import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteMovie } from "@/actions/movie";
import CreateMovieToast from "./_components/CreateMovieToast";
import { requireAdminArea } from "@/lib/admin-rbac";

export default async function AdminMoviesPage() {
    await requireAdminArea("movies");

    const movies = await prisma.movie.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-5">
            <CreateMovieToast />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold">Movies</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage catalog titles, pricing, stock, and metadata.
                    </p>
                </div>

                <Link
                    href="/admin/movies/new"
                    className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm"
                >
                    + Add Movie
                </Link>
            </div>

            {movies.length === 0 ? (
                <div className="rounded-lg border p-8 text-center text-muted-foreground">
                    No movies yet.
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="md:hidden space-y-3">
                        {movies.map((movie) => (
                            <div key={movie.id} className="rounded-lg border p-4 space-y-3 bg-card">
                                <div>
                                    <div className="font-medium">{movie.title}</div>
                                    <div className="text-xs text-muted-foreground">ID: {movie.id}</div>
                                </div>

                                <div className="text-sm text-muted-foreground">
                                    ${movie.price.toString()} • Stock: {movie.stock} • {movie.runtime} min
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                                        href={`/admin/movies/${movie.id}/edit`}
                                    >
                                        Edit
                                    </Link>

                                    <form action={deleteMovie.bind(null, movie.id)}>
                                        <button
                                            type="submit"
                                            className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:block rounded-lg border">
                        <div className="overflow-x-auto">
                            <div className="min-w-[760px]">
                                <div className="flex items-center px-4 py-3 bg-muted/40 text-xs font-semibold text-muted-foreground">
                                    <div className="flex-1">Movie</div>
                                    <div className="w-64">Details</div>
                                    <div className="w-48 text-right">Actions</div>
                                </div>

                                <div className="divide-y">
                                    {movies.map((movie) => (
                                        <div key={movie.id} className="flex items-center gap-4 px-4 py-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium truncate">{movie.title}</div>
                                                <div className="text-xs text-muted-foreground">ID: {movie.id}</div>
                                            </div>

                                            <div className="w-64 text-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                                                ${movie.price.toString()} · Stock: {movie.stock} · {movie.runtime} min
                                            </div>

                                            <div className="w-48 flex justify-end gap-2 shrink-0">
                                                <Link
                                                    className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                                                    href={`/admin/movies/${movie.id}/edit`}
                                                >
                                                    Edit
                                                </Link>

                                                <form action={deleteMovie.bind(null, movie.id)}>
                                                    <button
                                                        type="submit"
                                                        className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
