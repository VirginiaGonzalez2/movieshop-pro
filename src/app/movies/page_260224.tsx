import { prisma } from "@/lib/prisma";
import { Role, Prisma } from "@prisma/client";
import MoviesClient from "./movies-client";

/**
 * Force dynamic rendering because the page depends on URL query parameters
 * (sorting, filters, pagination).
 */
export const dynamic = "force-dynamic";

/**
 * MoviesPage (Server Component)
 *
 * Responsibilities:
 * - Handle server-side sorting
 * - Parse filter parameters (genres, directors, actors)
 * - Prepare layout structure (sidebar + main content)
 * - Fetch and transform movie data
 *
 * NOTE:
 * Filtering logic will be implemented after filter integration is finalized.
 */
export default async function MoviesPage({
    searchParams,
}: {
    searchParams: Promise<{
        sort?: string;
        genres?: string | string[];
        directors?: string | string[];
        actors?: string | string[];
        page?: string;
    }>;
}) {
    /**
     * Next.js 15+ requires awaiting searchParams
     */
    const params = await searchParams;

    /**
     * ----------------------------------------
     * 1️⃣ Parse Sorting Parameter
     * ----------------------------------------
     */
    const sort = params?.sort ?? "new";

    let orderBy: { createdAt: "desc" } | { title: "asc" } | { price: "asc" } | { rating: "desc" };

    switch (sort) {
        case "az":
            orderBy = { title: "asc" };
            break;
        case "price":
            orderBy = { price: "asc" };
            break;
        case "popular":
            orderBy = { rating: "desc" };
            break;
        case "new":
        default:
            orderBy = { createdAt: "desc" };
            break;
    }

    /**
     * ----------------------------------------
     * 2️⃣ Parse Filter Parameters
     * ----------------------------------------
     * Filters use comma-separated values:
     * Example:
     * ?genres=1,2&directors=3&actors=5,8
     */
    const selectedGenres = Array.isArray(params.genres)
        ? params.genres
        : (params.genres?.split(",") ?? []);

    const selectedDirectors = Array.isArray(params.directors)
        ? params.directors
        : (params.directors?.split(",") ?? []);

    const selectedActors = Array.isArray(params.actors)
        ? params.actors
        : (params.actors?.split(",") ?? []);

    /**
     * ----------------------------------------
     * 3️⃣ Prepare Prisma WHERE
     * ----------------------------------------
     * Filtering logic will be implemented once
     * filter integration is finalized.
     */
    const where: Prisma.MovieWhereInput = {};

    /**
     * ----------------------------------------
     * 4️⃣ Fetch Movies (Sorted)
     * ----------------------------------------
     */
    const movies = await prisma.movie.findMany({
        where,
        orderBy,
    });

    if (movies.length === 0) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-2">Movies</h1>
                <p className="text-muted-foreground">
                    No movies found yet. Add some movies first (admin page).
                </p>
            </div>
        );
    }

    /**
     * ----------------------------------------
     * 5️⃣ Fetch Related People
     * ----------------------------------------
     */
    const movieIds = movies.map((m) => m.id);

    const moviePeople = await prisma.moviePerson.findMany({
        where: { movieId: { in: movieIds } },
        include: { person: true },
        orderBy: [{ movieId: "asc" }, { personId: "asc" }],
    });

    /**
     * Group actors and directors by movieId
     */
    const byMovie = new Map<number, { actors: string[]; directors: string[] }>();

    for (const mp of moviePeople) {
        const entry = byMovie.get(mp.movieId) ?? { actors: [], directors: [] };

        if (mp.role === Role.ACTOR) {
            entry.actors.push(mp.person.name);
        } else if (mp.role === Role.DIRECTOR) {
            entry.directors.push(mp.person.name);
        }

        byMovie.set(mp.movieId, entry);
    }

    /**
     * ----------------------------------------
     * 6️⃣ Transform Data for MoviesClient
     * ----------------------------------------
     */
    const items = movies.map((m) => {
        const info = byMovie.get(m.id) ?? { actors: [], directors: [] };

        return {
            id: m.id,
            title: m.title,
            price: m.price.toString(),
            stock: m.stock,
            runtime: m.runtime,
            rating: m.rating,
            imageUrl: m.imageUrl ?? null,
            directors: info.directors,
            actors: info.actors,
        };
    });

    /**
     * ----------------------------------------
     * 7️⃣ Layout Structure
     * ----------------------------------------
     * 12-column grid:
     * - Sidebar (filters) → col-span-3
     * - Main content → col-span-9
     *
     * MoviePanel will be integrated into the sidebar.
     */
    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="grid grid-cols-12 gap-8">
                {/* Sidebar Placeholder (Filters) */}
                <aside className="col-span-3">{/* MoviePanel will be rendered here */}</aside>

                {/* Main Content */}
                <div className="col-span-9">
                    <MoviesClient items={items} />
                </div>
            </div>
        </div>
    );
}
