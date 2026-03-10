import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL in .env file");
}

const prisma = new PrismaClient();

// ...existing code...
// (copiado de seed.script.ts)
