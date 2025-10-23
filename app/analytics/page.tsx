'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Pin } from '@/utils/types';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import { BarChart3, Loader2, TrendingUp, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function AnalyticsPage() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPins();
  }, []);

  const fetchPins = async () => {
    try {
      const { data, error } = await supabase
        .from('pins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPins(data || []);
    } catch (error) {
      console.error('Error fetching pins:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const totalLikes = pins.reduce((sum, pin) => sum + (pin.likes || 0), 0);

  const recentPins = pins.filter((pin) => {
    const createdDate = new Date(pin.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate >= thirtyDaysAgo;
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#C46C24] mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <BarChart3 size={32} className="text-[#C46C24]" />
          Community Analytics
        </h1>
        <p className="text-gray-600">
          Insights into Hidden Kolkata&apos;s growing community and discovered gems
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Gems</p>
              <p className="text-3xl font-bold text-gray-900">{pins.length}</p>
            </div>
            <div className="w-12 h-12 bg-[#C46C24]/10 rounded-lg flex items-center justify-center">
              <MapPin size={24} className="text-[#C46C24]" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Discovered across Kolkata
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Likes</p>
              <p className="text-3xl font-bold text-gray-900">{totalLikes}</p>
            </div>
            <div className="w-12 h-12 bg-[#C46C24]/10 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-[#C46C24]" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Community engagement
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Added This Month</p>
              <p className="text-3xl font-bold text-gray-900">{recentPins}</p>
            </div>
            <div className="w-12 h-12 bg-[#C46C24]/10 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-[#C46C24]" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Last 30 days
          </p>
        </div>
      </div>

      {pins.length > 0 ? (
        <AnalyticsCharts pins={pins} />
      ) : (
        <div className="bg-white rounded-xl p-12 shadow-lg text-center">
          <BarChart3 size={64} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No data available yet. Start adding hidden gems to see analytics!
          </p>
        </div>
      )}
    </div>
  );
}
