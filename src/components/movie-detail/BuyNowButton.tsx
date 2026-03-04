"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { addShoppingCartItem } from "@/actions/shopping-cart";

type Props = {
    movieId: number;
    disabled?: boolean;
};

export default function BuyNowButton({ movieId, disabled }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function onBuyNow() {
        startTransition(async () => {
            try {
                await addShoppingCartItem(movieId, 1);
                router.push("/checkout");
            } catch {
                toast.error("Failed to start checkout");
            }
        });
    }

    const isDisabled = Boolean(disabled) || isPending;

    return (
        <Button
            type="button"
            variant="outline"
            onClick={onBuyNow}
            disabled={isDisabled}
            className="h-10 px-4 rounded-md shadow-sm transition-all duration-150 hover:shadow-md active:scale-[0.98] disabled:opacity-60"
        >
            {isPending ? "Working..." : "Buy now"}
        </Button>
    );
}
