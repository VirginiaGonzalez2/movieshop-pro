"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type GenreItem = {
    id: number;
    name: string;
    description?: string | null;
};

export default function GenresClient({ items }: { items: GenreItem[] }) {
    const [q, setQ] = useState("");

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return items;
        return items.filter((g) => g.name.toLowerCase().includes(query));
    }, [q, items]);

    return (
        <div className="space-y-4">
            {/* Search + count */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search genres..."
                    className="w-full sm:max-w-sm border rounded px-3 py-2"
                />
                <div className="text-sm text-muted-foreground">
                    {filtered.length} genre{filtered.length === 1 ? "" : "s"}
                </div>
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <div className="text-sm text-muted-foreground">No genres match “{q}”.</div>
            ) : (
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((g) => (
                        <li key={g.id} className="rounded-lg border p-4 hover:shadow-sm transition">
                            <div className="font-semibold">{g.name}</div>

                            {g.description ? (
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                                    {g.description}
                                </p>
                            ) : null}

                            <Link
                                href={`/genres/${g.id}`}
                                className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                            >
                                Browse →
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
