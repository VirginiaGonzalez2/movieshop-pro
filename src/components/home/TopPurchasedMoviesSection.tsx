import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import MovieCard from "../movies/MovieCard";

export default async function TopPurchasedMoviesSection({
  genre,
}: {
  genre?: string | null;
}) {
  console.log("TopPurchasedMoviesSection - genre:", genre);

  const topSelling = await prisma.orderItem.groupBy({
    by: ["movieId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
  });

  // IMPORTANT: movie.id is number in your schema
  const movieIdsInOrder: number[] = topSelling.map(
    (m) => m.movieId
  );

  // Create map of purchased counts
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
    .map((id) => movies.find((m) => m.id === id))
    .filter(
      (m): m is (typeof movies)[number] =>
        m !== undefined
    )
    .slice(0, 5);

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
      ratingMap.get(movie.id) ?? {
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
      genres: movie.genres.map((mg) => mg.genre.name),
      avgRating: rating.avgRating,
      ratingCount: rating.ratingCount,
      purchasedCount: purchasedCountMap.get(movie.id) ?? 0,
    };
  });

  return (
    <div className="px-6">
      <div className="grid grid-cols-5 gap-6">
        {movieItems.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>
    </div>
  );
}