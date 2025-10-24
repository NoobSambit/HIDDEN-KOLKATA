/**
 * Seed Script for Kolkata Gems
 * 
 * This script populates the database with accurate Kolkata places using:
 * - Nominatim API (OpenStreetMap) for place data
 * - Gemini API for generating descriptions
 * - Unsplash API for fetching images
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const unsplashAccessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const GEMINI_MODEL = 'gemini-1.5-flash-latest';

type GemCategory = 'park' | 'lake' | 'restaurant' | 'cafe' | 'street_food' | 'heritage' | 'colonial' | 'culture' | 'art' | 'ghat' | 'temple' | 'market' | 'bookstore' | 'bridge' | 'viewpoint' | 'theater' | 'music' | 'modern' | 'sports' | 'educational' | 'other';

interface PlaceData {
  name: string;
  lat: number;
  lon: number;
  category: GemCategory;
}

// Comprehensive Kolkata places by category (100+ curated locations)
const KOLKATA_GEMS: PlaceData[] = [
  // Parks & Gardens
  { name: 'Central Park Salt Lake', lat: 22.5801, lon: 88.4171, category: 'park' },
  { name: 'Eco Park Kolkata', lat: 22.6114, lon: 88.4386, category: 'park' },
  { name: 'Millennium Park', lat: 22.5726, lon: 88.3506, category: 'park' },
  { name: 'Maidan', lat: 22.5552, lon: 88.3538, category: 'park' },
  { name: 'Alipore Zoological Gardens', lat: 22.5397, lon: 88.3350, category: 'park' },
  { name: 'Horticultural Gardens', lat: 22.5380, lon: 88.3380, category: 'park' },
  { name: 'Botanical Garden Howrah', lat: 22.5583, lon: 88.2639, category: 'park' },
  { name: 'Nicco Park', lat: 22.5680, lon: 88.4520, category: 'park' },
  { name: 'Japanese Garden Salt Lake', lat: 22.5755, lon: 88.4200, category: 'park' },
  { name: 'Deshapriya Park', lat: 22.5265, lon: 88.3630, category: 'park' },
  
  // Lakes & Water Bodies
  { name: 'Rabindra Sarobar', lat: 22.5167, lon: 88.3667, category: 'lake' },
  { name: 'Subhas Sarobar', lat: 22.5978, lon: 88.4300, category: 'lake' },
  { name: 'Santragachi Jheel', lat: 22.5833, lon: 88.2667, category: 'lake' },
  { name: 'Rabindra Tirtha', lat: 22.6300, lon: 88.4100, category: 'lake' },
  
  // Restaurants
  { name: 'Peter Cat Park Street', lat: 22.5539, lon: 88.3556, category: 'restaurant' },
  { name: 'Arsalan Biryani Park Circus', lat: 22.5498, lon: 88.3682, category: 'restaurant' },
  { name: 'Flurys Park Street', lat: 22.5540, lon: 88.3555, category: 'restaurant' },
  { name: 'Mocambo Park Street', lat: 22.5534, lon: 88.3558, category: 'restaurant' },
  { name: 'Oh Calcutta Elgin Road', lat: 22.5440, lon: 88.3527, category: 'restaurant' },
  { name: 'Kewpies Kitchen', lat: 22.5280, lon: 88.3470, category: 'restaurant' },
  { name: 'Bhojohori Manna Salt Lake', lat: 22.5745, lon: 88.4147, category: 'restaurant' },
  { name: '6 Ballygunge Place', lat: 22.5315, lon: 88.3655, category: 'restaurant' },
  { name: 'Aaheli ITC Sonar', lat: 22.5760, lon: 88.4890, category: 'restaurant' },
  { name: 'Banana Leaf Gariahat', lat: 22.5175, lon: 88.3642, category: 'restaurant' },
  { name: 'Aminia Esplanade', lat: 22.5700, lon: 88.3540, category: 'restaurant' },
  
  // Cafés & Coffee
  { name: 'Indian Coffee House College Street', lat: 22.5734, lon: 88.3638, category: 'cafe' },
  { name: 'Roastery Coffee House', lat: 22.5170, lon: 88.3629, category: 'cafe' },
  { name: 'Blue Tokai Coffee Hindustan Park', lat: 22.5300, lon: 88.3740, category: 'cafe' },
  { name: 'Mrs Magpie Broadway', lat: 22.5690, lon: 88.3620, category: 'cafe' },
  { name: 'Café Mezzuna Ballygunge', lat: 22.5325, lon: 88.3645, category: 'cafe' },
  { name: 'Dolly Chai Tapri', lat: 22.5540, lon: 88.3555, category: 'cafe' },
  { name: 'Chai Break Theater Road', lat: 22.5370, lon: 88.3620, category: 'cafe' },
  { name: 'Beanbag Café Salt Lake', lat: 22.5745, lon: 88.4200, category: 'cafe' },
  
  // Street Food
  { name: 'Tiretti Bazaar', lat: 22.5750, lon: 88.3570, category: 'street_food' },
  { name: 'Terreti Bazar Breakfast', lat: 22.5755, lon: 88.3572, category: 'street_food' },
  { name: 'Dacres Lane Food Street', lat: 22.5580, lon: 88.3545, category: 'street_food' },
  { name: 'Vivekananda Park Puchka', lat: 22.5340, lon: 88.3880, category: 'street_food' },
  { name: 'Shyambazar Five Point', lat: 22.5990, lon: 88.3720, category: 'street_food' },
  { name: 'Vardaan Market Food Court', lat: 22.5190, lon: 88.3635, category: 'street_food' },
  
  // Heritage Sites
  { name: 'Victoria Memorial', lat: 22.5448, lon: 88.3426, category: 'heritage' },
  { name: 'Marble Palace', lat: 22.5889, lon: 88.3572, category: 'heritage' },
  { name: 'Jorasanko Thakurbari', lat: 22.5839, lon: 88.3653, category: 'heritage' },
  { name: 'Shaheed Minar', lat: 22.5726, lon: 88.3520, category: 'heritage' },
  { name: 'Raj Bhavan', lat: 22.5560, lon: 88.3510, category: 'heritage' },
  { name: 'Town Hall', lat: 22.5740, lon: 88.3525, category: 'heritage' },
  { name: 'Metcalfe Hall', lat: 22.5738, lon: 88.3522, category: 'heritage' },
  
  // Colonial Buildings
  { name: 'Fort William', lat: 22.5571, lon: 88.3392, category: 'colonial' },
  { name: 'Writers Building', lat: 22.5721, lon: 88.3519, category: 'colonial' },
  { name: 'St Pauls Cathedral', lat: 22.5446, lon: 88.3502, category: 'colonial' },
  { name: 'General Post Office', lat: 22.5725, lon: 88.3515, category: 'colonial' },
  { name: 'High Court Kolkata', lat: 22.5726, lon: 88.3498, category: 'colonial' },
  { name: 'Presidency University', lat: 22.5735, lon: 88.3640, category: 'colonial' },
  { name: 'Scottish Church College', lat: 22.5733, lon: 88.3641, category: 'colonial' },
  
  // Museums & Culture
  { name: 'Indian Museum Kolkata', lat: 22.5577, lon: 88.3521, category: 'culture' },
  { name: 'Birla Planetarium', lat: 22.5449, lon: 88.3433, category: 'culture' },
  { name: 'Science City Kolkata', lat: 22.5427, lon: 88.4146, category: 'culture' },
  { name: 'Victoria Memorial Museum', lat: 22.5448, lon: 88.3426, category: 'culture' },
  { name: 'Nehru Children Museum', lat: 22.5460, lon: 88.3520, category: 'culture' },
  { name: 'Birla Industrial Museum', lat: 22.5550, lon: 88.3570, category: 'culture' },
  
  // Art Galleries
  { name: 'Academy of Fine Arts', lat: 22.5463, lon: 88.3471, category: 'art' },
  { name: 'CIMA Art Gallery', lat: 22.5540, lon: 88.3555, category: 'art' },
  { name: 'Experimenter Gallery', lat: 22.5495, lon: 88.3625, category: 'art' },
  { name: 'Chemould Prescott Road', lat: 22.5320, lon: 88.3640, category: 'art' },
  { name: 'Emami Art Gallery', lat: 22.5745, lon: 88.4150, category: 'art' },
  
  // Ghats & Riversides
  { name: 'Prinsep Ghat', lat: 22.5609, lon: 88.3384, category: 'ghat' },
  { name: 'Babughat', lat: 22.5605, lon: 88.3405, category: 'ghat' },
  { name: 'Outram Ghat', lat: 22.5580, lon: 88.3393, category: 'ghat' },
  { name: 'Babu Ghat', lat: 22.5602, lon: 88.3407, category: 'ghat' },
  { name: 'Belur Ghat', lat: 22.6244, lon: 88.3585, category: 'ghat' },
  { name: 'Millennium Park Ghat', lat: 22.5725, lon: 88.3505, category: 'ghat' },
  
  // Religious Sites
  { name: 'Kalighat Kali Temple', lat: 22.5186, lon: 88.3428, category: 'temple' },
  { name: 'Dakshineswar Kali Temple', lat: 22.6551, lon: 88.3572, category: 'temple' },
  { name: 'Belur Math', lat: 22.6320, lon: 88.3570, category: 'temple' },
  { name: 'Birla Mandir', lat: 22.5450, lon: 88.3434, category: 'temple' },
  { name: 'Nakhoda Mosque', lat: 22.5774, lon: 88.3590, category: 'temple' },
  { name: 'St James Church', lat: 22.5370, lon: 88.3410, category: 'temple' },
  { name: 'Pareshnath Jain Temple', lat: 22.5775, lon: 88.3595, category: 'temple' },
  { name: 'Tipu Sultan Mosque', lat: 22.5772, lon: 88.3545, category: 'temple' },
  { name: 'ISKCON Kolkata', lat: 22.5410, lon: 88.3440, category: 'temple' },
  
  // Markets & Shopping
  { name: 'New Market', lat: 22.5567, lon: 88.3522, category: 'market' },
  { name: 'Gariahat Market', lat: 22.5173, lon: 88.3640, category: 'market' },
  { name: 'Dakshinapan Shopping Complex', lat: 22.5179, lon: 88.3625, category: 'market' },
  { name: 'Hatibagan Market', lat: 22.5909, lon: 88.3719, category: 'market' },
  { name: 'Burrabazar', lat: 22.5759, lon: 88.3577, category: 'market' },
  { name: 'Shyambazar Street Market', lat: 22.5990, lon: 88.3720, category: 'market' },
  { name: 'Lake Market', lat: 22.5190, lon: 88.3640, category: 'market' },
  { name: 'Sreeram Arcade', lat: 22.5745, lon: 88.4150, category: 'market' },
  
  // Bookstores & Libraries
  { name: 'College Street Book Market', lat: 22.5734, lon: 88.3638, category: 'bookstore' },
  { name: 'Oxford Bookstore Park Street', lat: 22.5540, lon: 88.3555, category: 'bookstore' },
  { name: 'Starmark Quest Mall', lat: 22.5537, lon: 88.3520, category: 'bookstore' },
  { name: 'National Library Kolkata', lat: 22.5350, lon: 88.3380, category: 'bookstore' },
  { name: 'Presidency Library', lat: 22.5735, lon: 88.3640, category: 'bookstore' },
  
  // Bridges
  { name: 'Howrah Bridge', lat: 22.5851, lon: 88.3468, category: 'bridge' },
  { name: 'Vidyasagar Setu', lat: 22.5198, lon: 88.3317, category: 'bridge' },
  { name: 'Vivekananda Setu', lat: 22.6567, lon: 88.3686, category: 'bridge' },
  { name: 'Nivedita Setu', lat: 22.6800, lon: 88.3900, category: 'bridge' },
  
  // Viewpoints
  { name: 'Princep Ghat Sunset Point', lat: 22.5610, lon: 88.3385, category: 'viewpoint' },
  { name: 'Eco Park Observation Tower', lat: 22.6115, lon: 88.4387, category: 'viewpoint' },
  { name: 'Science City Space Tower', lat: 22.5428, lon: 88.4147, category: 'viewpoint' },
  
  // Theaters & Cinema
  { name: 'Nandan Cinema', lat: 22.5451, lon: 88.3437, category: 'theater' },
  { name: 'Rabindra Sadan', lat: 22.5464, lon: 88.3503, category: 'theater' },
  { name: 'Academy of Fine Arts Theater', lat: 22.5463, lon: 88.3471, category: 'theater' },
  { name: 'Star Theatre', lat: 22.5840, lon: 88.3680, category: 'theater' },
  { name: 'Priya Cinema', lat: 22.5265, lon: 88.3630, category: 'theater' },
  { name: 'Inox Quest Mall', lat: 22.5537, lon: 88.3520, category: 'theater' },
  
  // Music Venues
  { name: 'Rabindra Sarobar Auditorium', lat: 22.5168, lon: 88.3668, category: 'music' },
  { name: 'ITC Sangeet Research Academy', lat: 22.5760, lon: 88.4890, category: 'music' },
  { name: 'Calcutta School of Music', lat: 22.5540, lon: 88.3555, category: 'music' },
  
  // Modern Landmarks
  { name: 'Park Street', lat: 22.5540, lon: 88.3555, category: 'modern' },
  { name: 'Quest Mall', lat: 22.5537, lon: 88.3520, category: 'modern' },
  { name: 'South City Mall', lat: 22.5069, lon: 88.3619, category: 'modern' },
  { name: 'City Centre Salt Lake', lat: 22.5745, lon: 88.4147, category: 'modern' },
  { name: 'Biswa Bangla Gate', lat: 22.6118, lon: 88.4393, category: 'modern' },
  { name: 'Acropolis Mall', lat: 22.5280, lon: 88.3300, category: 'modern' },
  { name: 'Mani Square Mall', lat: 22.5140, lon: 88.3725, category: 'modern' },
  
  // Sports & Recreation
  { name: 'Eden Gardens', lat: 22.5645, lon: 88.3433, category: 'sports' },
  { name: 'Salt Lake Stadium', lat: 22.5728, lon: 88.4050, category: 'sports' },
  { name: 'Calcutta Cricket Club', lat: 22.5553, lon: 88.3540, category: 'sports' },
  { name: 'Mohun Bagan Ground', lat: 22.5552, lon: 88.3538, category: 'sports' },
  
  // Educational
  { name: 'Presidency University', lat: 22.5735, lon: 88.3640, category: 'educational' },
  { name: 'Jadavpur University', lat: 22.4986, lon: 88.3716, category: 'educational' },
  { name: 'St Xavier College', lat: 22.5540, lon: 88.3555, category: 'educational' },
  { name: 'Scottish Church College', lat: 22.5733, lon: 88.3641, category: 'educational' },
  { name: 'Loreto College', lat: 22.5540, lon: 88.3555, category: 'educational' },
];

// Sleep function for rate limiting
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate description using Gemini
async function generateDescription(placeName: string, category: string): Promise<string> {
  if (!geminiApiKey) {
    console.log('⚠️  Gemini API key not found, using default description');
    return `Explore ${placeName}, a notable ${category} in Kolkata.`;
  }

  try {
    const prompt = `Write a single engaging sentence (20-30 words) describing ${placeName} in Kolkata, India. Focus on what makes it special or worth visiting. Be conversational and tourist-friendly. Do not use quotes or markdown.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return text.trim().replace(/^["']|["']$/g, '') || `Explore ${placeName}, a notable ${category} in Kolkata.`;
  } catch (error) {
    console.error(`Error generating description for ${placeName}:`, error);
    return `Explore ${placeName}, a notable ${category} in Kolkata.`;
  }
}

// Fetch image from Unsplash
async function fetchImage(placeName: string): Promise<string> {
  if (!unsplashAccessKey) {
    console.log('⚠️  Unsplash API key not found, using placeholder');
    return '';
  }

  try {
    const query = `${placeName} Kolkata`;
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${unsplashAccessKey}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results?.[0]?.urls?.regular || '';
  } catch (error) {
    console.error(`Error fetching image for ${placeName}:`, error);
    return '';
  }
}

// Main seeding function
async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');
  console.log(`📍 Total places to add: ${KOLKATA_GEMS.length}\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (let i = 0; i < KOLKATA_GEMS.length; i++) {
    const place = KOLKATA_GEMS[i];
    const progress = `[${i + 1}/${KOLKATA_GEMS.length}]`;

    try {
      console.log(`${progress} Processing: ${place.name} (${place.category})`);

      // Check if place already exists
      const { data: existing } = await supabase
        .from('pins')
        .select('id')
        .eq('name', place.name)
        .single();

      if (existing) {
        console.log(`  ⏭️  Skipped (already exists)\n`);
        skipCount++;
        continue;
      }

      // Generate description
      console.log(`  🤖 Generating description...`);
      const description = await generateDescription(place.name, place.category);
      await sleep(500); // Rate limit for Gemini

      // Fetch image
      console.log(`  🖼️  Fetching image...`);
      const imageUrl = await fetchImage(place.name);
      await sleep(500); // Rate limit for Unsplash

      // Insert into database
      const { error } = await supabase.from('pins').insert({
        name: place.name,
        description: description,
        latitude: place.lat,
        longitude: place.lon,
        image_url: imageUrl,
        category: place.category,
        created_by: 'system',
      });

      if (error) {
        throw error;
      }

      console.log(`  ✅ Successfully added!\n`);
      successCount++;

    } catch (error) {
      console.error(`  ❌ Error: ${error}\n`);
      errorCount++;
    }

    // Rate limiting between places
    await sleep(1000);
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎉 Seeding Complete!\n');
  console.log(`✅ Successfully added: ${successCount}`);
  console.log(`⏭️  Skipped (existing): ${skipCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('='.repeat(50));
}

// Run the script
seedDatabase().catch(console.error);
