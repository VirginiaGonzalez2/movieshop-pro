// SEO metadata for Wishlist page
export const metadata = {
    title: "Wishlist - A+ MovieShop",
    description: "View and manage your wishlist. Track stock and get notified for your favorite movies.",
    openGraph: {
        title: "Wishlist - A+ MovieShop",
        description: "View and manage your wishlist. Track stock and get notified for your favorite movies.",
        url: "https://tu-dominio.com/wishlist",
        images: [
            {
                url: "https://tu-dominio.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "A+ MovieShop"
            }
        ]
    }
};
/**
 *   Author: Maria Virgina Gonzalez
 *   Description: Dedicated Wishlist page

"use server";
 */

import Link from "next/link";
import { getWishlistInfo } from "@/actions/wishlist";
import { LinkButton } from "@/components/ui-custom-shadcn/LinkButton";
import { Heart, AlertTriangle } from "lucide-react";
import { WishlistPageItem } from "./_components/WishlistPageItem";

export default async function WishlistPage() {
    const wishlistInfo = await getWishlistInfo();

    const isEmpty = !wishlistInfo || wishlistInfo.length === 0;
    const lowStockItems = wishlistInfo?.filter((item) => item.stock > 0 && item.stock <= 3) ?? [];
    const outOfStockItems = wishlistInfo?.filter((item) => item.stock === 0) ?? [];

    return (
        <div className="mx-auto max-w-6xl py-10 px-4 space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg">
                        <Heart className="h-8 w-8 text-red-500 fill-red-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">My Wishlist</h1>
                        <p className="text-muted-foreground">
                            {isEmpty ? "Your wishlist is empty" : `${wishlistInfo.length} item${wishlistInfo.length !== 1 ? "s" : ""} saved`}
                        </p>
                    </div>
                </div>
            </div>

            {isEmpty ? (
                /* Empty State */
                <div className="text-center py-16 space-y-4">
                    <div className="flex justify-center mb-4">
                        <Heart className="h-16 w-16 text-gray-300" />
                    </div>
                    <p className="text-lg text-muted-foreground">
                        No items in your wishlist yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Start adding movies you love by clicking the heart icon on movie detail pages
                    </p>
                    <LinkButton href="/movies" className="mt-6">
                        Explore Movies
                    </LinkButton>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Stock Alerts */}
                    {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
                        <div className="space-y-3">
                            {outOfStockItems.length > 0 && (
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-orange-900">Out of Stock</h3>
                                        <p className="text-sm text-orange-800">
                                            {outOfStockItems.length} item{outOfStockItems.length !== 1 ? "s" : ""} are currently unavailable
                                        </p>
                                    </div>
                                </div>
                            )}

                            {lowStockItems.length > 0 && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-amber-900">Low Stock Alert</h3>
                                        <p className="text-sm text-amber-800">
                                            {lowStockItems.length} item{lowStockItems.length !== 1 ? "s" : ""} have limited copies left
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {wishlistInfo.map((item) => (
                            <WishlistPageItem key={item.movieId} item={item} />
                        ))}
                    </div>

                    {/* Continue Shopping Button */}
                    <div className="flex justify-center pt-4">
                        <LinkButton href="/movies" variant="secondary" size="lg">
                            Continue Exploring
                        </LinkButton>
                    </div>
                </div>
            )}
        </div>
    );
}
