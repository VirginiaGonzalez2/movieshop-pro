import "dotenv/config"
import { prisma } from "./src/lib/prisma"

async function test() {
  try {
    console.log("Testing Prisma connection...")

    await prisma.$connect()
    console.log("✅ Database connected successfully")

    const movieCount = await prisma.movie.count()
    console.log("🎬 Movies in database:", movieCount)

  } catch (error) {
    console.error("❌ Prisma error:")
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

test()

