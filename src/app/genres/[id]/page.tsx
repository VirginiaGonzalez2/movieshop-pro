import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MovieCard from "@/components/movies/MovieCard";

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
    });

    const items = movies.map((m) => ({
        id: m.id,
        title: m.title,
        price: m.price.toString(),
        stock: m.stock,
        runtime: m.runtime,
        rating: m.rating,
        imageUrl: m.imageUrl ?? null,
    }));

    return (
        <div className="p-8">
            <Link className="text-blue-600" href="/genres">
                ← Back to Genres
            </Link>

            <h1 className="text-2xl font-bold mt-4 mb-6">{genre.name}</h1>

            {items.length === 0 ? (
                <p className="text-muted-foreground">No movies in this genre yet.</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
}
