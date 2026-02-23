import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MovieHeroSection from "@/components/movie-detail/MovieHeroSection";
import MovieDescription from "@/components/movie-detail/MovieDescription";
import MovieTrailerSection from "@/components/movie-detail/MovieTrailerSection";

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

            <MovieHeroSection
                title={movie.title}
                price={movie.price.toString()}
                runtime={movie.runtime}
                stock={movie.stock}
                rating={movie.rating}
                imageUrl={movie.imageUrl ?? null}
                trailerUrl={movie.trailerUrl ?? null}
            />

            <MovieDescription description={movie.description} />

            <MovieTrailerSection trailerUrl={movie.trailerUrl ?? null} title={movie.title} />
        </div>
    );
}
