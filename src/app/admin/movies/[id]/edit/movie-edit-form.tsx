"use client";

type Genre = { id: number; name: string };
type Person = { id: number; name: string };

type MovieFormMovie = {
    id: number;
    title: string;
    description: string;
    price: string; // Decimal -> string
    releaseDate: string; // Date -> YYYY-MM-DD
    runtime: number;
    imageUrl: string;
    stock: number;
    trailerUrl?: string;
};

type Props = {
    movie: MovieFormMovie;
    genres: Genre[];
    people: Person[];
    selectedGenreIds: number[];
    selectedActorIds: number[];
    selectedDirectorIds: number[];
    action: (formData: FormData) => void | Promise<void>;
};

export default function MovieEditForm({
    movie,
    genres,
    people,
    selectedGenreIds,
    selectedActorIds,
    selectedDirectorIds,
    action,
}: Props) {
    const selectedGenreSet = new Set(selectedGenreIds);
    const selectedActorSet = new Set(selectedActorIds);
    const selectedDirectorSet = new Set(selectedDirectorIds);

    return (
        <form action={action} className="space-y-4">
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

            <div>
                <input
                    name="trailerUrl"
                    defaultValue={movie.trailerUrl ?? ""}
                    placeholder="Trailer URL (YouTube link)"
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

            <button className="bg-black text-white px-4 py-2 rounded">Update Movie</button>
        </form>
    );
}
