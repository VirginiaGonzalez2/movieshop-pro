"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
    const router = useRouter();

    const selectedGenreSet = new Set(selectedGenreIds);
    const selectedActorSet = new Set(selectedActorIds);
    const selectedDirectorSet = new Set(selectedDirectorIds);

    // useActionState is the correct way /Sabrina
    const updateWithId = updateMovie.bind(null, movie.id);

    const initialState: MovieActionState = { ok: true };

    const [state, formAction, isPending] = useActionState(updateWithId, initialState);

    useEffect(() => {
        if (!state) return;

        if (state.ok) {
            toast.success("Movie updated");
            router.refresh();
        } else {
            toast.error(state.message || "Failed to update movie");
        }
    }, [state, router]);

    const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

    return (
        <form action={formAction} className="space-y-4">
            {/* Pass id as hidden input /Sabrina */}
            <input type="hidden" name="id" value={movie.id} />

            <div>
                <input name="title" defaultValue={movie.title} className="w-full border p-2" />
                {fieldErrors?.title?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.title[0]}</p>
                ) : null}
            </div>

            <div>
                <textarea
                    name="description"
                    defaultValue={movie.description}
                    className="w-full border p-2"
                />
                {fieldErrors?.description?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.description[0]}</p>
                ) : null}
            </div>

            <div>
                <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={movie.price}
                    className="w-full border p-2"
                />
                {fieldErrors?.price?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.price[0]}</p>
                ) : null}
            </div>

            <div>
                <input
                    name="releaseDate"
                    type="date"
                    defaultValue={movie.releaseDate}
                    className="w-full border p-2"
                />
                {fieldErrors?.releaseDate?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.releaseDate[0]}</p>
                ) : null}
            </div>

            <div>
                <input
                    name="runtime"
                    type="number"
                    defaultValue={movie.runtime}
                    className="w-full border p-2"
                />
                {fieldErrors?.runtime?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.runtime[0]}</p>
                ) : null}
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
                    placeholder="Image URL (optional)"
                    className="w-full border p-2"
                />
                {fieldErrors?.imageUrl?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.imageUrl[0]}</p>
                ) : null}
            </div>

            {/* Trailer URL */}
            <div>
                <input
                    name="trailerUrl"
                    defaultValue={movie.trailerUrl ?? ""}
                    placeholder="Trailer URL (YouTube link)"
                    className="w-full border p-2"
                />
                {fieldErrors?.trailerUrl?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.trailerUrl[0]}</p>
                ) : null}
            </div>

            <div>
                <input
                    name="stock"
                    type="number"
                    defaultValue={movie.stock}
                    className="w-full border p-2"
                />
                {fieldErrors?.stock?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.stock[0]}</p>
                ) : null}
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

            {fieldErrors?.form?.length ? (
                <p className="text-red-600 text-sm">{fieldErrors.form[0]}</p>
            ) : null}

            <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded"
                disabled={isPending}
            >
                {isPending ? "Updating..." : "Update Movie"}
            </button>
        </form>
    );
}
