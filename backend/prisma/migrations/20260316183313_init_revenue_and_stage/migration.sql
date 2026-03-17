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
    "received_amount" DECIMAL(10,2) NOT NULL,
    "pending_amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "flat_id" INTEGER,
    "vendor_id" INTEGER,
    "occasion_id" INTEGER,

    CONSTRAINT "revenue_t_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue_stage_t" (
    "id" SERIAL NOT NULL,
    "bill_no" TEXT,
    "received_amount" DECIMAL(10,2) NOT NULL,
    "pending_amount" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_mode" "payment_type",
    "payment_date" DATE NOT NULL,
    "payment_status" "payment_status",
    "tracking_id" "tracking_type",
    "flat_id" INTEGER,
    "vendor_id" INTEGER,
    "occasion_id" INTEGER,

    CONSTRAINT "revenue_stage_t_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "revenue_t" ADD CONSTRAINT "revenue_t_flat_id_fkey" FOREIGN KEY ("flat_id") REFERENCES "flat_d"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_t" ADD CONSTRAINT "revenue_t_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor_d"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_t" ADD CONSTRAINT "revenue_t_occasion_id_fkey" FOREIGN KEY ("occasion_id") REFERENCES "occasion_d"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_stage_t" ADD CONSTRAINT "revenue_stage_t_flat_id_fkey" FOREIGN KEY ("flat_id") REFERENCES "flat_d"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_stage_t" ADD CONSTRAINT "revenue_stage_t_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor_d"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_stage_t" ADD CONSTRAINT "revenue_stage_t_occasion_id_fkey" FOREIGN KEY ("occasion_id") REFERENCES "occasion_d"("id") ON DELETE SET NULL ON UPDATE CASCADE;
