import { prisma } from "@/lib/prisma";
import MovieCard from "../movies/MovieCard";

export default async function TopCheapestMoviesSection({ genre }: { genre?: string | null }) {
    console.log("TopCheapestMoviesSection - genre:", genre);

    // // Build where condition to filter by genre name when provided
    // const whereCondition = genre
    //     ? {
    //           // genres is a join table; filter via the related Genre.name
    //           genres: {
    //               some: { genre: { name: { equals: genre, mode: "insensitive" } } },
    //           },
    //       }
    //     : {};

    // // Debug: log the computed where condition
    // console.log("WHERE CONDITION (TopCheapest):", whereCondition);

    const movies = await prisma.movie.findMany({
        // Build where condition to filter by genre name when provided
        where: genre
            ? {
                  // genres is a join table; filter via the related Genre.name
                  genres: {
                      some: { genre: { name: { equals: genre, mode: "insensitive" } } },
                  },
              }
            : undefined,
        orderBy: { price: "asc" },
        take: 5,
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

    // Compute rating aggregates for the movies we loaded.
    const movieIds = movies.map((m) => m.id);

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
    for (const r of ratingAgg) {
        ratingMap.set(r.movieId, {
            avgRating: r._avg.value ?? 0,
            ratingCount: r._count.value ?? 0,
        });
    }

    const movieItems = movies.map((movie) => {
        const rating = ratingMap.get(movie.id) ?? { avgRating: 0, ratingCount: 0 };
        return {
            id: movie.id,
            title: movie.title,
            price: movie.price.toString(),
            stock: movie.stock,
            runtime: movie.runtime,
            imageUrl: movie.imageUrl,
            genres: movie.genres.map((mg) => mg.genre.name),

            avgRating: rating.avgRating,
            ratingCount: rating.ratingCount,
        };
    });

    return (
        <div className="grid grid-cols-5 gap-4">
            {movies.length > 0 ? (
                movieItems.map((movie) => <MovieCard key={movie.id} movie={movie} />)
            ) : (
                <p className="text-left text-2xl">No results found.</p>
            )}
        </div>
    );
}
