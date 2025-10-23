# Hidden Kolkata - Development Log

## Project Overview
A gamified trail exploration platform for discovering Kolkata's hidden gems, heritage sites, and special places. Built with Next.js, Supabase, and MapLibre.

## Tech Stack
- **Framework**: Next.js 13 (App Router) with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Maps**: MapLibre GL + OpenStreetMap
- **Routing**: OSRM (OpenRouteService)
- **AI**: Google Gemini 1.5 Flash
- **Styling**: Tailwind CSS with teal/mint color scheme
- **UI Components**: shadcn/ui

---

## Phase 1: Foundation (Initial Setup)
### Implemented Features
- Basic Next.js project structure
- Supabase integration with environment variables
- Initial database schema for pins
- MapLibre integration for interactive maps
- Basic pin CRUD operations

### Database Tables
- `pins`: Basic location markers with name, description, coordinates, images

---

## Phase 2: Community Features
### Implemented Features
- Like/upvote system for pins
- Comment threads on pins
- Real-time updates using Supabase Realtime
- Enhanced UI with card-based layouts
- Search and filter functionality

### Database Additions
- Like tracking system
- Comments with user attribution
- Category-based filtering

---

## Phase 3: Gamification & Social (Current)
### Completed Features

#### 1. User Profiles & XP System
- **Table**: `profiles`
  - Username, email, avatar
  - XP (experience points)
  - Stats tracking (gems created, trails explored)
  - Automatic profile creation on signup
- **XP Rewards**:
  - Add Hidden Gem: +50 XP
  - Upvote Gem: +5 XP
  - Upload Memory: +25 XP
- **Level System**: Dynamic levels based on XP (100 XP per level)

#### 2. Hidden Gems Feature
- **Table**: `hidden_gems`
  - Name, description, location (lat/lng)
  - Image upload to Supabase Storage
  - Creator attribution
  - Upvote count
- **Components**:
  - `HiddenGemCard`: Display gem with image, upvotes, comments
  - `AddHiddenGemModal`: Create new gems with photo upload
  - Integrated into map view with sparkle markers
- **Features**:
  - Geolocation capture
  - One upvote per user
  - Real-time comment threads
  - Collapsible discussion panels

#### 3. Trail Memories Gallery
- **Table**: `memories`
  - Photo URL, caption, trail name
  - Location coordinates (optional)
  - User attribution
- **Components**:
  - `MemoryCard`: Photo card with trail info and metadata
  - `AddMemoryModal`: Upload photos with captions
- **Gallery Page** (`/memories`):
  - Masonry grid layout
  - Search by trail name, caption, or username
  - Sort by date (newest/oldest)
  - Lazy-loaded images

#### 4. Leaderboard System
- **Page**: `/leaderboard`
- **Features**:
  - Top 50 users by XP
  - Medal icons for top 3 (🥇🥈🥉)
  - Stats display (gems, trails, XP)
  - Color-coded XP badges based on level
  - Real-time ranking updates

#### 5. AI Trail Discovery
- **Page**: `/discover`
- **Integration**: Google Gemini 1.5 Flash
- **Features**:
  - Natural language trail requests
  - Quick prompt suggestions
  - Generated trails with 3-5 stops
  - Real Kolkata coordinates
  - Stop descriptions and captions
  - Copy trail data to clipboard

#### 6. User Profile Dashboard
- **Page**: `/profile`
- **Features**:
  - User stats overview
  - XP progress bar to next level
  - Level titles (Novice → Master Explorer)
  - Recent hidden gems list
  - Recent memories grid
  - Member since date
  - Sign out functionality

#### 7. Enhanced Navigation
- **Updated Header**:
  - New routes: Discover, Memories, Leaderboard, Profile
  - Teal/mint color scheme
  - Active state indicators
  - Mobile-responsive design

#### 8. Map Integration
- Combined pins and hidden gems on single map
- Visual distinction (sparkle icon for gems)
- "Add Hidden Gem" button on map page
- Stats display (pins vs gems count)
- Random gem selector includes both types

---

## Database Schema Summary

### Core Tables
1. **profiles**: User accounts with XP and stats
2. **hidden_gems**: Community-discovered special places
3. **gem_upvotes**: One vote per user per gem
4. **memories**: Photo gallery of trail experiences
5. **gem_comments**: Discussion threads on gems
6. **pins**: Original location markers (legacy)

### Security (RLS)
- All tables have Row Level Security enabled
- Public read access for community content
- Users can only edit/delete their own content
- Profile updates restricted to owner

### Helper Functions
- `award_xp()`: Grant XP and update user stats
- `increment_gem_upvotes()`: Safely increment votes
- `decrement_gem_upvotes()`: Safely decrement votes
- `handle_new_user()`: Auto-create profile on signup

---

## API Integration Summary

### Supabase APIs Used
- Database queries (select, insert, update, delete)
- Storage for images (gems/, memories/ buckets)
- Realtime subscriptions for comments
- Auth for user management
- RPC for custom functions

### External APIs
- **Nominatim**: Location search
- **OSRM**: Route planning
- **Google Gemini**: AI trail suggestions
- **Unsplash**: Stock photos (optional)
- **Wikipedia**: Location enrichment (optional)

---

## Design System

### Colors
- **Primary**: Teal-500 (#14B8A6)
- **Secondary**: Mint-500 (custom mint green)
- **Gradients**: Teal to Mint
- **Background**: Cream-50 to Mint-50 gradient
- **Text**: Gray-800 (headings), Gray-600 (body)

### Typography
- **Font**: Inter/Poppins
- **Headings**: Bold, large sizes
- **Body**: Regular weight, comfortable line height

### Components
- Rounded corners (rounded-xl, rounded-lg)
- Soft shadows (shadow-md, shadow-lg)
- Hover transitions
- Card-based layouts
- Glassmorphic overlays

---

## Project Structure

```
app/
├── page.tsx              # Home landing page
├── map/page.tsx          # Interactive map view
├── discover/page.tsx     # AI trail suggestions
├── memories/page.tsx     # Photo gallery
├── leaderboard/page.tsx  # XP rankings
├── profile/page.tsx      # User dashboard
├── gems/page.tsx         # Hidden gems grid
├── add/page.tsx          # Add pin (legacy)
├── routes/page.tsx       # Route planner
└── analytics/page.tsx    # Usage analytics

components/
├── Header.tsx            # Navigation bar
├── Footer.tsx            # Footer
├── HiddenGemCard.tsx     # Gem display card
├── AddHiddenGemModal.tsx # Create gem form
├── MemoryCard.tsx        # Photo card
├── AddMemoryModal.tsx    # Upload memory form
├── MapComponent.tsx      # Map wrapper
├── LikeButton.tsx        # Vote button
└── ui/                   # shadcn components

lib/
├── supabaseClient.ts     # Supabase instance
├── fetchGemini.ts        # AI API wrapper
├── fetchNominatim.ts     # Location search
├── fetchOSRM.ts          # Routing
├── fetchUnsplash.ts      # Images
└── fetchWikipedia.ts     # Info lookup

utils/
├── types.ts              # TypeScript types
└── constants.ts          # Config values

supabase/migrations/
└── *.sql                 # Database migrations
```

---

## Key Features Summary

### Social & Community
✅ User profiles with avatars
✅ XP and leveling system
✅ Hidden gems discovery
✅ Photo memories gallery
✅ Comment threads
✅ Upvote system
✅ Leaderboard rankings

### Exploration
✅ Interactive map
✅ Location search
✅ Random gem finder
✅ AI trail generator
✅ Route planning
✅ Analytics dashboard

### Content Creation
✅ Add hidden gems
✅ Upload photos
✅ Write captions
✅ Add comments
✅ Vote on content
✅ Geolocation capture

---

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=
NEXT_PUBLIC_GEMINI_API_KEY=
NEXT_PUBLIC_OSRM_URL=https://router.project-osrm.org
```

---

## Pending Enhancements

### Future Ideas
- [ ] Social following system
- [ ] Trail challenges and achievements
- [ ] Weekly gem of the week
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Offline map caching
- [ ] AR navigation
- [ ] Gem verification badges
- [ ] Private trails/collections
- [ ] Export trail as GPX

### Technical Debt
- [ ] Add comprehensive error boundaries
- [ ] Implement loading skeletons
- [ ] Add unit tests
- [ ] Optimize image loading (next/image)
- [ ] Add PWA support
- [ ] Implement CDN for images
- [ ] Add rate limiting
- [ ] Add content moderation

---

## Development Notes

### Best Practices Followed
- TypeScript for type safety
- Server components where possible
- Client components with 'use client' directive
- Proper error handling
- Loading states
- Optimistic UI updates
- Real-time subscriptions cleanup
- Secure RLS policies
- Environment variable management

### Performance Optimizations
- Lazy loading for images
- Pagination for large lists
- Index-based database queries
- Efficient Supabase queries
- Debounced search inputs
- Cached API responses

---

## Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Type Checking
```bash
npm run typecheck
```

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **MapLibre GL**: https://maplibre.org/
- **shadcn/ui**: https://ui.shadcn.com/
- **Tailwind CSS**: https://tailwindcss.com/

---

**Last Updated**: 2025-10-12
**Version**: Phase 3 (Gamification Complete)
**Status**: Production Ready
