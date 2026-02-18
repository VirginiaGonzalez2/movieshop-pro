"use server";

import { getShoppingCart } from "@/actions/shopping-cart";
import { TestAddCartItem } from "./TestAddCartItem";
import { TestClearCart } from "./TestClearCart";

export async function TestCart() {
    const shoppingCart = await getShoppingCart();

    const count = shoppingCart?.length ?? 0;

    return (
        <div className="flex justify-center">
            <TestAddCartItem itemId={count + 1} quantity={(count + 1) * 2} />
            <TestClearCart />
        </div>
    );
}
