import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { platform, apiKey, settings } = body;

    await prisma.integrationConfig.create({
      data: {
        platform,
        apiKey,
        settings: settings || {},
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Integration failed" });
  }
}
