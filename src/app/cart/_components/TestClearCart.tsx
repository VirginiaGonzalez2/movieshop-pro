"use client";

import { clearShoppingCart } from "@/actions/shopping-cart";
import { Button } from "@/components/ui/button";

export function TestClearCart() {
    return <Button onClick={() => clearShoppingCart()}>CLICK HERE TO CLEAR CART</Button>;
}
