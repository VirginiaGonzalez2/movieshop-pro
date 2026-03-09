import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import { NextResponse } from 'next/server';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Missing DATABASE_URL in .env file");
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// GET: Get current PromoBar config
export async function GET() {
  const promoBar = await prisma.promoBar.findFirst({});
  return NextResponse.json(promoBar);
}

// PUT: Update PromoBar config
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    // Asegura que endDate sea tipo Date
    if (data.endDate && typeof data.endDate === "string") {
      data.endDate = new Date(data.endDate);
    }
    const promoBar = await prisma.promoBar.upsert({
      where: { id: 1 }, // Assuming single config row
      update: data,
      create: { id: 1, ...data },
    });
    return NextResponse.json(promoBar);
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message || String(error) }, { status: 500 });
  }
}
