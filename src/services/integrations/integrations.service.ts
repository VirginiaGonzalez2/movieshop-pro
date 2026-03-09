import { prisma } from "@/lib/prisma";

export async function getAllIntegrations() {
  try {
    const integrations = await prisma.integrationConfig.findMany();
    return Array.isArray(integrations) ? integrations : [];
  } catch (error) {
    console.error("getAllIntegrations error:", error);
    return [];
  }
}

export async function getIntegration(platform: string) {
  try {
    const integration = await prisma.integrationConfig.findFirst({
      where: { platform },
    });
    return integration ?? null;
  } catch (error) {
    console.error("getIntegration error:", error);
    return null;
  }
}

export async function saveIntegration(platform: string, apiKey?: string, settings?: any) {
  try {
    const integration = await prisma.integrationConfig.upsert({
      where: { platform },
      update: { apiKey, settings },
      create: { platform, apiKey, settings },
    });
    return integration ?? null;
  } catch (error) {
    console.error("saveIntegration error:", error);
    return null;
  }
}
