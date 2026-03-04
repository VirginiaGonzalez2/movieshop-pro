import Link from "next/link";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

import WishlistToggle from "@/components/movie-detail/WishlistToggle";
import MovieRatingSection from "@/components/movie-detail/MovieRatingSection";
import MovieDescription from "@/components/movie-detail/MovieDescription";
import RecommendedMoviesSection from "@/components/movie-detail/RecommendedMoviesSection";
import SocialShareActions from "@/components/movie-detail/SocialShareActions";
import AddToCartButton from "@/components/movie-detail/AddToCartButton";
import BuyNowButton from "@/components/movie-detail/BuyNowButton";

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

function toYouTubeEmbedUrl(url: string | null): string | null {
    if (!url) return null;

    try {
        const u = new URL(url);

        if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/embed/")) {
            return url;
        }

        if (u.hostname === "youtu.be") {
            const id = u.pathname.replace("/", "").trim();
            if (!id) return null;
            return `https://www.youtube.com/embed/${id}`;
        }

        if (u.hostname.includes("youtube.com")) {
            const v = u.searchParams.get("v");
            if (!v) return null;
            return `https://www.youtube.com/embed/${v}`;
        }

        return null;
    } catch {
        return null;
    }
}

function formatMoney(n: number) {
    return n.toFixed(2);
}

function capFirst(s: string) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
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
            genres: { select: { genre: { select: { id: true, name: true } } } },
            people: { include: { person: true } },
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

    const { avgRating, ratingCount } = await getMovieRatingSummary(movie.id);

    const shareUrl = await buildAbsoluteUrl(`/movies/${movie.id}`);
    const shareTitle = `${movie.title} | MovieShop`;

    const trailerEmbed = toYouTubeEmbedUrl(movie.trailerUrl ?? null);

    const directors = movie.people.filter((p) => p.role === "DIRECTOR").map((p) => p.person.name);
    const actors = movie.people.filter((p) => p.role === "ACTOR").map((p) => p.person.name);

    const priceNumber = Number(movie.price.toString());
    const inStock = movie.stock > 0;

    const genreIds = movie.genres.map((mg) => mg.genre.id);

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
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-8">
            <Link
                className="text-sm text-muted-foreground hover:text-foreground transition"
                href="/movies"
            >
                ← Back to Movies
            </Link>

            {/* Top layout: poster stays still, right panel scrolls internally */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Poster (sticky) */}
                <div className="lg:col-span-5 lg:sticky lg:top-24">
                    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
                        <div className="aspect-[2/3] bg-muted flex items-center justify-center overflow-hidden">
                            {movie.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={movie.imageUrl}
                                    alt={movie.title}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="text-sm text-muted-foreground">No image</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: scrollable info section */}
                <div className="lg:col-span-7">
                    <div className="rounded-2xl border bg-card shadow-sm">
                        {/* internal scroll area */}
                        <div className="p-6 space-y-6 max-h-[calc(100vh-10rem)] overflow-y-auto">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                        {capFirst(movie.title)}
                                    </h1>

                                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                        <span className="rounded-full border px-3 py-1 bg-background">
                                            {movie.runtime} min
                                        </span>
                                        <span className="rounded-full border px-3 py-1 bg-background">
                                            {inStock ? `In stock (${movie.stock})` : "Out of stock"}
                                        </span>
                                        <span className="rounded-full border px-3 py-1 bg-background">
                                            {ratingCount
                                                ? `Avg ${avgRating.toFixed(1)} (${ratingCount})`
                                                : "No ratings"}
                                        </span>
                                    </div>

                                    {/* Director + Cast aligned */}
                                    <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                                        <div className="flex items-start gap-2">
                                            <span className="font-semibold text-foreground">
                                                Director:
                                            </span>
                                            <span className="min-w-0">
                                                {directors.length ? directors.join(", ") : "—"}
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="font-semibold text-foreground">
                                                Cast:
                                            </span>
                                            <span className="min-w-0">
                                                {actors.length ? actors.join(", ") : "—"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Icons */}
                                <div className="shrink-0 flex items-center gap-2">
                                    <div className="rounded-full border bg-background shadow-sm p-1 transition-transform duration-200 hover:scale-105 active:scale-95">
                                        <WishlistToggle movieId={movie.id} />
                                    </div>
                                    <div className="rounded-full border bg-background shadow-sm p-1 transition-transform duration-200 hover:scale-105 active:scale-95">
                                        <SocialShareActions url={shareUrl} title={shareTitle} />
                                    </div>
                                </div>
                            </div>

                            {/* Price + buttons */}
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <div className="text-xs text-muted-foreground">Price</div>
                                    <div className="text-4xl font-extrabold tracking-tight">
                                        ${formatMoney(priceNumber)}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        Taxes calculated at checkout
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <BuyNowButton movieId={movie.id} disabled={!inStock} />
                                    <AddToCartButton movieId={movie.id} disabled={!inStock} />
                                </div>
                            </div>

                            {/* About */}
                            <div className="rounded-2xl border bg-background shadow-sm p-6">
                                <MovieDescription description={movie.description ?? ""} />
                            </div>

                            {/* Rating  */}
                            <div className="pt-1">
                                <MovieRatingSection
                                    movieId={movie.id}
                                    avgRating={avgRating}
                                    ratingCount={ratingCount}
                                />
                            </div>

                            {/* Trailer inside this scroll area */}
                            <div className="rounded-2xl border bg-background shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-4">
                                    <div className="font-semibold">Trailer</div>
                                    {movie.trailerUrl ? (
                                        <a
                                            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                                            href={movie.trailerUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Open in YouTube ↗
                                        </a>
                                    ) : null}
                                </div>

                                <div className="px-6 pb-6">
                                    {trailerEmbed ? (
                                        <div className="rounded-xl overflow-hidden border bg-black">
                                            <div className="aspect-video">
                                                <iframe
                                                    className="h-full w-full"
                                                    src={trailerEmbed}
                                                    title={`${movie.title} trailer`}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    allowFullScreen
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground">
                                            Trailer not available.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommend heading */}
            <div className="space-y-3">
                <h2 className="text-2xl font-bold"></h2>
                <RecommendedMoviesSection title="More like this" items={recItems} />
            </div>
        </div>
    );
}
