import AddToCartButton from "@/components/movie-detail/AddToCartButton";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PriceTag } from "@/components/ui-localized/PriceTag";
import MovieRatingSection from "@/components/movie-detail/MovieRatingSection";
import MovieTrailerSection from "@/components/movie-detail/MovieTrailerSection";
import WishlistToggle from "@/components/movie-detail/WishlistToggle";
import RecommendedMoviesSection from "@/components/movie-detail/RecommendedMoviesSection";
export default async function MovieDetailsNewPage({ params }: { params: { id: string } }) {
    // Next.js App Router: params may be a Promise, so unwrap if needed
    const resolvedParams = params instanceof Promise ? await params : params;
    const movieId = Number(resolvedParams.id);
    if (Number.isNaN(movieId) || !Number.isInteger(movieId) || movieId <= 0) {
        return notFound();
    }

    const movie = await prisma.movie.findUnique({
        where: { id: movieId },
        include: {
            genres: { select: { genre: { select: { name: true, id: true } } } },
            people: { include: { person: true } },
        },
    });

    // Rating info
    const ratingSummary = await prisma.movieRating.aggregate({
        where: { movieId },
        _avg: { value: true },
        _count: { value: true },
    });
    const avgRating = ratingSummary._avg.value ?? 0;
    const ratingCount = ratingSummary._count.value ?? 0;

    // Películas recomendadas por género
    let genreIds: number[] = [];
    let recommendedMovies: any[] = [];
    if (movie) {
        genreIds = movie.genres.map((mg) => mg.genre.id);
        recommendedMovies = await prisma.movie.findMany({
            where: {
                genres: {
                    some: { genreId: { in: genreIds } },
                },
                id: { not: movieId },
            },
            take: 6,
            select: {
                id: true,
                title: true,
                imageUrl: true,
                price: true,
                stock: true,
                runtime: true,
            },
        });
        // Agregar avgRating y ratingCount a cada película recomendada
        for (let i = 0; i < recommendedMovies.length; i++) {
            const rec = recommendedMovies[i];
            const recRating = await prisma.movieRating.aggregate({
                where: { movieId: rec.id },
                _avg: { value: true },
                _count: { value: true },
            });
            rec.avgRating = recRating._avg.value ?? 0;
            rec.ratingCount = recRating._count.value ?? 0;
            // Convertir price a string para evitar error Decimal
            rec.price = rec.price?.toString();
        }
    }

    if (!movie) return notFound();

    const directors = movie.people.filter((p) => p.role === "DIRECTOR").map((p) => p.person.name);
    const actors = movie.people.filter((p) => p.role === "ACTOR").map((p) => p.person.name);
    const genreNames = movie.genres.map((mg) => mg.genre.name);

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
            <Link className="text-sm text-muted-foreground hover:text-foreground transition" href="/movies">
                ← Back to Movies
            </Link>
            <div className="flex flex-col md:flex-row gap-8">
                {/* LEFT COLUMN: Poster + Wishlist */}
                <div className="md:w-1/3">
                    <div className="relative">
                        {movie.imageUrl ? (
                            <Image src={movie.imageUrl} alt={movie.title} width={444} height={666} className="rounded-lg object-cover" />
                        ) : (
                            <div className="text-sm text-muted-foreground">No image</div>
                        )}
                        <div className="absolute top-3 right-3 bg-white shadow rounded-full p-3">
                            <WishlistToggle movieId={movie.id} />
                        </div>
                    </div>
                </div>
                {/* RIGHT COLUMN: Info + Actions */}
                <div className="flex flex-col gap-4 max-w-md mx-auto md:mx-0 md:w-2/3">
                    <h1 className="text-2xl font-bold">{movie.title}</h1>
                    {/* Rating stars directly under title */}
                    <MovieRatingSection movieId={movie.id} avgRating={avgRating} ratingCount={ratingCount} />
                    {/* Description below rating */}
                    <div className="text-sm text-muted-foreground">
                        {movie.description || "No description available."}
                    </div>
                    {/* Metadata block */}
                    <p className="text-sm text-gray-600">
                        {genreNames.join(", ")} • {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "—"} • {movie.runtime} min
                    </p>
                    <p className="mt-2">
                        <strong>Director:</strong> {directors.join(", ") || "—"}
                    </p>
                    <p>
                        <strong>Cast:</strong> {actors.join(", ") || "—"}
                    </p>
                    {/* Price */}
                    <div className="mt-2 text-lg font-semibold">
                        <PriceTag amount={movie.price.toString()} />
                    </div>
                    {/* Centered purchase buttons */}
                    <div className="flex flex-col items-center gap-3 mt-6">
                        <button className="w-56 h-10 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition">
                            Add to Cart
                        </button>
                        <button className="w-56 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <MovieTrailerSection trailerUrl={movie.trailerUrl} title={movie.title} />
            </div>
            <div className="mt-8">
                <RecommendedMoviesSection title="Películas relacionadas" items={recommendedMovies} />
            </div>
        </div>
    );
}
