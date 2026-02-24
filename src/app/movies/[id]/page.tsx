import Link from "next/link";
import { prisma } from "@/lib/prisma";

import MovieHeroSection from "@/components/movie-detail/MovieHeroSection";
import MovieDescription from "@/components/movie-detail/MovieDescription";
import MovieTrailerSection from "@/components/movie-detail/MovieTrailerSection";

import RecommendedMoviesSection from "@/components/movie-detail/RecommendedMoviesSection";
import MovieRatingSection from "@/components/movie-detail/MovieRatingSection";
import WishlistToggle from "@/components/movie-detail/WishlistToggle";

import { getMovieRatingSummary } from "@/actions/movie-rating";

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
        include: {
            genres: { include: { genre: true } },
        },
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

    // Ratings summary (real ratings table)
    const { avgRating, ratingCount } = await getMovieRatingSummary(movie.id);

    // Recommendations: same genre, exclude current
    const genreIds = movie.genres.map((mg) => mg.genreId);

    const rec = genreIds.length
        ? await prisma.movie.findMany({
              where: {
                  id: { not: movie.id },
                  genres: { some: { genreId: { in: genreIds } } },
              },
              orderBy: { createdAt: "desc" },
              take: 6,
          })
        : [];

    const recItems = rec.map((m) => ({
        id: m.id,
        title: m.title,
        price: m.price.toString(),
        stock: m.stock,
        runtime: m.runtime,
        rating: 0,
        imageUrl: m.imageUrl ?? null,
    }));

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
                rating={Math.round(avgRating)} // display avg as stars
                imageUrl={movie.imageUrl ?? null}
                trailerUrl={movie.trailerUrl ?? null}
            />

            <MovieTrailerSection trailerUrl={movie.trailerUrl ?? null} title={movie.title} />

            <WishlistToggle movieId={movie.id} />

            <MovieRatingSection
                movieId={movie.id}
                avgRating={avgRating}
                ratingCount={ratingCount}
            />

            <MovieDescription description={movie.description} />

            <RecommendedMoviesSection title="More like this" items={recItems} />
        </div>
    );
}
