-- CreateEnum
CREATE TYPE "flat_occupancy_type" AS ENUM ('OWNER', 'TENANT');

-- CreateEnum
CREATE TYPE "flat_type" AS ENUM ('MIG', 'DUPLEX');

-- CreateEnum
CREATE TYPE "payment_type" AS ENUM ('UPI', 'CASH', 'NET_BANKING');

-- CreateEnum
CREATE TYPE "tracking_type" AS ENUM ('TEMPLE', 'CHATT', 'RWA');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('PAID', 'RECEIVED', 'PENDING', 'PARTIAL');

-- CreateTable
CREATE TABLE "revenue_t" (
    "id" SERIAL NOT NULL,
    "bill_no" TEXT,
    "tracking_id" "tracking_type" NOT NULL,
    "payment_mode" "payment_type" NOT NULL,
    "payment_status" "payment_status" NOT NULL,
    "payment_date" DATE NOT NULL,
    "amount_received" DECIMAL(10,2) NOT NULL,
    "amount_paid" DECIMAL(10,2) NOT NULL,
    "amount_pending" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "flat_id" INTEGER,
    "vendor_id" INTEGER,
    "event_id" INTEGER,

    CONSTRAINT "revenue_t_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue_stage_t" (
    "id" SERIAL NOT NULL,
    "bill_no" TEXT,
    "amount_received" DECIMAL(10,2) NOT NULL,
    "amount_paid" DECIMAL(10,2) NOT NULL,
    "amount_pending" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_mode" "payment_type",
    "payment_date" DATE NOT NULL,
    "payment_status" "payment_status",
    "tracking_id" "tracking_type",
    "flat_id" INTEGER,
    "vendor_id" INTEGER,
    "event_id" INTEGER,

    CONSTRAINT "revenue_stage_t_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_d" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "event_d_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flat_d" (
    "id" SERIAL NOT NULL,
    "flat_number" TEXT NOT NULL,
    "owner_name" TEXT,
    "type" "flat_type" NOT NULL,
    "occupancy" "flat_occupancy_type",
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

-- AddForeignKey
ALTER TABLE "revenue_t" ADD CONSTRAINT "revenue_t_flat_id_fkey" FOREIGN KEY ("flat_id") REFERENCES "flat_d"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_t" ADD CONSTRAINT "revenue_t_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor_d"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_t" ADD CONSTRAINT "revenue_t_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event_d"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_stage_t" ADD CONSTRAINT "revenue_stage_t_flat_id_fkey" FOREIGN KEY ("flat_id") REFERENCES "flat_d"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_stage_t" ADD CONSTRAINT "revenue_stage_t_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor_d"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_stage_t" ADD CONSTRAINT "revenue_stage_t_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event_d"("id") ON DELETE SET NULL ON UPDATE CASCADE;
