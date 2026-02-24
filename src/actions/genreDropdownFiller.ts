"use server";

import { prisma } from "@/lib/prisma";

export async function getGenres() {
  return prisma.genre.findMany({
    orderBy: { name: "asc" }
  });
}