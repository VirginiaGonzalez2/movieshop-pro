"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { PriceTag } from "@/components/ui/PriceTag";
import { RatingStars } from "@/components/ui/RatingStars";
import AddToCartButton from "@/components/movie-detail/AddToCartButton";
import { addShoppingCartItem } from "@/actions/shopping-cart";

export type MovieCardItem = {
    id: number;
    title: string;
    price: string;
    stock: number;
    runtime: number;
    imageUrl?: string | null;
    // optional release year to show in certain lists (e.g., oldest section)
    releaseYear?: number | null;

    // real ratings
    avgRating: number; // 0..5
    ratingCount: number;
};

export default function MovieCard({ movie }: { movie: MovieCardItem }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function onBuyNow() {
        startTransition(async () => {
            try {
                await addShoppingCartItem(movie.id, 1);
                router.push("/checkout");
            } catch (e) {
                // ignore; toast handled elsewhere if desired
            }
        });
    }

    return (
        <div className="block border rounded-lg overflow-hidden transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg">
            {/* Poster (clickable) */}
            <Link href={`/movies/${movie.id}`} className="block">
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
            </Link>

            {/* Content */}
            <div className="p-3 space-y-2">
                <Link href={`/movies/${movie.id}`} className="block">
                    <div className="font-semibold line-clamp-1 flex items-baseline gap-2">
                        <span className="truncate">{movie.title}</span>
                        {movie.releaseYear ? (
                            <span className="text-xs text-muted-foreground">{movie.releaseYear}</span>
                        ) : null}
                    </div>
                </Link>

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

                <div className="flex flex-col sm:flex-row gap-1 mt-2 items-stretch">
                    <div className="w-full sm:w-auto">
                        <AddToCartButton movieId={movie.id} disabled={movie.stock <= 0} />
                    </div>

                    <div className="w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={onBuyNow}
                            disabled={isPending || movie.stock <= 0}
                            className="h-7 px-2 rounded-md bg-blue-600 text-white text-xs shadow-sm transition-all duration-150 hover:shadow-sm active:scale-[0.98] disabled:opacity-60 w-full sm:w-auto"
                        >
                            {isPending ? "Buying" : "Buy"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
