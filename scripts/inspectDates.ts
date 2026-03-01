/*
  scripts/inspectDates.ts
  Quick utility to inspect movie releaseDate values in the DB.
*/
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const movies = await prisma.movie.findMany({ orderBy: { id: "asc" }, take: 50 });
  for (const m of movies) {
    console.log(`id=${m.id} title=${m.title} releaseDate=${m.releaseDate?.toISOString()} local=${m.releaseDate}`);
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
