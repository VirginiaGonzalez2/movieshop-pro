"use server";

import { prisma } from "@/lib/prisma";
import { movieSchema } from "@/lib/validations/movie";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

//read genreIds

function readGenreIds(formData: FormData): number[] {
  return formData
    .getAll("genres")
    .map((v) => Number(v))
    .filter((n) => Number.isInteger(n) && n > 0);
}

//  CREATE
export async function createMovie(formData: FormData): Promise<void> {
  const raw = Object.fromEntries(formData);
  const parsed = movieSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  const genreIds = readGenreIds(formData);

  const movie = await prisma.movie.create({
    data: {
      ...parsed.data,
      price: new Prisma.Decimal(parsed.data.price),
    },
  });

  if (genreIds.length > 0) {
    await prisma.movieGenre.createMany({
      data: genreIds.map((genreId) => ({ movieId: movie.id, genreId })),
      skipDuplicates: true,
    });
  }

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

  const genreIds = readGenreIds(formData);

  await prisma.$transaction([
    prisma.movie.update({
      where: { id },
      data: {
        ...parsed.data,
        price: new Prisma.Decimal(parsed.data.price),
      },
    }),

    prisma.movieGenre.deleteMany({
      where: { movieId: id },
    }),

    ...(genreIds.length > 0
      ? [
          prisma.movieGenre.createMany({
            data: genreIds.map((genreId) => ({ movieId: id, genreId })),
            skipDuplicates: true,
          }),
        ]
      : []),
  ]);

  revalidatePath("/admin/movies");
  revalidatePath("/movies");
  redirect("/admin/movies");
}

//  DELETE
export async function deleteMovie(id: number): Promise<void> {

  await prisma.movieGenre.deleteMany({ where: { movieId: id } });

  await prisma.movie.delete({ where: { id } });

  revalidatePath("/admin/movies");
  revalidatePath("/movies");
}
