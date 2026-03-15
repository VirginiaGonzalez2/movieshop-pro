import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Get current PromoBar config
export async function GET() {
  try {
    const promoBar = await prisma.promoBar.findFirst({});
    return NextResponse.json(promoBar);
  } catch (error) {
    console.error("PROMOBAR API ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
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
