/*
  prisma/seed.ts

  Development seed script for MovieShop project.
  - Creates a set of atomic genres (no compound values).
  - Creates movies (20+) and assigns each movie 2-3 genres
    using the explicit join model `MovieGenre` via nested creates.

  Important:
  - This file assumes the project exports a `prisma` instance
    from `src/lib/prisma` (server-side Prisma client).
  - Run with: `npx prisma db seed` (configured in package.json)
*/

import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../src/lib/prisma";

async function main() {
  // Define atomic genres to insert.
  const genreNames = [
    "Action",
    "Drama",
    "Comedy",
    "Animation",
    "Sci-Fi",
    "Fantasy",
    "Thriller",
    "Crime",
    "Romance",
    "Superhero",
    "Mystery",
    "War",
    "Horror",
    "Musical",
    "Martial Arts",
  ];

  // Create genres one-by-one so we can map name -> id.
  const genreMap: Record<string, number> = {};

  console.log("Seeding genres...");

  for (const name of genreNames) {
    const g = await prisma.genre.create({ data: { name, description: `${name} movies` } });
    genreMap[name] = g.id;
  }

  console.log("Genres created:", Object.keys(genreMap).length);

  // Helper to create a Decimal price.
  const toPrice = (n: number) => new Prisma.Decimal(n.toFixed(2));

  // Define a set of 20+ movies with titles and 2-3 genre assignments.
  // Ensure at least 6 Action, 6 Drama, and 6 Comedy movies across the set.
  const movies: Array<{
    title: string;
    releaseDate: string;
    runtime: number;
    price: number;
    stock: number;
    genres: string[];
  }> = [
    { title: "Skyline Strikers", releaseDate: "2023-06-10", runtime: 120, price: 12.99, stock: 20, genres: ["Action", "Sci-Fi"] },
    { title: "Broken Vows", releaseDate: "2021-02-14", runtime: 110, price: 9.99, stock: 15, genres: ["Drama", "Romance"] },
    { title: "Laugh Riot", releaseDate: "2020-08-01", runtime: 95, price: 7.99, stock: 10, genres: ["Comedy", "Musical"] },
    { title: "City of Shadows", releaseDate: "2019-11-02", runtime: 130, price: 14.99, stock: 8, genres: ["Crime", "Thriller"] },
    { title: "Heroic Dawn", releaseDate: "2024-01-20", runtime: 140, price: 15.99, stock: 25, genres: ["Action", "Superhero"] },
    { title: "The Quiet Meadow", releaseDate: "2018-05-30", runtime: 100, price: 8.99, stock: 12, genres: ["Drama", "Comedy"] },
    { title: "Midnight Chase", releaseDate: "2022-09-17", runtime: 105, price: 11.99, stock: 9, genres: ["Action", "Thriller"] },
    { title: "Spacebound", releaseDate: "2021-12-25", runtime: 125, price: 13.99, stock: 18, genres: ["Sci-Fi", "Fantasy"] },
    { title: "Comic Relief", releaseDate: "2017-03-11", runtime: 92, price: 6.99, stock: 20, genres: ["Comedy", "Drama"] },
    { title: "Dance of Fate", releaseDate: "2020-07-07", runtime: 115, price: 10.99, stock: 7, genres: ["Musical", "Romance"] },
    { title: "Blade Legacy", releaseDate: "2016-10-10", runtime: 118, price: 9.49, stock: 11, genres: ["Action", "Martial Arts"] },
    { title: "Haunted Harbor", releaseDate: "2019-10-31", runtime: 98, price: 8.49, stock: 6, genres: ["Horror", "Mystery"] },
    { title: "Family Ties", releaseDate: "2015-04-20", runtime: 102, price: 7.49, stock: 14, genres: ["Drama", "Comedy"] },
    { title: "Detective's Edge", releaseDate: "2022-02-08", runtime: 121, price: 12.49, stock: 10, genres: ["Crime", "Mystery"] },
    { title: "Wings of Valor", releaseDate: "2014-06-06", runtime: 132, price: 13.49, stock: 5, genres: ["War", "Drama"] },
    { title: "Neon Knights", releaseDate: "2023-03-03", runtime: 127, price: 14.49, stock: 16, genres: ["Action", "Sci-Fi"] },
    { title: "The Great Escape", releaseDate: "2013-09-09", runtime: 119, price: 9.99, stock: 13, genres: ["Action", "Drama"] },
    { title: "RomCom Nights", releaseDate: "2021-05-05", runtime: 97, price: 8.99, stock: 19, genres: ["Romance", "Comedy"] },
    { title: "Mystic Falls", releaseDate: "2020-10-10", runtime: 110, price: 11.49, stock: 8, genres: ["Fantasy", "Mystery"] },
    { title: "Masked Vigilante", releaseDate: "2024-02-14", runtime: 135, price: 16.99, stock: 22, genres: ["Superhero", "Action"] },
    // Extra entries to ensure counts
    { title: "Punchline", releaseDate: "2018-08-08", runtime: 90, price: 6.49, stock: 12, genres: ["Comedy", "Action"] },
    { title: "Tears of Summer", releaseDate: "2017-07-07", runtime: 108, price: 7.99, stock: 9, genres: ["Drama", "Romance"] },
  ];

  console.log("Seeding movies...");

  // Assign unique release years to each movie and ensure the array
  // is ordered from oldest -> newest. This guarantees each movie has
  // a different year and the seed inserts movies in ascending date order.
  const startYear = 1995;
  movies.forEach((m, idx) => {
    // Set releaseDate to Jan 1st of the assigned year to keep dates simple.
    m.releaseDate = `${startYear + idx}-01-01`;
  });

  // Sort movies by releaseDate ascending to ensure oldest -> newest ordering.
  movies.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());

  for (const m of movies) {
    const created = await prisma.movie.create({
      data: {
        title: m.title,
        description: `${m.title} - A compelling story.`,
        price: toPrice(m.price),
        releaseDate: new Date(m.releaseDate),
        runtime: m.runtime,
        stock: m.stock,
        // Create join rows in MovieGenre by connecting to existing Genre ids.
        genres: {
          create: m.genres.map((gName) => ({ genre: { connect: { id: genreMap[gName] } } })),
        },
      },
    });

    console.log("Created movie:", created.title);
  }

  console.log("Seeding finished.");
}

// Execute main and clean up.
main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
