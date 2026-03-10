/**
 * @ Author: Sabrina Bjurman
 * @ Create Time: 2026-02-24 11:22:22
 * @ Modified by: Sabrina Bjurman
 * @ Modified time: 2026-02-24 11:25:49
 * @ Description: Checkout server side.
 */

"use server";

import { CheckoutFormValues, checkoutSchema, OrderItemFormValues } from "@/form-schemas/checkout";
import { applyDealDiscountToPrice } from "@/actions/deal-of-the-day";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// import eliminado: no se usa ningún tipo directamente de @prisma/client
import { headers } from "next/headers";
import { ZodError } from "zod";
import { Decimal } from "@prisma/client/runtime/client";

type SerializableOrder = {
    id: number;
    userId: string;
    status: string;
    orderDate: Date;
    totalAmount: string;
};

class CheckoutBusinessError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CheckoutBusinessError";
    }
}
type OrderItemData = {
    movieId: number;
    quantity: number;
    priceAtPurchase: string;
};

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

    if (!userId) {
        return { ok: false, cause: "business", error: "No valid id found." };
    }

    const authUserId = session?.user?.id ?? null;

    if (safeValues.orderItems.length === 0) {
        return { ok: false, cause: "business", error: "Cart is empty." };
    }

    const orderQuantityByMovieId = new Map<number, number>();
    for (const item of safeValues.orderItems) {
        const idAsNumber = Number(item.id);
        const quantityAsNumber = Number(item.quantity ?? 1);
        if (!Number.isInteger(idAsNumber) || idAsNumber <= 0 || quantityAsNumber <= 0) {
            return { ok: false, cause: "business", error: "Invalid cart item data." };
        }
        orderQuantityByMovieId.set(
            idAsNumber,
            (orderQuantityByMovieId.get(idAsNumber) ?? 0) + quantityAsNumber,
        );
    }

    const requestedIds = [...orderQuantityByMovieId.keys()];
    const movies = await prisma.movie.findMany({
        where: { id: { in: requestedIds } },
        select: { id: true, price: true, stock: true },
    });

    if (movies.length !== requestedIds.length) {
        return { ok: false, cause: "business", error: "One or more movies no longer exist." };
    }

    const movieById = new Map(movies.map((movie: any) => [movie.id, movie]));
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

    const orderPrices = await calculateOrderPrices(safeValues.orderItems);

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
                    totalAmount: Number(orderPrices.totalOrderCost.toFixed(2)),
                    status: "PENDING",
                    authUserId: authUserId,
                    items: {
                        create: orderPrices.orderItems,
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

async function calculateOrderPrices(
    orderItems: OrderItemFormValues[],
): Promise<{ orderItems: OrderItemData[]; totalOrderCost: number }> {
    const requestedIds = orderItems.map((item) => Number(item.id));
    const movies = await prisma.movie.findMany({
        where: { id: { in: requestedIds } },
        select: { id: true, price: true },
    });

    const movieById = new Map(movies.map((movie: any) => [movie.id, movie]));

    const pricedOrderItems: OrderItemData[] = [];

    let totalOrderCost = 0;
    for (const item of orderItems) {
        const idAsNumber = Number(item.id);
        const movie = movieById.get(idAsNumber);
        if (!movie) {
            continue;
        }

        const basePrice = movie.price.toNumber();
        let discountedPrice = await applyDealDiscountToPrice(idAsNumber, basePrice);

        const quantity = item.quantity ?? 1;

        pricedOrderItems.push({
            movieId: idAsNumber,
            quantity: quantity,
            priceAtPurchase: new Decimal(discountedPrice.toFixed(2)).toString(),
        });

        totalOrderCost += discountedPrice * quantity;
    }

    return { orderItems: pricedOrderItems, totalOrderCost: totalOrderCost };
}

export { checkout, calculateOrderPrices };
