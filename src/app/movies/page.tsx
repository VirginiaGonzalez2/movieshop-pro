import { prisma } from "@/lib/prisma";

export default async function MoviesPage() {
    const movies = await prisma.movie.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="mx-auto max-w-3xl text-left">
            <h1 className="text-2xl font-bold mb-4">Movies</h1>

            {movies.length === 0 ? (
                <p className="text-muted-foreground">
                    No movies found yet. Add some movies first (admin page).
                </p>
            ) : (
                <div className="space-y-3">
                    {movies.map((movie) => (
                        <div key={movie.id} className="border rounded p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="font-semibold">{movie.title}</h2>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {movie.description}
                                    </p>
                                </div>

                                <div className="text-sm font-medium whitespace-nowrap">
                                    ${movie.price.toString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
