import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteMovie } from "@/actions/movie";
import CreateMovieToast from "./_components/CreateMovieToast";

export default async function AdminMoviesPage() {
    const movies = await prisma.movie.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="p-8">
            {/* Shows toast after redirect from create */}
            <CreateMovieToast />

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Admin: Movies</h1>

                <Link href="/admin/movies/new" className="bg-black text-white px-4 py-2 rounded">
                    + Add Movie
                </Link>
            </div>

            {movies.length === 0 ? (
                <p className="text-muted-foreground">No movies yet.</p>
            ) : (
                <div className="space-y-4">
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            className="border p-4 rounded flex items-start justify-between"
                        >
                            <div>
                                <div className="font-semibold">{movie.title}</div>
                                <div className="text-sm text-muted-foreground">
                                    ${movie.price.toString()} • Stock: {movie.stock} • Runtime:{" "}
                                    {movie.runtime} min
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Link
                                    className="text-blue-600"
                                    href={`/admin/movies/${movie.id}/edit`}
                                >
                                    Edit
                                </Link>

                                <form action={deleteMovie.bind(null, movie.id)}>
                                    <button className="text-red-600">Delete</button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
