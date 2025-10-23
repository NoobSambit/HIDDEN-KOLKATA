'use client';

import { Pin } from '@/utils/types';
import { ExternalLink, X } from 'lucide-react';

type PinPopupProps = {
  pin: Pin;
  onClose: () => void;
};

export default function PinPopup({ pin, onClose }: PinPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-4 pr-8">{pin.name}</h2>

        {pin.image_url && (
          <img
            src={pin.image_url}
            alt={pin.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        <p className="text-gray-700 mb-4 leading-relaxed">{pin.description}</p>

        <a
          href={`https://www.google.com/maps?q=${pin.latitude},${pin.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#C46C24] text-white rounded-lg hover:bg-[#A05A1D] transition-colors"
        >
          <ExternalLink size={18} />
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}
