import Link from "next/link";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

import MovieDescription from "@/components/movie-detail/MovieDescription";
import RecommendedMoviesSection from "@/components/movie-detail/RecommendedMoviesSection";
import MovieRatingSection from "@/components/movie-detail/MovieRatingSection";
import WishlistToggle from "@/components/movie-detail/WishlistToggle";

import AddToCartButton from "@/components/movie-detail/AddToCartButton";
import ShareIconButton from "@/components/movie-detail/ShareIconButton";

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

    const poster = (
        <div className="relative overflow-hidden rounded-2xl bg-muted shadow-sm">
            {movie.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={movie.imageUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            ) : (
                <div className="aspect-[2/3] w-full flex items-center justify-center text-sm text-muted-foreground">
                    No Image
                </div>
            )}
        </div>
    );

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
            <Link className="text-blue-600" href="/movies">
                ← Back to Movies
            </Link>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT: Poster */}
                <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-6 space-y-3">
                        {movie.trailerUrl ? (
                            <Link href={movie.trailerUrl} target="_blank" rel="noreferrer">
                                {poster}
                            </Link>
                        ) : (
                            poster
                        )}

                        {movie.trailerUrl ? (
                            <p className="text-xs text-muted-foreground">
                                Tip: click poster to open trailer ↗
                            </p>
                        ) : null}
                    </div>
                </div>

                {/* RIGHT: Details */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            {movie.title}
                        </h1>

                        <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-3">
                            <span className="font-medium text-foreground">
                                ${movie.price.toString()}
                            </span>
                            <span>•</span>
                            <span>{movie.runtime} min</span>
                            <span>•</span>
                            <span className={movie.stock > 0 ? "text-green-600" : "text-red-500"}>
                                {movie.stock > 0 ? `In stock (${movie.stock})` : "Out of stock"}
                            </span>
                        </div>
                    </div>

                    {/* ACTION BAR */}
                    <div className="flex flex-wrap items-center gap-3">
                        <AddToCartButton movieId={movie.id} disabled={movie.stock <= 0} />

                        <ShareIconButton url={shareUrl} title={shareTitle} />

                        {/* Wishlist aligned next to icons */}
                        <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
                            <WishlistToggle movieId={movie.id} />
                        </div>
                    </div>

                    {/* ABOUT (move up, no border) */}
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">About</h2>
                        <MovieDescription description={movie.description} />
                    </div>

                    {/* RATING (no border) */}
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Rating</h2>
                        <MovieRatingSection
                            movieId={movie.id}
                            avgRating={avgRating}
                            ratingCount={ratingCount}
                        />
                    </div>

                    {/* Recommendations */}
                    <div className="pt-2">
                        <RecommendedMoviesSection title="More like this" items={recItems} />
                    </div>
                </div>
            </div>
        </div>
    );
}
