import { prisma } from "@/lib/prisma";
import MovieCard from "../movies/MovieCard";

export default async function TopRecentMoviesSection() {
    const movies = await prisma.movie.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
    });

    return (
        <div className="grid grid-cols-5 gap-4">
            {movies.length > 0 ? (
                movies.map((movie) => (
                    <MovieCard
                        key={movie.id}
                        movie={{
                            id: movie.id,
                            title: movie.title,
                            price: movie.price.toString(),
                            stock: movie.stock,
                            runtime: movie.runtime,
                            imageUrl: movie.imageUrl,

                            // placeholders for now (Step 3 will compute real ratings)
                            avgRating: 0,
                            ratingCount: 0,
                        }}
                    />
                ))
            ) : (
                <p>No results found.</p>
            )}
        </div>
    );
}
