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
                <div className="md:w-1/3">
                    {movie.imageUrl ? (
                        <Image src={movie.imageUrl} alt={movie.title} width={444} height={666} className="rounded-lg object-cover" />
                    ) : (
                        <div className="text-sm text-muted-foreground">No image</div>
                    )}
                    <div className="mt-4">
                        <WishlistToggle movieId={movie.id} />
                    </div>
                </div>
                <div className="md:w-2/3 space-y-4">
                    <h1 className="text-2xl font-bold">{movie.title}</h1>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span>{movie.runtime} min</span>
                        <span>{movie.stock > 0 ? `In stock (${movie.stock})` : "Out of stock"}</span>
                        <span>{genreNames.join(", ")}</span>
                        <span>{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "—"}</span>
                    </div>
                    <div className="mt-2 text-sm">
                        <strong>Director:</strong> {directors.join(", ") || "—"}
                    </div>
                    <div className="mt-2 text-sm">
                        <strong>Cast:</strong> {actors.join(", ") || "—"}
                    </div>
                    <div className="mt-2 text-lg font-semibold">
                        <PriceTag amount={movie.price.toString()} />
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                        {movie.description || "No description available."}
                    </div>
                    <div className="mt-4">
                        <MovieRatingSection movieId={movie.id} avgRating={avgRating} ratingCount={ratingCount} />
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
