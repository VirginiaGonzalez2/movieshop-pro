import { prisma } from "@/lib/prisma";
import MovieEditForm from "./movie-edit-form";

export default async function AdminEditMoviePage({
    params,
}: {
    params: Promise<{ id: string }> | { id: string };
}) {
    const resolvedParams = await Promise.resolve(params);
    const id = Number(resolvedParams.id);

    if (!Number.isInteger(id) || id <= 0) {
        return (
            <div className="p-8">
                <h1 className="text-xl font-semibold">Invalid movie id</h1>
                <p className="text-muted-foreground">
                    URL must look like: <code>/admin/movies/1/edit</code>
                </p>
            </div>
        );
    }

    const movie = await prisma.movie.findUnique({ where: { id } });
    if (!movie) return <div className="p-8">Movie not found</div>;

    const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });

    const selectedGenres = await prisma.movieGenre.findMany({
        where: { movieId: movie.id },
        select: { genreId: true },
    });

    const selectedGenreIds = selectedGenres.map((x) => x.genreId);

    const people = await prisma.person.findMany({ orderBy: { name: "asc" } });

    const selectedPeople = await prisma.moviePerson.findMany({
        where: { movieId: movie.id },
        select: { personId: true, role: true },
    });

    const selectedActorIds = selectedPeople
        .filter((p) => p.role === "ACTOR")
        .map((p) => p.personId);

    const selectedDirectorIds = selectedPeople
        .filter((p) => p.role === "DIRECTOR")
        .map((p) => p.personId);

    return (
        <div className="p-8 max-w-xl">
            <h1 className="text-2xl font-bold mb-6">Edit Movie</h1>

            <MovieEditForm
                movie={{
                    id: movie.id,
                    title: movie.title,
                    description: movie.description,
                    price: movie.price.toString(),
                    releaseDate: movie.releaseDate.toISOString().split("T")[0],
                    runtime: movie.runtime,
                    imageUrl: movie.imageUrl ?? null,
                    trailerUrl: movie.trailerUrl ?? null,
                    stock: movie.stock,
                }}
                genres={genres}
                people={people}
                selectedGenreIds={selectedGenreIds}
                selectedActorIds={selectedActorIds}
                selectedDirectorIds={selectedDirectorIds}
            />
        </div>
    );
}
