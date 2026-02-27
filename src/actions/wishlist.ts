"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Returns true if the current logged-in user has this movie wishlisted.
 * If not logged in -> false (no throw).
 */
export async function getMyWishlistState(movieId: number): Promise<boolean> {
    if (!Number.isInteger(movieId) || movieId <= 0) return false;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userId = session?.user?.id;
    if (!userId) return false;

    const row = await prisma.wishlistItem.findUnique({
        where: { movieId_userId: { movieId, userId } },
        select: { id: true },
    });

    return !!row;
}

/**
 * Toggles wishlist for the current logged-in user.
 * Returns the NEW state: true = wishlisted, false = removed.
 */
export async function toggleWishlist(movieId: number): Promise<boolean> {
    if (!Number.isInteger(movieId) || movieId <= 0) {
        throw new Error("Invalid movie id");
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userId = session?.user?.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const existing = await prisma.wishlistItem.findUnique({
        where: { movieId_userId: { movieId, userId } },
        select: { id: true },
    });

    if (existing) {
        await prisma.wishlistItem.delete({
            where: { id: existing.id },
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
