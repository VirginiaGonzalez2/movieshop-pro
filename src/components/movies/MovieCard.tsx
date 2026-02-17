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

                <div className="flex items-center justify-between text-sm">
                    <PriceTag amount={movie.price} />
                    <span className="text-muted-foreground">{movie.runtime} min</span>
                </div>

                <div className="flex items-center justify-between">
                    <RatingStars value={movie.rating} />
                    <span className="text-xs text-muted-foreground">Stock: {movie.stock}</span>
                </div>
            </div>
        </Link>
    );
}
