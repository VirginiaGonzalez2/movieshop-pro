"use server";

import { requireAdminArea } from "@/lib/admin-rbac";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { personSchema } from "@/lib/validations/person";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function revalidatePersonRelatedPaths() {
    revalidatePath("/");
    revalidatePath("/home");
    revalidatePath("/movies");
    revalidatePath("/people");
    revalidatePath("/search");
    revalidatePath("/admin/people");
    revalidatePath("/admin/movies");
}

export async function createPerson(formData: FormData): Promise<void> {
    await requireAdminArea("people");

    const raw = Object.fromEntries(formData);
    const parsed = personSchema.safeParse(raw);

    if (!parsed.success) {
        throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
    }

    await prisma.person.create({
        data: {
            name: parsed.data.name,
            bio: parsed.data.bio || null,
        },
    });

    revalidatePersonRelatedPaths();
    redirect("/admin/people");
}

export async function updatePerson(id: number, formData: FormData): Promise<void> {
    await requireAdminArea("people");

    const raw = Object.fromEntries(formData);
    const parsed = personSchema.safeParse(raw);

    if (!parsed.success) {
        throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
    }

    await prisma.person.update({
        where: { id },
        data: {
            name: parsed.data.name,
            bio: parsed.data.bio || null,
        },
    });

    revalidatePersonRelatedPaths();
    redirect("/admin/people");
}

export async function deletePerson(id: number): Promise<void> {
    await requireAdminArea("people");

    await prisma.moviePerson.deleteMany({ where: { personId: id } });
    await prisma.person.delete({ where: { id } });

    revalidatePersonRelatedPaths();
}

export async function updatePersonMovieRole(
    personId: number,
    movieId: number,
    formData: FormData,
): Promise<void> {
    await requireAdminArea("people");

    const nextRoleRaw = String(formData.get("role") ?? "");
    const previousRoleRaw = String(formData.get("previousRole") ?? "");

    if (!Object.values(Role).includes(nextRoleRaw as Role)) {
        throw new Error("Invalid role");
    }

    if (!Object.values(Role).includes(previousRoleRaw as Role)) {
        throw new Error("Invalid previous role");
    }

    const nextRole = nextRoleRaw as Role;
    const previousRole = previousRoleRaw as Role;

    if (nextRole === previousRole) {
        return;
    }

    await prisma.$transaction(async (tx) => {
        const existingTarget = await tx.moviePerson.findUnique({
            where: {
                movieId_personId_role: {
                    movieId,
                    personId,
                    role: nextRole,
                },
            },
            select: { movieId: true },
        });

        await tx.moviePerson.delete({
            where: {
                movieId_personId_role: {
                    movieId,
                    personId,
                    role: previousRole,
                },
            },
        });

        if (!existingTarget) {
            await tx.moviePerson.create({
                data: {
                    movieId,
                    personId,
                    role: nextRole,
                },
            });
        }
    });

    revalidatePersonRelatedPaths();
    revalidatePath(`/admin/people/${personId}/edit`);
    revalidatePath(`/admin/movies/${movieId}/edit`);
    revalidatePath(`/movies/${movieId}`);
}

export async function connectPersonToMovieRole(personId: number, formData: FormData): Promise<void> {
    await requireAdminArea("people");

    const movieId = Number(formData.get("movieId"));
    const roleRaw = String(formData.get("role") ?? "");

    if (!Number.isInteger(movieId) || movieId <= 0) {
        throw new Error("Invalid movie");
    }

    if (!Object.values(Role).includes(roleRaw as Role)) {
        throw new Error("Invalid role");
    }

    const role = roleRaw as Role;

    await prisma.moviePerson.upsert({
        where: {
            movieId_personId_role: {
                movieId,
                personId,
                role,
            },
        },
        update: {},
        create: {
            movieId,
            personId,
            role,
        },
    });

    revalidatePersonRelatedPaths();
    revalidatePath(`/admin/people/${personId}/edit`);
    revalidatePath(`/admin/movies/${movieId}/edit`);
    revalidatePath(`/movies/${movieId}`);
}
