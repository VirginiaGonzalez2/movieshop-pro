"use server";

import { redirect, RedirectType } from "next/navigation";

export async function toggleDirector(id: string, current: string[], pathname: string) {
    const set = new Set(current);

    if (set.has(id))
        set.delete(id);
    else
        set.add(id);

    const params = new URLSearchParams();

    if (set.size > 0)
        params.set("genres", Array.from(set).join(","));

    // Should be removed later
    console.log("SERVER ACTION FIRED AS IT SHOULD!", id, current)

    // Change after use in IRL
    redirect(`${pathname}?${params.toString()}`, RedirectType.replace);
}