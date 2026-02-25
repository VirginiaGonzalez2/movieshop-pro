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
        genres?: string | string[];
        directors?: string | string[];
        actors?: string | string[];
        page?: string;
    }>;
}) {
    /**
     * Await search params (Next.js 15+ requirement)
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
     * 2️⃣ Parse Filters
     * ----------------------------------------
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
     * 3️⃣ Fetch Dropdown Data
     * ----------------------------------------
     */
    const [genres, directors, actors] = await Promise.all([
        getGenres(),
        getDirectors(),
        getActors(),
    ]);

    /**
     * ----------------------------------------
     * 4️⃣ Build Prisma WHERE
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
     * 5️⃣ Fetch Movies
     * ----------------------------------------
     */
    const movies = await prisma.movie.findMany({
        where,
        orderBy,
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
     * 6️⃣ Fetch Related People
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
        const entry = byMovie.get(mp.movieId) ?? {
            actors: [],
            directors: [],
        };

        if (mp.role === Role.ACTOR) entry.actors.push(mp.person.name);
        if (mp.role === Role.DIRECTOR) entry.directors.push(mp.person.name);

        byMovie.set(mp.movieId, entry);
    }

    /**
     * ----------------------------------------
     * 7️⃣ Transform Data for MoviesClient
     * ----------------------------------------
     */
    const items = movies.map((m) => {
        const info = byMovie.get(m.id) ?? {
            actors: [],
            directors: [],
        };

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
     * 8️⃣ Responsive Layout
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
