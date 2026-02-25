"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

// Genres
export async function getGenres() {
    return prisma.genre.findMany({
        orderBy: { name: "asc" },
    });
}

// People by role (director/actor)
export async function getPeopleByRole(role: Role) {
    return prisma.person.findMany({
        where: {
            movies: {
                // ✅ EXACTAMENTE como está en schema
                some: {
                    role: role, // enum Role
                },
            },
        },
        select: {
            id: true,
            name: true,
        },
        orderBy: { name: "asc" },
    });
}

// Directors
export async function getDirectors() {
    return getPeopleByRole(Role.DIRECTOR);
}

// Actors
export async function getActors() {
    return getPeopleByRole(Role.ACTOR);
}
