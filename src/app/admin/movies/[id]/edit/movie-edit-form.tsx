"use client";

import { MovieActionState, updateMovie } from "@/actions/movie";

type Genre = { id: number; name: string };
type Person = { id: number; name: string };

type MovieFormMovie = {
    id: number;
    title: string;
    description: string;
    price: string; // Decimal -> string
    releaseDate: string; // Date -> YYYY-MM-DD
    runtime: number;
    imageUrl: string | null;
    trailerUrl: string | null;
    stock: number;
};

type Props = {
    movie: MovieFormMovie;
    genres: Genre[];
    people: Person[];
    selectedGenreIds: number[];
    selectedActorIds: number[];
    selectedDirectorIds: number[];
};

export default function MovieEditForm({
    movie,
    genres,
    people,
    selectedGenreIds,
    selectedActorIds,
    selectedDirectorIds,
}: Props) {
    const selectedGenreSet = new Set(selectedGenreIds);
    const selectedActorSet = new Set(selectedActorIds);
    const selectedDirectorSet = new Set(selectedDirectorIds);

    // Band-aid solution kinda /Sabrina
    async function onSubmitForm(data: FormData) {
        // Could do this in updateMovie instead but I will leave that to you. /Sabrina
        const id = Number(data.get("id")?.toString());
        if (!isNaN(id)) {
            // Where am I supposed to get prevState from? /Sabrina
            const result = await updateMovie(id, /*prevState: */ { ok: true }, data);
            console.log("result", result);
        }
    }

    return (
        <form action={onSubmitForm} className="space-y-4">
            {/* Pass id as hidden input /Sabrina */}
            <input type="hidden" name="id" value={movie.id} />

            <div>
                <input name="title" defaultValue={movie.title} className="w-full border p-2" />
            </div>

            <div>
                <textarea
                    name="description"
                    defaultValue={movie.description}
                    className="w-full border p-2"
                />
            </div>

            <div>
                <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={movie.price}
                    className="w-full border p-2"
                />
            </div>

            <div>
                <input
                    name="releaseDate"
                    type="date"
                    defaultValue={movie.releaseDate}
                    className="w-full border p-2"
                />
            </div>

            <div>
                <input
                    name="runtime"
                    type="number"
                    defaultValue={movie.runtime}
                    className="w-full border p-2"
                />
            </div>

            {/* file upload */}
            <div className="space-y-1">
                <div className="text-sm font-medium">Poster Image (Upload)</div>
                <input name="image" type="file" accept="image/*" className="w-full border p-2" />
                <p className="text-xs text-muted-foreground">
                    Upload overrides Image URL. Leave empty to keep current.
                </p>
            </div>

            {/* Image URL fallback */}
            <div>
                <input
                    name="imageUrl"
                    defaultValue={movie.imageUrl ?? ""}
                    className="w-full border p-2"
                />
            </div>

            {/* Trailer URL */}
            <div>
                <input
                    name="trailerUrl"
                    defaultValue={movie.trailerUrl ?? ""}
                    placeholder="Trailer URL (YouTube link)"
                    className="w-full border p-2"
                />
                {movie.trailerUrl?.length ? (
                    <p className="text-red-600 text-sm">{movie.trailerUrl[0]}</p>
                ) : null}
            </div>

            {/* Image upload (optional) */}
            <div className="space-y-1">
                <div className="text-sm font-medium">Poster Image (Upload)</div>
                <input name="image" type="file" accept="image/*" className="w-full border p-2" />
                <p className="text-xs text-muted-foreground">
                    Upload is preferred. If you don’t upload, the Image URL below will be used.
                </p>
            </div>

            {/* Image URL fallback */}
            <div>
                <input
                    name="imageUrl"
                    defaultValue={movie.imageUrl ?? ""}
                    placeholder="Image URL (optional)"
                    className="w-full border p-2"
                />
            </div>

            <div>
                <input
                    name="stock"
                    type="number"
                    defaultValue={movie.stock}
                    className="w-full border p-2"
                />
            </div>

            {/* Genres */}
            <div className="border rounded p-3">
                <div className="font-semibold mb-2">Genres</div>
                <div className="grid grid-cols-2 gap-2">
                    {genres.map((g) => (
                        <label key={g.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="genres"
                                value={g.id}
                                defaultChecked={selectedGenreSet.has(g.id)}
                            />
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
                            <input
                                type="checkbox"
                                name="actors"
                                value={p.id}
                                defaultChecked={selectedActorSet.has(p.id)}
                            />
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
                            <input
                                type="checkbox"
                                name="directors"
                                value={p.id}
                                defaultChecked={selectedDirectorSet.has(p.id)}
                            />
                            {p.name}
                        </label>
                    ))}
                </div>
            </div>

            <button type="submit" className="bg-black text-white px-4 py-2 rounded">
                Update Movie
            </button>
        </form>
    );
}
