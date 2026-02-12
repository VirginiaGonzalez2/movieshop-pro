import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import MoviesClient from "./movies-client";

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

    // Prepare serializable data for the Client component
    const items = movies.map((m) => {
        const info = byMovie.get(m.id) ?? { actors: [], directors: [] };

        return {
            id: m.id,
            title: m.title,
            price: m.price.toString(),
            stock: m.stock,
            runtime: m.runtime,
            actors: info.actors,
            directors: info.directors,
        };
    });

    return <MoviesClient items={items} />;
}
