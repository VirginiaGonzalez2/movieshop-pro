"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useOriginRouter } from "@/hooks/use-origin-router";
import { getMyMovieRating, setMovieRating } from "@/actions/movie-rating";

type Props = {
    movieId: number;
    avgRating: number;
    ratingCount: number;
};

export default function MovieRatingSection({ movieId, avgRating, ratingCount }: Props) {
    const session = authClient.useSession();
    const originRouter = useOriginRouter();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [userRating, setUserRating] = useState<number>(0);
    const [loadingMine, setLoadingMine] = useState<boolean>(true);

    // hover preview (optional nice UX)
    const [hover, setHover] = useState<number | null>(null);

    useEffect(() => {
        let alive = true;

        async function loadMine() {
            try {
                setLoadingMine(true);
                const mine = await getMyMovieRating(movieId);
                if (alive) setUserRating(mine);
            } finally {
                if (alive) setLoadingMine(false);
            }
        }

        loadMine();
        return () => {
            alive = false;
        };
    }, [movieId]);

    const summaryLabel = useMemo(() => {
        if (!ratingCount) return "No ratings yet";
        return `${avgRating.toFixed(1)} / 5 (${ratingCount})`;
    }, [avgRating, ratingCount]);

    const shown = hover ?? userRating; // what stars should look like right now

    function onRate(value: number) {
        if (!session.data) {
            originRouter.push("/login");
            return;
        }

        startTransition(async () => {
            await setMovieRating(movieId, value); // upsert (one per user)
            setUserRating(value);
            router.refresh();
        });
    }

    const disabled = isPending || loadingMine;

    return (
        <div className="border rounded p-6 space-y-3">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold">Rating</h2>
                    <div className="text-sm text-muted-foreground">{summaryLabel}</div>
                </div>

                {disabled ? (
                    <span className="text-xs text-muted-foreground">
                        {loadingMine ? "Loading…" : "Saving…"}
                    </span>
                ) : null}
            </div>

            {/* ONE rating field: clickable stars (this is the only input) */}
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((v) => {
                    const active = shown >= v;

                    return (
                        <button
                            key={v}
                            type="button"
                            disabled={disabled}
                            onClick={() => onRate(v)}
                            onMouseEnter={() => setHover(v)}
                            onMouseLeave={() => setHover(null)}
                            aria-label={`Rate ${v} star${v === 1 ? "" : "s"}`}
                            className="rounded p-1 hover:bg-muted disabled:opacity-60"
                        >
                            <Star className={`h-6 w-6 ${active ? "fill-black" : ""}`} />
                        </button>
                    );
                })}

                <span className="ml-3 text-sm">
                    {userRating > 0 ? (
                        <span className="font-medium">Your rating: {userRating}/5</span>
                    ) : (
                        <span className="text-muted-foreground">Click to rate</span>
                    )}
                </span>
            </div>

            {!session.data ? (
                <p className="text-xs text-muted-foreground">
                    You must be logged in to rate. Clicking a star will take you to login.
                </p>
            ) : null}
        </div>
    );
}
