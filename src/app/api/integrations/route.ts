import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { NextResponse } from "next/server";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Missing DATABASE_URL in .env file");
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// GET: List all integrations
export async function GET() {
  try {
    const integrations = await prisma.integrationConfig.findMany();
    // Always return an array, even if empty
    return NextResponse.json(Array.isArray(integrations) ? integrations : []);
  } catch (error) {
    // Always return valid JSON
    return NextResponse.json({ error: error?.message || String(error), integrations: [] }, { status: 500 });
  }
}

// POST: Create/update integration
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { platform, apiKey, settings } = data;
    const integration = await prisma.integrationConfig.upsert({
      where: { platform },
      update: { apiKey, settings },
      create: { platform, apiKey, settings },
    });
    return NextResponse.json(integration);
  } catch (error) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}
