"use client";

import { useMemo, useState } from "react";
import MovieCard from "@/components/movies/MovieCard";

type Item = {
    id: number;
    title: string;
    price: string;
    stock: number;
    runtime: number;
    rating: number;
    imageUrl?: string | null;
};

type SortKey = "newest" | "rating-desc" | "price-asc" | "price-desc";

export default function GenreMoviesClient({ items }: { items: Item[] }) {
    const [q, setQ] = useState("");
    const [sort, setSort] = useState<SortKey>("newest");

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return items;
        return items.filter((m) => m.title.toLowerCase().includes(query));
    }, [q, items]);

    const sorted = useMemo(() => {
        const copy = [...filtered];

        if (sort === "newest") {
            return copy;
        }

        if (sort === "rating-desc") {
            return copy.sort((a, b) => b.rating - a.rating);
        }

        const toNumber = (p: string) => {
            const n = Number(p);
            return Number.isFinite(n) ? n : 0;
        };

        if (sort === "price-asc") return copy.sort((a, b) => toNumber(a.price) - toNumber(b.price));
        if (sort === "price-desc")
            return copy.sort((a, b) => toNumber(b.price) - toNumber(a.price));

        return copy;
    }, [filtered, sort]);

    return (
        <div className="space-y-4">
            {/* Search + sort controls */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search movies in this genre..."
                    className="w-full sm:max-w-sm border rounded px-3 py-2"
                />

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="w-full sm:w-56 border rounded px-3 py-2"
                >
                    <option value="newest">Newest</option>
                    <option value="rating-desc">Rating (High → Low)</option>
                    <option value="price-asc">Price (Low → High)</option>
                    <option value="price-desc">Price (High → Low)</option>
                </select>
            </div>

            {/* Results */}
            {sorted.length === 0 ? (
                <div className="text-sm text-muted-foreground">No movies match “{q}”.</div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sorted.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
}
