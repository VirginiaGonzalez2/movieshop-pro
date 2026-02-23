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
    Rating?: number;
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

    // 🔥 Use index to generate clear sorting differences
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

        /**
         * 🔥 Controlled variation for testing sorting
         */

        // Clear price difference (50, 100, 150, ...)
        const price = new Prisma.Decimal((i + 1) * 50);

        // Deterministic rating pattern (1.0 → 5.0 cycle)
        const rating = Number(((i % 5) + 1).toFixed(1));

        // Each movie 1 day older than previous
        const createdAt = new Date(Date.now() - i * 1000 * 60 * 60 * 24);

        const movie = await prisma.movie.create({
            data: {
                title,
                description: row.Description ?? "No description",
                price,
                releaseDate: toReleaseDate(row.Year),
                runtime: Number(row.Runtime ?? 90),
                rating,
                stock: 10,
                imageUrl: toImagePath(title),
                createdAt, // 🔥 Important for "new" sorting
            },
        });

        await prisma.movieGenre.create({
            data: {
                movieId: movie.id,
                genreId: genre.id,
            },
        });

        console.log(`✅ Added: ${movie.title}`);
    }

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

console.log("DATABASE URL:", connectionString);
