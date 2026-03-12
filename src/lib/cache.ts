import { cache } from "react"

/**
 * Utility helper for caching server-side data functions
 * in Next.js App Router.
 *
 * This helps prevent repeated database queries
 * when the same data is requested multiple times.
 */
export const cached = cache
