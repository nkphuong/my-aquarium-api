-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fullname" VARCHAR,
    "auth_id" UUID,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fishes" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "tank_id" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "fishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tanks" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT,
    "name" VARCHAR(100) NOT NULL,
    "volume_liters" DECIMAL(10,2),
    "dimensions" JSONB,
    "tank_type" VARCHAR(20),
    "style" VARCHAR(50),
    "substrate" VARCHAR(100),
    "filter_type" VARCHAR(100),
    "cover_image_url" TEXT,
    "description" TEXT,
    "setup_date" DATE,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tanks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fish_species" (
    "id" SERIAL NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_vn" TEXT NOT NULL,
    "scientific_name" TEXT,
    "aliases" TEXT[],
    "image_url" TEXT,
    "temp_min" DOUBLE PRECISION NOT NULL,
    "temp_max" DOUBLE PRECISION NOT NULL,
    "ph_min" DOUBLE PRECISION NOT NULL,
    "ph_max" DOUBLE PRECISION NOT NULL,
    "gh_min" INTEGER,
    "gh_max" INTEGER,
    "min_tank_size" INTEGER NOT NULL,
    "size_max" DOUBLE PRECISION NOT NULL,
    "bioload_level" INTEGER NOT NULL DEFAULT 5,
    "flow_preference" TEXT NOT NULL DEFAULT 'moderate',
    "care_level" TEXT NOT NULL,
    "temperament" TEXT NOT NULL,
    "diet_type" TEXT NOT NULL,
    "is_schooling" BOOLEAN NOT NULL DEFAULT false,
    "min_school_size" INTEGER DEFAULT 1,
    "plant_safe" BOOLEAN NOT NULL DEFAULT true,
    "substrate_digger" BOOLEAN NOT NULL DEFAULT false,
    "jumper" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,

    CONSTRAINT "fish_species_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_id_key" ON "users"("auth_id");

-- CreateIndex
CREATE UNIQUE INDEX "fish_species_name_en_key" ON "fish_species"("name_en");

-- AddForeignKey
ALTER TABLE "fishes" ADD CONSTRAINT "fishes_tank_id_fkey" FOREIGN KEY ("tank_id") REFERENCES "tanks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tanks" ADD CONSTRAINT "tanks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
