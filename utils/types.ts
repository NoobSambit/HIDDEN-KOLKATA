import { GemCategory } from './constants';

export type Pin = {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  image_url: string;
  created_by: string | null;
  created_at: string;
  likes?: number;
  category?: GemCategory;
};

export type MapPosition = {
  lat: number;
  lng: number;
};

export type Profile = {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  xp: number;
  gems_created: number;
  trails_explored: number;
  created_at: string;
};

export type HiddenGem = {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  image_url: string;
  created_by: string | null;
  upvotes: number;
  created_at: string;
  profiles?: Profile;
};

export type Memory = {
  id: string;
  user_id: string;
  trail_name: string;
  caption: string;
  image_url: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  profiles?: Profile;
};

export type GemComment = {
  id: string;
  gem_id: string;
  user_id: string;
  text: string;
  created_at: string;
  profiles?: Profile;
};

export type GemUpvote = {
  id: string;
  gem_id: string;
  user_id: string;
  created_at: string;
};

export type AITrailSuggestion = {
  title: string;
  description: string;
  stops: {
    name: string;
    lat: number;
    lng: number;
    caption: string;
  }[];
};
