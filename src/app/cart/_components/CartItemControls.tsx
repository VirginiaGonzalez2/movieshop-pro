/**
 *   Author: Sabrina Bjurman
 *   Create Time: 2026-02-16 09:20:35
 *   Modified by: Sabrina Bjurman
 *   Modified time: 2026-02-18 15:30:15
 *   Description: Add, remove and set quantity of item in cart.
 */

"use client";

import {
    addShoppingCartItem,
    getShoppingCartItemQuantity,
    removeShoppingCartItem,
    updateShoppingCartItem,
} from "@/actions/shopping-cart";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { MinusIcon, PlusIcon } from "lucide-react";
import { ChangeEvent, ComponentProps, FocusEvent, InputEvent, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentProps<typeof ButtonGroup> & {
    itemId: number;
    quantity: number;
    stock: number;
};

// Just for sanity.
const MAX_QUANTITY = 999;

export function CartItemControls({ itemId, quantity, stock, ...buttonGroupProps }: Props) {
    const [updating, setUpdating] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    function updateInput(value: number) {
        if (inputRef.current) {
            inputRef.current.value = Math.max(0, value).toString();
        }
    }

    function filterInput(event: InputEvent<HTMLInputElement>) {
        if (updating || event.data.match(/[^\d]/)) {
            event.preventDefault();
            return;
        }
    }

    async function addItem() {
        if (updating) {
            return;
        }
        setUpdating(true);
        updateInput(await addShoppingCartItem(itemId));
        setUpdating(false);
    }

    async function removeItem() {
        if (updating) {
            return;
        }
        setUpdating(true);
        updateInput(await removeShoppingCartItem(itemId));
        setUpdating(false);
    }

    async function updateItem(event: ChangeEvent<HTMLInputElement>) {
        if (event.currentTarget.value === "" || updating) {
            return;
        }

        setUpdating(true);

        let valueAsNumber = Number(event.currentTarget.value);
        if (!Number.isNaN(valueAsNumber)) {
            valueAsNumber = Math.min(MAX_QUANTITY, valueAsNumber);
            await updateShoppingCartItem(itemId, valueAsNumber);
            updateInput(valueAsNumber);
        }

        setUpdating(false);
    }

    async function stopUpdateItem(event: FocusEvent<HTMLInputElement>) {
        if (updating) {
            return;
        }

        setUpdating(true);

        if (event.currentTarget.value === "" || Number.isNaN(Number(event.currentTarget.value))) {
            updateInput(await getShoppingCartItemQuantity(itemId));
        }

        setUpdating(false);
    }

    return (
        <ButtonGroup {...buttonGroupProps}>
            <Button variant="outline" size="icon" onClick={removeItem}>
                <MinusIcon />
            </Button>
            <Input
                className={twMerge(
                    "w-12 text-center",
                    quantity > stock ? "text-red-600" : undefined,
                )}
                type="text"
                ref={inputRef}
                defaultValue={quantity}
                onBeforeInput={filterInput}
                onChange={updateItem}
                onBlur={stopUpdateItem}
            />
            {/* <Button variant="outline" size="icon">
                    <TrashIcon />
                </Button> */}
            <Button variant="outline" size="icon" onClick={addItem}>
                <PlusIcon />
            </Button>
        </ButtonGroup>
    );
}
