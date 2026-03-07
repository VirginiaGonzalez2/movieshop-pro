"use server";

import { requireAdminArea } from "@/lib/admin-access";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

function revalidateOrderPaths(orderId?: number) {
    revalidatePath("/admin/orders");
    revalidatePath("/orders");
    revalidatePath("/orders/[orderId]", "page");

    if (orderId) {
        revalidatePath(`/orders/${orderId}`);
    }
}

export async function updateOrderStatusAction(orderId: number, formData: FormData): Promise<void> {
    await requireAdminArea("orders");

    const rawStatus = String(formData.get("status") ?? "");
    const allowedStatuses = Object.values(OrderStatus) as string[];

    if (!allowedStatuses.includes(rawStatus)) {
        throw new Error("Invalid order status");
    }

    const status = rawStatus as OrderStatus;

    await prisma.order.update({
        where: { id: orderId },
        data: { status },
    });

    revalidateOrderPaths(orderId);
}

export async function deleteOrderAdminAction(orderId: number): Promise<void> {
    await requireAdminArea("orders");

    await prisma.order.delete({ where: { id: orderId } });

    revalidateOrderPaths(orderId);
}

export async function deleteContactMessageAdminAction(messageId: number): Promise<void> {
    await requireAdminArea("messages");

    await prisma.contactMessage.delete({ where: { id: messageId } });

    revalidatePath("/admin/contact-messages");
}
