'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Plus, Home, Route, BarChart3, Sparkles, Trophy, Camera, User } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-mint-500 rounded-lg flex items-center justify-center">
              <Map size={20} className="text-white" />
            </div>
            <span className="font-semibold text-xl text-gray-900">Hidden Kolkata</span>
          </Link>

          <nav className="flex items-center gap-1 overflow-x-auto">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                isActive('/')
                  ? 'bg-teal-50 text-teal-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Home size={16} />
              Home
            </Link>
            <Link
              href="/map"
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                isActive('/map')
                  ? 'bg-teal-50 text-teal-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Map size={16} />
              Map
            </Link>
            <Link
              href="/discover"
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                isActive('/discover')
                  ? 'bg-teal-50 text-teal-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Sparkles size={16} />
              Discover
            </Link>
            <Link
              href="/memories"
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                isActive('/memories')
                  ? 'bg-teal-50 text-teal-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Camera size={16} />
              Memories
            </Link>
            <Link
              href="/leaderboard"
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                isActive('/leaderboard')
                  ? 'bg-teal-50 text-teal-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Trophy size={16} />
              Leaderboard
            </Link>
            <Link
              href="/profile"
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                isActive('/profile')
                  ? 'bg-teal-50 text-teal-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User size={16} />
              Profile
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
