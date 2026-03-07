"use client";

import { useEffect, useMemo, useRef } from "react";
import { useActionState } from "react";
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

    const selectedGenreSet = useMemo(() => new Set(selectedGenreIds), [selectedGenreIds]);
    const selectedActorSet = useMemo(() => new Set(selectedActorIds), [selectedActorIds]);
    const selectedDirectorSet = useMemo(() => new Set(selectedDirectorIds), [selectedDirectorIds]);

    // Band-aid solution
    const initialState: MovieActionState = { ok: false, message: "" };

    // useActionState is the correct way
    const [state, formAction, isPending] = useActionState(
        updateMovie.bind(null, movie.id),
        initialState,
    );

    // Prevent "green toast" on first render (when just click Edit)
    const submittedRef = useRef(false);

    useEffect(() => {
        if (!submittedRef.current) return;

        if (state.ok) {
            toast.success("Movie updated");
            // refresh so the server page re-fetches the updated movie
            router.refresh();
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state, router]);

    const fe = state.ok ? undefined : state.fieldErrors;

    return (
        <form
            action={async (fd: FormData) => {
                submittedRef.current = true;
                await formAction(fd);
            }}
            className="space-y-6"
        >
            {/* Pass id as hidden input */}
            <input type="hidden" name="id" value={movie.id} />

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium">Title</label>
                    <input
                        name="title"
                        defaultValue={movie.title}
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        defaultValue={movie.description}
                        className="w-full border rounded-md p-2 min-h-[110px]"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Price</label>
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        defaultValue={movie.price}
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Release Date</label>
                    <input
                        name="releaseDate"
                        type="date"
                        defaultValue={movie.releaseDate}
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Runtime (minutes)</label>
                    <input
                        name="runtime"
                        type="number"
                        defaultValue={movie.runtime}
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Stock</label>
                    <input
                        name="stock"
                        type="number"
                        defaultValue={movie.stock}
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
                        Upload overrides Image URL. Leave empty to keep current.
                    </p>
                </div>

                <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium">Image URL</label>
                    <input
                        name="imageUrl"
                        defaultValue={movie.imageUrl ?? ""}
                        placeholder="Image URL (optional)"
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium">Trailer URL</label>
                    <input
                        name="trailerUrl"
                        defaultValue={movie.trailerUrl ?? ""}
                        placeholder="Trailer URL (YouTube link)"
                        className="w-full border rounded-md p-2"
                    />
                </div>
            </div>

            <div>
                {fe?.title?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fe.title[0]}</p>
                ) : null}
                {fe?.description?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fe.description[0]}</p>
                ) : null}
                {fe?.price?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fe.price[0]}</p>
                ) : null}
                {fe?.releaseDate?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fe.releaseDate[0]}</p>
                ) : null}
                {fe?.runtime?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fe.runtime[0]}</p>
                ) : null}
                {fe?.stock?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fe.stock[0]}</p>
                ) : null}
                {fe?.imageUrl?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fe.imageUrl[0]}</p>
                ) : null}
                {fe?.trailerUrl?.length ? (
                    <p className="text-red-600 text-sm mt-1">{fe.trailerUrl[0]}</p>
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

            {/* form-level errors */}
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
                {isPending ? "Updating..." : "Update Movie"}
            </button>
        </form>
    );
}
