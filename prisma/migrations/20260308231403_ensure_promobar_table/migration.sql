-- CreateTable
CREATE TABLE "IntegrationConfig" (
    "id" SERIAL NOT NULL,
    "platform" TEXT NOT NULL,
    "apiKey" TEXT,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoBar" (
    "id" SERIAL NOT NULL,
    "promoText" TEXT NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "visiblePages" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoBar_pkey" PRIMARY KEY ("id")
);
