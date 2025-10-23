'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import HiddenGemCard from '@/components/HiddenGemCard';
import AddHiddenGemModal from '@/components/AddHiddenGemModal';
import { supabase } from '@/lib/supabaseClient';
import { HiddenGem } from '@/utils/types';

export default function GemsPage() {
  const [gems, setGems] = useState<HiddenGem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  useEffect(() => {
    checkUser();
    loadGems();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setCurrentUserId(user?.id);
  };

  const loadGems = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('hidden_gems')
        .select(`
          *,
          profiles:created_by (username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (data) {
        setGems(data as HiddenGem[]);
      }
    } catch (error) {
      console.error('Error loading gems:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-mint-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-teal-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading hidden gems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-mint-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-teal-500" />
              Hidden Gems
            </h1>
            <p className="text-gray-600">
              Discover special places shared by our community
            </p>
          </div>
          <AddHiddenGemModal currentUserId={currentUserId} onGemAdded={loadGems} />
        </div>

        {gems.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No hidden gems yet</h3>
            <p className="text-gray-500 mb-6">Be the first to share a special place!</p>
            {currentUserId && (
              <AddHiddenGemModal currentUserId={currentUserId} onGemAdded={loadGems} />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gems.map((gem) => (
              <HiddenGemCard
                key={gem.id}
                gem={gem}
                currentUserId={currentUserId}
                onUpvoteChange={loadGems}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
