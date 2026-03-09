"use server";

import { prisma } from "../lib/prisma";
import { getCurrentUser } from "../lib/auth";

function validateGAId(gaId: string): boolean {
  return /^G-\w{8,}$|^UA-\w{8,}$/.test(gaId);
}

function validateGTMId(gtmId: string): boolean {
  return /^GTM-\w{6,}$/.test(gtmId);
}

export async function saveAnalyticsConfig(data: { gaId?: string; gtmId?: string }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized: Only admins can update analytics config.");
  }

  const { gaId, gtmId } = data;
  if (gaId && !validateGAId(gaId)) {
    throw new Error("Invalid Google Analytics ID format.");
  }
  if (gtmId && !validateGTMId(gtmId)) {
    throw new Error("Invalid Google Tag Manager ID format.");
  }

  // Update if exists, else create
  const existing = await prisma.analyticsConfig.findFirst();
  if (existing) {
    return await prisma.analyticsConfig.update({
      where: { id: existing.id },
      data: { gaId, gtmId },
    });
  } else {
    return await prisma.analyticsConfig.create({
      data: { gaId, gtmId },
    });
  }
}
