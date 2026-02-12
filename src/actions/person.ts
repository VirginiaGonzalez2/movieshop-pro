"use server";

import { prisma } from "@/lib/prisma";
import { personSchema } from "@/lib/validations/person";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPerson(formData: FormData): Promise<void> {
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

    revalidatePath("/admin/people");
    redirect("/admin/people");
}

export async function updatePerson(id: number, formData: FormData): Promise<void> {
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

    revalidatePath("/admin/people");
    redirect("/admin/people");
}

export async function deletePerson(id: number): Promise<void> {
    await prisma.moviePerson.deleteMany({ where: { personId: id } });
    await prisma.person.delete({ where: { id } });

    revalidatePath("/admin/people");
}
