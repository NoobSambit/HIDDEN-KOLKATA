'use client';

import { Pin } from '@/utils/types';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useMemo } from 'react';

type AnalyticsChartsProps = {
  pins: Pin[];
};

const COLORS = ['#C46C24', '#E88B3A', '#F4A460', '#DEB887', '#D2B48C', '#BC8F8F'];

export default function AnalyticsCharts({ pins }: AnalyticsChartsProps) {
  const categoryData = useMemo(() => {
    const categories = pins.reduce((acc, pin) => {
      const category = pin.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
  }, [pins]);

  const neighborhoodData = useMemo(() => {
    const neighborhoods: Record<string, number> = {};

    pins.forEach((pin) => {
      const area = extractNeighborhood(pin.latitude, pin.longitude);
      neighborhoods[area] = (neighborhoods[area] || 0) + 1;
    });

    return Object.entries(neighborhoods)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, count]) => ({
        name,
        count,
      }));
  }, [pins]);

  const timelineData = useMemo(() => {
    const months: Record<string, number> = {};

    pins.forEach((pin) => {
      const date = new Date(pin.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months[monthKey] = (months[monthKey] || 0) + 1;
    });

    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({
        month: formatMonth(month),
        count,
      }));
  }, [pins]);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-6 text-gray-900">Category Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-6 text-gray-900">Top Areas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={neighborhoodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#C46C24" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-6 text-gray-900">Growth Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#C46C24"
              strokeWidth={2}
              name="Gems Added"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function extractNeighborhood(lat: number, lng: number): string {
  const neighborhoods = [
    { name: 'North Kolkata', lat: 22.62, lng: 88.38, radius: 0.05 },
    { name: 'Central Kolkata', lat: 22.57, lng: 88.36, radius: 0.05 },
    { name: 'South Kolkata', lat: 22.52, lng: 88.36, radius: 0.05 },
    { name: 'Salt Lake', lat: 22.58, lng: 88.42, radius: 0.05 },
    { name: 'Howrah', lat: 22.58, lng: 88.31, radius: 0.05 },
    { name: 'New Town', lat: 22.60, lng: 88.47, radius: 0.05 },
  ];

  for (const area of neighborhoods) {
    const distance = Math.sqrt(
      Math.pow(lat - area.lat, 2) + Math.pow(lng - area.lng, 2)
    );
    if (distance < area.radius) {
      return area.name;
    }
  }

  return 'Other Areas';
}

function formatMonth(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
