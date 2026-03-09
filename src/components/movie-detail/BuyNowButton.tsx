"use client";

import { Button } from "@/components/ui/button";
import { useBuyNow } from "@/hooks/use-buy-now";

type Props = {
    movieId: number;
    disabled?: boolean;
};

export default function BuyNowButton({ movieId, disabled }: Props) {
    const buyNow = useBuyNow(movieId);

    return (
        <Button
            type="button"
            variant="outline"
            onClick={buyNow}
            disabled={disabled}
            className="h-10 px-4 rounded-md shadow-sm transition-all duration-150 hover:shadow-md active:scale-[0.98] disabled:opacity-60"
        >
            Buy Now
        </Button>
    );
}
