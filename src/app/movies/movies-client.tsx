"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import MoviesSearchBar from "./search-bar";
import { PriceTag } from "@/components/ui/PriceTag";
import { RatingStars } from "@/components/ui/RatingStars";

type MovieCard = {
  id: number;
  title: string;
  price: string;
  stock: number;
  runtime: number;
  directors: string[];
  actors: string[];
};

export default function MoviesClient({ items }: { items: MovieCard[] }) {
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
          <div
            key={movie.id}
            className="border rounded p-4 flex items-start justify-between"
          >
            <div className="space-y-1">
              <div className="font-semibold text-lg">{movie.title}</div>

              <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                <PriceTag amount={movie.price} />
                <span>•</span>
                <span>Stock: {movie.stock}</span>
                <span>•</span>
                <span>Runtime: {movie.runtime} min</span>
              </div>

              {/* Demo rating (until add rating to DB) */}
              <div className="text-sm flex items-center gap-2">
                <RatingStars value={4} />
                <span className="text-muted-foreground">(demo)</span>
              </div>

              <div className="text-sm">
                <span className="font-semibold">Director:</span>{" "}
                {movie.directors.length > 0 ? movie.directors.join(", ") : "—"}
              </div>

              <div className="text-sm">
                <span className="font-semibold">Cast:</span>{" "}
                {movie.actors.length > 0 ? movie.actors.join(", ") : "—"}
              </div>
            </div>

            <div className="text-sm">
              <Link className="text-blue-600" href={`/movies`}>
                View
              </Link>
            </div>
          </div>
        ))}

        {filtered.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No movies match “{q}”.
          </div>
        ) : null}
      </div>
    </div>
  );
}
