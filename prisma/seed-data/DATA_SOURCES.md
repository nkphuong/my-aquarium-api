# Fish Species Data Sources

This document lists recommended sources for populating your fish species database.

## Primary Data Sources

### 1. FishBase (Recommended for Scientific Data)
- **URL**: https://www.fishbase.org
- **API**: https://fishbase.ropensci.org/
- **Best for**: Scientific names, max size, temperature ranges, native habitat
- **Access**: Free REST API
- **Example**:
  ```bash
  curl "https://fishbase.ropensci.org/species?name=Paracheirodon+innesi"
  ```

### 2. Seriously Fish (Best for Aquarium Care)
- **URL**: https://www.seriouslyfish.com
- **Best for**: Care requirements, temperament, compatibility, diet
- **Quality**: Excellent, peer-reviewed content
- **Access**: Web scraping (respect robots.txt and rate limits)

### 3. AqAdvisor
- **URL**: http://www.aqadvisor.com
- **Best for**: Bioload calculations, tank stocking recommendations
- **Access**: Web interface (no public API)

## Data Collection Strategy

### Phase 1: Manual Seed Data (Current)
Start with 20-30 most popular species:
- ✅ Neon Tetra
- ✅ Betta Fish
- ✅ Corydoras Catfish
- ✅ Guppy
- ✅ Angelfish
- ✅ Cherry Shrimp
- 🔲 Platy (Xiphophorus maculatus)
- 🔲 Molly (Poecilia sphenops)
- 🔲 Zebra Danio (Danio rerio)
- 🔲 Cardinal Tetra (Paracheirodon axelrodi)
- 🔲 Harlequin Rasbora (Trigonostigma heteromorpha)
- 🔲 Otocinclus (Otocinclus vittatus)
- 🔲 Bristlenose Pleco (Ancistrus sp.)
- 🔲 Dwarf Gourami (Trichogaster lalius)
- 🔲 Kuhli Loach (Pangio kuhlii)
- 🔲 Amano Shrimp (Caridina multidentata)

### Phase 2: API Integration
Use FishBase API to fetch additional data programmatically.

### Phase 3: Community Contributions
Allow verified users to suggest new species with admin approval.

## Running the Seed Script

```bash
# Seed the database
pnpm run seed

# Or with Prisma directly
npx prisma db seed
```

## Data Fields Mapping

### From FishBase → Our Schema
- `Species` → `scientific_name`
- `CommonNames` → `name_en` (primary) + `aliases`
- `TempMin/TempMax` → `temp_min/temp_max`
- `pHMin/pHMax` → `ph_min/ph_max`
- `MaxLengthTL` → `size_max`

### From Seriously Fish → Our Schema
- Care Requirements → `care_level`
- Temperament → `temperament`
- Diet → `diet_type`
- Tank Size → `min_tank_size`
- Shoaling → `is_schooling` + `min_school_size`

## Vietnamese Names
Vietnamese common names should be researched from:
- Local aquarium forums (voz.vn, webtretho.com)
- Vietnamese aquarium Facebook groups
- Local fish stores in Vietnam

## Image Sources
- Wikimedia Commons (CC licensed)
- FishBase images
- User-contributed photos (with permission)

## Contributing New Species

When adding new species, ensure you have:
1. Scientific name (verified)
2. Common name in English
3. Water parameters (temp, pH, GH)
4. Care requirements
5. Behavioral traits
6. Tank size requirements
7. Detailed description

## Legal Considerations
- Always respect copyright and licensing
- Attribute data sources appropriately
- Use only CC-licensed or public domain images
- Follow API rate limits and terms of service
