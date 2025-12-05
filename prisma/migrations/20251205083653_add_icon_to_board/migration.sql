-- AlterTable
ALTER TABLE "boards" ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "archived_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "cards_archived_idx" ON "cards"("archived");
