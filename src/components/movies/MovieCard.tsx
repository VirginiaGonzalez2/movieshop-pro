import Link from "next/link";
import { PriceTag } from "@/components/ui/PriceTag";
import { RatingStars } from "@/components/ui/RatingStars";

export type MovieCardItem = {
    id: number;
    title: string;
    price: string;
    stock: number;
    runtime: number;
    imageUrl?: string | null;

    // real ratings
    avgRating: number; // 0..5
    ratingCount: number;
};

export default function MovieCard({ movie }: { movie: MovieCardItem }) {
    return (
        <Link
            href={`/movies/${movie.id}`}
            className="block border rounded-lg overflow-hidden hover:shadow-md transition"
        >
            {/* Poster */}
            <div className="aspect-[2/3] bg-muted flex items-center justify-center overflow-hidden">
                {movie.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={movie.imageUrl}
                        alt={movie.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="text-sm text-muted-foreground">No image</div>
                )}
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
                <div className="font-semibold line-clamp-1">{movie.title}</div>

                <div className="flex items-start justify-between">
                    <div className="text-lg font-semibold">
                        <PriceTag amount={movie.price} />
                    </div>

                    <div className="text-xs text-muted-foreground text-right">
                        <div>{movie.runtime} min</div>
                        <div>
                            {movie.stock > 0 ? (
                                <span className="text-green-600">In stock ({movie.stock})</span>
                            ) : (
                                <span className="text-red-500">Out of stock</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <RatingStars value={Math.round(movie.avgRating)} />
                    <span className="text-xs text-muted-foreground">
                        {movie.ratingCount > 0
                            ? `${movie.avgRating.toFixed(1)} (${movie.ratingCount})`
                            : "No ratings"}
                    </span>
                </div>
            </div>
        </Link>
    );
}
