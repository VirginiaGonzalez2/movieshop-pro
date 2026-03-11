"use client";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import MoviesSearchBar from "./search-bar";
import MoviesSortBar from "./MoviesSortBar";
import MovieCard from "@/components/movies/MovieCard";

/**
 * Local type definition.
 * Keep it local so we don't depend on internals from MovieCard.
 */
type MoviesClientItem = {
    id: number;
    title: string;
    price: string;
    stock: number;
    runtime: number;

    //  real rating fields
    avgRating: number;
    ratingCount: number;

    imageUrl: string | null;
    directors: string[];
    actors: string[];
    genres?: string[];
};

export default function MoviesClient({
    items,
    hasMore = false,
    nextPageHref = "/movies?page=2",
    currentPage = 1,
}: {
    items: MoviesClientItem[];
    hasMore?: boolean;
    nextPageHref?: string;
    currentPage?: number;
}) {
    const [q, setQ] = useState("");

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return items;

        return items.filter((movie) => {
            const matchesTitle = movie.title.toLowerCase().includes(query);

            const matchesDirector = movie.directors.some((director) =>
                director.toLowerCase().includes(query),
            );

            const matchesActor = movie.actors.some((actor) => actor.toLowerCase().includes(query));

            return matchesTitle || matchesDirector || matchesActor;
        });
    }, [q, items]);

    return (
        <div className="px-6 sm:px-8 py-8">
            <div className="flex items-start justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold">Movies</h1>
                <MoviesSearchBar onSearch={setQ} />
            </div>

            <div className="mb-6">
                <Suspense fallback={null}>
                    <MoviesSortBar />
                </Suspense>
            </div>

            {filtered.length === 0 ? (
                <div className="text-sm text-muted-foreground">No movies match “{q}”.</div>
            ) : (
                <div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filtered.map((movie) => (
                            <Link href={`/movies/${movie.id}`} className="block group" prefetch={false} key={movie.id}>
                                <MovieCard
                                    movie={{
                                        id: movie.id,
                                        title: movie.title,
                                        price: movie.price,
                                        stock: movie.stock,
                                        runtime: movie.runtime,
                                        avgRating: movie.avgRating,
                                        ratingCount: movie.ratingCount,
                                        imageUrl: movie.imageUrl,
                                        genres: movie.genres,
                                    }}
                                />
                            </Link>
                        ))}
                    </div>

                    {hasMore && (
                        <div className="mt-8 flex justify-center">
                            <a
                                href={nextPageHref}
                                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium"
                            >
                                Ver más
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
