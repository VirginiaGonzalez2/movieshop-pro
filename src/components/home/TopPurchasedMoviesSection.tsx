import { prisma } from "@/lib/prisma";
import MovieCard from "../movies/MovieCard";


export default async function TopPurchasedMoviesSection()
{
  const topSelling = await prisma.orderItem.groupBy ({
    by: ["movieId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5
  });

  const movieIdsInOrder = topSelling.map((m) => m.movieId);
  const movies = await prisma.movie.findMany({
    where: {
      id: {
        in: movieIdsInOrder
      }
    }
  });

  const moviesSorted = movieIdsInOrder.map((id) => movies.find((m) => m.id === id)!).filter(Boolean);

  const movieItems = moviesSorted.map((movie) => ({
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
      {movieItems.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}