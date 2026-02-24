"use client";

import { toggleGenre } from "@/actions/genreDropdown";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import { useTransition } from "react";

type GenreDropdownFilterProps = {
    genres: {
        id: string;
        name: string;
    }[];
    selected: string[];
};

// Genre filter
function GenreDropdownFilter({ genres, selected }: GenreDropdownFilterProps) {
    const [, startTransition] = useTransition();
    const pathname = usePathname();

    function onToggle(id: string) {
        startTransition(() => {
            toggleGenre(id, selected, pathname);
        });
    }

    return (
        <Accordion type="single" collapsible className="max-w-lg">
            <AccordionItem value="Genre" className="border-b px-4 last:border-b-0">
                <AccordionTrigger>Genre</AccordionTrigger>
                <AccordionContent>
                    <ScrollArea className="h-40 w-48 rounded-md border">
                        <div className="pl-3 pt-1 space-y-2">
                            {genres.map((g) => (
                                <label key={g.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(g.id)}
                                        onChange={() => onToggle(g.id)}
                                        />
                                    {/* Alter 'name' to what's appropriate for the genre db table */}
                                    {g.name}
                                </label>
                            ))}
                        </div>
                    </ScrollArea>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

export { GenreDropdownFilter };