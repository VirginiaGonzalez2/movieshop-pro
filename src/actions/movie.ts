"use server";

import { prisma } from "@/lib/prisma";
import { movieSchema } from "@/lib/validations/movie";
import { Prisma, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { savePublicUpload } from "@/lib/upload";

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

function normalizeImageUrl(value: string | undefined): string | null {
    if (!value) return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

//  CREATE
export async function createMovie(formData: FormData): Promise<void> {
    const raw = Object.fromEntries(formData);
    const parsed = movieSchema.safeParse(raw);

    if (!parsed.success) {
        throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
    }

    const genreIds = readGenreIds(formData);
    const actorIds = readPersonIds(formData, "actors");
    const directorIds = readPersonIds(formData, "directors");

    // image upload 
    const imageFile = formData.get("image");
    const uploadedPath =
        imageFile instanceof File && imageFile.size > 0 ? await savePublicUpload(imageFile) : "";

    const movie = await prisma.movie.create({
        data: {
            ...parsed.data,
            price: new Prisma.Decimal(parsed.data.price),
            rating: parsed.data.rating ?? 0,
            imageUrl: uploadedPath || normalizeImageUrl(parsed.data.imageUrl) || null,
        },
    });

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
export async function updateMovie(id: number, formData: FormData): Promise<void> {
    const raw = Object.fromEntries(formData);
    const parsed = movieSchema.safeParse(raw);

    if (!parsed.success) {
        throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
    }

    const genreIds = readGenreIds(formData);
    const actorIds = readPersonIds(formData, "actors");
    const directorIds = readPersonIds(formData, "directors");

    // image upload
    const imageFile = formData.get("image");
    const uploadedPath =
        imageFile instanceof File && imageFile.size > 0 ? await savePublicUpload(imageFile) : "";

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
                rating: parsed.data.rating ?? 0,
                imageUrl: uploadedPath || normalizeImageUrl(parsed.data.imageUrl) || null,
            },
        }),

        // genres
        prisma.movieGenre.deleteMany({ where: { movieId: id } }),
        ...(genreIds.length > 0
            ? [
                  prisma.movieGenre.createMany({
                      data: genreIds.map((genreId) => ({ movieId: id, genreId })),
                      skipDuplicates: true,
                  }),
              ]
            : []),

        // people roles
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

//  DELETE
export async function deleteMovie(id: number): Promise<void> {
    await prisma.moviePerson.deleteMany({ where: { movieId: id } });
    await prisma.movieGenre.deleteMany({ where: { movieId: id } });

    await prisma.movie.delete({ where: { id } });

    revalidatePath("/admin/movies");
    revalidatePath("/movies");
}
