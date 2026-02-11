"use server";

import { prisma } from "@/lib/prisma";
import { movieSchema } from "@/lib/validations/movie";
import { Prisma, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type MovieActionState =
    | { ok: true }
    | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

function readGenreIds(formData: FormData): number[] {
  return formData
    .getAll("genres")
    .map((v) => Number(v))
    .filter((n) => Number.isInteger(n) && n > 0);
}

function readPersonIds(formData: FormData, key: "actors" | "directors"): number[] {
    return formData
        .getAll(key)
        .map((v) => Number(v))
        .filter((n) => Number.isInteger(n) && n > 0);
}

//  CREATE
export async function createMovie(
    _prevState: MovieActionState,
    formData: FormData,
): Promise<MovieActionState> {
    const raw = Object.fromEntries(formData);
    const parsed = movieSchema.safeParse(raw);

    if (!parsed.success) {
        const flattened = parsed.error.flatten();
        return {
            ok: false,
            message: "Please fix the highlighted fields.",
            fieldErrors: flattened.fieldErrors,
        };
    }

    const genreIds = readGenreIds(formData);
    const actorIds = readPersonIds(formData, "actors");
    const directorIds = readPersonIds(formData, "directors");

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

    if (genreIds.length > 0) {
        await prisma.movieGenre.createMany({
            data: genreIds.map((genreId) => ({ movieId: movie.id, genreId })),
            skipDuplicates: true,
        });
    }

    const moviePeople = [
        ...actorIds.map((personId) => ({
            movieId: movie.id,
            personId,
            role: Role.ACTOR as Role,
        })),
        ...directorIds.map((personId) => ({
            movieId: movie.id,
            personId,
            role: Role.DIRECTOR as Role,
        })),
    ];

    if (moviePeople.length > 0) {
        await prisma.moviePerson.createMany({
            data: moviePeople,
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
    _prevState: MovieActionState,
    formData: FormData,
): Promise<MovieActionState> {
    const raw = Object.fromEntries(formData);
    const parsed = movieSchema.safeParse(raw);

    if (!parsed.success) {
        const flattened = parsed.error.flatten();
        return {
            ok: false,
            message: "Please fix the highlighted fields.",
            fieldErrors: flattened.fieldErrors,
        };
    }

    const genreIds = readGenreIds(formData);
    const actorIds = readPersonIds(formData, "actors");
    const directorIds = readPersonIds(formData, "directors");

    const moviePeople = [
        ...actorIds.map((personId) => ({
            movieId: id,
            personId,
            role: Role.ACTOR as Role,
        })),
        ...directorIds.map((personId) => ({
            movieId: id,
            personId,
            role: Role.DIRECTOR as Role,
        })),
    ];

    await prisma.$transaction([
        prisma.movie.update({
            where: { id },
            data: {
                ...parsed.data,
                price: new Prisma.Decimal(parsed.data.price),
            },
        }),

        // Replace genres
        prisma.movieGenre.deleteMany({ where: { movieId: id } }),
        ...(genreIds.length > 0
            ? [
                  prisma.movieGenre.createMany({
                      data: genreIds.map((genreId) => ({ movieId: id, genreId })),
                      skipDuplicates: true,
                  }),
              ]
            : []),

        // Replace people roles
        prisma.moviePerson.deleteMany({ where: { movieId: id } }),
        ...(moviePeople.length > 0
            ? [
                  prisma.moviePerson.createMany({
                      data: moviePeople,
                      skipDuplicates: true,
                  }),
              ]
            : []),
    ]);

  revalidatePath("/admin/movies");
  revalidatePath("/movies");
  redirect("/admin/movies");
}

//  DELETE (delete can stay void)
export async function deleteMovie(id: number): Promise<void> {
    await prisma.moviePerson.deleteMany({ where: { movieId: id } });
    await prisma.movieGenre.deleteMany({ where: { movieId: id } });

  await prisma.movieGenre.deleteMany({ where: { movieId: id } });

  await prisma.movie.delete({ where: { id } });

  revalidatePath("/admin/movies");
  revalidatePath("/movies");
}
