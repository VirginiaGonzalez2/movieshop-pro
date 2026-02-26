import { GenreDropdownFilter } from "@/components/filters/GenreDropdownFilter";
import { DirectorDropdownFilter } from "@/components/filters/DirectorDropdownFilter";
import { ActorDropdownFilter } from "@/components/filters/ActorDropdownFilter";
import { Accordion } from "../ui/accordion";

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
  return (
    <div className="flex flex-col gap-6">
      {/* Accordion must be in this file if you want only one dropdown open at once */}
      <Accordion type="multiple" className="max-w-lg"> 
        <GenreDropdownFilter genres={genres} selected={selectedGenres} />
        <DirectorDropdownFilter directors={directors} selected={selectedDirectors} />
        <ActorDropdownFilter actors={actors} selected={selectedActors} />
      </Accordion>
      {/* Render movies here if needed */}
    </div>
  );
}
