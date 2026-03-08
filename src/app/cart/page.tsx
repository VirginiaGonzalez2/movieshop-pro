// SEO metadata for Cart page
export const metadata = {
    title: "Shopping Cart - A+ MovieShop",
    description: "View and manage your shopping cart. Checkout your favorite movies easily.",
    openGraph: {
        title: "Shopping Cart - A+ MovieShop",
        description: "View and manage your shopping cart. Checkout your favorite movies easily.",
        url: "https://tu-dominio.com/cart",
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
 *   Author: Sabrina Bjurman
 *   Create Time: 2026-02-12 08:45:41
 *   Modified by: Sabrina Bjurman
 *   Modified time: 2026-03-05 10:30:47
 *   Description: Cart page.

"use server";
 */

import { getShoppingCartInfo } from "@/actions/shopping-cart";
import { getWishlistInfo } from "@/actions/wishlist";
import { LinkButton } from "@/components/ui-custom-shadcn/LinkButton";
import CartItem from "./_components/CartItem";
import { WishlistSection } from "./_components/WishlistSection";
import { PriceTag } from "@/components/ui-localized/PriceTag";

export default async function CartPage() {
    const shoppingCartInfo = await getShoppingCartInfo();
    const wishlistInfo = await getWishlistInfo();

    let totalPrice = 0;
    if (shoppingCartInfo) {
        for (const item of shoppingCartInfo) {
            totalPrice += item.price * item.quantity;
        }
    }

    const hasCart = !!shoppingCartInfo;
    const hasWishlist = !!wishlistInfo;
    const isEmpty = !hasCart && !hasWishlist;
    const showWishlistOnly = !hasCart && hasWishlist;

    return (
        <div className="mx-auto max-w-5xl py-10 px-4 gap-8 flex flex-col">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>

            {isEmpty ? (
                // COMPLETELY EMPTY
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">
                        It&apos;s very empty here right now, let&apos;s do some shopping!
                    </p>
                    <LinkButton href="/movies" className="mt-6">
                        Explore Movies
                    </LinkButton>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                        {/* SHOPPING CART SECTION */}
                        {hasCart ? (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Cart Items</h2>
                                <ul className="flex flex-col gap-3">
                                    {shoppingCartInfo.map(async (item) => (
                                        <CartItem key={item.itemId} item={item} />
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="rounded-lg border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                                No items in cart yet.
                            </div>
                        )}

                        {/* WISHLIST SECTION */}
                        {hasWishlist && <WishlistSection items={wishlistInfo} />}
                    </div>

                    {/* Sidebar - Checkout */}
                    {hasCart && (
                        <div className="lg:w-80">
                            <div className="bg-gray-50 rounded-lg p-6 sticky top-20 space-y-4">
                                <h3 className="text-lg font-semibold">Order Summary</h3>

                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal:</span>
                                        <PriceTag amount={totalPrice} />
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Shipping:</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Tax:</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                </div>

                                <div className="border-t pt-4 flex justify-between font-semibold">
                                    <span>Total:</span>
                                    <PriceTag amount={totalPrice} />
                                </div>

                                <LinkButton
                                    href="/checkout"
                                    disabled={!shoppingCartInfo}
                                    className="w-full"
                                >
                                    Proceed to Checkout
                                </LinkButton>
                                <LinkButton
                                    variant="secondary"
                                    href={"/movies"}
                                    className="w-full"
                                >
                                    Continue Shopping
                                </LinkButton>
                            </div>
                        </div>
                    )}

                    {showWishlistOnly && (
                        <div className="w-full flex justify-center lg:justify-start">
                            <LinkButton variant="secondary" href={"/movies"}>
                                Continue Shopping
                            </LinkButton>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
