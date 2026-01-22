/*
  Warnings:

  - You are about to drop the column `dimensions` on the `tanks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tanks" DROP COLUMN "dimensions",
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "length" INTEGER,
ADD COLUMN     "width" INTEGER;
