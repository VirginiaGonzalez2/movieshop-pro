import { prisma } from "@/lib/prisma";
import NewMovieForm from "./movie-form";

export default async function AdminNewMoviePage() {
    const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });
    const people = await prisma.person.findMany({ orderBy: { name: "asc" } });

    return (
        <div className="p-8 max-w-xl">
            <h1 className="text-2xl font-bold mb-6">Add Movie</h1>
            <NewMovieForm genres={genres} people={people} />
        </div>
    );
}
