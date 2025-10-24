export const KOLKATA_CENTER = {
  lat: 22.5726,
  lng: 88.3639,
};

export const DEFAULT_ZOOM = 12;
export const MARKER_ZOOM = 15;

export const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Category definitions for gems with Lucide icon names
export const GEM_CATEGORIES = {
  park: { label: 'Parks & Gardens', icon: 'Trees', color: '#22c55e' },
  lake: { label: 'Lakes & Water Bodies', icon: 'Waves', color: '#06b6d4' },
  restaurant: { label: 'Restaurants', icon: 'Utensils', color: '#f97316' },
  cafe: { label: 'Cafés & Coffee', icon: 'Coffee', color: '#8b5cf6' },
  street_food: { label: 'Street Food', icon: 'Pizza', color: '#ec4899' },
  heritage: { label: 'Heritage Sites', icon: 'Landmark', color: '#dc2626' },
  colonial: { label: 'Colonial Buildings', icon: 'Building2', color: '#991b1b' },
  culture: { label: 'Museums & Culture', icon: 'Palette', color: '#eab308' },
  art: { label: 'Art Galleries', icon: 'Paintbrush', color: '#a855f7' },
  ghat: { label: 'Ghats & Riversides', icon: 'Sunset', color: '#3b82f6' },
  temple: { label: 'Religious Sites', icon: 'Church', color: '#f59e0b' },
  market: { label: 'Markets & Shopping', icon: 'ShoppingBag', color: '#64748b' },
  bookstore: { label: 'Bookstores & Libraries', icon: 'BookOpen', color: '#0891b2' },
  bridge: { label: 'Bridges', icon: 'Bridge', color: '#475569' },
  viewpoint: { label: 'Viewpoints', icon: 'Eye', color: '#6366f1' },
  theater: { label: 'Theaters & Cinema', icon: 'Theater', color: '#be123c' },
  music: { label: 'Music Venues', icon: 'Music', color: '#7c3aed' },
  modern: { label: 'Modern Landmarks', icon: 'Building', color: '#0f172a' },
  sports: { label: 'Sports & Recreation', icon: 'Trophy', color: '#15803d' },
  educational: { label: 'Educational', icon: 'GraduationCap', color: '#1e40af' },
  other: { label: 'Other Places', icon: 'MapPin', color: '#71717a' },
} as const;

export type GemCategory = keyof typeof GEM_CATEGORIES;
