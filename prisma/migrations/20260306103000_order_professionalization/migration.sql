-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'CANCELLED', 'REFUNDED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "authUserId" TEXT;

ALTER TABLE "Order"
ALTER COLUMN "status" TYPE "OrderStatus"
USING (
	CASE
		WHEN "status" IN ('PENDING', 'PAID', 'SHIPPED', 'CANCELLED', 'REFUNDED')
			THEN "status"::"OrderStatus"
		ELSE 'PENDING'::"OrderStatus"
	END
);

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_orderDate_idx" ON "Order"("orderDate");

-- CreateIndex
CREATE INDEX "Order_authUserId_idx" ON "Order"("authUserId");

-- CreateIndex
CREATE INDEX "Order_status_orderDate_idx" ON "Order"("status", "orderDate");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_movieId_idx" ON "OrderItem"("movieId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_authUserId_fkey" FOREIGN KEY ("authUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
