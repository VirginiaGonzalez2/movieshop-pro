/**
 *   Author: Sabrina Bjurman
 *   Create Time: 2026-02-16 09:20:35
 *   Modified by: Sabrina Bjurman
 *   Modified time: 2026-02-26 17:40:20
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
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { buildInputFilter } from "@/utils/input-event-filters";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { ComponentProps, FocusEvent, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentProps<typeof ButtonGroup> & {
    itemId: number;
    title: string;
    quantity: number;
    stock?: number;
};

const inputFilter = buildInputFilter({ numericsOnly: true, maxLength: 3 });

export function CartItemControls({ itemId, title, quantity, stock, ...buttonGroupProps }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [updating, setUpdating] = useState(false);

    function updateInput(value: number) {
        if (inputRef.current) {
            inputRef.current.value = Math.max(0, value).toString();
        }
    }

    async function addSingle() {
        if (!updating) {
            setUpdating(true);
            updateInput(await addShoppingCartItem(itemId));
            setUpdating(false);
        }
    }

    async function removeSingle() {
        if (!updating) {
            setUpdating(true);
            updateInput(await removeShoppingCartItem(itemId));
            setUpdating(false);
        }
    }

    async function removeAll() {
        if (!updating) {
            setUpdating(true);
            updateInput(await removeShoppingCartItem(itemId, "all"));
            setUpdating(false);
        }
    }

    async function updateQuantity(event: FocusEvent<HTMLInputElement>) {
        if (updating) {
            return;
        }

        setUpdating(true);

        const value = event.currentTarget.value;
        const valueAsNumber = Number(value);
        if (value === "" || Number.isNaN(valueAsNumber)) {
            updateInput(await getShoppingCartItemQuantity(itemId));
        } else {
            await updateShoppingCartItem(itemId, valueAsNumber);
            updateInput(valueAsNumber);
        }

        setUpdating(false);
    }

    return (
        <ButtonGroup {...buttonGroupProps}>
            <Button variant="outline" size="icon" onClick={removeSingle}>
                <MinusIcon />
            </Button>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <TrashIcon />
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-fit">
                    <DialogHeader>
                        <DialogTitle>Remove {title}?</DialogTitle>
                        <DialogDescription className="gap-4 flex flex-col">
                            This will remove {quantity > 1 && "all copies of"} {title} from your
                            shopping cart.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-evenly">
                        <DialogClose asChild>
                            <Button
                                className="w-30"
                                variant="destructive"
                                type="button"
                                onClick={removeAll}
                            >
                                Continue
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button className="w-30" variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Input
                className={twMerge(
                    "w-12 text-center",
                    stock && quantity > stock ? "text-red-600" : undefined,
                )}
                type="text"
                ref={inputRef}
                defaultValue={quantity}
                onBeforeInput={inputFilter}
                onBlur={updateQuantity}
            />
            <Button variant="outline" size="icon" onClick={addSingle}>
                <PlusIcon />
            </Button>
        </ButtonGroup>
    );
}
