import Link from "next/link";
import { PriceTag } from "@/components/ui/PriceTag";
import { RatingStars } from "@/components/ui/RatingStars";

type Movie = {
    id: number;
    title: string;
    price: string;
    stock: number;
    runtime: number;
    rating: number;
    imageUrl?: string | null;
};

export default function MovieCard({ movie }: { movie: Movie }) {
    return (
        <Link
            href={`/movies/${movie.id}`}
            className="block border rounded-lg overflow-hidden hover:shadow-md transition"
        >
            {/* Poster */}
            <div className="aspect-[2/3] bg-muted flex items-center justify-center overflow-hidden">
                {movie.imageUrl ? (
                    <img
                        src={movie.imageUrl}
                        alt={movie.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="text-sm text-muted-foreground">No image</div>
                )}
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
                <div className="font-semibold line-clamp-1">{movie.title}</div>

                <div className="flex items-start justify-between">
                    {/* Primary price */}
                    <div className="text-lg font-semibold">
                        <PriceTag amount={movie.price} />
                    </div>

                    {/* Secondary metadata */}
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

                <RatingStars value={movie.rating} />
            </div>
        </Link>
    );
}
