"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type ActorDropdownFilterProps = {
    actors: {
        id: string;
        name: string;
    }[];
    selected: string[];
};

// Actor filter component
function ActorDropdownFilter({ actors, selected }: ActorDropdownFilterProps) {
    const [, startTransition] = useTransition();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Handles toggling an actor filter (client-side: update query params)
    function onToggle(id: string) {
        startTransition(() => {
            const set = new Set(selected);

            if (set.has(id)) set.delete(id);
            else set.add(id);

            const params = new URLSearchParams(searchParams.toString());

            if (set.size > 0) params.set("actor", Array.from(set).join(","));
            else params.delete("actor");

            router.push(`${pathname}?${params.toString()}`);
        });
    }

    return (
        <Accordion type="single" collapsible className="max-w-lg">
            {/* // ✅ Changed value from "Genre" to "Actors" */}
            <AccordionItem value="Actors" className="border-b px-4 last:border-b-0">
                {/* ✅ Changed label from "Genre" to "Actors" */}
                <AccordionTrigger>Actors</AccordionTrigger>

                <AccordionContent>
                    <ScrollArea className="h-40 w-48 rounded-md border">
                        <div className="pl-3 pt-1 space-y-2">
                            {actors.map((a) => (
                                <label key={a.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(a.id)}
                                        onChange={() => onToggle(a.id)}
                                    />
                                    {a.name}
                                </label>
                            ))}
                        </div>
                    </ScrollArea>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

export { ActorDropdownFilter };
