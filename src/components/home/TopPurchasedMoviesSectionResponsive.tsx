import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import MovieCard from "../movies/MovieCard";

export default async function TopPurchasedMoviesSectionResponsive({
    genre,
}: {
    genre?: string | null;
}) {
    const topSelling = await prisma.orderItem.groupBy({
        by: ["movieId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
    });

    const movieIdsInOrder: number[] = topSelling.map((movie) => movie.movieId);

    const purchasedCountMap = new Map<number, number>();
    for (const item of topSelling) {
        purchasedCountMap.set(item.movieId, item._sum.quantity ?? 0);
    }

    let whereClause: Prisma.MovieWhereInput;

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

    const movies = await prisma.movie.findMany({
        where: whereClause,
        include: {
            genres: {
                include: {
                    genre: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });

    const moviesSorted = movieIdsInOrder
        .map((id) => movies.find((movie) => movie.id === id))
        .filter((movie): movie is (typeof movies)[number] => movie !== undefined)
        .slice(0, 4);

    const movieIds = moviesSorted.map((movie) => movie.id);

    const ratingAgg =
        movieIds.length === 0
            ? []
            : await prisma.movieRating.groupBy({
                  by: ["movieId"],
                  where: { movieId: { in: movieIds } },
                  _avg: { value: true },
                  _count: { value: true },
              });

    const ratingMap = new Map<number, { avgRating: number; ratingCount: number }>();

    for (const row of ratingAgg) {
        ratingMap.set(row.movieId, {
            avgRating: row._avg.value ?? 0,
            ratingCount: row._count.value ?? 0,
        });
    }

    const movieItems = moviesSorted.map((movie) => {
        const rating = ratingMap.get(movie.id) ?? {
            avgRating: 0,
            ratingCount: 0,
        };

        return {
            id: movie.id,
            title: movie.title,
            price: movie.price.toString(),
            stock: movie.stock,
            runtime: movie.runtime,
            imageUrl: movie.imageUrl,
            genres: movie.genres.map((item) => item.genre.name),
            avgRating: rating.avgRating,
            ratingCount: rating.ratingCount,
            purchasedCount: purchasedCountMap.get(movie.id) ?? 0,
        };
    });

    return (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {movieItems.length > 0 ? (
                movieItems.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))
            ) : (
                <p className="text-left text-base text-muted-foreground">No results found.</p>
            )}
        </div>
    );
}
