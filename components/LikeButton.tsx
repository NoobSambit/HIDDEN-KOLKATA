'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

type LikeButtonProps = {
  pinId: string;
  initialLikes: number;
};

export default function LikeButton({ pinId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const likedPins = localStorage.getItem('likedPins');
    if (likedPins) {
      const liked = JSON.parse(likedPins);
      setIsLiked(liked.includes(pinId));
    }
  }, [pinId]);

  const handleLike = async () => {
    if (isAnimating) return;

    setIsAnimating(true);

    const newLikedState = !isLiked;
    const newLikesCount = newLikedState ? likes + 1 : likes - 1;

    setIsLiked(newLikedState);
    setLikes(newLikesCount);

    const likedPins = localStorage.getItem('likedPins');
    let liked = likedPins ? JSON.parse(likedPins) : [];

    if (newLikedState) {
      liked.push(pinId);
    } else {
      liked = liked.filter((id: string) => id !== pinId);
    }

    localStorage.setItem('likedPins', JSON.stringify(liked));

    try {
      const { error } = await supabase
        .from('pins')
        .update({ likes: newLikesCount })
        .eq('id', pinId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating likes:', error);
      setIsLiked(!newLikedState);
      setLikes(newLikedState ? likes - 1 : likes + 1);
      toast.error('Failed to update like');
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        isLiked
          ? 'bg-[#C46C24] text-white hover:bg-[#A05A1D]'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${isAnimating ? 'scale-110' : 'scale-100'}`}
    >
      <Heart
        size={18}
        className={`transition-all ${isLiked ? 'fill-white' : 'fill-none'}`}
      />
      <span>{likes}</span>
    </button>
  );
}
