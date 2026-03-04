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
        const ratingsWord = ratingCount === 1 ? "rating" : "ratings";
        return `Avg ${avgRating.toFixed(1)} · ${ratingCount} ${ratingsWord}`;
    }, [avgRating, ratingCount]);

    function onRate(value: number) {
        if (!session.data) {
            originRouter.push("/login");
            return;
        }

        startTransition(async () => {
            await setMovieRating(movieId, value);
            setUserRating(value);
            router.refresh();
        });
    }

    const disabled = isPending || loadingMine;

    return (
        <div className="space-y-2">
            {/* Keep stars + avg aligned together */}
            <div className="inline-block">
                <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((v) => {
                        const active = userRating >= v && userRating > 0;

                        return (
                            <button
                                key={v}
                                type="button"
                                disabled={disabled}
                                onClick={() => onRate(v)}
                                aria-label={`Rate ${v} out of 5`}
                                title={`Rate ${v}`}
                                className="group"
                            >
                                <span
                                    className={`inline-flex h-12 w-12 items-center justify-center rounded-full
                                    transition-transform duration-200
                                    group-hover:scale-110 group-active:scale-95
                                    disabled:opacity-60 disabled:group-hover:scale-100
                                    ${active ? "bg-foreground text-background" : "bg-muted text-foreground"}`}
                                >
                                    <span className="text-xl leading-none">★</span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* centered under the stars */}
                <div className="mt-2 text-center text-sm text-muted-foreground">
                    {avgLabel}
                    {userRating ? <div>Your rating: {userRating}/5</div> : null}
                    {loadingMine ? <div>Loading…</div> : isPending ? <div>Saving…</div> : null}
                </div>
            </div>

            {!session.data ? (
                <p className="text-xs text-muted-foreground">You must be logged in to rate.</p>
            ) : null}
        </div>
    );
}
