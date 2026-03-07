/**
 *   Author: Maria Virgina Gonzalez
 *   Description: Professional wishlist section for cart page with Add All to Cart button.
 */

"use client";

import { WishlistItemInfo } from "@/actions/wishlist";
import { addShoppingCartMultipleItems } from "@/actions/shopping-cart";
import { Button } from "@/components/ui/button";
import { WishlistItemComponent } from "./WishlistItem";
import { useTransition } from "react";
import { toast } from "sonner";
import { Heart, ShoppingCart } from "lucide-react";

type Props = {
    items: WishlistItemInfo[];
};

export function WishlistSection({ items }: Props) {
    const [isPending, startTransition] = useTransition();

    const hasOutOfStockOnly = items.every((item) => item.stock <= 0);

    function handleAddAllToCart() {
        const inStockIds = items.filter((item) => item.stock > 0).map((item) => item.movieId);

        if (inStockIds.length === 0) {
            toast.error("No items in stock to add");
            return;
        }

        startTransition(async () => {
            try {
                const added = await addShoppingCartMultipleItems(inStockIds);
                toast.success(`${added} item${added !== 1 ? "s" : ""} added to cart`);
            } catch (error) {
                toast.error("Failed to add items to cart");
                console.error(error);
            }
        });
    }

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg">
                        <Heart className="h-6 w-6 text-red-500 fill-red-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Wishlist</h2>
                        <p className="text-sm text-muted-foreground">
                            {items.length} item{items.length !== 1 ? "s" : ""} saved
                        </p>
                    </div>
                </div>

                <Button
                    onClick={handleAddAllToCart}
                    disabled={isPending || hasOutOfStockOnly}
                    size="lg"
                    className="w-full sm:w-auto gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="hidden sm:inline">Add All to Cart</span>
                    <span className="sm:hidden">Add All</span>
                </Button>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {items.map((item) => (
                    <WishlistItemComponent key={item.movieId} item={item} />
                ))}
            </div>

            {/* Info message if all out of stock */}
            {hasOutOfStockOnly && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                    <p className="text-amber-800 text-sm">
                        All items are currently out of stock. Check back soon!
                    </p>
                </div>
            )}
        </div>
    );
}
