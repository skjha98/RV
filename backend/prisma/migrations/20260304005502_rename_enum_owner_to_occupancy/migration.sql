/*
  Warnings:

  - You are about to drop the column `owner_type` on the `flat_d` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "flat_occupancy_type" AS ENUM ('OWNER', 'TENANT');

-- AlterTable
ALTER TABLE "flat_d" DROP COLUMN "owner_type",
ADD COLUMN     "occupancy" "flat_occupancy_type";

-- DropEnum
DROP TYPE "flat_owner_type";
