'use client';

import { useState, useEffect } from 'react';
import { Trophy, Award, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { Profile } from '@/utils/types';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('xp', { ascending: false })
        .limit(50);

      if (data) {
        setLeaders(data as Profile[]);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-2xl">🥇</span>;
      case 2:
        return <span className="text-2xl">🥈</span>;
      case 3:
        return <span className="text-2xl">🥉</span>;
      default:
        return (
          <span className="text-gray-500 font-bold text-lg w-8 text-center">#{rank}</span>
        );
    }
  };

  const getXPBadgeColor = (xp: number) => {
    if (xp >= 1000) return 'bg-gradient-to-r from-amber-400 to-orange-500';
    if (xp >= 500) return 'bg-gradient-to-r from-purple-400 to-pink-500';
    if (xp >= 200) return 'bg-gradient-to-r from-blue-400 to-cyan-500';
    return 'bg-gradient-to-r from-teal-400 to-mint-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-mint-50 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-teal-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-mint-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 text-amber-500" />
            Leaderboard
          </h1>
          <p className="text-gray-600">
            Top explorers who have discovered the most hidden gems and created memorable trails
          </p>
        </div>

        <div className="grid gap-4 mb-6 grid-cols-1 md:grid-cols-3">
          <Card className="text-center shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-500" />
                Total Gems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">
                {leaders.reduce((sum, l) => sum + l.gems_created, 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4 text-mint-500" />
                Total XP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">
                {leaders.reduce((sum, l) => sum + l.xp, 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 flex items-center justify-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Explorers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{leaders.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-mint-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Top Explorers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {leaders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No explorers yet. Be the first to discover hidden gems!</p>
                </div>
              ) : (
                leaders.map((leader, idx) => (
                  <div
                    key={leader.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      idx < 3 ? 'bg-gradient-to-r from-amber-50/30 to-transparent' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 flex items-center justify-center">
                        {getMedalIcon(idx + 1)}
                      </div>

                      <Avatar className="w-12 h-12">
                        <AvatarImage src={leader.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-teal-400 to-mint-400 text-white font-bold">
                          {leader.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {leader.username}
                        </h3>
                        <div className="flex gap-3 text-xs text-gray-500 mt-1">
                          <span>{leader.gems_created} gems</span>
                          <span>{leader.trails_explored} trails</span>
                        </div>
                      </div>

                      <Badge
                        className={`${getXPBadgeColor(
                          leader.xp
                        )} text-white font-bold px-3 py-1`}
                      >
                        {leader.xp.toLocaleString()} XP
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Rankings update in real-time as users explore and contribute</p>
        </div>
      </div>
    </div>
  );
}
