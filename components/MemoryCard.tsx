'use client';

import { MapPin, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Memory } from '@/utils/types';
import { format } from 'date-fns';

interface MemoryCardProps {
  memory: Memory;
}

export default function MemoryCard({ memory }: MemoryCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all group">
      <div className="relative h-64 overflow-hidden">
        <img
          src={memory.image_url}
          alt={memory.trail_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-lg mb-1 drop-shadow-lg">
            {memory.trail_name}
          </h3>
          {memory.caption && (
            <p className="text-white/90 text-sm drop-shadow-md line-clamp-2">
              {memory.caption}
            </p>
          )}
        </div>
      </div>
      <CardContent className="p-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            {memory.latitude && memory.longitude && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>
                  {memory.latitude.toFixed(2)}, {memory.longitude.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(memory.created_at), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
        {memory.profiles && (
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="w-5 h-5">
              <AvatarImage src={memory.profiles.avatar_url} />
              <AvatarFallback>{memory.profiles.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600">{memory.profiles.username}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
