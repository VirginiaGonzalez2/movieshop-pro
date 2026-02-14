"use client";

import Link from "next/link";
import { PriceTag } from "@/components/ui/PriceTag";
import { RatingStars } from "@/components/ui/RatingStars";

type Props = {
    movie: {
        id: number;
        title: string;
        price: string;
        stock: number;
        runtime: number;
        imageUrl: string | null;
        directors: string[];
        actors: string[];
    };
};

export default function MovieCard({ movie }: Props) {
    return (
        <Link
            href={`/movies/${movie.id}`}
            className="group block overflow-hidden rounded-xl border bg-background hover:shadow-sm transition"
        >
            {/* Poster area */}
            <div className="relative aspect-[2/3] w-full bg-muted">
                {movie.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={movie.imageUrl}
                        alt={movie.title}
                        className="h-full w-full object-cover group-hover:scale-[1.02] transition"
                        loading="lazy"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                        No poster
                    </div>
                )}

                {/* Price badge */}
                <div className="absolute left-3 top-3 rounded-md bg-background/90 px-2 py-1 text-xs font-semibold backdrop-blur">
                    <PriceTag amount={movie.price} />
                </div>
            </div>

            {/* Info area */}
            <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-snug line-clamp-2">{movie.title}</h3>
                    <span className="text-xs text-blue-600">View</span>
                </div>

                <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                    <span>Runtime: {movie.runtime} min</span>
                    <span>•</span>
                    <span>Stock: {movie.stock}</span>
                </div>

                {/* Demo rating until DB has rating */}
                <div className="flex items-center gap-2">
                    <RatingStars value={4} />
                    <span className="text-xs text-muted-foreground">(demo)</span>
                </div>

                <div className="text-sm">
                    <span className="font-semibold">Director:</span>{" "}
                    <span className="text-muted-foreground">
                        {movie.directors.length > 0 ? movie.directors.join(", ") : "—"}
                    </span>
                </div>

                <div className="text-sm">
                    <span className="font-semibold">Cast:</span>{" "}
                    <span className="text-muted-foreground">
                        {movie.actors.length > 0 ? movie.actors.join(", ") : "—"}
                    </span>
                </div>
            </div>

            {/*
              NOTE:
              - MovieCard must navigate to /movies/[movieId] (we do /movies/${movie.id})
              - Added poster UI using movie.imageUrl (optional)
              - This is visual-only change; backend logic unchanged
            */}
        </Link>
    );
}
