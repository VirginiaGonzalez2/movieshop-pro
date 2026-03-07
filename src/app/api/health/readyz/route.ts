import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json(
            {
                status: "ready",
                database: "ok",
                timestamp: new Date().toISOString(),
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            {
                status: "not_ready",
                database: "error",
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : "Unknown database error",
            },
            { status: 503 },
        );
    }
}
