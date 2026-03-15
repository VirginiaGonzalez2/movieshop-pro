/**
 * Deal of the Day (DB changes)
 * - Picks ONE movie per user per day (deterministic)
 * - Discount applies ONLY to that movie
 * - Logged-in: uses userId
 * - Anonymous: uses existing cookie if present; otherwise deterministic fallback (no cookie writes)
 */

"use server";

import { prisma } from "@/lib/prisma";
import { cookies, headers } from "next/headers";
import { getSession } from "@/lib/auth-session";

const DEAL_COOKIE = "dotd_uid_v1";

export type DealSelection = {
    date: string; // YYYY-MM-DD
    movieId: number;
    discountPct: number; // 5..80
};

export type DealMovie = DealSelection & {
    title: string;
    imageUrl: string | null;
    stock: number;
    originalPrice: number;
    discountedPrice: number;
};

function todayKeyUTC(): string {
    return new Date().toISOString().slice(0, 10);
}

// Simple stable hash (FNV-1a style)
function hashToInt(input: string): number {
    let h = 2166136261;
    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0; // positive 32-bit
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

async function getUserKey(): Promise<string> {
    // Logged-in user gets stable key
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        const userId = session?.user?.id;
        if (userId) return `user_${userId}`;
    } catch {
        // ignore
    }

    // Anonymous: NOT allowed to set cookies here, only read.
    const store = await cookies();
    const existing = store.get(DEAL_COOKIE)?.value;
    if (existing && existing.length >= 8) return existing;

    // Fallback deterministic key (no cookie writes)
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "0.0.0.0";
    const ua = h.get("user-agent") ?? "unknown";
    return `anon_${hashToInt(`${ip}:${ua}`).toString(16)}`;
}

export async function getDealSelection(): Promise<DealSelection | null> {
    const date = todayKeyUTC();
    const userKey = await getUserKey();

    // Pick from movies with stock > 0, excluding Interstellar from deals
    let ids = await prisma.movie.findMany({
        where: {
            stock: { gt: 0 },
            NOT: {
                title: {
                    equals: "Interstellar",
                    mode: "insensitive",
                },
            },
        },
        select: { id: true },
        orderBy: { id: "asc" },
    });

    // Safety fallback: if all available movies are excluded, keep deals working.
    if (ids.length === 0) {
        ids = await prisma.movie.findMany({
            where: { stock: { gt: 0 } },
            select: { id: true },
            orderBy: { id: "asc" },
        });
    }

    if (ids.length === 0) return null;

    const seed = `${userKey}:${date}`;
    const h = hashToInt(seed);

    const index = h % ids.length;
    const movieId = ids[index].id;

    // discount
    const discountPct = 10 + (hashToInt(seed + ":pct") % 36);

    return {
        date,
        movieId,
        discountPct: clamp(discountPct, 5, 80),
    };
}

export async function getDealMovie(): Promise<DealMovie | null> {
    const sel = await getDealSelection();
    if (!sel) return null;

    const movie = await prisma.movie.findUnique({
        where: { id: sel.movieId },
        select: {
            title: true,
            imageUrl: true,
            stock: true,
            price: true,
        },
    });

    if (!movie) return null;

    const originalPrice = movie.price.toNumber();
    const discountedPrice = Number((originalPrice * (1 - sel.discountPct / 100)).toFixed(2));

    return {
        ...sel,
        title: movie.title,
        imageUrl: movie.imageUrl ?? null,
        stock: movie.stock,
        originalPrice,
        discountedPrice,
    };
}

/**
 * if itemId is today’s deal movieId => apply discount.
 */
export async function applyDealDiscountToPrice(itemId: number, price: number): Promise<number> {
    const sel = await getDealSelection();
    if (!sel) return price;
    if (sel.movieId !== itemId) return price;

    return Number((price * (1 - sel.discountPct / 100)).toFixed(2));
}
