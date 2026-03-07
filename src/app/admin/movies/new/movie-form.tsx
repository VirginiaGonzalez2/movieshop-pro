"use client";

import { useActionState, useMemo } from "react";
import { createMovie } from "@/actions/movie";

type Genre = { id: number; name: string };
type Person = { id: number; name: string };

export default function NewMovieForm({ genres, people }: { genres: Genre[]; people: Person[] }) {
    const initialState = useMemo(() => ({ ok: false as const, message: "" }), []);
    const [state, formAction, isPending] = useActionState(createMovie, initialState);

    const fe = state.ok ? undefined : state.fieldErrors;

    return (
        <form action={formAction} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium">Title</label>
                    <input
                        name="title"
                        placeholder="Title"
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        placeholder="Description"
                        className="w-full border rounded-md p-2 min-h-[110px]"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Price</label>
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Release Date</label>
                    <input name="releaseDate" type="date" className="w-full border rounded-md p-2" />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Runtime (minutes)</label>
                    <input
                        name="runtime"
                        type="number"
                        placeholder="Runtime"
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Stock</label>
                    <input
                        name="stock"
                        type="number"
                        placeholder="Stock"
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div className="space-y-1 md:col-span-2">
                    <div className="text-sm font-medium">Poster Image (Upload)</div>
                    <input
                        name="image"
                        type="file"
                        accept="image/*"
                        className="w-full border rounded-md p-2"
                    />
                    <p className="text-xs text-muted-foreground">
                        Upload overrides Image URL. Leave empty to use Image URL below.
                    </p>
                </div>

                <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium">Image URL</label>
                    <input
                        name="imageUrl"
                        placeholder="Image URL"
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium">Trailer URL</label>
                    <input
                        name="trailerUrl"
                        placeholder="Trailer URL (YouTube link)"
                        className="w-full border rounded-md p-2"
                    />
                </div>
            </div>

            <div>
                {fe?.title?.length ? <p className="text-red-600 text-sm mt-1">{fe.title[0]}</p> : null}
                {fe?.description?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fe.description[0]}</p>
                ) : null}
                {fe?.price?.length ? <p className="text-red-600 text-sm mt-1">{fe.price[0]}</p> : null}
                {fe?.releaseDate?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fe.releaseDate[0]}</p>
                ) : null}
                {fe?.runtime?.length ? <p className="text-red-600 text-sm mt-1">{fe.runtime[0]}</p> : null}
                {fe?.imageUrl?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fe.imageUrl[0]}</p>
                ) : null}
                {fe?.trailerUrl?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fe.trailerUrl[0]}</p>
                ) : null}
                {fe?.stock?.length ? <p className="text-red-600 text-sm mt-1">{fe.stock[0]}</p> : null}
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

            {!state.ok && fe?.form?.length ? (
                <div className="border border-red-200 bg-red-50 text-red-700 p-3 rounded">
                    {fe.form[0]}
                </div>
            ) : null}

            <button
                type="submit"
                disabled={isPending}
                className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm disabled:opacity-60"
            >
                {isPending ? "Creating..." : "Create Movie"}
            </button>
        </form>
    );
}
