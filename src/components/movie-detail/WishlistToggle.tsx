"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";

// import { authClient } from "@/lib/auth-client";
import { useOriginRouter } from "@/hooks/use-origin-router";
import { getMyWishlistState, toggleWishlist } from "@/actions/wishlist";

type Props = { movieId: number };

export default function WishlistToggle({ movieId }: Props) {
    // Nueva lógica: verifica token en localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    let session = null;
    if (token) {
        try {
            session = JSON.parse(atob(token.split(".")[1]));
        } catch {
            session = null;
        }
    }
    const originRouter = useOriginRouter();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [loading, setLoading] = useState(true);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        let alive = true;

        async function load() {
            try {
                setLoading(true);
                const state = await getMyWishlistState(movieId);
                if (alive) setIsWishlisted(state);
            } finally {
                if (alive) setLoading(false);
            }
        }

        load();
        return () => {
            alive = false;
        };
    }, [movieId]);

    function onToggle() {
        if (!session.data) {
            originRouter.push("/login");
            return;
        }

        startTransition(async () => {
            try {
                const next = await toggleWishlist(movieId);
                setIsWishlisted(next);
                toast.success(next ? "Added to wishlist" : "Removed from wishlist");
                router.refresh();
            } catch {
                toast.error("Wishlist action failed");
            }
        });
    }

    const disabled = loading || isPending;

    return (
        <button
            type="button"
            onClick={onToggle}
            disabled={disabled}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="h-11 w-11 rounded-full bg-white shadow-sm transition
                       hover:shadow-md hover:scale-105 active:scale-95
                       disabled:opacity-60 disabled:hover:scale-100
                       flex items-center justify-center"
        >
            <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
        </button>
    );
}
