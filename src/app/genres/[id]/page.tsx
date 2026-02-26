import Link from "next/link";
import { prisma } from "@/lib/prisma";
import GenreMoviesClient from "./genre-movies-client";
import { MovieCardItem } from "@/components/movies/MovieCard";

export default async function GenreDetailsPage({
    params,
}: {
    params: Promise<{ id: string }> | { id: string };
}) {
    const resolved = await Promise.resolve(params);
    const genreId = Number(resolved.id);

    if (!Number.isInteger(genreId) || genreId <= 0) {
        return (
            <div className="p-8">
                <h1 className="text-xl font-semibold">Invalid genre id</h1>
                <p className="text-muted-foreground">
                    URL must look like: <code>/genres/1</code>
                </p>
                <Link className="text-blue-600" href="/genres">
                    ← Back to Genres
                </Link>
            </div>
        );
    }

    const genre = await prisma.genre.findUnique({
        where: { id: genreId },
    });

    if (!genre) {
        return (
            <div className="p-8">
                <h1 className="text-xl font-semibold">Genre not found</h1>
                <Link className="text-blue-600" href="/genres">
                    ← Back to Genres
                </Link>
            </div>
        );
    }

    const movies = await prisma.movie.findMany({
        where: {
            genres: {
                some: { genreId },
            },
        },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            price: true,
            stock: true,
            runtime: true,
            imageUrl: true,
        },
    });

    const movieIds = movies.map((m) => m.id);

    const ratingAgg =
        movieIds.length === 0
            ? []
            : await prisma.movieRating.groupBy({
                  by: ["movieId"],
                  where: { movieId: { in: movieIds } },
                  _avg: { value: true },
                  _count: { value: true },
              });

    const ratingMap = new Map<number, { avgRating: number; ratingCount: number }>();
    for (const r of ratingAgg) {
        ratingMap.set(r.movieId, {
            avgRating: r._avg.value ?? 0,
            ratingCount: r._count.value ?? 0,
        });
    }

    const items: MovieCardItem[] = movies.map((m) => {
        const rating = ratingMap.get(m.id) ?? { avgRating: 0, ratingCount: 0 };

        return {
            id: m.id,
            title: m.title,
            price: m.price.toString(),
            stock: m.stock,
            runtime: m.runtime,
            imageUrl: m.imageUrl ?? null,
            avgRating: rating.avgRating,
            ratingCount: rating.ratingCount,
        };
    });

    return (
        <div className="p-8">
            <Link className="text-blue-600" href="/genres">
                ← Back to Genres
            </Link>

            <h1 className="text-2xl font-bold mt-4">{genre.name}</h1>

            {genre.description ? (
                <p className="text-muted-foreground mt-1">{genre.description}</p>
            ) : null}

            <div className="text-sm text-muted-foreground mt-2 mb-6">
                {items.length} movie{items.length === 1 ? "" : "s"}
            </div>

            {items.length === 0 ? (
                <p className="text-muted-foreground">No movies in this genre yet.</p>
            ) : (
                <GenreMoviesClient items={items} />
            )}
        </div>
    );
}
