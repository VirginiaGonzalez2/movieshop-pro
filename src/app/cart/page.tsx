/**
 *   Author: Sabrina Bjurman
 *   Create Time: 2026-02-12 08:45:41
 *   Modified by: Sabrina Bjurman
 *   Modified time: 2026-02-18 15:01:15
 *   Description: Cart page.
 */

"use server";

import { getShoppingCart, getShoppingCartInfo } from "@/actions/shopping-cart";
import { LinkButton } from "@/components/ui-custom-shadcn/LinkButton";
import { TestCart } from "./_components/TestCart";
import { prisma } from "@/lib/prisma";
import {
    Item,
    ItemContent,
    ItemGroup,
    ItemHeader,
    ItemMedia,
    ItemSeparator,
} from "@/components/ui/item";
import Image from "next/image";
import { Genre } from "@prisma/client";
import { CartItemControls } from "./_components/CartItemControls";
import CartItem from "./_components/CartItem";

export default async function CartPage() {
    const shoppingCartInfo = await getShoppingCartInfo();

    let totalPrice = 0;
    if (shoppingCartInfo) {
        shoppingCartInfo.forEach((value) => {
            totalPrice += value.price * value.quantity;
        });
    }

    return (
        <div className="mx-auto max-w-2xl py-10 px-4 gap-4 flex flex-col items-end">
            <h1 className="text-2xl font-bold mb-4 flex-1">Shopping Cart</h1>
            <TestCart />

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
                    <p>{totalPrice} sek</p>
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
