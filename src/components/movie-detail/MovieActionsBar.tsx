import Link from "next/link";
import { Play } from "lucide-react";

import AddToCartButton from "@/components/movie-detail/AddToCartButton";
import WishlistToggle from "@/components/movie-detail/WishlistToggle";
import ShareIconButton from "@/components/movie-detail/ShareIconButton";
import { Button } from "@/components/ui/button";

type Props = {
    movieId: number;
    trailerUrl?: string | null;
    shareUrl: string;
    shareTitle: string;
};

export default function MovieActionsBar({ movieId, trailerUrl, shareUrl, shareTitle }: Props) {
    return (
        <div className="border rounded p-4 flex flex-wrap items-center gap-3">
            {trailerUrl ? (
                <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-full">
                    <Link
                        href={trailerUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Watch trailer"
                        title="Watch trailer"
                    >
                        <Play className="h-5 w-5" />
                    </Link>
                </Button>
            ) : null}

            <AddToCartButton movieId={movieId} />
            <WishlistToggle movieId={movieId} />
            <ShareIconButton url={shareUrl} title={shareTitle} />

            <div className="ml-auto text-xs text-muted-foreground">
                Trailer • Cart • Wishlist • Share
            </div>
        </div>
    );
}
