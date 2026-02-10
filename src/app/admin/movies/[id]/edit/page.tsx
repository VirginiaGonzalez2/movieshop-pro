import { prisma } from "@/lib/prisma";
import { updateMovie } from "@/actions/movie";

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

    // fetch all genres ids

    const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });
    const selected = await prisma.movieGenre.findMany({
        where: { movieId: movie.id },
        select: { genreId: true },
    });
    const selectedIds = new Set(selected.map((x) => x.genreId));

    const updateWithId = updateMovie.bind(null, movie.id);

    return (
        <div className="p-8 max-w-xl">
            <h1 className="text-2xl font-bold mb-6">Edit Movie</h1>

            <form action={updateWithId} className="space-y-4">
                <input name="title" defaultValue={movie.title} className="w-full border p-2" />
                <textarea
                    name="description"
                    defaultValue={movie.description}
                    className="w-full border p-2"
                />
                <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={movie.price.toString()}
                    className="w-full border p-2"
                />
                <input
                    name="releaseDate"
                    type="date"
                    defaultValue={movie.releaseDate.toISOString().split("T")[0]}
                    className="w-full border p-2"
                />
                <input
                    name="runtime"
                    type="number"
                    defaultValue={movie.runtime}
                    className="w-full border p-2"
                />
                <input
                    name="imageUrl"
                    defaultValue={movie.imageUrl ?? ""}
                    className="w-full border p-2"
                />
                <input
                    name="stock"
                    type="number"
                    defaultValue={movie.stock}
                    className="w-full border p-2"
                />

                {/* Genres */}
                <div className="border rounded p-3">
                    <div className="font-semibold mb-2">Genres</div>
                    {genres.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No genres yet. Create some in <code>/admin/genres</code>.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            {genres.map((g) => (
                                <label key={g.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="genres"
                                        value={g.id}
                                        defaultChecked={selectedIds.has(g.id)}
                                    />
                                    {g.name}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <button className="bg-black text-white px-4 py-2 rounded">Update Movie</button>
            </form>
        </div>
    );
}
