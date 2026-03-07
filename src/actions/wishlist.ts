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

/**
 * Gets count of wishlisted items for the current logged-in user.
 */
export async function getWishlistCount(): Promise<number> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userId = session?.user?.id;
    if (!userId) return 0;

    const count = await prisma.wishlistItem.count({
        where: { userId },
    });

    return count;
}

/**
 * Gets all wishlisted movies for the current logged-in user.
 * Returns null if not logged in or wishlist is empty.
 */
export type WishlistItemInfo = {
    movieId: number;
    title: string;
    imageUrl: string | null;
    genres: string[];
    price: number;
    stock: number;
};

export async function getWishlistInfo(): Promise<WishlistItemInfo[] | null> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userId = session?.user?.id;
    if (!userId) return null;

    const wishlisted = await prisma.wishlistItem.findMany({
        where: { userId },
        select: { movieId: true },
    });

    if (!wishlisted.length) return null;

    const movieIds = wishlisted.map((item) => item.movieId);

    const movies = await prisma.movie.findMany({
        where: { id: { in: movieIds } },
        select: {
            id: true,
            title: true,
            price: true,
            imageUrl: true,
            stock: true,
            genres: {
                select: { genre: { select: { name: true } } },
            },
        },
    });

    return movies.map((movie) => ({
        movieId: movie.id,
        title: movie.title,
        imageUrl: movie.imageUrl,
        genres: movie.genres.map((value) => value.genre.name).flat(),
        price: Number(movie.price),
        stock: movie.stock,
    }));
}
