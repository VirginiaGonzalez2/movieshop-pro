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
    const [openSection, setOpenSection] = useState<string | null>("genres");

    const toggleSection = (key: string) => {
        setOpenSection((prev) => (prev === key ? null : key));
    };

    const updateParam = (key: string, values: string[]) => {
        const params = new URLSearchParams(searchParams.toString());

        if (values.length === 0) {
            params.delete(key);
        } else {
            params.set(key, values.join(","));
        }

        router.push(`/movies?${params.toString()}`);
    };

    const toggleValue = (value: string, selectedValues: string[], key: string) => {
        const newValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];

        updateParam(key, newValues);
    };

    const clearFilters = () => {
        router.push("/movies");
    };

    const hasFilters =
        selectedGenres.length > 0 || selectedDirectors.length > 0 || selectedActors.length > 0;

    return (
        <div className="bg-white border rounded-2xl p-6 shadow-md space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Find Your Favorite Movie 🎬</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Use the filters below to discover movies by genre, director or actor.
                </p>
            </div>

            {hasFilters && (
                <button
                    onClick={clearFilters}
                    className="w-full bg-gray-100 hover:bg-gray-200 transition rounded-lg py-2 text-sm"
                >
                    Clear All Filters
                </button>
            )}

            {/* GENRE */}
            <div className="border-b pb-3">
                <button
                    onClick={() => toggleSection("genres")}
                    className="w-full flex justify-between items-center font-medium text-left"
                >
                    Genre
                    <span>{openSection === "genres" ? "−" : "+"}</span>
                </button>

                {openSection === "genres" && (
                    <div className="mt-3 max-h-56 overflow-y-auto pr-2 space-y-2 text-sm">
                        {genres.map((genre) => (
                            <label key={genre.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedGenres.includes(genre.id)}
                                    onChange={() => toggleValue(genre.id, selectedGenres, "genres")}
                                />
                                {genre.name}
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* DIRECTORS */}
            <div className="border-b pb-3">
                <button
                    onClick={() => toggleSection("directors")}
                    className="w-full flex justify-between items-center font-medium text-left"
                >
                    Directors
                    <span>{openSection === "directors" ? "−" : "+"}</span>
                </button>

                {openSection === "directors" && (
                    <div className="mt-3 max-h-56 overflow-y-auto pr-2 space-y-2 text-sm">
                        {directors.map((director) => (
                            <label key={director.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedDirectors.includes(director.id)}
                                    onChange={() =>
                                        toggleValue(director.id, selectedDirectors, "directors")
                                    }
                                />
                                {director.name}
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* ACTORS */}
            <div>
                <button
                    onClick={() => toggleSection("actors")}
                    className="w-full flex justify-between items-center font-medium text-left"
                >
                    Actors
                    <span>{openSection === "actors" ? "−" : "+"}</span>
                </button>

                {openSection === "actors" && (
                    <div className="mt-3 max-h-56 overflow-y-auto pr-2 space-y-2 text-sm">
                        {actors.map((actor) => (
                            <label key={actor.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedActors.includes(actor.id)}
                                    onChange={() => toggleValue(actor.id, selectedActors, "actors")}
                                />
                                {actor.name}
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
