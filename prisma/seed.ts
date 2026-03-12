import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// --- Database connection setup for Neon ---
// We explicitly pass DATABASE_URL to the PrismaPg adapter
// so Prisma connects correctly to Neon Postgres.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString,
  }),
});

// --- Types ---
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
  trailerUrl?: string;
};

// --- Static Data ---
const genres = [
  { name: "Action", description: "Fast-paced movies with intense sequences and high-stakes conflict." },
  { name: "Animation", description: "Animated stories for all ages." },
  { name: "Comedy", description: "Lighthearted films designed to entertain through humor." },
  { name: "Drama", description: "Character-driven stories focused on emotion." },
  { name: "Romance", description: "Love-centered stories exploring relationships." },
  { name: "Sci-Fi", description: "Speculative films featuring futuristic technology." },
  { name: "Thriller", description: "Suspenseful movies built around tension and twists." },
];

// --- Movies dataset ---
const movies: SeedMovie[] = [
  { title: "The Dark Knight", year: 2008, genre: "Action", director: "Christopher Nolan", actor: "Christian Bale", rating: 5, price: 19.99, runtime: 152, image: "/images/the_dark_knight.jpeg", trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY" },
  { title: "Inception", year: 2010, genre: "Sci-Fi", director: "Christopher Nolan", actor: "Leonardo DiCaprio", rating: 5, price: 17.99, runtime: 148, image: "/images/inception.jpeg", trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0" },
  { title: "Interstellar", year: 2014, genre: "Sci-Fi", director: "Christopher Nolan", actor: "Matthew McConaughey", rating: 5, price: 18.99, runtime: 169, image: "/images/interstellar.jpeg", trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E" },
];

// --- Helper Functions ---
function buildReleaseDate(year: number) {
  return new Date(`${year}-01-01`);
}

function buildShortEnglishDescription(movie: SeedMovie) {
  return `${movie.title} is a ${movie.genre.toLowerCase()} feature directed by ${movie.director}.`;
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

// --- Main Seed Logic ---
async function main() {
  console.log("🌱 Starting FULL seed...");

  // Create genres
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { name: genre.name },
      update: {},
      create: genre,
    });
  }

  const allGenres = await prisma.genre.findMany();
  const genreByName = new Map(allGenres.map(g => [g.name, g.id]));

  // Create movies
  for (const m of movies) {
    const genreId = genreByName.get(m.genre);

    if (!genreId) continue;

    const [director, actor] = await Promise.all([
      getOrCreatePerson(m.director),
      getOrCreatePerson(m.actor),
    ]);

    const movie = await prisma.movie.create({
      data: {
        title: m.title,
        description: buildShortEnglishDescription(m),
        price: m.price,
        runtime: m.runtime,
        releaseDate: buildReleaseDate(m.year),
        imageUrl: m.image,
        trailerUrl: m.trailerUrl ?? null,
        stock: 20,
      },
    });

    await prisma.movieGenre.create({
      data: {
        movieId: movie.id,
        genreId,
      },
    });

    await prisma.moviePerson.createMany({
      data: [
        { movieId: movie.id, personId: director.id, role: "DIRECTOR" },
        { movieId: movie.id, personId: actor.id, role: "ACTOR" },
      ],
    });
  }

  console.log("🎉 FULL dataset created successfully.");
}

// --- Run Seed ---
main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });