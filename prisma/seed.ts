import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL in .env file");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type SeedMovie = {
  title: string;
  year: number;
  genre: string;
  director: string;
  actor: string;
  rating: number;
  price: number;
  runtime: number;
  image: string;
};

const genres = [
  "Action",
  "Drama",
  "Sci-Fi",
  "Romance",
  "Animation",
  "Thriller",
];

const movies: SeedMovie[] = [
  { title: "The Dark Knight", year: 2008, genre: "Action", director: "Christopher Nolan", actor: "Christian Bale", rating: 5, price: 19.99, runtime: 152, image: "/images/the_dark_knight.jpeg" },
  { title: "Inception", year: 2010, genre: "Sci-Fi", director: "Christopher Nolan", actor: "Leonardo DiCaprio", rating: 5, price: 17.99, runtime: 148, image: "/images/inception.jpeg" },
  { title: "Interstellar", year: 2014, genre: "Sci-Fi", director: "Christopher Nolan", actor: "Matthew McConaughey", rating: 5, price: 18.99, runtime: 169, image: "/images/interstellar.jpeg" },
  { title: "Parasite", year: 2019, genre: "Drama", director: "Bong Joon-ho", actor: "Song Kang-ho", rating: 5, price: 14.99, runtime: 132, image: "/images/parasite.jpeg" },
  { title: "The Matrix", year: 1999, genre: "Sci-Fi", director: "Lana Wachowski", actor: "Keanu Reeves", rating: 5, price: 13.99, runtime: 136, image: "/images/the_matrix.jpeg" },
  { title: "Joker", year: 2019, genre: "Drama", director: "Todd Phillips", actor: "Joaquin Phoenix", rating: 4, price: 12.99, runtime: 122, image: "/images/joker.jpeg" },
  { title: "Her", year: 2013, genre: "Drama", director: "Spike Jonze", actor: "Joaquin Phoenix", rating: 4, price: 11.99, runtime: 126, image: "/images/her.jpeg" },
  { title: "Coco", year: 2017, genre: "Animation", director: "Lee Unkrich", actor: "Anthony Gonzalez", rating: 4, price: 9.99, runtime: 105, image: "/images/coco.jpeg" },
  { title: "Blade Runner 2049", year: 2017, genre: "Sci-Fi", director: "Denis Villeneuve", actor: "Ryan Gosling", rating: 4, price: 15.99, runtime: 164, image: "/images/blade_runner_2049.jpeg" },
  { title: "Casablanca", year: 1942, genre: "Romance", director: "Michael Curtiz", actor: "Humphrey Bogart", rating: 5, price: 8.99, runtime: 102, image: "/images/casablanca.jpeg" },
  { title: "La La Land", year: 2016, genre: "Romance", director: "Damien Chazelle", actor: "Emma Stone", rating: 4, price: 13.49, runtime: 128, image: "/images/la_la_land.jpeg" },
  { title: "Moonlight", year: 2016, genre: "Drama", director: "Barry Jenkins", actor: "Trevante Rhodes", rating: 4, price: 10.49, runtime: 111, image: "/images/moonlight.jpeg" },
];

function buildReleaseDate(year: number) {
  return new Date(`${year}-01-01`);
}

async function getOrCreatePerson(name: string) {
  const existing = await prisma.person.findFirst({
    where: { name },
  });

  if (existing) return existing;

  return prisma.person.create({
    data: { name },
  });
}

async function main() {
  console.log("🌱 Starting FULL seed...");

  // Create genres
  for (const name of genres) {
    await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const allGenres = await prisma.genre.findMany({
    where: { name: { in: genres } },
  });

  const genreByName = new Map(allGenres.map(g => [g.name, g.id]));

  // Ensure user exists
  await prisma.user.upsert({
    where: { id: "user-1" },
    update: { updatedAt: new Date() },
    create: {
      id: "user-1",
      name: "Test User",
      email: "test@example.com",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  /* ---------------- MOVIES + RELATIONS ---------------- */

  for (const m of movies) {
    const genreId = genreByName.get(m.genre);
    if (!genreId) throw new Error(`Missing genre ${m.genre}`);

    const [director, actor] = await Promise.all([
      getOrCreatePerson(m.director),
      getOrCreatePerson(m.actor),
    ]);

    const releaseDate = buildReleaseDate(m.year);

    let movie = await prisma.movie.findFirst({
      where: { title: m.title, releaseDate },
    });

    if (!movie) {
      movie = await prisma.movie.create({
        data: {
          title: m.title,
          description: `${m.title} description.`,
          price: m.price,
          releaseDate,
          runtime: m.runtime,
          stock: 20,
          imageUrl: m.image,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    await prisma.movieGenre.upsert({
      where: {
        movieId_genreId: { movieId: movie.id, genreId },
      },
      update: {},
      create: { movieId: movie.id, genreId },
    });

    await prisma.moviePerson.upsert({
      where: {
        movieId_personId_role: {
          movieId: movie.id,
          personId: director.id,
          role: "DIRECTOR",
        },
      },
      update: {},
      create: {
        movieId: movie.id,
        personId: director.id,
        role: "DIRECTOR",
      },
    });

    await prisma.moviePerson.upsert({
      where: {
        movieId_personId_role: {
          movieId: movie.id,
          personId: actor.id,
          role: "ACTOR",
        },
      },
      update: {},
      create: {
        movieId: movie.id,
        personId: actor.id,
        role: "ACTOR",
      },
    });

    await prisma.movieRating.upsert({
      where: {
        movieId_userId: {
          movieId: movie.id,
          userId: "user-1",
        },
      },
      update: { value: m.rating },
      create: {
        movieId: movie.id,
        userId: "user-1",
        value: m.rating,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  /* ---------------- FAKE PURCHASE DATA ---------------- */

  // Create a single completed order for the test user
  // This enables TopPurchasedMoviesSection to work
  const order = await prisma.order.create({
    data: {
      userId: "user-1",
      status: "COMPLETED",
      totalAmount: 0,
      orderDate: new Date(),
    },
  });

  // Create order items with deterministic quantities
  // Higher index = lower quantity (so ranking is visible)
  for (let i = 0; i < movies.length; i++) {
    const movie = await prisma.movie.findFirst({
      where: { title: movies[i].title },
    });

    if (!movie) continue;

    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        movieId: movie.id,
        priceAtPurchase: movie.price,
        quantity: movies.length - i, // descending quantity for ranking
      },
    });
  }

  console.log("🎉 FULL dataset with purchase data created successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });