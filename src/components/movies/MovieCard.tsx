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
        directors: string[];
        actors: string[];
    };
};

export default function MovieCard({ movie }: Props) {
    return (
        <div className="border rounded p-4 flex items-start justify-between">
            <div className="space-y-1">
                <div className="font-semibold text-lg">{movie.title}</div>

                <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                    <PriceTag amount={movie.price} />
                    <span>•</span>
                    <span>Stock: {movie.stock}</span>
                    <span>•</span>
                    <span>Runtime: {movie.runtime} min</span>
                </div>

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
                <Link className="text-blue-600" href={`/movies/${movie.id}`}>
                    View
                </Link>
            </div>
        </div>
    );
}
