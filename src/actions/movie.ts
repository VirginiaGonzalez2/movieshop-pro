"use server";

import { prisma } from "@/lib/prisma";
import { movieSchema } from "@/lib/validations/movie";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

// CREATE MOVIE
export async function createMovie(formData: FormData) {
  const data = Object.fromEntries(formData);

  const parsed = movieSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  await prisma.movie.create({
    data: {
      ...parsed.data,
      price: new Prisma.Decimal(parsed.data.price), // required for Decimal
    },
  });

  revalidatePath("/admin/movies");
  return { success: true };
}

// UPDATE MOVIE
export async function updateMovie(id: number, formData: FormData) {
  const data = Object.fromEntries(formData);

  const parsed = movieSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  await prisma.movie.update({
    where: { id },
    data: {
      ...parsed.data,
      price: new Prisma.Decimal(parsed.data.price),
    },
  });

  revalidatePath("/admin/movies");
  return { success: true };
}

// DELETE MOVIE
export async function deleteMovie(id: number) {
  await prisma.movie.delete({
    where: { id },
  });

  revalidatePath("/admin/movies");
}
