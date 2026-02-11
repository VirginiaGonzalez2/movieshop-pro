"use client";

import { useActionState } from "react";
import { createMovie, type MovieActionState } from "@/actions/movie";

type Genre = { id: number; name: string };
type Person = { id: number; name: string };

const initialState: MovieActionState = { ok: true };

export default function NewMovieForm({ genres, people }: { genres: Genre[]; people: Person[] }) {
    const [state, action] = useActionState(createMovie, initialState);

    const fe = state.ok ? undefined : state.fieldErrors;

    return (
        <form action={action} className="space-y-4">
            {!state.ok && (
                <div className="border border-red-500 rounded p-3 text-sm">{state.message}</div>
            )}

            <div>
                <input name="title" placeholder="Title" className="w-full border p-2" />
                {fe?.title && <p className="text-red-600 text-sm">{fe.title[0]}</p>}
            </div>

            <div>
                <textarea
                    name="description"
                    placeholder="Description"
                    className="w-full border p-2"
                />
                {fe?.description && <p className="text-red-600 text-sm">{fe.description[0]}</p>}
            </div>

            <div>
                <input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    className="w-full border p-2"
                />
                {fe?.price && <p className="text-red-600 text-sm">{fe.price[0]}</p>}
            </div>

            <div>
                <input name="releaseDate" type="date" className="w-full border p-2" />
                {fe?.releaseDate && <p className="text-red-600 text-sm">{fe.releaseDate[0]}</p>}
            </div>

            <div>
                <input
                    name="runtime"
                    type="number"
                    placeholder="Runtime"
                    className="w-full border p-2"
                />
                {fe?.runtime && <p className="text-red-600 text-sm">{fe.runtime[0]}</p>}
            </div>

            <div>
                <input name="imageUrl" placeholder="Image URL" className="w-full border p-2" />
                {fe?.imageUrl && <p className="text-red-600 text-sm">{fe.imageUrl[0]}</p>}
            </div>

            <div>
                <input
                    name="stock"
                    type="number"
                    placeholder="Stock"
                    className="w-full border p-2"
                />
                {fe?.stock && <p className="text-red-600 text-sm">{fe.stock[0]}</p>}
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
