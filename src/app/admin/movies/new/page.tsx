import { createMovie } from "@/actions/movie";
import { prisma } from "@/lib/prisma";

export default async function AdminNewMoviePage() {
    const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });

    return (
        <div className="p-8 max-w-xl">
            <h1 className="text-2xl font-bold mb-6">Add Movie</h1>

            <form action={createMovie} className="space-y-4">
                <input name="title" placeholder="Title" className="w-full border p-2" />
                <textarea
                    name="description"
                    placeholder="Description"
                    className="w-full border p-2"
                />
                <input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    className="w-full border p-2"
                />
                <input name="releaseDate" type="date" className="w-full border p-2" />
                <input
                    name="runtime"
                    type="number"
                    placeholder="Runtime (minutes)"
                    className="w-full border p-2"
                />
                <input
                    name="imageUrl"
                    placeholder="Image URL (optional)"
                    className="w-full border p-2"
                />
                <input
                    name="stock"
                    type="number"
                    placeholder="Stock"
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
                                    <input type="checkbox" name="genres" value={g.id} />
                                    {g.name}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <button className="bg-black text-white px-4 py-2 rounded">Create Movie</button>
            </form>
        </div>
    );
}
