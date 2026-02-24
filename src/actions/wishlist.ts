"use server";

import { prisma } from "@/lib/prisma";
import { authClient } from "@/lib/auth-client";
import { revalidatePath } from "next/cache";

export async function getMyWishlistState(movieId: number): Promise<boolean> {
    const session = await authClient.getSession();
    const userId = session?.user?.id;

    if (!userId) return false;

    const row = await prisma.wishlistItem.findUnique({
        where: { movieId_userId: { movieId, userId } },
        select: { id: true },
    });

    return !!row;
}

export async function toggleWishlist(movieId: number): Promise<boolean> {
    const session = await authClient.getSession();
    const userId = session?.user?.id;

    if (!userId) throw new Error("Unauthorized");

    const existing = await prisma.wishlistItem.findUnique({
        where: { movieId_userId: { movieId, userId } },
        select: { id: true },
    });

    if (existing) {
        await prisma.wishlistItem.delete({
            where: { movieId_userId: { movieId, userId } },
        });

        revalidatePath(`/movies/${movieId}`);
        return false;
    }

    await prisma.wishlistItem.create({
        data: { movieId, userId },
    });

    revalidatePath(`/movies/${movieId}`);
    return true;
}
