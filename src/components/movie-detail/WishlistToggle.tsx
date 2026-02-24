"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useOriginRouter } from "@/hooks/use-origin-router";
import { getMyWishlistState, toggleWishlist } from "@/actions/wishlist";

type Props = {
    movieId: number;
};

export default function WishlistToggle({ movieId }: Props) {
    const session = authClient.useSession();
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
        }

        startTransition(async () => {
            const next = await toggleWishlist(movieId);
            setIsWishlisted(next);
            router.refresh();
        });
    }

    return (
        <div className="border rounded p-6 space-y-2">
            <h2 className="text-xl font-semibold">Wishlist</h2>

            <button
                type="button"
                disabled={loading || isPending}
                onClick={onToggle}
                className={`rounded px-4 py-2 text-sm border ${
                    isWishlisted ? "bg-black text-white" : "bg-white"
                }`}
            >
                {loading ? "Loading…" : isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>

            {!session.data ? (
                <p className="text-xs text-muted-foreground">
                    You must be logged in. Clicking will take you to login.
                </p>
            ) : null}
        </div>
    );
}
