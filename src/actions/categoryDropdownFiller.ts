"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

// Genres
export async function getGenres() {
    const genres = await prisma.genre.findMany({
        orderBy: { name: "asc" }
  });

  return genres;
}

// People by role (director/actor)
export async function getPeopleByRole(role: Role)
{
    const persons = await prisma.person.findMany({
        where: {
            movies:     {
                some:   { role }
            }
        },
        orderBy: { name: "asc" }
    });

    return persons;
}

export async function getDirectors()
{
    return getPeopleByRole(Role.DIRECTOR);
}

export async function getActors()
{
    return getPeopleByRole(Role.ACTOR);
}