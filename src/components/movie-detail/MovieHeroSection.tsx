import Link from "next/link";
import { PriceTag } from "@/components/ui/PriceTag";

type Props = {
    title: string;
    price: string;
    runtime: number;
    stock: number;
    imageUrl?: string | null;
    trailerUrl?: string | null;
};

export default function MovieHeroSection({
    title,
    price,
    runtime,
    stock,
    imageUrl,
    trailerUrl,
}: Props) {
    const poster = (
        <div className="bg-muted aspect-[2/3] w-full flex items-center justify-center overflow-hidden rounded border">
            {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={imageUrl}
                    alt={title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
            ) : (
                <div className="text-sm text-muted-foreground">No Image</div>
            )}
        </div>
    );

    return (
        <div className="border rounded p-6 space-y-4">
            {/* Poster */}
            <div className="w-full max-w-md">
                {trailerUrl ? (
                    <Link href={trailerUrl} target="_blank" rel="noreferrer" className="block">
                        {poster}
                    </Link>
                ) : (
                    poster
                )}

                {trailerUrl ? (
                    <p className="text-xs text-muted-foreground mt-2">
                        Tip: click poster or title to open trailer ↗
                    </p>
                ) : null}
            </div>

            {/* Title */}
            {trailerUrl ? (
                <Link
                    href={trailerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-3xl font-bold hover:underline"
                >
                    {title}
                </Link>
            ) : (
                <h1 className="text-3xl font-bold">{title}</h1>
            )}

            {/* Meta */}
            <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                <PriceTag amount={price} />
                <span>•</span>
                <span>Runtime: {runtime} min</span>
                <span>•</span>
                <span>Stock: {stock}</span>
            </div>
        </div>
    );
}
