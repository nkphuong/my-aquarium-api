-- CreateTable
CREATE TABLE "livestock" (
    "id" BIGSERIAL NOT NULL,
    "tank_id" BIGINT,
    "name" VARCHAR(100) NOT NULL,
    "scientific_name" VARCHAR(150),
    "fishbase_id" INTEGER,
    "type" VARCHAR(20) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "status" VARCHAR(20) NOT NULL,
    "image_url" TEXT,
    "added_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "livestock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "livestock" ADD CONSTRAINT "livestock_tank_id_fkey" FOREIGN KEY ("tank_id") REFERENCES "tanks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
