'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { fetchUnsplashImage } from '@/lib/fetchUnsplash';
import { MapPin, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type AddGemFormProps = {
  selectedLocation: { lat: number; lng: number } | null;
  onSuccess?: () => void;
};

export default function AddGemForm({ selectedLocation, onSuccess }: AddGemFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingImage, setFetchingImage] = useState(false);

  const handleFetchImage = async () => {
    if (!name) {
      toast.error('Please enter a name first');
      return;
    }

    setFetchingImage(true);
    try {
      const url = await fetchUnsplashImage(name);
      if (url) {
        setImageUrl(url);
        toast.success('Image fetched successfully');
      } else {
        toast.error('No image found. Try a different name.');
      }
    } catch (error) {
      toast.error('Failed to fetch image');
    } finally {
      setFetchingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLocation) {
      toast.error('Please select a location on the map');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter a name for this gem');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('pins').insert([
        {
          name: name.trim(),
          description: description.trim(),
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
          image_url: imageUrl,
          created_by: null,
        },
      ]);

      if (error) throw error;

      toast.success('Hidden gem added successfully!');
      setName('');
      setDescription('');
      setImageUrl('');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding gem:', error);
      toast.error('Failed to add gem. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Add a Hidden Gem</h2>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Name *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C46C24] focus:border-transparent outline-none transition"
          placeholder="e.g., College Street Coffee House"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C46C24] focus:border-transparent outline-none transition resize-none"
          placeholder="Tell us what makes this place special..."
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
          Image URL
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C46C24] focus:border-transparent outline-none transition"
            placeholder="https://..."
          />
          <button
            type="button"
            onClick={handleFetchImage}
            disabled={fetchingImage || !name}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {fetchingImage ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ImageIcon size={18} />
            )}
            Fetch
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Click &quot;Fetch&quot; to automatically find an image from Unsplash
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={18} className="text-[#C46C24]" />
          {selectedLocation ? (
            <span>
              Location selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
            </span>
          ) : (
            <span className="text-gray-400">Click on the map to select a location</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !selectedLocation}
        className="w-full px-6 py-3 bg-[#C46C24] text-white rounded-lg font-medium hover:bg-[#A05A1D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Adding...
          </>
        ) : (
          'Add Hidden Gem'
        )}
      </button>
    </form>
  );
}
