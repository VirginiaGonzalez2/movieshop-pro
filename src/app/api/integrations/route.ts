import { NextResponse } from "next/server";
import {
  getAllIntegrations,
  saveIntegration
} from "@/services/integrations/integrations.service";

// GET: List all integrations
  try {
    const integrations = await getAllIntegrations();
    return NextResponse.json({ integrations: Array.isArray(integrations) ? integrations : [] });
  } catch (error) {
    return NextResponse.json({ integrations: [] });
  }
}

// POST: Create/update integration
  try {
    const data = await request.json();
    const { platform, apiKey, settings } = data;
    const integration = await saveIntegration(platform, apiKey, settings);
    return NextResponse.json({ integration: integration ?? null });
  } catch (error) {
    return NextResponse.json({ integration: null });
  }
}
