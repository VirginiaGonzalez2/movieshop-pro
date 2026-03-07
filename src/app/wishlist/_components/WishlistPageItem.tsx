/**
 *   Author: Maria Virgina Gonzalez
 *   Description: Wishlist item card for wishlist page with stock info and quick actions
 */

"use client";

import { WishlistItemInfo } from "@/actions/wishlist";
import { addShoppingCartItem } from "@/actions/shopping-cart";
import { toggleWishlist } from "@/actions/wishlist";
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/ui-localized/PriceTag";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";
import { ShoppingCart, X } from "lucide-react";
import Link from "next/link";

type Props = {
    item: WishlistItemInfo;
};

export function WishlistPageItem({ item }: Props) {
    const [isPending, startTransition] = useTransition();

    function handleAddToCart() {
        if (item.stock <= 0) {
            toast.error("This item is out of stock");
            return;
        }

        startTransition(async () => {
            try {
                await addShoppingCartItem(item.movieId, 1);
                toast.success(`${item.title} added to cart`);
            } catch (error) {
                toast.error("Failed to add to cart");
                console.error(error);
            }
        });
    }

    function handleRemoveFromWishlist() {
        startTransition(async () => {
            try {
                await toggleWishlist(item.movieId);
                toast.success(`${item.title} removed from wishlist`);
            } catch (error) {
                toast.error("Failed to remove from wishlist");
                console.error(error);
            }
        });
    }

    const isOutOfStock = item.stock === 0;
    const isLowStock = item.stock > 0 && item.stock <= 3;

    return (
        <Link href={`/movies/${item.movieId}`} className="group">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full hover:shadow-md hover:border-gray-300 transition-all max-w-xs">
                {/* Image Container */}
                <div className="relative w-full aspect-[3/4] bg-gray-900 overflow-hidden h-48">
                    <Image
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={item.imageUrl || `/movies/${item.movieId}`}
                        width={160}
                        height={220}
                        alt={`Cover for ${item.title}`}
                    />

                    {/* Stock Badge - Compact */}
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                        <div
                            className={`px-2 py-0.5 rounded text-xs font-semibold text-white ${
                                isOutOfStock
                                    ? "bg-red-500"
                                    : isLowStock
                                      ? "bg-amber-500"
                                      : "bg-green-500"
                            }`}
                        >
                            {isOutOfStock ? "Out" : `${item.stock}`}
                        </div>
                    </div>

                    {/* Remove Button - Floating */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handleRemoveFromWishlist();
                        }}
                        disabled={isPending}
                        className="absolute top-1.5 left-1.5 h-7 w-7 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm hover:shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                        title="Remove from wishlist"
                    >
                        <X className="h-4 w-4 text-gray-700" />
                    </button>
                </div>

                {/* Content */}
                <div
                    className="flex-1 px-3 py-2 flex flex-col gap-1.5"
                    onClick={(e) => e.preventDefault()}
                >
                    {/* Title */}
                    <h3 className="font-semibold text-xs leading-tight line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                    </h3>

                    {/* Genres - One line max */}
                    {item.genres.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                            <span className="text-xs text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded line-clamp-1">
                                {item.genres[0]}
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="mt-auto pt-1">
                        <div className="text-sm font-bold text-gray-900">
                            <PriceTag amount={item.price} />
                        </div>
                    </div>

                    {/* Low Stock Warning */}
                    {isLowStock && (
                        <div className="text-xs text-amber-700 font-semibold">
                            Only {item.stock} left
                        </div>
                    )}

                    {/* Add to Cart Button */}
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart();
                        }}
                        disabled={isPending || isOutOfStock}
                        size="sm"
                        className="w-full h-7 text-xs gap-1 mt-1"
                    >
                        <ShoppingCart className="h-3 w-3" />
                        Add
                    </Button>
                </div>
            </div>
        </Link>
    );
}
