import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PriceTag } from "@/components/ui/PriceTag";
import { RatingStars } from "@/components/ui/RatingStars";

export default async function MovieDetailsPage({
    params,
}: {
    params: Promise<{ id: string }> | { id: string };
}) {
    const resolved = await Promise.resolve(params);
    const id = Number(resolved.id);

    if (!Number.isInteger(id) || id <= 0) {
        return (
            <div className="p-8">
                <h1 className="text-xl font-semibold">Invalid movie id</h1>
                <p className="text-muted-foreground">
                    URL must look like: <code>/movies/1</code>
                </p>
                <Link className="text-blue-600" href="/movies">
                    ← Back to Movies
                </Link>
            </div>
        );
    }

    const movie = await prisma.movie.findUnique({
        where: { id },
    });

    if (!movie) {
        return (
            <div className="p-8">
                <h1 className="text-xl font-semibold">Movie not found</h1>
                <Link className="text-blue-600" href="/movies">
                    ← Back to Movies
                </Link>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-3xl space-y-4">
            <Link className="text-blue-600" href="/movies">
                ← Back to Movies
            </Link>

            <div className="border rounded p-6 space-y-3">
                <h1 className="text-3xl font-bold">{movie.title}</h1>

                <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                    <PriceTag amount={movie.price.toString()} />
                    <span>•</span>
                    <span>Runtime: {movie.runtime} min</span>
                    <span>•</span>
                    <span>Stock: {movie.stock}</span>
                </div>

                <RatingStars value={movie.rating} />

                <p className="leading-relaxed">{movie.description}</p>

                {movie.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={movie.imageUrl}
                        alt={movie.title}
                        className="w-full max-w-md rounded border"
                    />
                ) : null}
            </div>
        </div>
    );
}
