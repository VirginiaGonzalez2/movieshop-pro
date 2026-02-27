"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
        if (!session.data) {
            originRouter.push("/login");
            return;
        }

        startTransition(async () => {
            try {
                await setMovieRating(movieId, value);
                setUserRating(value);
                router.refresh();
            } catch {
                // keep silent or add toast
            }
        });
    }

    const disabled = isPending || loadingMine;

    return (
        <div className="space-y-2">
            {/* avg label */}
            <div className="text-sm text-muted-foreground">{avgLabel}</div>

            {/* stars */}
            <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((v) => {
                    const active = userRating >= v;

                    return (
                        <button
                            key={v}
                            type="button"
                            disabled={disabled}
                            onClick={() => onRate(v)}
                            aria-label={`Rate ${v} out of 5`}
                            title={`Rate ${v}`}
                            className={[
                                "h-11 w-11 rounded-full bg-white shadow-sm",
                                "transition-transform duration-200 hover:shadow-md hover:scale-105 active:scale-95",
                                "disabled:opacity-60 disabled:hover:scale-100",
                                "flex items-center justify-center text-lg",
                                active ? "text-black" : "text-muted-foreground",
                            ].join(" ")}
                        >
                            ★
                        </button>
                    );
                })}

                <div className="ml-2 text-sm">
                    <div className="font-medium">
                        Your rating: {userRating ? `${userRating}/5` : "-"}
                    </div>
                    {loadingMine ? (
                        <div className="text-xs text-muted-foreground">Loading…</div>
                    ) : isPending ? (
                        <div className="text-xs text-muted-foreground">Saving…</div>
                    ) : null}
                </div>
            </div>

            {!session.data ? (
                <p className="text-xs text-muted-foreground">
                    Log in to rate. Clicking a star will take you to login.
                </p>
            ) : null}
        </div>
    );
}
