"use client";

import { useTransition } from "react";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { addShoppingCartItem } from "@/actions/shopping-cart";

type Props = {
    movieId: number;
    disabled?: boolean;
};

export default function AddToCartButton({ movieId, disabled }: Props) {
    const [isPending, startTransition] = useTransition();

    function onAdd() {
        startTransition(async () => {
            try {
                // add 1 item to cart
                await addShoppingCartItem(movieId, 1);
                toast.success("Added to cart");
            } catch {
                toast.error("Failed to add to cart");
            }
        });
    }

    const isDisabled = Boolean(disabled) || isPending;

    return (
        <Button
            type="button"
            onClick={onAdd}
            disabled={isDisabled}
            aria-label="Add to cart"
            title="Add to cart"
            className="h-7 px-2 rounded-md bg-slate-800 text-white text-xs shadow-sm transition-all duration-150 hover:shadow-sm active:scale-[0.98] disabled:opacity-60 w-full sm:w-auto"
        >
            <ShoppingCart className="h-3 w-3 mr-2" />
            {isPending ? "Adding" : "Add"}
        </Button>
    );
}
