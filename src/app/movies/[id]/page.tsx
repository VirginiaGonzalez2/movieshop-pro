import Link from "next/link";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

import MovieHeroSection from "@/components/movie-detail/MovieHeroSection";
import MovieDescription from "@/components/movie-detail/MovieDescription";
import MovieTrailerSection from "@/components/movie-detail/MovieTrailerSection";
import RecommendedMoviesSection from "@/components/movie-detail/RecommendedMoviesSection";
import MovieRatingSection from "@/components/movie-detail/MovieRatingSection";
import WishlistToggle from "@/components/movie-detail/WishlistToggle";
import SocialShareActions from "@/components/movie-detail/SocialShareActions";

import { getMovieRatingSummary } from "@/actions/movie-rating";
import { type MovieCardItem } from "@/components/movies/MovieCard";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }> | { id: string };
}) {
    const resolved = await Promise.resolve(params);
    const id = Number(resolved.id);

    if (!Number.isInteger(id) || id <= 0) {
        return { title: "Movie | MovieShop" };
    }

    const movie = await prisma.movie.findUnique({
        where: { id },
        select: { title: true },
    });

    return {
        title: movie?.title ? `${movie.title} | MovieShop` : "Movie | MovieShop",
    };
}

async function buildAbsoluteUrl(path: string) {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    const proto = h.get("x-forwarded-proto") ?? "http";
    return `${proto}://${host}${path}`;
}

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
            genres: { select: { genreId: true } },
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

    // Social share
    const shareUrl = await buildAbsoluteUrl(`/movies/${movie.id}`);
    const shareTitle = `${movie.title} | MovieShop`;

    // Recommendations: same genre, exclude current
    const genreIds = movie.genres.map((mg) => mg.genreId);

    const recMovies = genreIds.length
        ? await prisma.movie.findMany({
              where: {
                  id: { not: movie.id },
                  genres: { some: { genreId: { in: genreIds } } },
              },
              orderBy: { createdAt: "desc" },
              take: 6,
              select: {
                  id: true,
                  title: true,
                  price: true,
                  stock: true,
                  runtime: true,
                  imageUrl: true,
              },
          })
        : [];

    const recIds = recMovies.map((m) => m.id);

    const recRatingAgg =
        recIds.length === 0
            ? []
            : await prisma.movieRating.groupBy({
                  by: ["movieId"],
                  where: { movieId: { in: recIds } },
                  _avg: { value: true },
                  _count: { value: true },
              });

    const recRatingMap = new Map<number, { avgRating: number; ratingCount: number }>();
    for (const r of recRatingAgg) {
        recRatingMap.set(r.movieId, {
            avgRating: r._avg.value ?? 0,
            ratingCount: r._count.value ?? 0,
        });
    }

    const recItems: MovieCardItem[] = recMovies.map((m) => {
        const r = recRatingMap.get(m.id) ?? { avgRating: 0, ratingCount: 0 };

        return {
            id: m.id,
            title: m.title,
            price: m.price.toString(),
            stock: m.stock,
            runtime: m.runtime,
            imageUrl: m.imageUrl ?? null,
            avgRating: r.avgRating,
            ratingCount: r.ratingCount,
        };
    });

    return (
        <div className="p-8 max-w-4xl space-y-4">
            <Link className="text-blue-600" href="/movies">
                ← Back to Movies
            </Link>

            <MovieHeroSection
                title={movie.title}
                price={movie.price.toString()}
                runtime={movie.runtime}
                stock={movie.stock}
                rating={Math.round(avgRating)}
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

            <SocialShareActions url={shareUrl} title={shareTitle} />

            <MovieDescription description={movie.description} />

            <RecommendedMoviesSection title="More like this" items={recItems} />
        </div>
    );
}
