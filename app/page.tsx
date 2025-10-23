import Link from 'next/link';
import { Map, Plus, Compass, MapPin } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#C46C24] rounded-2xl mb-6">
            <Map size={40} className="text-white" />
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Discover Kolkata&apos;s
          <br />
          <span className="text-[#C46C24]">Hidden Gems</span>
        </h1>

        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Explore and share the city&apos;s secret corners — vintage cafes, quiet bookstores,
          historic ghats, and forgotten lanes waiting to be rediscovered.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/map"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#C46C24] text-white rounded-xl font-semibold hover:bg-[#A05A1D] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Compass size={20} />
            Explore Map
          </Link>
          <Link
            href="/add"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Add a Gem
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#C46C24]/10 rounded-lg flex items-center justify-center mb-4">
              <MapPin size={24} className="text-[#C46C24]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Discover</h3>
            <p className="text-gray-600 leading-relaxed">
              Explore a curated map of Kolkata&apos;s hidden treasures, from heritage buildings to cozy corners.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#C46C24]/10 rounded-lg flex items-center justify-center mb-4">
              <Plus size={24} className="text-[#C46C24]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Contribute</h3>
            <p className="text-gray-600 leading-relaxed">
              Know a special spot? Share it with the community and help others discover the city&apos;s soul.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#C46C24]/10 rounded-lg flex items-center justify-center mb-4">
              <Compass size={24} className="text-[#C46C24]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Explore</h3>
            <p className="text-gray-600 leading-relaxed">
              Plan your journey through Kolkata&apos;s lanes and discover stories that don&apos;t make it to guidebooks.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
