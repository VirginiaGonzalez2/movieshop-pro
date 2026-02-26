"use server";

import { prisma } from "@/lib/prisma";
import { movieSchema } from "@/lib/validations/movie";
import { Prisma, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { savePublicUpload } from "@/lib/upload";

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

function normalizeString(value: string | undefined): string | null {
    if (!value) return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

// Accept Zod's real issue shape (path can include symbol/PropertyKey)
function zodToFieldErrors(
    issues: { path: PropertyKey[]; message: string }[],
): Record<string, string[]> {
    const fieldErrors: Record<string, string[]> = {};

    for (const issue of issues) {
        const first = issue.path?.[0];
        const key = typeof first === "string" || typeof first === "number" ? String(first) : "form";

        fieldErrors[key] = fieldErrors[key] ?? [];
        fieldErrors[key].push(issue.message);
    }

    return fieldErrors;
}

// CREATE (for useActionState)
export async function createMovie(
    prevState: MovieActionState,
    formData: FormData,
): Promise<MovieActionState> {
    const raw = Object.fromEntries(formData);
    const parsed = movieSchema.safeParse(raw);

    if (!parsed.success) {
        return {
            ok: false,
            message: "Please fix the errors below.",
            fieldErrors: zodToFieldErrors(parsed.error.issues),
        };
    }

    try {
        const genreIds = readGenreIds(formData);
        const actorIds = readPersonIds(formData, "actors");
        const directorIds = readPersonIds(formData, "directors");

        const imageFile = formData.get("image");
        const uploadedPath =
            imageFile instanceof File && imageFile.size > 0
                ? await savePublicUpload(imageFile)
                : "";

        const movie = await prisma.movie.create({
            data: {
                ...parsed.data,
                price: new Prisma.Decimal(parsed.data.price),
                imageUrl: uploadedPath || normalizeString(parsed.data.imageUrl) || null,
                trailerUrl: normalizeString(parsed.data.trailerUrl) || null,
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
    } catch (e) {
        console.error(e);
        return { ok: false, message: "Failed to create movie. Please try again." };
    }
}

// UPDATE (for useActionState)
export async function updateMovie(
    id: number,
    prevState: MovieActionState,
    formData: FormData,
): Promise<MovieActionState> {
    const raw = Object.fromEntries(formData);
    const parsed = movieSchema.safeParse(raw);

    if (!parsed.success) {
        return {
            ok: false,
            message: "Please fix the errors below.",
            fieldErrors: zodToFieldErrors(parsed.error.issues),
        };
    }

    try {
        const genreIds = readGenreIds(formData);
        const actorIds = readPersonIds(formData, "actors");
        const directorIds = readPersonIds(formData, "directors");

        const imageFile = formData.get("image");
        const uploadedPath =
            imageFile instanceof File && imageFile.size > 0
                ? await savePublicUpload(imageFile)
                : "";

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
                    imageUrl: uploadedPath || normalizeString(parsed.data.imageUrl) || null,
                    trailerUrl: normalizeString(parsed.data.trailerUrl) || null,
                },
            }),

            prisma.movieGenre.deleteMany({ where: { movieId: id } }),
            ...(genreIds.length > 0
                ? [
                      prisma.movieGenre.createMany({
                          data: genreIds.map((genreId) => ({ movieId: id, genreId })),
                          skipDuplicates: true,
                      }),
                  ]
                : []),

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
        revalidatePath(`/admin/movies/${id}/edit`);

        return { ok: true };
    } catch (e) {
        console.error(e);
        return { ok: false, message: "Failed to update movie. Please try again." };
    }
}

// DELETE
export async function deleteMovie(id: number): Promise<void> {
    await prisma.moviePerson.deleteMany({ where: { movieId: id } });
    await prisma.movieGenre.deleteMany({ where: { movieId: id } });

    await prisma.movie.delete({ where: { id } });

    revalidatePath("/admin/movies");
    revalidatePath("/movies");
}
