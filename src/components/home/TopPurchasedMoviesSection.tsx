import { prisma } from "@/lib/prisma";
import MovieCard from "../movies/MovieCard";

export default async function TopPurchasedMoviesSection() {
    const topSelling = await prisma.orderItem.groupBy({
        by: ["movieId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
    });

    const movieIdsInOrder = topSelling.map((m) => m.movieId);

    const movies = await prisma.movie.findMany({
        where: {
            id: { in: movieIdsInOrder },
        },
    });

    const moviesSorted = movieIdsInOrder
        .map((id) => movies.find((m) => m.id === id))
        .filter((m): m is (typeof movies)[number] => Boolean(m));

    const movieItems = moviesSorted.map((movie) => ({
        id: movie.id,
        title: movie.title,
        price: movie.price.toString(),
        stock: movie.stock,
        runtime: movie.runtime,
        imageUrl: movie.imageUrl,

        // placeholders for now (Step 3 will make these real from MovieRating)
        avgRating: 0,
        ratingCount: 0,
    }));

    return (
        <div className="grid grid-cols-5 gap-4">
            {movieItems.length > 0 ? (
                movieItems.map((movie) => <MovieCard key={movie.id} movie={movie} />)
            ) : (
                <p className="text-left text-2xl">No results found.</p>
            )}
        </div>
    );
}
