-- CreateEnum
CREATE TYPE "flat_owner_type" AS ENUM ('OWNER', 'TENANT');

-- CreateEnum
CREATE TYPE "flat_type" AS ENUM ('MIG', 'DUPLEX');

-- CreateTable
CREATE TABLE "occasion_d" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "occasion_d_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flat_d" (
    "id" SERIAL NOT NULL,
    "flat_number" TEXT NOT NULL,
    "owner_name" TEXT,
    "type" "flat_type" NOT NULL,
    "owner_type" "flat_owner_type",
    "mobile" CHAR(10),
    "email" TEXT,

    CONSTRAINT "flat_d_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_d" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" CHAR(10),

    CONSTRAINT "vendor_d_pkey" PRIMARY KEY ("id")
);
