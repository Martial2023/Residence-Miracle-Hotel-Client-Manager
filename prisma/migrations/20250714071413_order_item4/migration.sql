-- AlterTable
ALTER TABLE "order_item" ADD COLUMN     "tableId" TEXT;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "table"("id") ON DELETE CASCADE ON UPDATE CASCADE;
