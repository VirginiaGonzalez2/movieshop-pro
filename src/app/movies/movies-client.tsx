"use client";

import { useMemo, useState } from "react";
import MoviesSearchBar from "./search-bar";
import MoviesSortBar from "./MoviesSortBar";
import MovieCard, { type MovieCardItem } from "@/components/movies/MovieCard";

/**
 * Extended type including relational data
 * received from the server component.
 */
type MoviesClientItem = MovieCardItem & {
    directors: string[];
    actors: string[];
};

/**
 * MoviesClient (Client Component)
 *
 * Responsibilities:
 * - Handle client-side title/people search
 * - Render sort controls (URL-driven)
 * - Render movie grid
 *
 * Important:
 * - Server already handles:
 *   - Genre filtering
 *   - Director filtering
 *   - Actor filtering
 *   - Sorting
 *
 * This component ONLY handles local text search.
 */
export default function MoviesClient({ items }: { items: MoviesClientItem[] }) {
    // Local search query state
    const [q, setQ] = useState("");

    /**
     * Client-side filtering
     *
     * This does NOT conflict with server filtering.
     * It only filters inside the already server-filtered dataset.
     */
    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();

        // If search is empty, return all server-filtered items
        if (!query) return items;

        return items.filter((movie) => {
            // Match against movie title
            const matchesTitle = movie.title.toLowerCase().includes(query);

            // Match against directors
            const matchesDirector = movie.directors.some((director) =>
                director.toLowerCase().includes(query),
            );

            // Match against actors
            const matchesActor = movie.actors.some((actor) => actor.toLowerCase().includes(query));

            // Return true if any field matches
            return matchesTitle || matchesDirector || matchesActor;
        });
    }, [q, items]);

    return (
        <div className="p-8">
            {/* Header Section */}
            <div className="flex items-start justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold">Movies</h1>
                <MoviesSearchBar onSearch={setQ} />
            </div>

            {/* Sorting Controls (URL-driven) */}
            <div className="mb-6">
                <MoviesSortBar />
            </div>

            {/* Movies Grid */}
            {filtered.length === 0 ? (
                <div className="text-sm text-muted-foreground">No movies match “{q}”.</div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={{
                                id: movie.id,
                                title: movie.title,
                                price: movie.price,
                                stock: movie.stock,
                                runtime: movie.runtime,
                                rating: movie.rating,
                                imageUrl: movie.imageUrl ?? null,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
