"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useOriginRouter } from "@/hooks/use-origin-router";
import { getMyMovieRating, setMovieRating } from "@/actions/movie-rating";
import { RatingStars } from "@/components/ui/RatingStars";

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

    const avgLabel = useMemo(() => {
        if (!ratingCount) return "No ratings yet";
        return `${avgRating.toFixed(1)} / 5 (${ratingCount})`;
    }, [avgRating, ratingCount]);

    function onRate(value: number) {
        // not logged in -> go login, preserve origin
        if (!session.data) {
            originRouter.push("/login");
        }

        startTransition(async () => {
            await setMovieRating(movieId, value);
            setUserRating(value);
            router.refresh();
        });
    }

    return (
        <div className="border rounded p-6 space-y-3">
            <h2 className="text-xl font-semibold">Ratings</h2>

            <div className="text-sm text-muted-foreground">{avgLabel}</div>

            <div className="flex items-center gap-3">
                {/* Average display */}
                <RatingStars value={Math.round(avgRating)} />

                {/* User action */}
                <div className="text-sm">
                    <div className="font-medium">Your rating</div>

                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((v) => (
                            <button
                                key={v}
                                type="button"
                                disabled={isPending || loadingMine}
                                onClick={() => onRate(v)}
                                className={`rounded px-2 py-1 border text-sm ${
                                    userRating === v ? "bg-black text-white" : "bg-white"
                                }`}
                            >
                                {v}★
                            </button>
                        ))}

                        {loadingMine ? (
                            <span className="text-xs text-muted-foreground">Loading…</span>
                        ) : null}

                        {isPending ? (
                            <span className="text-xs text-muted-foreground">Saving…</span>
                        ) : null}
                    </div>
                </div>
            </div>

            {!session.data ? (
                <p className="text-xs text-muted-foreground">
                    You must be logged in to rate. Clicking a star will take you to login.
                </p>
            ) : null}
        </div>
    );
}
