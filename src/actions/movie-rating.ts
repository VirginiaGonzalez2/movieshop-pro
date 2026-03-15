"use server";

import { prisma } from "@/lib/prisma";
// import { getSession } from "@/lib/auth-session";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Avg + count for a movie.
 */
export async function getMovieRatingSummary(movieId: number): Promise<{
    avgRating: number;
    ratingCount: number;
}> {
    if (!Number.isInteger(movieId) || movieId <= 0) {
        return { avgRating: 0, ratingCount: 0 };
    }

    const agg = await prisma.movieRating.aggregate({
        where: { movieId },
        _avg: { value: true },
        _count: { value: true },
    });

    return {
        avgRating: agg._avg.value ?? 0,
        ratingCount: agg._count.value ?? 0,
    };
}

/**
 * My rating (0 if not logged in or not rated yet).
 */
export async function getMyMovieRating(movieId: number): Promise<number> {
    if (!Number.isInteger(movieId) || movieId <= 0) return 0;

    // TODO: Nueva lógica de sesión basada en JWT/cookie
    // const session = getSession();
    // if (!session) return 0;
    // const userId = session.id;

    const userId = session?.user?.id;
    if (!userId) return 0;

    const row = await prisma.movieRating.findUnique({
        where: { movieId_userId: { movieId, userId } },
        select: { value: true },
    });

    return row?.value ?? 0;
}

/**
 * Set/update my rating (upsert). Still one rating per user per movie.
 */
export async function setMovieRating(movieId: number, value: number): Promise<void> {
    if (!Number.isInteger(movieId) || movieId <= 0) {
        throw new Error("Invalid movie id");
    }

    if (!Number.isInteger(value) || value < 1 || value > 5) {
        throw new Error("Rating must be between 1 and 5");
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userId = session?.user?.id;
    if (!userId) throw new Error("Unauthorized");

    await prisma.movieRating.upsert({
        where: { movieId_userId: { movieId, userId } },
        create: { movieId, userId, value },
        update: { value },
    });

    revalidatePath(`/movies/${movieId}`);
}
