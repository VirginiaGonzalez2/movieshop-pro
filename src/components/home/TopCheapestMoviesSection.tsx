import { prisma } from "@/lib/prisma";
import MovieCard from "../movies/MovieCard";


export default async function TopCheapestMoviesSection()
{
  const movies = await prisma.movie.findMany ({
    orderBy: { price: "asc" },
    take: 5
  });

  const movieItems = movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    price: movie.price.toString(),
    stock: movie.stock,
    runtime: movie.runtime,
    rating: movie.rating,
    imageUrl: movie.imageUrl
  }));

  return (
    <div className="grid grid-cols-5 gap-4">
      {movies.length > 0 ? (      
          movieItems.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <p className="text-left text-2xl">No results found.</p>
        )
      }
    </div>
  );
}