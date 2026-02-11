"use server";

import { prisma } from "@/lib/prisma";
import { genreSchema } from "@/lib/validations/genre";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// CREATE
export async function createGenre(formData: FormData): Promise<void> {
  const raw = Object.fromEntries(formData);
  const parsed = genreSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  await prisma.genre.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
    },
  });

  revalidatePath("/admin/genres");
  redirect("/admin/genres");
}

// UPDATE
export async function updateGenre(
  id: number,
  formData: FormData,
): Promise<void> {
  const raw = Object.fromEntries(formData);
  const parsed = genreSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  await prisma.genre.update({
    where: { id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
    },
  });

  revalidatePath("/admin/genres");
  redirect("/admin/genres");
}

// DELETE
export async function deleteGenre(id: number): Promise<void> {
  await prisma.movieGenre.deleteMany({ where: { genreId: id } });
  await prisma.genre.delete({ where: { id } });

  revalidatePath("/admin/genres");
}
