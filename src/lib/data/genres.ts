import { prisma } from "@/lib/prisma"
import { cached } from "@/lib/cache"

/**
 * Cached query for fetching genres.
 * Genres rarely change, so caching improves performance.
 */
export const getGenres = cached(async () => {
  return prisma.genre.findMany({
    orderBy: {
      name: "asc"
    }
  })
})
