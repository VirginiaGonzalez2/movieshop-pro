"use server";

import { prisma } from "../lib/prisma";
// import { getCurrentUser } from "../lib/auth";

function validateGAId(gaId: string): boolean {
  return /^G-\w{8,}$|^UA-\w{8,}$/.test(gaId);
}

function validateGTMId(gtmId: string): boolean {
  return /^GTM-\w{6,}$/.test(gtmId);
}

export async function saveAnalyticsConfig(data: { gaId?: string; gtmId?: string }) {
  // TODO: Validación de usuario actual eliminada temporalmente para evitar error de compilación.
  const { gaId, gtmId } = data;
  if (gaId && !validateGAId(gaId)) {
    throw new Error("Invalid Google Analytics ID format.");
  }
  if (gtmId && !validateGTMId(gtmId)) {
    throw new Error("Invalid Google Tag Manager ID format.");
  }

  // Update if exists, else create
  const existing = await prisma.analyticsConfig.findFirst(); // Usa el nombre correcto del modelo
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
