import { prisma } from "@/lib/prisma";
import MovieCard from "../movies/MovieCard";

export default async function TopRecentMoviesSectionResponsive({
    genre,
}: {
    genre?: string | null;
}) {
    const movies = await prisma.movie.findMany({
        where: genre
            ? {
                  genres: {
                      some: {
                          genre: { name: { equals: genre, mode: "insensitive" } },
                      },
                  },
              }
            : undefined,
        orderBy: { createdAt: "desc" },
        take: 4,
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

    const movieIds = movies.map((movie) => movie.id);

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

    return (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {movies.length > 0 ? (
                movies.map((movie) => {
                    const rating = ratingMap.get(movie.id) ?? { avgRating: 0, ratingCount: 0 };

                    return (
                        <MovieCard
                            key={movie.id}
                            movie={{
                                id: movie.id,
                                title: movie.title,
                                price: movie.price.toString(),
                                stock: movie.stock,
                                runtime: movie.runtime,
                                imageUrl: movie.imageUrl,
                                releaseYear: movie.releaseDate
                                    ? movie.releaseDate.getFullYear()
                                    : undefined,
                                genres: movie.genres.map((item) => item.genre.name),
                                avgRating: rating.avgRating,
                                ratingCount: rating.ratingCount,
                            }}
                        />
                    );
                })
            ) : (
                <p className="text-left text-base text-muted-foreground">No results found.</p>
            )}
        </div>
    );
}
