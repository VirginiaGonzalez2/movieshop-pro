"use client";

import { addShoppingCartItem } from "@/actions/shopping-cart";
import { Button } from "@/components/ui/button";

type Props = {
    itemId: number;
    quantity: number;
};

export function TestAddCartItem(props: Props) {
    return (
        <Button onClick={() => addShoppingCartItem(props.itemId, props.quantity)}>
            CLICK HERE TO ADD A TEST ITEM
        </Button>
    );
}
