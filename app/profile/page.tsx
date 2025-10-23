'use client';

import { useState, useEffect } from 'react';
import { User, Award, Sparkles, TrendingUp, Calendar, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { Profile, HiddenGem, Memory } from '@/utils/types';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userGems, setUserGems] = useState<HiddenGem[]>([]);
  const [userMemories, setUserMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData as Profile);
      }

      const { data: gemsData } = await supabase
        .from('hidden_gems')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (gemsData) {
        setUserGems(gemsData as HiddenGem[]);
      }

      const { data: memoriesData } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (memoriesData) {
        setUserMemories(memoriesData as Memory[]);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    router.push('/');
  };

  const getXPLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1;
  };

  const getXPProgress = (xp: number) => {
    return (xp % 100);
  };

  const getLevelTitle = (level: number) => {
    if (level >= 20) return 'Master Explorer';
    if (level >= 15) return 'Trail Veteran';
    if (level >= 10) return 'Expert Navigator';
    if (level >= 5) return 'Seasoned Wanderer';
    return 'Novice Explorer';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-mint-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-teal-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-mint-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>Please sign in to view your profile</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const level = getXPLevel(profile.xp);
  const xpProgress = getXPProgress(profile.xp);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-mint-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Card className="mb-6 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-mint-500 h-32" />
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-teal-400 to-mint-400 text-white text-4xl font-bold">
                  {profile.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800 mb-1">{profile.username}</h1>
                <p className="text-gray-600 mb-2">{profile.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className="bg-gradient-to-r from-teal-500 to-mint-500 text-white">
                    Level {level}
                  </Badge>
                  <Badge variant="outline">{getLevelTitle(level)}</Badge>
                </div>
              </div>

              <Button variant="outline" onClick={handleSignOut} className="md:self-start mt-4">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Progress to Level {level + 1}
                </span>
                <span className="text-sm font-bold text-teal-600">
                  {xpProgress} / 100 XP
                </span>
              </div>
              <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-mint-500 transition-all duration-300"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Total XP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{profile.xp.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-500" />
                Hidden Gems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{profile.gems_created}</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-mint-500" />
                Trails
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{profile.trails_explored}</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Member Since
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-gray-800">
                {format(new Date(profile.created_at), 'MMM yyyy')}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-500" />
                Recent Hidden Gems
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userGems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hidden gems yet</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {userGems.slice(0, 5).map((gem) => (
                    <div
                      key={gem.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {gem.image_url && (
                        <img
                          src={gem.image_url}
                          alt={gem.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm truncate">
                          {gem.name}
                        </h4>
                        <p className="text-xs text-gray-600 truncate">{gem.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{gem.upvotes} upvotes</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-mint-500" />
                Recent Memories
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userMemories.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No memories yet</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {userMemories.slice(0, 5).map((memory) => (
                    <div
                      key={memory.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={memory.image_url}
                        alt={memory.trail_name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm truncate">
                          {memory.trail_name}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2">{memory.caption}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(memory.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
