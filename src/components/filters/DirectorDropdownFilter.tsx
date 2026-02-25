"use client";

import { toggleDirector } from "@/actions/directorDropdown";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import { useTransition } from "react";

type DirectorDropdownFilterProps = {
    directors: {
        id: string;
        name: string;
    }[];
    selected: string[];
};

// Director filter component
function DirectorDropdownFilter({ directors, selected }: DirectorDropdownFilterProps) {
    const [, startTransition] = useTransition();
    const pathname = usePathname();

    // Handles toggling a director filter
    function onToggle(id: string) {
        startTransition(() => {
            toggleDirector(id, selected, pathname);
        });
    }

    return (
        <Accordion type="single" collapsible className="max-w-lg">
            {/* ✅ Changed value from "Genre" to "Directors" */}
            <AccordionItem value="Directors" className="border-b px-4 last:border-b-0">
                {/* ✅ Changed label from "Genre" to "Directors" */}
                <AccordionTrigger>Directors</AccordionTrigger>

                <AccordionContent>
                    <ScrollArea className="h-40 w-48 rounded-md border">
                        <div className="pl-3 pt-1 space-y-2">
                            {directors.map((d) => (
                                <label key={d.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(d.id)}
                                        onChange={() => onToggle(d.id)}
                                    />
                                    {d.name}
                                </label>
                            ))}
                        </div>
                    </ScrollArea>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

export { DirectorDropdownFilter };
