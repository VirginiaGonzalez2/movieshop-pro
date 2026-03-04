import Link from "next/link";
import { PriceTag } from "@/components/ui/PriceTag";
import { Play } from "lucide-react";
import Image from "next/image";

type Props = {
    title: string;
    price: string;
    runtime: number;
    stock: number;

    avgRating: number;
    ratingCount: number;

    description: string;

    imageUrl?: string | null;
    trailerUrl?: string | null;

    actions: React.ReactNode;
    rating: React.ReactNode;
};

export default function MovieHeroSection({
    title,
    price,
    runtime,
    stock,
    avgRating,
    ratingCount,
    description,
    imageUrl,
    trailerUrl,
    actions,
    rating,
}: Props) {
    const avgLabel =
        ratingCount > 0 ? `${avgRating.toFixed(1)} / 5 (${ratingCount})` : "No ratings yet";

    return (
        <section className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-10 items-start">
            {/* Poster */}
            <div className="md:sticky md:top-24">
                <div className="overflow-hidden rounded-2xl shadow-sm bg-muted">
                    {imageUrl ? (
                        trailerUrl ? (
                            <Link
                                href={trailerUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="block"
                                aria-label="Open trailer"
                                title="Open trailer"
                            >
                                <Image
                                    src={imageUrl}
                                    alt={title}
                                    className="w-full object-cover"
                                    style={{ height: "calc(100vh - 10rem)" }}
                                    loading="lazy"
                                    width={444}
                                    height={666}
                                />
                            </Link>
                        ) : (
                            <Image
                                src={imageUrl}
                                alt={title}
                                className="w-full object-cover"
                                style={{ height: "calc(100vh - 10rem)" }}
                                loading="lazy"
                                width={444}
                                height={666}
                            />
                        )
                    ) : (
                        <div
                            className="flex items-center justify-center text-muted-foreground"
                            style={{ height: "calc(100vh - 10rem)" }}
                        >
                            No Image
                        </div>
                    )}
                </div>

                {trailerUrl ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                        Tip: click poster to open trailer ↗
                    </p>
                ) : null}
            </div>

            {/* Right side */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight">{title}</h1>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <PriceTag amount={price} />
                        <span>•</span>
                        <span>{runtime} min</span>
                        <span>•</span>
                        <span>{stock > 0 ? `In stock (${stock})` : "Out of stock"}</span>
                        <span>•</span>
                        <span>{avgLabel}</span>
                    </div>
                </div>

                {/* About (moved UP before buttons) */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">About</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {description}
                    </p>
                </div>

                {/* Actions row */}
                <div className="flex flex-wrap items-center gap-3">
                    {trailerUrl ? (
                        <Link href={trailerUrl} target="_blank" rel="noreferrer">
                            <button
                                type="button"
                                aria-label="Watch trailer"
                                title="Watch trailer"
                                className="h-11 w-11 rounded-full bg-white shadow-sm transition
                                           hover:shadow-md hover:scale-105 active:scale-95
                                           flex items-center justify-center"
                            >
                                <Play className="h-5 w-5" />
                            </button>
                        </Link>
                    ) : null}

                    {actions}
                </div>

                {/* Rating (right column, no duplicate UI) */}
                <div>{rating}</div>
            </div>
        </section>
    );
}
