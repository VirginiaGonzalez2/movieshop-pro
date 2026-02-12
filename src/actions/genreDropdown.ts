"use server";

import { redirect } from "next/navigation";

export async function toggleGenre(id: string, current: string[])
{
  const set = new Set(current);

  if (set.has(id))
    set.delete(id);
  else
    set.add(id);

  const params = new URLSearchParams();

  if (set.size > 0)
    params.set("genres", Array.from(set).join(","));

  // Change after use in IRL
  redirect(`/test?{params.toString()}`);
}