/**
 * @ Author: Sabrina Bjurman
 * @ Create Time: 2026-02-24 11:22:22
 * @ Modified by: Sabrina Bjurman
 * @ Modified time: 2026-02-24 11:25:49
 * @ Description: Checkout server side.
 */

"use server";

import { CheckoutFormValues, checkoutSchema } from "@/form-schemas/checkout";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Order } from "@prisma/client";
import { headers } from "next/headers";
import { ZodError } from "zod";

type SerializableOrder = Pick<Order, "id" | "userId" | "status" | "orderDate"> & {
    totalAmount: string;
};

async function checkout(
    values: CheckoutFormValues,
): Promise<
    | { ok: true; order: SerializableOrder }
    | { ok: false; cause: "zod"; error: ZodError<CheckoutFormValues> }
    | { ok: false; cause: "better-auth"; error: unknown }
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

    const userId = session ? session.user.id : `${safeValues.firstName} ${safeValues.lastName}`;

    let result;
    try {
        result = await prisma.order.create({
            data: {
                userId: userId,
                totalAmount: safeValues.orderCost,
                status: "placed",
                items: {
                    create: safeValues.orderItems
                        .map((item) => {
                            return {
                                movieId: item.id,
                                quantity: item.quantity,
                                priceAtPurchase: item.cost,
                            };
                        })
                        .flat(),
                },
            },
        });
    } catch (error) {
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
