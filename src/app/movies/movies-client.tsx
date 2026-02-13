"use client";

import { useMemo, useState } from "react";
import MoviesSearchBar from "./search-bar";
import MovieCard from "@/components/movies/MovieCard";

type MovieCardType = {
    id: number;
    title: string;
    price: string;
    stock: number;
    runtime: number;
    directors: string[];
    actors: string[];
};

export default function MoviesClient({ items }: { items: MovieCardType[] }) {
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

            <div className="grid gap-4">
                {filtered.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}

                {filtered.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No movies match “{q}”.</div>
                ) : null}
            </div>
        </div>
    );
}
