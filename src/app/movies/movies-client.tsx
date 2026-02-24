"use client";

import { useMemo, useState } from "react";
import MoviesSearchBar from "./search-bar";
import MovieCard, { type MovieCardItem } from "@/components/movies/MovieCard";
import MoviesSortBar from "./MoviesSortBar";

type MoviesClientItem = MovieCardItem & {
    directors: string[];
    actors: string[];
};

export default function MoviesClient({ items }: { items: MoviesClientItem[] }) {
    const [q, setQ] = useState("");

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return items;

        return items.filter((m) => m.title.toLowerCase().includes(query));
    }, [q, items]);

    return (
        <div className="p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold">Movies</h1>
                <MoviesSearchBar onSearch={setQ} />
            </div>

            <div className="mb-6">
                <MoviesSortBar />
            </div>

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
