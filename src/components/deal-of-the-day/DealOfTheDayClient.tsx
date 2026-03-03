"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { X, ChevronRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addShoppingCartItem } from "@/actions/shopping-cart";
import { toast } from "sonner";

type Props = {
    deal: {
        date: string;
        movieId: number;
        discountPct: number;
        title: string;
        imageUrl: string | null;
        stock: number;
        originalPrice: number;
        discountedPrice: number;
    } | null;
};

function readLS(key: string, fallback: string) {
    if (typeof window === "undefined") return fallback;
    try {
        return window.localStorage.getItem(key) ?? fallback;
    } catch {
        return fallback;
    }
}

function writeLS(key: string, value: string) {
    try {
        window.localStorage.setItem(key, value);
    } catch {
        // ignore
    }
}

export default function DealOfTheDayClient({ deal }: Props) {
    const dayKey = deal?.date ?? "no-deal";
    const [isPending, startTransition] = useTransition();

    const [isClosed, setIsClosed] = useState(() => readLS(`dotd_closed_${dayKey}`, "0") === "1");
    const [isMinimized, setIsMinimized] = useState(() => readLS(`dotd_min_${dayKey}`, "0") === "1");

    const canRender = !!deal && !isClosed;

    const badgeText = useMemo(() => {
        if (!deal) return "";
        return `${deal.discountPct}% OFF`;
    }, [deal]);

    if (!canRender) return null;

    // Minimized pill
    if (isMinimized) {
        return (
            <div className="fixed right-4 bottom-4 z-50">
                <button
                    type="button"
                    onClick={() => {
                        setIsMinimized(false);
                        writeLS(`dotd_min_${dayKey}`, "0");
                    }}
                    className="flex items-center gap-2 rounded-full bg-white shadow-md px-4 py-2
                               transition-transform duration-200 hover:scale-105 active:scale-95"
                    aria-label="Open Deal of the Day"
                    title="Open Deal of the Day"
                >
                    <Tag className="h-4 w-4" />
                    <span className="text-sm font-medium">Deal</span>
                    <span className="text-xs text-muted-foreground">{badgeText}</span>
                </button>
            </div>
        );
    }

    return (
        <div className="fixed right-4 bottom-4 z-50 w-[320px]">
            <div className="rounded-2xl bg-white shadow-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        <div className="font-semibold">Deal of the Day</div>
                        <span className="text-xs rounded-full bg-black text-white px-2 py-0.5">
                            {badgeText}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => {
                                setIsMinimized(true);
                                writeLS(`dotd_min_${dayKey}`, "1");
                            }}
                            className="h-9 w-9 rounded-full hover:bg-muted transition"
                            aria-label="Minimize"
                            title="Minimize"
                        >
                            <ChevronRight className="h-5 w-5 mx-auto" />
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setIsClosed(true);
                                writeLS(`dotd_closed_${dayKey}`, "1");
                            }}
                            className="h-9 w-9 rounded-full hover:bg-muted transition"
                            aria-label="Close"
                            title="Close"
                        >
                            <X className="h-5 w-5 mx-auto" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 pb-4">
                    <div className="flex gap-3">
                        <div className="h-20 w-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            {deal?.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={deal.imageUrl}
                                    alt={deal.title}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            ) : null}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="font-medium leading-snug line-clamp-2">
                                {deal?.title}
                            </div>

                            <div className="mt-1 flex items-baseline gap-2">
                                <span className="text-lg font-bold">
                                    ${deal?.discountedPrice.toFixed(2)}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                    ${deal?.originalPrice.toFixed(2)}
                                </span>
                            </div>

                            <div className="text-xs text-muted-foreground mt-1">
                                {deal?.stock > 0 ? `${deal.stock} in stock` : "Out of stock"}
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                        <Button asChild className="flex-1">
                            <Link href={`/movies/${deal?.movieId}`}>View</Link>
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 shadow-sm transition-transform duration-200 hover:scale-105 active:scale-95"
                            onClick={() => {
                                if (!deal?.movieId) return;
                                startTransition(async () => {
                                    try {
                                        await addShoppingCartItem(deal.movieId, 1);
                                        toast.success("Movie added to cart");
                                    } catch {
                                        toast.error("Could not add movie to cart");
                                    }
                                });
                            }}
                            disabled={isPending || deal?.stock === 0}
                        >
                            {deal?.stock === 0 ? "Out of stock" : "Add to cart"}
                        </Button>
                    </div>

                    <div className="mt-2 text-[11px] text-muted-foreground">
                        New deal every day. Discount only applies to this movie.
                    </div>
                </div>
            </div>
        </div>
    );
}
