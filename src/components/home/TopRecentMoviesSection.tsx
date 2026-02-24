import { prisma } from "@/lib/prisma";
import MovieCard from "../movies/MovieCard";


export default async function TopRecentMoviesSection()
{
  const movies = await prisma.movie.findMany ({
    orderBy: { createdAt: "desc" },
    take: 5
  });

  return (
    <div className="grid grid-cols-5 gap-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={
            {
              id: movie.id,
              title: movie.title,
              price: movie.price.toString(),   // Prisma Decimal → string
              stock: movie.stock,
              runtime: movie.runtime,
              rating: movie.rating,
              imageUrl: movie.imageUrl,
            }
          }
        />
      ))}
    </div>
  );
}