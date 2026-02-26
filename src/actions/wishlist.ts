"use server";

import { prisma } from "@/lib/prisma";
import { authClient } from "@/lib/auth-client";
import { revalidatePath } from "next/cache";

function getUserIdFromSession(sessionResult: any): string | null {
    // Many auth clients return { data, error }.
    // keep this minimal and safe without assuming too much.
    const userId = sessionResult?.data?.user?.id;
    return typeof userId === "string" && userId.length > 0 ? userId : null;
}

export async function getMyWishlistState(movieId: number): Promise<boolean> {
    const session = await authClient.getSession();
    const userId = getUserIdFromSession(session);

    if (!userId) return false;

    const row = await prisma.wishlistItem.findUnique({
        where: { movieId_userId: { movieId, userId } },
        select: { id: true },
    });

    return !!row;
}

export async function toggleWishlist(movieId: number): Promise<boolean> {
    const session = await authClient.getSession();
    const userId = getUserIdFromSession(session);

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
