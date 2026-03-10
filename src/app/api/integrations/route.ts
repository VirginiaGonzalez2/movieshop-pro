import { NextResponse } from "next/server";
import { getAllIntegrations } from "@/services/integrations/integrations.service";

export async function GET() {
  try {
    const integrations = await getAllIntegrations();

    return NextResponse.json({
      integrations: Array.isArray(integrations) ? integrations : [],
    });
  } catch (error) {
    return NextResponse.json({
      integrations: [],
    });
  }
}
