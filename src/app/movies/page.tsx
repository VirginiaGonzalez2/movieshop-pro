import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export default async function MoviesPage() {
  const movies = await prisma.movie.findMany({
    orderBy: { createdAt: "desc" },
  });

    if (movies.length === 0) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-2">Movies</h1>
                <p className="text-muted-foreground">
                    No movies found yet. Add some movies first (admin page).
                </p>
            </div>
        );
    }

    const movieIds = movies.map((m) => m.id);

    const moviePeople = await prisma.moviePerson.findMany({
        where: { movieId: { in: movieIds } },
        include: { person: true },
        orderBy: [{ movieId: "asc" }, { personId: "asc" }],
    });

    //  Map movieId -> { actors: [], directors: [] }
    const byMovie = new Map<number, { actors: string[]; directors: string[] }>();

    for (const mp of moviePeople) {
        const entry = byMovie.get(mp.movieId) ?? { actors: [], directors: [] };

        if (mp.role === Role.ACTOR) {
            entry.actors.push(mp.person.name);
        } else if (mp.role === Role.DIRECTOR) {
            entry.directors.push(mp.person.name);
        }

        byMovie.set(mp.movieId, entry);
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Movies</h1>

            <div className="grid gap-4">
                {movies.map((movie) => {
                    const info = byMovie.get(movie.id) ?? {
                        actors: [],
                        directors: [],
                    };

                    return (
                        <div
                            key={movie.id}
                            className="border rounded p-4 flex items-start justify-between"
                        >
                            <div className="space-y-1">
                                <div className="font-semibold text-lg">{movie.title}</div>

                                <div className="text-sm text-muted-foreground">
                                    ${movie.price.toString()} • Stock: {movie.stock} • Runtime:{" "}
                                    {movie.runtime} min
                                </div>

                                {/* Directors */}
                                <div className="text-sm">
                                    <span className="font-semibold">Director:</span>{" "}
                                    {info.directors.length > 0 ? info.directors.join(", ") : "—"}
                                </div>

                                {/* Actors */}
                                <div className="text-sm">
                                    <span className="font-semibold">Cast:</span>{" "}
                                    {info.actors.length > 0 ? info.actors.join(", ") : "—"}
                                </div>
                            </div>

                            {/*  details page lateron */}
                            <div className="text-sm">
                                <Link className="text-blue-600" href={`/movies`}>
                                    View
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      )}
    </div>
  );
}
