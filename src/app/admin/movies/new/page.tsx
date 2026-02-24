import { createMovie } from "@/actions/movie";
import { prisma } from "@/lib/prisma";

export default async function AdminNewMoviePage() {
    const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });
    const people = await prisma.person.findMany({ orderBy: { name: "asc" } });

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

                {/* rating input */}
                <input
                    name="rating"
                    type="number"
                    min={0}
                    max={5}
                    placeholder="Rating (0-5)"
                    className="w-full border p-2"
                />

                {/* file upload */}
                <div className="space-y-1">
                    <div className="text-sm font-medium">Poster Image (Upload)</div>
                    <input
                        name="image"
                        type="file"
                        accept="image/*"
                        className="w-full border p-2"
                    />
                    <p className="text-xs text-muted-foreground">
                        Upload is preferred. If you don’t upload, the Image URL below will be used.
                    </p>
                </div>

                {/* Keep Image URL as fallback */}
                <input
                    name="imageUrl"
                    placeholder="Image URL (optional)"
                    className="w-full border p-2"
                />

                {/* trailer URL */}
                <input
                    name="trailerUrl"
                    placeholder="Trailer URL (YouTube link)"
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

                {/* Actors */}
                <div className="border rounded p-3">
                    <div className="font-semibold mb-2">Actors</div>
                    {people.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No people yet. Create some in <code>/admin/people</code>.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            {people.map((p) => (
                                <label key={p.id} className="flex items-center gap-2">
                                    <input type="checkbox" name="actors" value={p.id} />
                                    {p.name}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Directors */}
                <div className="border rounded p-3">
                    <div className="font-semibold mb-2">Directors</div>
                    {people.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No people yet. Create some in <code>/admin/people</code>.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            {people.map((p) => (
                                <label key={p.id} className="flex items-center gap-2">
                                    <input type="checkbox" name="directors" value={p.id} />
                                    {p.name}
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
