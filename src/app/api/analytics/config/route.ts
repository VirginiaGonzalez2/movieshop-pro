import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const config = await prisma.analyticsConfig.findFirst();

    return NextResponse.json({
      gaId: config?.gaId ?? "",
      gtmId: config?.gtmId ?? "",
    });

  } catch (error) {
    console.error("Analytics config API error:", error);

    return NextResponse.json({
      gaId: "",
      gtmId: "",
    });
  }
}
