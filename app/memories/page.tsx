'use client';

import { useState, useEffect } from 'react';
import { Camera, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MemoryCard from '@/components/MemoryCard';
import AddMemoryModal from '@/components/AddMemoryModal';
import { supabase } from '@/lib/supabaseClient';
import { Memory } from '@/utils/types';

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [filteredMemories, setFilteredMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');

  useEffect(() => {
    checkUser();
    loadMemories();
  }, []);

  useEffect(() => {
    filterAndSortMemories();
  }, [memories, searchQuery, sortBy]);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setCurrentUserId(user?.id);
  };

  const loadMemories = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('memories')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (data) {
        setMemories(data as Memory[]);
      }
    } catch (error) {
      console.error('Error loading memories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortMemories = () => {
    let filtered = [...memories];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (memory) =>
          memory.trail_name.toLowerCase().includes(query) ||
          memory.caption.toLowerCase().includes(query) ||
          memory.profiles?.username.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === 'recent' ? dateB - dateA : dateA - dateB;
    });

    setFilteredMemories(filtered);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-mint-50 flex items-center justify-center">
        <div className="text-center">
          <Camera className="w-16 h-16 text-teal-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading memories...</p>
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
              <Camera className="w-8 h-8 text-teal-500" />
              Trail Memories
            </h1>
            <p className="text-gray-600">Capturing moments from Kolkata's trails</p>
          </div>
          <AddMemoryModal currentUserId={currentUserId} onMemoryAdded={loadMemories} />
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search memories by trail name, caption, or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={sortBy} onValueChange={(value: 'recent' | 'oldest') => setSortBy(value)}>
            <SelectTrigger className="w-full md:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredMemories.length === 0 ? (
          <div className="text-center py-16">
            <Camera className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchQuery ? 'No memories found' : 'No memories yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Start capturing your favorite moments from the trails'}
            </p>
            {!searchQuery && currentUserId && (
              <AddMemoryModal currentUserId={currentUserId} onMemoryAdded={loadMemories} />
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMemories.map((memory) => (
                <MemoryCard key={memory.id} memory={memory} />
              ))}
            </div>
            <div className="text-center mt-8 text-sm text-gray-500">
              Showing {filteredMemories.length} of {memories.length} memories
            </div>
          </>
        )}
      </div>
    </div>
  );
}
