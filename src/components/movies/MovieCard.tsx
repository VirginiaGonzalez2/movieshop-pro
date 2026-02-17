"use client";

import Link from "next/link";
import { PriceTag } from "@/components/ui/PriceTag";
import { RatingStars } from "@/components/ui/RatingStars";

export type MovieCardItem = {
    id: number;
    title: string;
    price: string;
    stock: number;
    runtime: number;
    rating: number;
    imageUrl?: string | null;
};

export default function MovieCard({ movie }: { movie: MovieCardItem }) {
    return (
        <Link
            href={`/movies/${movie.id}`}
            className="block border rounded-lg overflow-hidden hover:shadow-sm transition"
        >
            <div className="bg-muted aspect-[2/3] w-full flex items-center justify-center">
                {movie.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={movie.imageUrl}
                        alt={movie.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="text-sm text-muted-foreground">No Image</div>
                )}
            </div>

            <div className="p-4 space-y-2">
                <div className="font-semibold">{movie.title}</div>

                <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                    <PriceTag amount={movie.price} />
                    <span>•</span>
                    <span>{movie.runtime} min</span>
                    <span>•</span>
                    <span>Stock: {movie.stock}</span>
                </div>

                <RatingStars value={movie.rating} />
            </div>
        </Link>
    );
}
