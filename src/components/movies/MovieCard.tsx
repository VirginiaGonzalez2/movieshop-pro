"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { PriceTag } from "@/components/ui-localized/PriceTag";
import { RatingStars } from "@/components/ui/RatingStars";
import AddToCartButton from "@/components/movie-detail/AddToCartButton";
import { addShoppingCartItem } from "@/actions/shopping-cart";
import Image from "next/image";

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

    // optional short genres text on card
    genres?: string[];

    // optional purchased count for top purchased section
    purchasedCount?: number;
};

export default function MovieCard({
    movie,
    compact = false,
}: {
    movie: MovieCardItem;
    compact?: boolean;
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function onBuyNow() {
        startTransition(async () => {
            try {
                await addShoppingCartItem(movie.id, 1);
                router.push("/checkout");
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                // ignore; toast handled elsewhere if desired
            }
        });
    }

    return (
        <div
            className={`block border rounded-lg overflow-hidden transition-all duration-200 transform hover:shadow-lg ${
                compact ? "hover:scale-100" : "hover:scale-[1.02]"
            }`}
        >
            {/* Poster (clickable) */}
            <Link href={`/movies/${movie.id}`} className="block">
                <div className="aspect-2/3 bg-muted flex items-center justify-center overflow-hidden">
                    {movie.imageUrl ? (
                        <Image
                            src={movie.imageUrl}
                            alt={movie.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            width={444}
                            height={666}
                        />
                    ) : (
                        <div className="text-sm text-muted-foreground">No image</div>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className={compact ? "p-2 space-y-1.5" : "p-3 space-y-2"}>
                <Link href={`/movies/${movie.id}`} className="block">
                    <div
                        className={`font-semibold line-clamp-1 flex items-baseline gap-2 ${
                            compact ? "text-xs" : ""
                        }`}
                    >
                        <span className="truncate">{movie.title}</span>
                        {movie.releaseYear ? (
                            <span className="text-xs text-muted-foreground">
                                {movie.releaseYear}
                            </span>
                        ) : null}
                    </div>
                </Link>

                {movie.genres && movie.genres.length > 0 ? (
                    <p
                        className={`text-muted-foreground line-clamp-1 ${
                            compact ? "text-[10px]" : "text-xs"
                        }`}
                    >
                        {movie.genres.join(" • ")}
                    </p>
                ) : null}

                {movie.purchasedCount !== undefined && movie.purchasedCount > 0 ? (
                    <p className={compact ? "text-[10px] text-muted-foreground" : "text-xs text-muted-foreground"}>
                        {movie.purchasedCount} sold
                    </p>
                ) : null}

                <div className="flex items-start justify-between">
                    <div className={compact ? "text-sm font-semibold" : "text-lg font-semibold"}>
                        <PriceTag amount={movie.price} />
                    </div>

                    <div
                        className={`text-muted-foreground text-right ${
                            compact ? "text-[10px]" : "text-xs"
                        }`}
                    >
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
                    <RatingStars value={Math.round(movie.avgRating)} size={compact ? 12 : 16} />
                    <span className={compact ? "text-[10px] text-muted-foreground" : "text-xs text-muted-foreground"}>
                        {movie.ratingCount > 0
                            ? `${movie.avgRating.toFixed(1)} (${movie.ratingCount})`
                            : "No ratings"}
                    </span>
                </div>

                <div
                    className={`flex flex-col sm:flex-row gap-1 mt-2 items-stretch ${
                        compact ? "scale-90 origin-left" : ""
                    }`}
                >
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
