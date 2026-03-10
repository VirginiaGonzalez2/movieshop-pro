"use server";

/**
 * ADDED:
 * Confirms order payment after successful checkout.
 * This marks the order as PAID.
 * Minimal implementation — no refactor.
 */

import { prisma } from "@/lib/prisma";

export async function confirmOrderPayment(orderId: number) {
    await prisma.order.update({
        where: { id: orderId },
        data: {
            status: OrderStatus.PAID,
        },
    });
}
