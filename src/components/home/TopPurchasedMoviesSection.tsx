import { prisma } from "@/lib/prisma";
import MovieCard from "../movies/MovieCard";

export default async function TopPurchasedMoviesSection({
    genre,
}: {
    genre?: string | null;
}) {
    console.log("TopPurchasedMoviesSection - genre:", genre);

    // If genre exists → fetch ALL sales ordered by quantity
    // If no genre → keep original behavior (global top 5)
    const topSelling = genre
        ? await prisma.orderItem.groupBy({
              by: ["movieId"],
              _sum: { quantity: true },
              orderBy: { _sum: { quantity: "desc" } },
          })
        : await prisma.orderItem.groupBy({
              by: ["movieId"],
              _sum: { quantity: true },
              orderBy: { _sum: { quantity: "desc" } },
              take: 5,
          });

    const movieIdsInOrder = topSelling.map((m) => m.movieId);

    let whereClause;

    if (genre) {
        whereClause = {
            AND: [
                { id: { in: movieIdsInOrder } },
                {
                    genres: {
                        some: {
                            genre: {
                                name: {
                                    equals: genre,
                                    mode: "insensitive",
                                },
                            },
                        },
                    },
                },
            ],
        };
    } else {
        whereClause = {
            id: { in: movieIdsInOrder },
        };
    }

    console.log("WHERE CONDITION (TopPurchased):", whereClause);

    const movies = await prisma.movie.findMany({
        where: whereClause,
    });

    // Preserve sales order
    const moviesSorted = movieIdsInOrder
        .map((id) => movies.find((m) => m.id === id))
        .filter((m): m is (typeof movies)[number] => Boolean(m))
        .slice(0, 5);

    // Rating aggregation
    const movieIds = moviesSorted.map((m) => m.id);

    const ratingAgg =
        movieIds.length === 0
            ? []
            : await prisma.movieRating.groupBy({
                  by: ["movieId"],
                  where: { movieId: { in: movieIds } },
                  _avg: { value: true },
                  _count: { value: true },
              });

    const ratingMap = new Map<
        number,
        { avgRating: number; ratingCount: number }
    >();

    for (const r of ratingAgg) {
        ratingMap.set(r.movieId, {
            avgRating: r._avg.value ?? 0,
            ratingCount: r._count.value ?? 0,
        });
    }

    const movieItems = moviesSorted.map((movie) => {
        const rating =
            ratingMap.get(movie.id) ?? { avgRating: 0, ratingCount: 0 };

        return {
            id: movie.id,
            title: movie.title,
            price: movie.price.toString(),
            stock: movie.stock,
            runtime: movie.runtime,
            imageUrl: movie.imageUrl,
            avgRating: rating.avgRating,
            ratingCount: rating.ratingCount,
        };
    });

    return (
        <div className="grid grid-cols-5 gap-4">
            {movieItems.length > 0 ? (
                movieItems.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))
            ) : (
                <p className="text-left text-2xl">
                    No results found.
                </p>
            )}
        </div>
    );
}