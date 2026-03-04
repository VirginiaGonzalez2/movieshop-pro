const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const movies = await prisma.movie.findMany({
    select: { title: true, imageUrl: true },
    orderBy: { title: "asc" },
  });

  const noImageUrl = movies
    .filter((movie) => !movie.imageUrl || !movie.imageUrl.trim())
    .map((movie) => movie.title);

  const missingImageFile = movies
    .filter((movie) => movie.imageUrl && movie.imageUrl.trim())
    .filter((movie) => {
      const relative = movie.imageUrl.replace(/^\/+/, "");
      const filePath = path.join(process.cwd(), "public", relative);
      return !fs.existsSync(filePath);
    })
    .map((movie) => movie.title);

  console.log(JSON.stringify({ noImageUrl, missingImageFile }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
