"use server";

import { prisma } from "@/lib/prisma";

// Genres
export async function getGenres() {
    return prisma.genre.findMany({
        orderBy: { name: "asc" },
    });
}

// People by role (director/actor)
export async function getPeopleByRole() {
    return prisma.person.findMany({
        where: {
            movies: {
                some: {},
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
    return prisma.person.findMany({
        where: {
            movies: {
                some: {
                    role: "DIRECTOR"
                }
            }
        },
        select: {
            id: true,
            name: true,
        },
        orderBy: { name: "asc" },
    });
}

// Actors
export async function getActors() {
    return prisma.person.findMany({
        where: {
            movies: {
                some: {
                    role: "ACTOR"
                }
            }
        },
        select: {
            id: true,
            name: true,
        },
        orderBy: { name: "asc" },
    });
}
