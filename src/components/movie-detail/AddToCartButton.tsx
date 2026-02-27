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
            className="h-11 px-5 rounded-full bg-black text-white shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
        >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {isPending ? "Adding..." : "Add to cart"}
        </Button>
    );
}
