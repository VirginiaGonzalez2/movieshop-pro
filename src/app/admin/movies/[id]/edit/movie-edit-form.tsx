"use client";

import { useActionState } from "react";
import { updateMovie, type MovieActionState } from "@/actions/movie";

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
};

type Props = {
    movie: MovieFormMovie;
    genres: Genre[];
    people: Person[];
    selectedGenreIds: number[];
    selectedActorIds: number[];
    selectedDirectorIds: number[];
};

const initialState: MovieActionState = { ok: true };

export default function MovieEditForm({
    movie,
    genres,
    people,
    selectedGenreIds,
    selectedActorIds,
    selectedDirectorIds,
}: Props) {
    const updateWithId = updateMovie.bind(null, movie.id);
    const [state, action] = useActionState(updateWithId, initialState);

    const fe = state.ok ? undefined : state.fieldErrors;

    const selectedGenreSet = new Set(selectedGenreIds);
    const selectedActorSet = new Set(selectedActorIds);
    const selectedDirectorSet = new Set(selectedDirectorIds);

    return (
        <form action={action} className="space-y-4">
            {!state.ok ? (
                <div className="border border-red-500 rounded p-3 text-sm">{state.message}</div>
            ) : null}

            <div>
                <input name="title" defaultValue={movie.title} className="w-full border p-2" />
                {fe?.title?.length ? <p className="text-red-600 text-sm">{fe.title[0]}</p> : null}
            </div>

            <div>
                <textarea
                    name="description"
                    defaultValue={movie.description}
                    className="w-full border p-2"
                />
                {fe?.description?.length ? (
                    <p className="text-red-600 text-sm">{fe.description[0]}</p>
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
                {fe?.price?.length ? <p className="text-red-600 text-sm">{fe.price[0]}</p> : null}
            </div>

            <div>
                <input
                    name="releaseDate"
                    type="date"
                    defaultValue={movie.releaseDate}
                    className="w-full border p-2"
                />
                {fe?.releaseDate?.length ? (
                    <p className="text-red-600 text-sm">{fe.releaseDate[0]}</p>
                ) : null}
            </div>

            <div>
                <input
                    name="runtime"
                    type="number"
                    defaultValue={movie.runtime}
                    className="w-full border p-2"
                />
                {fe?.runtime?.length ? (
                    <p className="text-red-600 text-sm">{fe.runtime[0]}</p>
                ) : null}
            </div>

            <div>
                <input
                    name="imageUrl"
                    defaultValue={movie.imageUrl}
                    className="w-full border p-2"
                />
                {fe?.imageUrl?.length ? (
                    <p className="text-red-600 text-sm">{fe.imageUrl[0]}</p>
                ) : null}
            </div>

            <div>
                <input
                    name="stock"
                    type="number"
                    defaultValue={movie.stock}
                    className="w-full border p-2"
                />
                {fe?.stock?.length ? <p className="text-red-600 text-sm">{fe.stock[0]}</p> : null}
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
