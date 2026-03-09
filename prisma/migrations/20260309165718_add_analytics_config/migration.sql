-- CreateTable
CREATE TABLE "AnalyticsConfig" (
    "id" SERIAL NOT NULL,
    "gaId" TEXT,
    "gtmId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalyticsConfig_pkey" PRIMARY KEY ("id")
);
