# Database Seeding Guide

## Overview

The `seedKolkataGems.ts` script populates your database with **accurate, real Kolkata places** across multiple categories. It combines three powerful APIs to create rich, authentic data:

- **OpenStreetMap Data** (hardcoded prominent places)
- **Gemini AI** for generating engaging descriptions
- **Unsplash** for fetching high-quality images

## Features

✅ **69 Prominent Kolkata Places** across 9 categories  
✅ **Smart duplicate detection** - won't add places twice  
✅ **AI-generated descriptions** using Gemini  
✅ **Automatic image fetching** from Unsplash  
✅ **Rate limiting** to respect API limits  
✅ **Progress tracking** with detailed console output  

## Categories Included

| Category | Count | Examples |
|----------|-------|----------|
| 🌳 Parks & Lakes | 7 | Rabindra Sarobar, Eco Park, Central Park |
| 🍛 Restaurants | 7 | Peter Cat, Arsalan, Flurys, Oh Calcutta |
| ☕ Cafés | 5 | Indian Coffee House, Blue Tokai, Mrs Magpie |
| 🏰 Heritage | 8 | Victoria Memorial, Howrah Bridge, Marble Palace |
| 🎭 Culture | 6 | Indian Museum, Nandan, Science City |
| 🌅 Ghats | 5 | Prinsep Ghat, Babughat, Belur Ghat |
| 🛕 Religious | 6 | Kalighat Temple, Dakshineswar, Belur Math |
| 🛍️ Markets | 6 | New Market, College Street, Gariahat |
| 🌆 Modern | 5 | Park Street, Quest Mall, South City Mall |

## Prerequisites

Before running the script, ensure you have:

1. **Environment variables** set in `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_key
   ```

2. **Database migration applied**:
   ```bash
   # Make sure you've run the category migration
   # Check supabase/migrations/20251023070000_add_category_to_pins.sql
   ```

3. **Dependencies installed**:
   ```bash
   npm install
   ```

## How to Run

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run the Seeding Script
```bash
npm run seed
```

### Step 3: Monitor Progress
The script will display detailed progress:
```
🌱 Starting database seeding...
📍 Total places to add: 69

[1/69] Processing: Rabindra Sarobar (park)
  🤖 Generating description...
  🖼️  Fetching image...
  ✅ Successfully added!

[2/69] Processing: Central Park Salt Lake (park)
  ⏭️  Skipped (already exists)
...
```

### Step 4: Review Results
At the end, you'll see a summary:
```
==================================================
🎉 Seeding Complete!

✅ Successfully added: 65
⏭️  Skipped (existing): 4
❌ Errors: 0
==================================================
```

## What the Script Does

### 1. **Checks for Duplicates**
Before adding each place, it checks if a gem with the same name already exists in the database.

### 2. **Generates AI Descriptions**
Uses Gemini to create engaging, tourist-friendly descriptions like:
> "A serene riverside promenade along the Hooghly, perfect for evening walks and chai."

### 3. **Fetches Images**
Searches Unsplash for high-quality images matching each location.

### 4. **Inserts into Database**
Adds each gem to the `pins` table with:
- Name
- Description (AI-generated)
- Coordinates (latitude, longitude)
- Category
- Image URL
- `created_by: 'system'`

## Rate Limiting

The script includes built-in delays to respect API limits:
- **500ms** between Gemini API calls
- **500ms** between Unsplash API calls
- **1000ms** between processing each place

**Total estimated runtime:** ~2-3 minutes for all 69 places

## Customization

### Adding More Places

Edit `KOLKATA_GEMS` array in `seedKolkataGems.ts`:

```typescript
const KOLKATA_GEMS: PlaceData[] = [
  // Add your custom places here
  { 
    name: 'Your Custom Place', 
    lat: 22.5726, 
    lon: 88.3639, 
    category: 'park' 
  },
  // ... existing places
];
```

### Modifying Categories

Categories must match those defined in `utils/constants.ts`:
- `park`, `restaurant`, `cafe`, `heritage`, `culture`, `ghat`, `temple`, `market`, `modern`, `other`

## Troubleshooting

### Issue: "Gemini API key not found"
**Solution:** Add `NEXT_PUBLIC_GEMINI_API_KEY` to your `.env.local` file

### Issue: "Unsplash API error: 401"
**Solution:** Verify your Unsplash access key is correct and active

### Issue: "Supabase error: duplicate key"
**Solution:** This is normal - the place already exists and will be skipped

### Issue: Script hangs
**Solution:** Check your internet connection and API rate limits

## Re-running the Script

The script is **idempotent** - you can run it multiple times safely:
- Already existing places will be **skipped**
- Only new places will be **added**
- No data will be **duplicated**

## API Costs

All APIs used are **free** with generous limits:

- **Nominatim (OSM):** Free, unlimited (be respectful)
- **Gemini:** 60 requests/minute free tier
- **Unsplash:** 50 requests/hour free tier

## Next Steps

After seeding:
1. Open your app: `npm run dev`
2. Navigate to the map view
3. Use the **Filter by Category** button to explore different types of gems
4. Each gem will have a **colored marker** based on its category
5. Click on markers to see AI-generated descriptions and images

## Advanced: Batch Seeding

To seed in smaller batches, modify the script:

```typescript
// Seed only parks
const PARKS_ONLY = KOLKATA_GEMS.filter(gem => gem.category === 'park');

// Then use PARKS_ONLY instead of KOLKATA_GEMS in the loop
```

## Support

If you encounter issues:
1. Check the console output for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure database migrations are up to date
4. Check API rate limits haven't been exceeded

---

**Happy Seeding! 🌱**
