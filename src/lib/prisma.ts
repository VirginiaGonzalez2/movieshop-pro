import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

// Create Prisma adapter for Neon using DATABASE_URL
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
})

// Prevent multiple Prisma instances during development and serverless execution
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Create Prisma client only once
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
    })

// Store Prisma instance globally in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
