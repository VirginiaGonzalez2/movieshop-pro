"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Option = {
    id: string;
    name: string;
};

type Props = {
    genres: Option[];
    selectedGenres: string[];
    directors: Option[];
    selectedDirectors: string[];
    actors: Option[];
    selectedActors: string[];
};

export default function MovieFilterPanel({
    genres,
    selectedGenres,
    directors,
    selectedDirectors,
    actors,
    selectedActors,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [openSection, setOpenSection] = useState<string | null>("genre");

    const hasGenreFilter = selectedGenres.length > 0;
    const hasDirectorFilter = selectedDirectors.length > 0;
    const hasActorFilter = selectedActors.length > 0;

    function toggleSection(key: string) {
        setOpenSection((prev) => (prev === key ? null : key));
    }

    function updateParam(key: string, values: string[]) {
        const params = new URLSearchParams(searchParams.toString());

        if (values.length === 0) {
            params.delete(key);
        } else {
            params.set(key, values.join(","));
        }

        router.push(`/movies?${params.toString()}`);
    }

    function toggleValue(value: string, selectedValues: string[], key: string) {
        const newValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];

        updateParam(key, newValues);
    }

    function clearFilters() {
        const params = new URLSearchParams(searchParams.toString());

        params.delete("genre");
        params.delete("director");
        params.delete("actor");
        params.delete("page");

        router.push(`/movies?${params.toString()}`);
    }

    const hasFilters =
        selectedGenres.length > 0 ||
        selectedDirectors.length > 0 ||
        selectedActors.length > 0;

    return (
        <div className="sticky top-24">
            <div className="bg-gray-50 border rounded-xl shadow-sm p-6 max-h-[75vh] overflow-y-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Filter Movies</h1>
                    <p className="text-sm text-muted-foreground">
                        Use the filters below to discover movies by genre, director or actor.
                    </p>
                </div>

                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        className="w-full bg-white hover:bg-gray-100 transition rounded-lg py-2 text-sm border"
                    >
                        Clear All Filters
                    </button>
                )}

                {/* GENRE */}
                <div className="pb-3">
                    <button
                        onClick={() => toggleSection("genre")}
                        className="w-full flex items-center justify-between text-lg font-semibold text-left py-2 border-b"
                    >
                        <div className="flex items-center gap-2">
                            {hasGenreFilter && <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />}
                            <span>Genre</span>
                        </div>
                        <span className="text-sm">{openSection === "genre" ? "−" : "+"}</span>
                    </button>

                    {openSection === "genre" && (
                        <div className="mt-3 max-h-56 overflow-y-auto pr-2 space-y-2 text-sm">
                            {genres.map((genre) => (
                                <label key={genre.id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">
                                    <input
                                        className="h-4 w-4"
                                        type="checkbox"
                                        checked={selectedGenres.includes(genre.id)}
                                        onChange={() =>
                                            toggleValue(genre.id, selectedGenres, "genre")
                                        }
                                    />
                                    {genre.name}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* DIRECTOR */}
                <div className="pb-3">
                    <button
                        onClick={() => toggleSection("director")}
                        className="w-full flex items-center justify-between text-lg font-semibold text-left py-2 border-b"
                    >
                        <div className="flex items-center gap-2">
                            {hasDirectorFilter && <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />}
                            <span>Director</span>
                        </div>
                        <span className="text-sm">{openSection === "director" ? "−" : "+"}</span>
                    </button>

                    {openSection === "director" && (
                        <div className="mt-3 max-h-56 overflow-y-auto pr-2 space-y-2 text-sm">
                            {directors.map((director) => (
                                <label key={director.id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">
                                    <input
                                        className="h-4 w-4"
                                        type="checkbox"
                                        checked={selectedDirectors.includes(director.id)}
                                        onChange={() =>
                                            toggleValue(director.id, selectedDirectors, "director")
                                        }
                                    />
                                    {director.name}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* ACTOR */}
                <div>
                    <button
                        onClick={() => toggleSection("actor")}
                        className="w-full flex items-center justify-between text-lg font-semibold text-left py-2 border-b"
                    >
                        <div className="flex items-center gap-2">
                            {hasActorFilter && <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />}
                            <span>Actor</span>
                        </div>
                        <span className="text-sm">{openSection === "actor" ? "−" : "+"}</span>
                    </button>

                    {openSection === "actor" && (
                        <div className="mt-3 max-h-56 overflow-y-auto pr-2 space-y-2 text-sm">
                            {actors.map((actor) => (
                                <label key={actor.id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">
                                    <input
                                        className="h-4 w-4"
                                        type="checkbox"
                                        checked={selectedActors.includes(actor.id)}
                                        onChange={() =>
                                            toggleValue(actor.id, selectedActors, "actor")
                                        }
                                    />
                                    {actor.name}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}