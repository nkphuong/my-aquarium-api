-- CreateTable
CREATE TABLE "water_parameters" (
    "id" BIGSERIAL NOT NULL,
    "tank_id" BIGINT NOT NULL,
    "tested_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "temperature" DECIMAL(4,1),
    "ph" DECIMAL(3,1),
    "ammonia" DECIMAL(5,3),
    "nitrite" DECIMAL(5,3),
    "nitrate" DECIMAL(6,2),
    "gh" DECIMAL(5,1),
    "kh" DECIMAL(5,1),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "water_parameters_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "water_parameters" ADD CONSTRAINT "water_parameters_tank_id_fkey" FOREIGN KEY ("tank_id") REFERENCES "tanks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
