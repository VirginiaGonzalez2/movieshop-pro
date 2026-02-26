"use server";

import { prisma } from "@/lib/prisma";
import { authClient } from "@/lib/auth-client";
import { revalidatePath } from "next/cache";

async function getUserIdFromSession(): Promise<string | null> {
    const result = await authClient.getSession();

    // better-auth/react returns a wrapper like: { data: { user, session } | null, error? }
    // We must read from result.data, not result.user.
    const userId = result?.data?.user?.id ?? null;

    return userId;
}

export async function getMyWishlistState(movieId: number): Promise<boolean> {
    const userId = await getUserIdFromSession();
    if (!userId) return false;

    const row = await prisma.wishlistItem.findUnique({
        where: { movieId_userId: { movieId, userId } },
        select: { id: true },
    });

    return !!row;
}

export async function toggleWishlist(movieId: number): Promise<boolean> {
    const userId = await getUserIdFromSession();
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
