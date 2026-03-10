"use server";

import { requireAdminArea } from "@/lib/admin-access";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function revalidateOrderPaths(orderId?: number) {
    revalidatePath("/admin/orders");
    revalidatePath("/orders");
    revalidatePath("/orders/[orderId]", "page");

    if (orderId) {
        revalidatePath(`/orders/${orderId}`);
    }
}

// ...existing code...
// Elimina código fuera de función, define correctamente las funciones

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
