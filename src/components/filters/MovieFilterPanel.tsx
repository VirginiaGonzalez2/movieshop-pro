"use client";

import { GenreDropdownFilter } from "@/components/filters/GenreDropdownFilter";
import { DirectorDropdownFilter } from "@/components/filters/DirectorDropdownFilter";
import { ActorDropdownFilter } from "@/components/filters/ActorDropdownFilter";
import { Accordion } from "../ui/accordion";
import { useRouter, useSearchParams } from "next/navigation";

type MovieFilterPanelProps = {
  genres: { id: string; name: string }[];
  selectedGenres: string[];

  directors: { id: string; name: string }[];
  selectedDirectors: string[];

  actors: { id: string; name: string }[];
  selectedActors: string[];

  // movies?: Movie[]; // if you want to display movies here
};

// MovieFilterPanel
export default function MovieFilterPanel({
  genres,
  selectedGenres,
  directors,
  selectedDirectors,
  actors,
  selectedActors,
}: MovieFilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function clearFilters() {
    // Clear the singular filter query keys and reset pagination
    const params = new URLSearchParams(searchParams.toString());
    params.delete("genre");
    params.delete("director");
    params.delete("actor");
    params.delete("page");

    router.push(`/movies?${params.toString()}`);
  }
  return (
    <div className="flex flex-col gap-6">
      {/* Filter panel header section
          Provides a short title and subtitle to explain the purpose of the filters. */}
      <div className="border-b pb-4 mb-6">
        <h2 className="text-lg font-semibold">Find your perfect movie</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Refine your results by genre, director, or actor.
        </p>
      </div>
      {/* Accordion must be in this file if you want only one dropdown open at once */}
      {/* Clear filters button for the vertical panel. Styling only, no filter logic change. */}
      <div>
        <button
          onClick={clearFilters}
          className="w-full bg-white hover:bg-gray-100 transition rounded-lg py-2 text-sm border mb-2"
        >
          Clear All Filters
        </button>
      </div>
      {/* <Accordion type="multiple" className="max-w-lg">  */}
        <GenreDropdownFilter genres={genres} selected={selectedGenres} />
        <DirectorDropdownFilter directors={directors} selected={selectedDirectors} />
        <ActorDropdownFilter actors={actors} selected={selectedActors} />
      {/* </Accordion> */}
      {/* Render movies here if needed */}
    </div>
  );
}
