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
  trailerUrl?: string;
};

const genres = [
  {
    name: "Action",
    description: "Fast-paced movies with intense sequences and high-stakes conflict.",
  },
  {
    name: "Animation",
    description: "Animated stories for all ages, from family adventures to mature themes.",
  },
  {
    name: "Comedy",
    description: "Lighthearted films designed to entertain through humor and wit.",
  },
  {
    name: "Drama",
    description: "Character-driven stories focused on emotion, conflict, and realism.",
  },
  {
    name: "Romance",
    description: "Love-centered stories exploring relationships and emotional connection.",
  },
  {
    name: "Sci-Fi",
    description: "Speculative films featuring futuristic technology, science, or space themes.",
  },
  {
    name: "Thriller",
    description: "Suspenseful movies built around tension, danger, and twists.",
  },
];

const movies: SeedMovie[] = [
  { title: "The Dark Knight", year: 2008, genre: "Action", director: "Christopher Nolan", actor: "Christian Bale", rating: 5, price: 19.99, runtime: 152, image: "/images/the_dark_knight.jpeg", trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY" },
  { title: "Inception", year: 2010, genre: "Sci-Fi", director: "Christopher Nolan", actor: "Leonardo DiCaprio", rating: 5, price: 17.99, runtime: 148, image: "/images/inception.jpeg", trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0" },
  { title: "Interstellar", year: 2014, genre: "Sci-Fi", director: "Christopher Nolan", actor: "Matthew McConaughey", rating: 5, price: 18.99, runtime: 169, image: "/images/interstellar.jpeg", trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E" },
  { title: "A Quiet Place", year: 2018, genre: "Thriller", director: "John Krasinski", actor: "Emily Blunt", rating: 4, price: 14.49, runtime: 90, image: "/images/a_quiet_place.jpeg", trailerUrl: "https://www.youtube.com/watch?v=WR7cc5t7tv8" },
  { title: "Everything Everywhere All at Once", year: 2022, genre: "Sci-Fi", director: "Daniel Kwan", actor: "Michelle Yeoh", rating: 5, price: 18.49, runtime: 139, image: "/images/everything_everywhere_all_at_once.jpeg", trailerUrl: "https://www.youtube.com/watch?v=wxN1T1uxQ2g" },
  { title: "Knives Out", year: 2019, genre: "Thriller", director: "Rian Johnson", actor: "Daniel Craig", rating: 4, price: 13.99, runtime: 130, image: "/images/knives_out.jpeg", trailerUrl: "https://www.youtube.com/watch?v=qGqiHJTsRkQ" },
  { title: "Lady Bird", year: 2017, genre: "Drama", director: "Greta Gerwig", actor: "Saoirse Ronan", rating: 4, price: 11.99, runtime: 94, image: "/images/lady_bird.jpeg", trailerUrl: "https://www.youtube.com/watch?v=cNi_HC839Wo" },
  { title: "Pan's Labyrinth", year: 2006, genre: "Drama", director: "Guillermo del Toro", actor: "Ivana Baquero", rating: 5, price: 12.99, runtime: 118, image: "/images/pans_labyrinth.jpeg", trailerUrl: "https://www.youtube.com/watch?v=EqYiSlkvRuw" },
  { title: "Spirited Away", year: 2001, genre: "Animation", director: "Hayao Miyazaki", actor: "Rumi Hiiragi", rating: 5, price: 16.49, runtime: 125, image: "/images/spirited_away.jpeg", trailerUrl: "https://www.youtube.com/watch?v=ByXuk9QqQkk" },
  { title: "The Big Lebowski", year: 1998, genre: "Drama", director: "Joel Coen", actor: "Jeff Bridges", rating: 4, price: 10.99, runtime: 117, image: "/images/the_big_lebowski.jpeg", trailerUrl: "https://www.youtube.com/watch?v=cd-go0oBF4Y" },
  { title: "The Godfather", year: 1972, genre: "Drama", director: "Francis Ford Coppola", actor: "Al Pacino", rating: 5, price: 17.49, runtime: 175, image: "/images/the_godfather.jpeg", trailerUrl: "https://www.youtube.com/watch?v=UaVTIH8mujA" },
  { title: "The Shawshank Redemption", year: 1994, genre: "Drama", director: "Frank Darabont", actor: "Tim Robbins", rating: 5, price: 16.99, runtime: 142, image: "/images/the_shawshank_redemption.jpeg", trailerUrl: "https://www.youtube.com/watch?v=NmzuHjWmXOc" },
  { title: "The Terminator", year: 1984, genre: "Action", director: "James Cameron", actor: "Arnold Schwarzenegger", rating: 4, price: 12.49, runtime: 107, image: "/images/the_terminator.jpeg", trailerUrl: "https://www.youtube.com/watch?v=k64P4l2Wmeg" },
  { title: "Parasite", year: 2019, genre: "Drama", director: "Bong Joon-ho", actor: "Song Kang-ho", rating: 5, price: 14.99, runtime: 132, image: "/images/parasite.jpeg", trailerUrl: "https://www.youtube.com/watch?v=5xH0HfJHsaY" },
  { title: "The Matrix", year: 1999, genre: "Sci-Fi", director: "Lana Wachowski", actor: "Keanu Reeves", rating: 5, price: 13.99, runtime: 136, image: "/images/the_matrix.jpeg", trailerUrl: "https://www.youtube.com/watch?v=vKQi3bBA1y8" },
  { title: "Joker", year: 2019, genre: "Drama", director: "Todd Phillips", actor: "Joaquin Phoenix", rating: 4, price: 12.99, runtime: 122, image: "/images/joker.jpeg", trailerUrl: "https://www.youtube.com/watch?v=zAGVQLHvwOY" },
  { title: "Her", year: 2013, genre: "Drama", director: "Spike Jonze", actor: "Joaquin Phoenix", rating: 4, price: 11.99, runtime: 126, image: "/images/her.jpeg", trailerUrl: "https://www.youtube.com/watch?v=WzV6mXIOVl4" },
  { title: "Coco", year: 2017, genre: "Animation", director: "Lee Unkrich", actor: "Anthony Gonzalez", rating: 4, price: 9.99, runtime: 105, image: "/images/coco.jpeg", trailerUrl: "https://www.youtube.com/watch?v=Rvr68u6k5sI" },
  { title: "Blade Runner 2049", year: 2017, genre: "Sci-Fi", director: "Denis Villeneuve", actor: "Ryan Gosling", rating: 4, price: 15.99, runtime: 164, image: "/images/blade_runner_2049.jpeg", trailerUrl: "https://www.youtube.com/watch?v=gCcx85zbxz4" },
  { title: "Casablanca", year: 1942, genre: "Romance", director: "Michael Curtiz", actor: "Humphrey Bogart", rating: 5, price: 8.99, runtime: 102, image: "/images/casablanca.jpeg", trailerUrl: "https://www.youtube.com/watch?v=BkL9l7qovsE" },
  { title: "La La Land", year: 2016, genre: "Romance", director: "Damien Chazelle", actor: "Emma Stone", rating: 4, price: 13.49, runtime: 128, image: "/images/la_la_land.jpeg", trailerUrl: "https://www.youtube.com/watch?v=0pdqf4P9MB8" },
  { title: "Moonlight", year: 2016, genre: "Drama", director: "Barry Jenkins", actor: "Trevante Rhodes", rating: 4, price: 10.49, runtime: 111, image: "/images/moonlight.jpeg", trailerUrl: "https://www.youtube.com/watch?v=9NJj12tJzqc" },
];

function buildReleaseDate(year: number) {
  return new Date(`${year}-01-01`);
}

function buildShortEnglishDescription(movie: SeedMovie) {
  return `${movie.title} is a ${movie.genre.toLowerCase()} feature directed by ${movie.director}. With a runtime of ${movie.runtime} minutes, it balances atmosphere, emotion, and strong storytelling. ${movie.actor} leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.`;
}

function isGenericDescription(description: string | null | undefined, title: string) {
  const clean = (description ?? "").trim().toLowerCase();
  const cleanTitle = title.trim().toLowerCase();

  return (
    !clean ||
    clean === `${cleanTitle} description.` ||
    clean === `${cleanTitle} description` ||
    clean === "description." ||
    clean === "description"
  );
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

  // 1. Crear usuario admin y cuenta asociada solo una vez
  const adminUser = await prisma.user.upsert({
    where: { email: "virginiagonzzalez@gmail.com" },
    update: { role: "admin", updatedAt: new Date() },
    create: {
      id: "user-virginia",
      name: "Virginia Gonzalez",
      email: "virginiagonzzalez@gmail.com",
      emailVerified: true,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.account.upsert({
    where: { id: "acc-virginia" },
    update: { password: "Exito2026#", updatedAt: new Date() },
    create: {
      id: "acc-virginia",
      accountId: "virginiagonzzalez@gmail.com",
      providerId: "email",
      userId: adminUser.id,
      password: "Exito2026#",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // 2. Crear usuario de test para ratings y órdenes
  const testUser = await prisma.user.upsert({
    where: { email: "test@user.com" },
    update: { updatedAt: new Date() },
    create: {
      id: "user-1",
      name: "Test User",
      email: "test@user.com",
      emailVerified: true,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // 3. Crear géneros y obtener sus IDs
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { name: genre.name },
      update: { description: genre.description },
      create: { name: genre.name, description: genre.description },
    });
  }
  const allGenres = await prisma.genre.findMany();
  const genreByName = new Map(allGenres.map(g => [g.name, g.id]));

  // 4. Crear películas y relaciones
  for (const m of movies) {
    const genreId = genreByName.get(m.genre);
    if (!genreId) throw new Error(`Missing genre ${m.genre}`);

    const [director, actor] = await Promise.all([
      getOrCreatePerson(m.director),
      getOrCreatePerson(m.actor),
    ]);

    const releaseDate = buildReleaseDate(m.year);
    const shortDescription = buildShortEnglishDescription(m);

    let movie = await prisma.movie.findFirst({
      where: { title: m.title, releaseDate },
    });

    if (!movie) {
      movie = await prisma.movie.create({
        data: {
          title: m.title,
          description: shortDescription,
          price: m.price,
          releaseDate,
          runtime: m.runtime,
          stock: 20,
          imageUrl: m.image,
          trailerUrl: m.trailerUrl ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } else if (isGenericDescription(movie.description, m.title)) {
      movie = await prisma.movie.update({
        where: { id: movie.id },
        data: {
          description: shortDescription,
          updatedAt: new Date(),
        },
      });
    }

    if (m.trailerUrl && !movie.trailerUrl) {
      movie = await prisma.movie.update({
        where: { id: movie.id },
        data: {
          trailerUrl: m.trailerUrl,
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
          userId: testUser.id,
        },
      },
      update: { value: m.rating },
      create: {
        movieId: movie.id,
        userId: testUser.id,
        value: m.rating,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  // 5. Añadir trailers adicionales si faltan
  const additionalTrailerByTitle = new Map<string, string>([
    ["Barbie", "https://www.youtube.com/watch?v=8zIf0XvoL9Y"],
  ]);
  for (const [title, trailerUrl] of additionalTrailerByTitle) {
    await prisma.movie.updateMany({
      where: {
        title,
        OR: [{ trailerUrl: null }, { trailerUrl: "" }],
      },
      data: {
        trailerUrl,
        updatedAt: new Date(),
      },
    });
  }

  // 6. Crear orden de prueba y order items
  const order = await prisma.order.create({
    data: {
      userId: testUser.id,
      status: "PAID",
      totalAmount: 0,
      orderDate: new Date(),
    },
  });
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
        quantity: movies.length - i,
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