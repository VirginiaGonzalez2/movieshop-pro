"use server";

import { prisma } from "@/lib/prisma";
import { movieSchema } from "@/lib/validations/movie";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

//  CREATE
export async function createMovie(formData: FormData): Promise<void> {
  const raw = Object.fromEntries(formData);
  const parsed = movieSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  await prisma.movie.create({
    data: {
      ...parsed.data,
      price: new Prisma.Decimal(parsed.data.price),
    },
  });

  revalidatePath("/admin/movies");
  revalidatePath("/movies");
  redirect("/admin/movies"); 
}

//  UPDATE
export async function updateMovie(
  id: number,
  formData: FormData,
): Promise<void> {
  const raw = Object.fromEntries(formData);
  const parsed = movieSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  await prisma.movie.update({
    where: { id },
    data: {
      ...parsed.data,
      price: new Prisma.Decimal(parsed.data.price),
    },
  });

  revalidatePath("/admin/movies");
  revalidatePath("/movies");
  redirect("/admin/movies");
}

//  DELETE
export async function deleteMovie(id: number): Promise<void> {
  await prisma.movie.delete({ where: { id } });

  revalidatePath("/admin/movies");
  revalidatePath("/movies");
}
