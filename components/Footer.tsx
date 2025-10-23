'use client';

import { Heart, Map } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#C46C24] rounded-lg flex items-center justify-center">
              <Map size={20} className="text-white" />
            </div>
            <span className="font-semibold text-lg text-gray-900">Hidden Kolkata</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>Made with</span>
            <Heart size={16} className="text-[#C46C24] fill-[#C46C24]" />
            <span>for Kolkata</span>
          </div>

          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Hidden Kolkata. All rights reserved.
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Map data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:text-[#C46C24] transition-colors">OpenStreetMap</a> contributors
          </p>
        </div>
      </div>
    </footer>
  );
}
