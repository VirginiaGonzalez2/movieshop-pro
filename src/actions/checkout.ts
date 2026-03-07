/**
 * @ Author: Sabrina Bjurman
 * @ Create Time: 2026-02-24 11:22:22
 * @ Modified by: Sabrina Bjurman
 * @ Modified time: 2026-02-24 11:25:49
 * @ Description: Checkout server side.
 */

"use server";

import { CheckoutFormValues, checkoutSchema } from "@/form-schemas/checkout";
import { getDealSelection } from "@/actions/deal-of-the-day";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Order, OrderStatus } from "@prisma/client";
import { headers } from "next/headers";
import { ZodError } from "zod";

type SerializableOrder = Pick<Order, "id" | "userId" | "status" | "orderDate"> & {
    totalAmount: string;
};

class CheckoutBusinessError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CheckoutBusinessError";
    }
}

async function checkout(
    values: CheckoutFormValues,
): Promise<
    | { ok: true; order: SerializableOrder }
    | { ok: false; cause: "zod"; error: ZodError<CheckoutFormValues> }
    | { ok: false; cause: "better-auth"; error: unknown }
    | { ok: false; cause: "business"; error: string }
    | { ok: false; cause: "prisma"; error: unknown }
> {
    const parsed = checkoutSchema.safeParse(values);

    if (!parsed.success) {
        return { ok: false, cause: "zod", error: parsed.error };
    }

    const safeValues = parsed.data;

    // TODO: Third-party authentication (shipping/payment)

    let session;
    try {
        session = await auth.api.getSession({
            headers: await headers(),
        });
    } catch (error) {
        return { ok: false, cause: "better-auth", error: error };
    }

    let guestIdentifier = safeValues.paymentPayPalInfo?.payPalEmail;
    if (!guestIdentifier && safeValues.firstName && safeValues.lastName) {
        guestIdentifier = `${safeValues.firstName} ${safeValues.lastName}`;
    }
    const userId = session ? session.user.id : guestIdentifier;
    const authUserId = session?.user?.id ?? null;

    if (safeValues.orderItems.length === 0) {
        return { ok: false, cause: "business", error: "Cart is empty." };
    }

    const orderQuantityByMovieId = new Map<number, number>();
    for (const item of safeValues.orderItems) {
        if (!Number.isInteger(item.id) || item.id <= 0 || item.quantity <= 0) {
            return { ok: false, cause: "business", error: "Invalid cart item data." };
        }
        orderQuantityByMovieId.set(item.id, (orderQuantityByMovieId.get(item.id) ?? 0) + item.quantity);
    }

    const requestedIds = [...orderQuantityByMovieId.keys()];
    const movies = await prisma.movie.findMany({
        where: { id: { in: requestedIds } },
        select: { id: true, price: true, stock: true },
    });

    if (movies.length !== requestedIds.length) {
        return { ok: false, cause: "business", error: "One or more movies no longer exist." };
    }

    const movieById = new Map(movies.map((movie) => [movie.id, movie]));
    for (const [movieId, quantity] of orderQuantityByMovieId) {
        const movie = movieById.get(movieId);
        if (!movie || movie.stock < quantity) {
            return {
                ok: false,
                cause: "business",
                error: `Insufficient stock for movie ${movieId}.`,
            };
        }
    }

    const dealSelection = await getDealSelection();

    const normalizedOrderItems = [] as Array<{
        movieId: number;
        quantity: number;
        priceAtPurchase: number;
    }>;

    let normalizedOrderCost = 0;
    for (const item of safeValues.orderItems) {
        const movie = movieById.get(item.id);
        if (!movie) {
            continue;
        }

        const basePrice = movie.price.toNumber();
        const discountedPrice =
            dealSelection && dealSelection.movieId === item.id
                ? Number((basePrice * (1 - dealSelection.discountPct / 100)).toFixed(2))
                : basePrice;
        const priceAtPurchase = Number(discountedPrice.toFixed(2));

        normalizedOrderItems.push({
            movieId: item.id,
            quantity: item.quantity,
            priceAtPurchase,
        });

        normalizedOrderCost += priceAtPurchase * item.quantity;
    }

    let result;
    try {
        result = await prisma.$transaction(async (tx) => {
            for (const [movieId, quantity] of orderQuantityByMovieId) {
                const stockUpdated = await tx.movie.updateMany({
                    where: {
                        id: movieId,
                        stock: { gte: quantity },
                    },
                    data: {
                        stock: { decrement: quantity },
                    },
                });

                if (stockUpdated.count !== 1) {
                    throw new CheckoutBusinessError(`Insufficient stock for movie ${movieId}.`);
                }
            }

            return tx.order.create({
                data: {
                    userId: userId,
                    totalAmount: Number(normalizedOrderCost.toFixed(2)),
                    status: OrderStatus.PENDING,
                    authUserId,
                    items: {
                        create: normalizedOrderItems,
                    },
                },
            });
        });
    } catch (error) {
        if (error instanceof CheckoutBusinessError) {
            return { ok: false, cause: "business", error: error.message };
        }
        return { ok: false, cause: "prisma", error: error };
    }

    return {
        ok: true,
        order: {
            id: result.id,
            userId: result.userId,
            totalAmount: result.totalAmount.valueOf(),
            status: result.status,
            orderDate: result.orderDate,
        },
    };
}

export { checkout };
