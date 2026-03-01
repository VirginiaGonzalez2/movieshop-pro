import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import XLSX from "xlsx";
import path from "path";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type SeedMovieRow = {
    Title?: string;
    Description?: string;
    Price?: number;
    Year?: string | number;
    Runtime?: number;
    Rating?: number; // ignored (real ratings come from MovieRating)
    Genre?: string;
};

function toReleaseDate(year: string | number | undefined) {
    const y =
        typeof year === "number"
            ? year
            : typeof year === "string" && year.trim()
              ? Number(year)
              : 2000;

    const safeYear = Number.isFinite(y) ? y : 2000;
    return new Date(`${safeYear}-01-01T00:00:00.000Z`);
}

function toImagePath(title: string) {
    return (
        "/images/" +
        title
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "_") +
        ".jpeg"
    );
}

async function main() {
    console.log("🌱 Seeding database...");

    const filePath = path.join(process.cwd(), "prisma", "seed", "movies_catalog.xlsx");

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json<SeedMovieRow>(sheet);

    console.log(`📄 Loaded ${rows.length} rows from Excel`);

    /**
     * ----------------------------------------
     * MOVIES + GENRES
     * ----------------------------------------
     */
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        const title = row.Title?.trim();
        if (!title) continue;

        const genreName = row.Genre?.trim() || "Unknown";

        const genre = await prisma.genre.upsert({
            where: { name: genreName },
            update: {},
            create: { name: genreName },
        });

        const existing = await prisma.movie.findFirst({
            where: { title },
            select: { id: true },
        });

        if (existing) {
            await prisma.movieGenre.upsert({
                where: {
                    movieId_genreId: {
                        movieId: existing.id,
                        genreId: genre.id,
                    },
                },
                update: {},
                create: {
                    movieId: existing.id,
                    genreId: genre.id,
                },
            });

            continue;
        }

        // Prefer explicit Price from spreadsheet, otherwise generate a varied price
        const priceValue = typeof row.Price === "number" && Number.isFinite(row.Price) ? row.Price : ((i % 10) + 1) * 2;
        const price = new Prisma.Decimal(priceValue);
        const createdAt = new Date(Date.now() - i * 1000 * 60 * 60 * 24);

        const movie = await prisma.movie.create({
            data: {
                title,
                description: row.Description ?? "No description",
                price,
                releaseDate: toReleaseDate(row.Year),
                runtime: Number(row.Runtime ?? 90),
                stock: 10,
                imageUrl: toImagePath(title),
                createdAt,
                // trailerUrl: null (optional)
            },
        });

        await prisma.movieGenre.create({
            data: {
                movieId: movie.id,
                genreId: genre.id,
            },
        });

        console.log(`✅ Added movie: ${movie.title}`);
    }

    /**
     * ----------------------------------------
     * ADD PEOPLE + ROLES
     * ----------------------------------------
     */

    // Only select what we need (avoid selecting missing columns in shared DBs)
    const movies = await prisma.movie.findMany({
        select: { id: true },
    });

    /**
     * ----------------------------------------
     * USERS + ORDERS (simulate purchases)
     * ----------------------------------------
     * Create a small set of users and generate one order per movie with
     * variable quantities so `TopPurchasedMoviesSection` can surface true
     * "most purchased" items in the seeded DB.
     */

    const existingUsers = await prisma.user.count();
    if (existingUsers === 0) {
        const now = new Date();
        await prisma.user.createMany({
            data: [
                { id: "user-1", name: "Seed User 1", email: "seed1@example.com", emailVerified: false, createdAt: now, updatedAt: now },
                { id: "user-2", name: "Seed User 2", email: "seed2@example.com", emailVerified: false, createdAt: now, updatedAt: now },
                { id: "user-3", name: "Seed User 3", email: "seed3@example.com", emailVerified: false, createdAt: now, updatedAt: now },
            ],
            skipDuplicates: true,
        });
    }

    const seedUsers = await prisma.user.findMany({ where: { id: { in: ["user-1", "user-2", "user-3"] } }, select: { id: true } });
    const userIds = seedUsers.map((u) => u.id);

    // Create orders: assign a deterministic quantity pattern so top-sellers exist
    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];

        // purchases: more for lower index movies to create a "top sold" ordering
        const purchases = ((movies.length - i) % 7) + 1; // 1..7

        const userId = userIds[i % userIds.length] ?? "user-1";

        const movieRecord = await prisma.movie.findUnique({ where: { id: movie.id }, select: { price: true } });
        const priceAtPurchase = movieRecord?.price ?? new Prisma.Decimal(10);

        const totalAmount = priceAtPurchase.mul(new Prisma.Decimal(purchases));

        await prisma.order.create({
            data: {
                userId,
                totalAmount,
                status: "COMPLETED",
                orderDate: new Date(Date.now() - i * 1000 * 60 * 60 * 24),
                items: {
                    create: {
                        movieId: movie.id,
                        quantity: purchases,
                        priceAtPurchase: priceAtPurchase,
                    },
                },
            },
        });
    }

    /**
     * ----------------------------------------
     * RATINGS (simulate user ratings)
     * ----------------------------------------
     * Create ratings for each movie from the seeded users so the
     * "most popular" logic (based on ratings) has meaningful data.
     */
    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];

        for (let u = 0; u < userIds.length; u++) {
            const userId = userIds[u] ?? "user-1";
            const value = ((i + u) % 5) + 1; // ratings 1..5 distributed deterministically

            try {
                await prisma.movieRating.create({
                    data: {
                        movieId: movie.id,
                        userId,
                        value,
                    },
                });
            } catch (e) {
                // ignore duplicates or errors to keep seed idempotent
            }
        }
    }

    const directorNames = [
        "Christopher Nolan",
        "Steven Spielberg",
        "Quentin Tarantino",
        "Martin Scorsese",
        "Denis Villeneuve",
    ];

    const actorNames = [
        "Leonardo DiCaprio",
        "Brad Pitt",
        "Natalie Portman",
        "Tom Hardy",
        "Scarlett Johansson",
        "Christian Bale",
        "Morgan Freeman",
    ];

    // Only create if empty (avoid duplicates on multiple seeds)
    const existingPeopleCount = await prisma.person.count();

    if (existingPeopleCount === 0) {
        await prisma.person.createMany({
            data: [
                ...directorNames.map((name) => ({
                    name,
                    bio: "Film director",
                })),
                ...actorNames.map((name) => ({
                    name,
                    bio: "Actor",
                })),
            ],
        });
    }

    const directors = await prisma.person.findMany({
        where: { name: { in: directorNames } },
    });

    const actors = await prisma.person.findMany({
        where: { name: { in: actorNames } },
    });

    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];

        const director = directors[i % directors.length];
        const actor1 = actors[i % actors.length];
        const actor2 = actors[(i + 1) % actors.length];

        await prisma.moviePerson.createMany({
            data: [
                {
                    movieId: movie.id,
                    personId: director.id,
                    role: "DIRECTOR",
                },
                {
                    movieId: movie.id,
                    personId: actor1.id,
                    role: "ACTOR",
                },
                {
                    movieId: movie.id,
                    personId: actor2.id,
                    role: "ACTOR",
                },
            ],
            skipDuplicates: true,
        });
    }

    console.log("🎭 People & roles linked");
    console.log("✅ Seeding complete");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
