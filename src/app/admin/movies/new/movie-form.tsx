"use client";

import { createMovie } from "@/actions/movie";

type Genre = { id: number; name: string };
type Person = { id: number; name: string };

export default function NewMovieForm({ genres, people }: { genres: Genre[]; people: Person[] }) {
    return (
        <form action={createMovie} className="space-y-4">
            <div>
                <input name="title" placeholder="Title" className="w-full border p-2" />
            </div>

            <div>
                <textarea
                    name="description"
                    placeholder="Description"
                    className="w-full border p-2"
                />
            </div>

            <div>
                <input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    className="w-full border p-2"
                />
            </div>

            <div>
                <input name="releaseDate" type="date" className="w-full border p-2" />
            </div>

            <div>
                <input
                    name="runtime"
                    type="number"
                    placeholder="Runtime"
                    className="w-full border p-2"
                />
            </div>

            {/* file upload */}
            <div className="space-y-1">
                <div className="text-sm font-medium">Poster Image (Upload)</div>
                <input name="image" type="file" accept="image/*" className="w-full border p-2" />
                <p className="text-xs text-muted-foreground">
                    Upload overrides Image URL. Leave empty to use Image URL below.
                </p>
            </div>

            <div>
                <input name="imageUrl" placeholder="Image URL" className="w-full border p-2" />
            </div>

            <div>
                <input
                    name="trailerUrl"
                    placeholder="Trailer URL (YouTube link)"
                    className="w-full border p-2"
                />
            </div>

            <div>
                <input
                    name="stock"
                    type="number"
                    placeholder="Stock"
                    className="w-full border p-2"
                />
            </div>

            {/* Genres */}
            <div className="border rounded p-3">
                <div className="font-semibold mb-2">Genres</div>
                <div className="grid grid-cols-2 gap-2">
                    {genres.map((g) => (
                        <label key={g.id} className="flex items-center gap-2">
                            <input type="checkbox" name="genres" value={g.id} />
                            {g.name}
                        </label>
                    ))}
                </div>
            </div>

            {/* Actors */}
            <div className="border rounded p-3">
                <div className="font-semibold mb-2">Actors</div>
                <div className="grid grid-cols-2 gap-2">
                    {people.map((p) => (
                        <label key={p.id} className="flex items-center gap-2">
                            <input type="checkbox" name="actors" value={p.id} />
                            {p.name}
                        </label>
                    ))}
                </div>
            </div>

            {/* Directors */}
            <div className="border rounded p-3">
                <div className="font-semibold mb-2">Directors</div>
                <div className="grid grid-cols-2 gap-2">
                    {people.map((p) => (
                        <label key={p.id} className="flex items-center gap-2">
                            <input type="checkbox" name="directors" value={p.id} />
                            {p.name}
                        </label>
                    ))}
                </div>
            </div>

            <button className="bg-black text-white px-4 py-2 rounded">Create Movie</button>
        </form>
    );
}
