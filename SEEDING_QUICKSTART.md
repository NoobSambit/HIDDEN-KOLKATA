# 🚀 Quick Start: Seeding Your Database

## Step-by-Step Setup

### 1️⃣ Install New Dependencies
```bash
npm install
```

This will install the new dependencies: `tsx` and `dotenv`

### 2️⃣ Run Database Migration

First, make sure your Supabase project is set up and run the category migration:

**Option A: Via Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of:
   `supabase/migrations/20251023070000_add_category_to_pins.sql`
4. Click **Run**

**Option B: Via Supabase CLI** (if you have it installed)
```bash
supabase db push
```

### 3️⃣ Verify Environment Variables

Check that your `.env.local` file has all required API keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

**Get API Keys:**
- **Gemini:** https://makersuite.google.com/app/apikey (Free)
- **Unsplash:** https://unsplash.com/developers (Free - 50 req/hour)

### 4️⃣ Run the Seeding Script

```bash
npm run seed
```

This will:
- ✅ Add **69 prominent Kolkata places** to your database
- ✅ Generate AI descriptions using Gemini
- ✅ Fetch beautiful images from Unsplash
- ✅ Categorize each gem automatically
- ⏱️ Takes ~2-3 minutes to complete

### 5️⃣ Start Your App

```bash
npm run dev
```

Visit http://localhost:3000 and explore your populated map!

## 🎨 What's New

### Category-Based Markers
Each gem now displays with a **color-coded marker**:
- 🟢 **Green** - Parks & Lakes
- 🟠 **Orange** - Restaurants  
- 🟣 **Violet** - Cafés
- 🔴 **Red** - Heritage Sites
- 🟡 **Gold** - Cultural Spots
- 🔵 **Blue** - Ghats & Riversides
- 🟡 **Yellow** - Religious Sites
- ⚫ **Grey** - Markets
- ⚫ **Black** - Modern Spots

### Filter by Category
Click the **"Filter by Category"** button on the map to:
- Filter gems by one or multiple categories
- See only the types of places you're interested in
- Clear filters to see everything

### Category Selection in Form
When adding a new gem manually, you can now:
- Select a category from the dropdown
- See category emoji icons
- Have properly color-coded markers automatically

## 📊 Seeded Data Breakdown

| Category | Places | Examples |
|----------|--------|----------|
| 🌳 Parks | 7 | Rabindra Sarobar, Eco Park, Central Park |
| 🍛 Restaurants | 7 | Peter Cat, Arsalan, Oh Calcutta |
| ☕ Cafés | 5 | Indian Coffee House, Blue Tokai |
| 🏰 Heritage | 8 | Victoria Memorial, Howrah Bridge |
| 🎭 Culture | 6 | Indian Museum, Nandan, Science City |
| 🌅 Ghats | 5 | Prinsep Ghat, Babughat, Belur Ghat |
| 🛕 Religious | 6 | Kalighat, Dakshineswar, Belur Math |
| 🛍️ Markets | 6 | New Market, College Street, Gariahat |
| 🌆 Modern | 5 | Quest Mall, South City Mall, Park Street |

**Total: 69 Gems** 🎉

## 🔧 Customization

### Add More Places
Edit `scripts/seedKolkataGems.ts` and add to the `KOLKATA_GEMS` array:

```typescript
const KOLKATA_GEMS: PlaceData[] = [
  // Your custom places
  { 
    name: 'My Secret Spot', 
    lat: 22.5726, 
    lon: 88.3639, 
    category: 'cafe' 
  },
  // ... existing places
];
```

Then run `npm run seed` again - it will only add new places!

### Modify Categories
Update `utils/constants.ts` to add new categories or change colors:

```typescript
export const GEM_CATEGORIES = {
  your_category: { label: '🏷️ Your Label', color: 'blue', icon: '🏷️' },
  // ... existing categories
};
```

## ❓ Troubleshooting

**Script fails immediately:**
- Check your `.env.local` file exists and has all variables
- Verify Supabase URL and key are correct

**All descriptions are generic:**
- Your Gemini API key might be missing or invalid
- Check the console for specific error messages

**No images appear:**
- Your Unsplash API key might be missing
- Free tier limit: 50 requests/hour

**"Already exists" for everything:**
- You've already run the script successfully!
- The script prevents duplicates automatically

## 📖 Need More Details?

Check out the full documentation in `scripts/README.md`

---

**Enjoy your fully populated Hidden Kolkata map! 🗺️✨**
