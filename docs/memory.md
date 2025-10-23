# Hidden Kolkata – Development Memory

## Project Overview
Hidden Kolkata is a full-stack Next.js application for discovering and sharing hidden gems across Kolkata. The app features an interactive map, community contributions, and integrates with multiple free-tier APIs.

---

## [2025-10-09] Initial Setup and Core Implementation

### Database Setup
- Created Supabase `pins` table with complete schema:
  - id (uuid, primary key)
  - name (text)
  - description (text)
  - latitude (float)
  - longitude (float)
  - image_url (text)
  - created_by (text, nullable)
  - created_at (timestamptz)
- Implemented Row Level Security (RLS) policies:
  - Public read access for all pins
  - Authenticated and anonymous users can insert pins
  - Users can update/delete their own pins
  - Added geospatial index for efficient location queries

### API Integration Layer
Created utility functions for all external APIs:
- **Supabase Client** (`lib/supabaseClient.ts`): Database connection and type definitions
- **Unsplash API** (`lib/fetchUnsplash.ts`): Fetches location images
- **Nominatim API** (`lib/fetchNominatim.ts`): Geocoding and reverse geocoding
- **Wikipedia API** (`lib/fetchWikipedia.ts`): Place descriptions
- **Gemini API** (`lib/fetchGemini.ts`): AI trail suggestions and random gem descriptions

### Map Components
- **MapComponent** (`components/MapComponent.tsx`): Client-side wrapper with dynamic import
- **MapView** (`components/MapView.tsx`): Core Leaflet map implementation with:
  - OpenStreetMap tiles
  - Custom markers for pins
  - Interactive popups with place info
  - Click handler for location selection
  - Support for selected location highlighting
- **PinPopup** (`components/PinPopup.tsx`): Modal popup for detailed pin view
- Installed React-Leaflet 4.2.1 for React 18 compatibility

### Form Components
- **AddGemForm** (`components/AddGemForm.tsx`):
  - Form for adding new hidden gems
  - Auto-fetch images from Unsplash
  - Real-time location preview
  - Toast notifications for user feedback

### Layout Components
- **Header** (`components/Header.tsx`): Navigation with active route highlighting
- **Footer** (`components/Footer.tsx`): Branding and attribution

### Pages Implemented
1. **Home Page** (`app/page.tsx`):
   - Hero section with tagline
   - Feature cards explaining Discover, Contribute, Explore
   - CTA buttons for Explore Map and Add Gem

2. **Map Explorer** (`app/map/page.tsx`):
   - Interactive map with all pins
   - Search functionality using Nominatim API
   - Random gem discovery feature
   - Pin count display

3. **Add Gem Page** (`app/add/page.tsx`):
   - Two-column layout: form + map
   - Click-to-select location on map
   - Redirects to map page on success

### Styling and Design
- Updated `app/layout.tsx`: Added Header, Footer, and Toaster
- Modified `app/globals.css`: Removed dark mode, light theme only
- Background color: `#FAF9F6` (soft ivory)
- Accent color: `#C46C24` (warm orange-brown)
- Font: Inter (Google Fonts)
- Clean, minimal design with rounded cards and subtle shadows

### Configuration
- Created `.env.example` with all required API keys
- Updated `.env.local` with Supabase credentials
- Package dependencies:
  - leaflet
  - react-leaflet@4.2.1
  - @types/leaflet

### Utilities
- **types.ts**: TypeScript type definitions for Pin and MapPosition
- **constants.ts**: Kolkata coordinates, zoom levels, OSM configuration

---

## [2025-10-10] Phase 2 – Community Features and Hidden Routes

### Database Enhancements
- **Updated `pins` table**:
  - Added `likes` column (integer, default 0) for community engagement
  - Added `category` column (text, default 'Other') for analytics grouping
  - Created indexes for efficient queries on category and created_at

- **New `comments` table**:
  - id (uuid, primary key)
  - pin_id (uuid, foreign key to pins)
  - content (text) - comment text
  - author_name (text, default 'Anonymous') - optional user name
  - created_at (timestamptz)
  - RLS: Public read access, anyone can insert
  - Indexed on pin_id and created_at for performance

- **New `trails` table**:
  - id (uuid, primary key)
  - title (text) - AI-generated trail name
  - description (text) - AI-generated trail description
  - pin_ids (jsonb) - ordered array of pin IDs
  - path (jsonb) - OSRM route geometry coordinates
  - created_by (text, nullable) - user identifier
  - created_at (timestamptz)
  - RLS: Public read access, anyone can insert
  - Users can delete their own trails

### API Integrations
- **OSRM Routing** (`lib/fetchOSRM.ts`):
  - Fetches walking routes between multiple waypoints
  - Returns coordinates, distance, and duration
  - Helper functions: formatDistance() and formatDuration()
  - Uses free OSRM public API (https://router.project-osrm.org)

- **Enhanced Gemini API** (`lib/fetchGemini.ts`):
  - New `generateHiddenRoute()` function
  - Returns structured JSON: title, description, optimized pin order
  - Intelligent route naming and storytelling
  - Error handling for JSON parsing

### Community Components
- **LikeButton** (`components/LikeButton.tsx`):
  - Optimistic UI updates for likes
  - LocalStorage tracking of user likes
  - Animated heart icon
  - Integrates with Supabase to update pin likes count

- **CommentSection** (`components/CommentSection.tsx`):
  - Display comments with author and timestamp
  - Anonymous commenting (no auth required)
  - Add comment form with name field (optional)
  - Real-time comment count
  - Scrollable comment list
  - Uses date-fns for relative timestamps

### Route Generation Features
- **HiddenRouteGenerator** (`components/HiddenRouteGenerator.tsx`):
  - Multi-select interface for choosing 2-5 pins
  - Visual feedback for selected pins
  - Calls Gemini API for route narrative
  - Calls OSRM API for walking directions
  - Reorders pins based on AI suggestions
  - Displays distance, duration, and stop count

- **RouteMapView** (`components/RouteMapView.tsx`):
  - Dedicated map component for route visualization
  - Polyline rendering in accent color (#C46C24)
  - Numbered markers for waypoint order
  - Enhanced popups with pin images

### New Pages
1. **Hidden Routes** (`app/routes/page.tsx`):
   - Two-column layout: generator sidebar + map
   - Interactive route creation with AI
   - Save routes to database
   - Route details card with:
     - AI-generated title and description
     - Distance and duration metrics
     - Ordered stop list
     - Save route functionality
   - Clear route and start over

2. **Analytics Dashboard** (`app/analytics/page.tsx`):
   - Summary cards with key metrics:
     - Total gems discovered
     - Total community likes
     - Gems added this month
   - Three main visualizations using Recharts

### Analytics Visualizations
- **AnalyticsCharts** (`components/AnalyticsCharts.tsx`):
  - **Category Distribution**: Pie chart showing gem categories
  - **Top Areas**: Bar chart of neighborhoods with most gems
  - **Growth Over Time**: Line chart of monthly gem additions
  - Automatic neighborhood detection based on coordinates
  - Color scheme matching app design (#C46C24 palette)

### Enhanced Map Interactions
- **Updated MapView** (`components/MapView.tsx`):
  - Integrated LikeButton in popups
  - Integrated CommentSection in popups
  - Share button with clipboard copy
  - Larger popup width (400px) for better content display
  - Scrollable comments section within popup

### Navigation Updates
- **Updated Header** (`components/Header.tsx`):
  - Added Routes link with route icon
  - Added Analytics link with chart icon
  - Condensed spacing for 5 nav items
  - Active state highlighting for all routes

### Environment Configuration
- Updated `.env` and `.env.example`:
  - Changed `GEMINI_API_KEY` to `NEXT_PUBLIC_GEMINI_API_KEY` (client-side access)
  - Added `NEXT_PUBLIC_OSRM_URL=https://router.project-osrm.org`
  - All APIs remain free-tier

### Design Consistency
- Maintained light aesthetic (#FAF9F6 background, #C46C24 accent)
- All new components use Inter font
- Rounded cards with subtle shadows
- Responsive layouts for mobile
- Toast notifications for all interactions
- Loading states with spinner animations

---

## Next Steps
- Test route generation with Gemini API (requires API key)
- Test Unsplash image fetching (requires API key)
- Add saved routes list view
- Optional: Add user authentication for saved routes
- Optional: Add PWA manifest for offline support
- Deploy to Vercel

---

## Technical Notes
- All APIs are free-tier, no paid services
- Map uses OpenStreetMap (no Mapbox/Google Maps)
- Leaflet loaded client-side only (SSR disabled)
- RLS policies ensure data security
- Responsive design with mobile breakpoints
- Toast notifications for all user actions

---

## File Structure
```
/app
  /map/page.tsx
  /add/page.tsx
  /routes/page.tsx (NEW)
  /analytics/page.tsx (NEW)
  layout.tsx
  page.tsx
  globals.css
/components
  MapComponent.tsx
  MapView.tsx (UPDATED with likes/comments/share)
  AddGemForm.tsx
  PinPopup.tsx
  Header.tsx (UPDATED with new routes)
  Footer.tsx
  LikeButton.tsx (NEW)
  CommentSection.tsx (NEW)
  HiddenRouteGenerator.tsx (NEW)
  RouteMapView.tsx (NEW)
  AnalyticsCharts.tsx (NEW)
/lib
  supabaseClient.ts
  fetchUnsplash.ts
  fetchNominatim.ts
  fetchWikipedia.ts
  fetchGemini.ts (UPDATED with generateHiddenRoute)
  fetchOSRM.ts (NEW)
/utils
  types.ts
  constants.ts
/docs
  memory.md
/supabase/migrations
  20251009150640_create_pins_table.sql
  add_community_features.sql (NEW)
```
