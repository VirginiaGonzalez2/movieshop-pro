/**
 *   Author: Sabrina Bjurman
 *   Create Time: 2026-02-12 08:45:41
 *   Modified by: Sabrina Bjurman
 *   Modified time: 2026-03-05 10:30:47
 *   Description: Cart page.
 */

"use server";

import { getShoppingCartInfo } from "@/actions/shopping-cart";
import { LinkButton } from "@/components/ui-custom-shadcn/LinkButton";
import CartItem from "./_components/CartItem";
import { PriceTag } from "@/components/ui/PriceTag";

export default async function CartPage() {
    const shoppingCartInfo = await getShoppingCartInfo();

    let totalPrice = 0;
    if (shoppingCartInfo) {
        for (const item of shoppingCartInfo) {
            totalPrice += item.price * item.quantity;
        }
    }

    return (
        <div className="mx-auto max-w-2xl py-10 px-4 gap-4 flex flex-col items-end">
            <h1 className="text-2xl font-bold mb-4 flex-1">Shopping Cart</h1>
            <div className="w-full content-end">
                {shoppingCartInfo ? (
                    // NOT EMPTY
                    <ul className="flex flex-col">
                        {shoppingCartInfo.map(async (item) => (
                            <CartItem key={item.itemId} item={item} />
                        ))}
                    </ul>
                ) : (
                    // EMPTY
                    <p>It&apos;s very empty here right now, let&apos;s do some shopping!</p>
                )}
            </div>

            <div className="flex justify-end">
                <p>Subtotal:</p>
                <div className="gap-2 flex flex-col items-end">
                    <PriceTag amount={totalPrice} />
                    <LinkButton href="/checkout" disabled={!shoppingCartInfo}>
                        Checkout
                    </LinkButton>
                    <LinkButton variant="secondary" href={"/movies"}>
                        Continue Shopping
                    </LinkButton>
                </div>
            </div>
        </div>
    );
}
