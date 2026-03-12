import { prisma } from "@/lib/prisma"
import { cached } from "@/lib/cache"

/**
 * Cached query for fetching all movies.
 * Reduces repeated database calls across requests.
 */
export const getMovies = cached(async () => {
  return prisma.movie.findMany({
    include: {
      genres: true
    }
  })
})

/**
 * Cached query for fetching featured movies.
 */
export const getFeaturedMovies = cached(async () => {
  return prisma.movie.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc"
    }
  })
})
