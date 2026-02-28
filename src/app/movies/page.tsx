import { prisma } from "@/lib/prisma";
import { Role, Prisma } from "@prisma/client";
import MoviesClient from "./movies-client";
import MoviePanel from "@/components/filters/MovieFilterPanel";
import { getActors, getDirectors, getGenres } from "@/actions/categoryDropdownFiller";

/**
 * Force dynamic rendering because the page depends on URL query parameters
 */
export const dynamic = "force-dynamic";

export default async function MoviesPage({
    searchParams,
}: {
    searchParams: Promise<{
        sort?: string;
        genre?: string | string[];
        director?: string | string[];
        actor?: string | string[];
        page?: string;
    }>;
}) {
    const params = await searchParams;

    /**
     * ----------------------------------------
     * 1️ Parse Sorting Parameter
     * ----------------------------------------
     */
    const sort = params?.sort ?? "new";

    // NOTE: We cannot orderBy "avgRating" in Prisma directly because it's computed.
    // For "popular", we sort in JS after we compute avgRating + ratingCount.
    let orderBy: { createdAt: "desc" } | { title: "asc" } | { price: "asc" } | undefined;

    switch (sort) {
        case "az":
            orderBy = { title: "asc" };
            break;
        case "price":
            orderBy = { price: "asc" };
            break;
        case "popular":
            orderBy = { createdAt: "desc" }; // stable fallback, then we sort by avgRating in JS
            break;
        case "new":
        default:
            orderBy = { createdAt: "desc" };
            break;
    }

    /**
     * ----------------------------------------
     * 2️ Parse Filters
     * ----------------------------------------
     */
    const selectedGenres = Array.isArray(params.genre)
        ? params.genre
        : (params.genre?.split(",") ?? []);

    const selectedDirectors = Array.isArray(params.director)
        ? params.director
        : (params.director?.split(",") ?? []);

    const selectedActors = Array.isArray(params.actor)
        ? params.actor
        : (params.actor?.split(",") ?? []);

    /**
     * ----------------------------------------
     * 3️ Fetch Dropdown Data
     * ----------------------------------------
     */
    const [genres, directors, actors] = await Promise.all([
        getGenres(),
        getDirectors(),
        getActors(),
    ]);

    /**
     * ----------------------------------------
     * 4️ Build Prisma WHERE
     * ----------------------------------------
     */
    const where: Prisma.MovieWhereInput = {
        AND: [
            selectedGenres.length > 0
                ? {
                      genres: {
                          some: {
                              genreId: { in: selectedGenres.map(Number) },
                          },
                      },
                  }
                : {},

            selectedDirectors.length > 0
                ? {
                      people: {
                          some: {
                              role: "DIRECTOR",
                              personId: { in: selectedDirectors.map(Number) },
                          },
                      },
                  }
                : {},

            selectedActors.length > 0
                ? {
                      people: {
                          some: {
                              role: "ACTOR",
                              personId: { in: selectedActors.map(Number) },
                          },
                      },
                  }
                : {},
        ],
    };

    /**
     * ----------------------------------------
     * 5️ Fetch Movies
     * ----------------------------------------
     */
    const movies = await prisma.movie.findMany({
        where,
        orderBy,
        select: {
            id: true,
            title: true,
            price: true,
            stock: true,
            runtime: true,
            imageUrl: true,
            createdAt: true,
        },
    });

    /**
     * Handle empty result case
     */
    if (movies.length === 0) {
        return (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
                <h1 className="text-2xl font-bold mb-4">Movies</h1>

                {/* Mobile Filters */}
                <div className="md:hidden mb-4">
                    <details className="bg-white rounded-xl shadow-sm border">
                        <summary className="cursor-pointer px-4 py-3 font-medium">Filters</summary>
                        <div className="p-4 border-t">
                            <MoviePanel
                                genres={genres.map((g) => ({ id: g.id.toString(), name: g.name }))}
                                selectedGenres={selectedGenres}
                                directors={directors.map((d) => ({
                                    id: d.id.toString(),
                                    name: d.name,
                                }))}
                                selectedDirectors={selectedDirectors}
                                actors={actors.map((a) => ({ id: a.id.toString(), name: a.name }))}
                                selectedActors={selectedActors}
                            />
                        </div>
                    </details>
                </div>

                {/* Desktop Filters */}
                <div className="hidden md:block">
                    <MoviePanel
                        genres={genres.map((g) => ({ id: g.id.toString(), name: g.name }))}
                        selectedGenres={selectedGenres}
                        directors={directors.map((d) => ({ id: d.id.toString(), name: d.name }))}
                        selectedDirectors={selectedDirectors}
                        actors={actors.map((a) => ({ id: a.id.toString(), name: a.name }))}
                        selectedActors={selectedActors}
                    />
                </div>

                <p className="text-muted-foreground mt-4">
                    No movies found with the selected filters.
                </p>
            </div>
        );
    }

    /**
     * ----------------------------------------
     * 6️ Fetch Related People
     * ----------------------------------------
     */
    const movieIds = movies.map((m) => m.id);

    const moviePeople = await prisma.moviePerson.findMany({
        where: { movieId: { in: movieIds } },
        include: { person: true },
        orderBy: [{ movieId: "asc" }, { personId: "asc" }],
    });

    const byMovie = new Map<number, { actors: string[]; directors: string[] }>();

    for (const mp of moviePeople) {
        const entry = byMovie.get(mp.movieId) ?? { actors: [], directors: [] };

        if (mp.role === Role.ACTOR) entry.actors.push(mp.person.name);
        if (mp.role === Role.DIRECTOR) entry.directors.push(mp.person.name);

        byMovie.set(mp.movieId, entry);
    }

    /**
     * ----------------------------------------
     * 7️ Real ratings (avg + count)
     * ----------------------------------------
     */
    const ratingAgg =
        movieIds.length === 0
            ? []
            : await prisma.movieRating.groupBy({
                  by: ["movieId"],
                  where: { movieId: { in: movieIds } },
                  _avg: { value: true },
                  _count: { value: true },
              });

    const ratingMap = new Map<number, { avgRating: number; ratingCount: number }>();
    for (const r of ratingAgg) {
        ratingMap.set(r.movieId, {
            avgRating: r._avg.value ?? 0,
            ratingCount: r._count.value ?? 0,
        });
    }

    /**
     * ----------------------------------------
     * 8️ Transform Data for MoviesClient
     * ----------------------------------------
     */
    let items = movies.map((m) => {
        const info = byMovie.get(m.id) ?? { actors: [], directors: [] };
        const rating = ratingMap.get(m.id) ?? { avgRating: 0, ratingCount: 0 };

        return {
            id: m.id,
            title: m.title,
            price: m.price.toString(),
            stock: m.stock,
            runtime: m.runtime,

            avgRating: rating.avgRating,
            ratingCount: rating.ratingCount,

            imageUrl: m.imageUrl ?? null,
            directors: info.directors,
            actors: info.actors,
        };
    });

    // Popular = highest avgRating first, then highest ratingCount
    if (sort === "popular") {
        items = items.sort((a, b) => {
            if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating;
            return b.ratingCount - a.ratingCount;
        });
    }

    /**
     * ----------------------------------------
     * 9️ Responsive Layout
     * ----------------------------------------
     */
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                {/* Mobile Filters (accordion style) */}
                <div className="md:hidden mb-4">
                    <details className="bg-white rounded-xl shadow-sm border">
                        <summary className="cursor-pointer px-4 py-3 font-medium">Filters</summary>
                        <div className="p-4 border-t">
                            <MoviePanel
                                genres={genres.map((g) => ({ id: g.id.toString(), name: g.name }))}
                                selectedGenres={selectedGenres}
                                directors={directors.map((d) => ({
                                    id: d.id.toString(),
                                    name: d.name,
                                }))}
                                selectedDirectors={selectedDirectors}
                                actors={actors.map((a) => ({ id: a.id.toString(), name: a.name }))}
                                selectedActors={selectedActors}
                            />
                        </div>
                    </details>
                </div>

                {/* Desktop Sidebar */}
                <aside className="hidden md:block md:col-span-3">
                    <MoviePanel
                        genres={genres.map((g) => ({ id: g.id.toString(), name: g.name }))}
                        selectedGenres={selectedGenres}
                        directors={directors.map((d) => ({ id: d.id.toString(), name: d.name }))}
                        selectedDirectors={selectedDirectors}
                        actors={actors.map((a) => ({ id: a.id.toString(), name: a.name }))}
                        selectedActors={selectedActors}
                    />
                </aside>

                {/* Movies Grid */}
                <div className="col-span-1 md:col-span-9">
                    <MoviesClient items={items} />
                </div>
            </div>
        </div>
    );
}
