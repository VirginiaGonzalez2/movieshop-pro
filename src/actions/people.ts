"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function getPeopleByRole(role: Role) {
    return prisma.person.findMany({
        where: {
            movies: {
                some: { role },
            },
        },
        orderBy: { name: "asc" },
    });
}

export async function getDirectors() {
    return getPeopleByRole(Role.DIRECTOR);
}

export async function getActors() {
    return getPeopleByRole(Role.ACTOR);
}
