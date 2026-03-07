/**
 *   Author: Maria Virgina Gonzalez
 *   Description: Wishlist item card in cart with add to cart and remove buttons.
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
import { ShoppingCart, Trash2 } from "lucide-react";

type Props = {
    item: WishlistItemInfo;
};

export function WishlistItemComponent({ item }: Props) {
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

    const isOutOfStock = item.stock <= 0;

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3 hover:shadow-md transition-shadow h-full max-w-sm mx-auto w-full">
            {/* Image */}
            <div className="w-full h-56 bg-black rounded-md overflow-hidden flex items-center justify-center">
                <Image
                    className="w-full h-full object-cover"
                    src={item.imageUrl || `/movies/${item.movieId}`}
                    width={200}
                    height={280}
                    alt={`Cover for ${item.title}`}
                />
            </div>

            {/* Title */}
            <h3 className="font-semibold text-base line-clamp-2 min-h-12">{item.title}</h3>

            {/* Genres */}
            {item.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {item.genres.slice(0, 2).map((genre) => (
                        <span key={genre} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {genre}
                        </span>
                    ))}
                </div>
            )}

            {/* Price & Stock */}
            <div className="flex justify-between items-start gap-2 min-h-12">
                <PriceTag amount={item.price} />
                <div className="text-xs text-muted-foreground text-right leading-tight">
                    {isOutOfStock ? (
                        <span className="text-orange-600 font-semibold">Out of stock</span>
                    ) : (
                        <span className="text-green-600">{item.stock} available</span>
                    )}
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-auto flex gap-2 pt-2">
                <Button
                    onClick={handleAddToCart}
                    disabled={isPending || isOutOfStock}
                    size="sm"
                    className="flex-1 gap-1 whitespace-nowrap"
                >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Add
                </Button>
                <Button
                    onClick={handleRemoveFromWishlist}
                    disabled={isPending}
                    size="sm"
                    variant="outline"
                    className="h-9 w-9 p-0"
                    title="Remove from wishlist"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
