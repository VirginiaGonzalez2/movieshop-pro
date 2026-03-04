const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const recentRows = await prisma.movie.findMany({
    orderBy: { releaseDate: "desc" },
    take: 5,
    select: { title: true },
  });

  const oldestRows = await prisma.movie.findMany({
    orderBy: { releaseDate: "asc" },
    take: 5,
    select: { title: true },
  });

  const cheapestRows = await prisma.movie.findMany({
    orderBy: { price: "asc" },
    take: 5,
    select: { title: true },
  });

  const topSelling = await prisma.orderItem.groupBy({
    by: ["movieId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
  });

  const movieIdsInOrder = topSelling.map((row) => row.movieId);

  const purchasedRows = await prisma.movie.findMany({
    where: { id: { in: movieIdsInOrder } },
    select: { id: true, title: true },
  });

  const purchasedMap = new Map(purchasedRows.map((row) => [row.id, row.title]));

  const topPurchased = movieIdsInOrder
    .map((id) => purchasedMap.get(id))
    .filter(Boolean)
    .slice(0, 5);

  const recent = recentRows.map((row) => row.title);
  const oldest = oldestRows.map((row) => row.title);
  const cheapest = cheapestRows.map((row) => row.title);

  const all20 = [...recent, ...topPurchased, ...oldest, ...cheapest];

  console.log(JSON.stringify({ recent, topPurchased, oldest, cheapest, all20 }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
