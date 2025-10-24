import Link from 'next/link';
import { Map, Plus, Compass, MapPin, Sparkles, Heart, Users, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-[#FFF9F5] via-[#FFDAC1]/20 to-[#E6B8D7]/20 overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-[#A8D8EA]/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 -right-20 w-96 h-96 bg-[#E6B8D7]/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-[#B4E7CE]/30 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Hero Section - Split Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-[#FF9B82]/20 shadow-sm">
              <Sparkles size={16} className="text-[#FF9B82]" />
              <span className="text-sm font-medium text-[#2D3748]">Join 500+ Kolkata Explorers</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="text-[#2D3748] font-light">Discover</span>
              <br />
              <span className="bg-gradient-to-r from-[#FF9B82] via-[#E6B8D7] to-[#A8D8EA] bg-clip-text text-transparent">
                Kolkata&apos;s Hidden Gems
              </span>
            </h1>

            <p className="text-xl text-[#2D3748]/70 leading-relaxed max-w-xl">
              Explore secret corners, vintage cafes, quiet bookstores, historic ghats, and forgotten lanes waiting to be rediscovered.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/map"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF9B82] to-[#E6B8D7] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 hover:scale-105"
              >
                <Compass size={20} className="group-hover:rotate-45 transition-transform" />
                Explore Map
              </Link>
              <Link
                href="/add"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm text-[#2D3748] rounded-2xl font-semibold border-2 border-[#FF9B82]/30 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 hover:border-[#FF9B82]"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                Add a Gem
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-[#FF9B82]">150+</div>
                <div className="text-sm text-[#2D3748]/60">Hidden Gems</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#A8D8EA]">25+</div>
                <div className="text-sm text-[#2D3748]/60">Neighborhoods</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#B4E7CE]">500+</div>
                <div className="text-sm text-[#2D3748]/60">Explorers</div>
              </div>
            </div>
          </div>

          {/* Right: Decorative Elements */}
          <div className="relative hidden lg:block">
            <div className="relative w-full h-[500px]">
              {/* Floating cards with Kolkata elements - IMAGE PLACEHOLDERS */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden transform rotate-6 hover:rotate-0 transition-transform border border-[#FF9B82]/20">
                {/* TODO: Add tram/heritage transport image */}
                <div className="w-full h-24 bg-gradient-to-br from-[#FF9B82] to-[#FFDAC1] flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">Tram Image</span>
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold text-[#2D3748]">Heritage Trams</div>
                  <div className="text-xs text-[#2D3748]/60 mt-1">Ride through history</div>
                </div>
              </div>
              
              <div className="absolute top-32 left-0 w-56 h-56 bg-gradient-to-br from-[#FFDAC1] to-[#FF9B82]/30 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden transform -rotate-6 hover:rotate-0 transition-transform border border-white/40">
                {/* TODO: Add chai/cafe image */}
                <div className="w-full h-32 bg-gradient-to-br from-[#FFDAC1] to-[#FF9B82] flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">Chai Corner Image</span>
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold text-[#2D3748]">Chai Corners</div>
                  <div className="text-xs text-[#2D3748]/60 mt-1">Sip & stories</div>
                </div>
              </div>
              
              <div className="absolute bottom-20 right-12 w-52 h-52 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform border border-[#A8D8EA]/20">
                {/* TODO: Add bookstore/library image */}
                <div className="w-full h-28 bg-gradient-to-br from-[#A8D8EA] to-[#B4E7CE] flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">Bookstore Image</span>
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold text-[#2D3748]">Book Havens</div>
                  <div className="text-xs text-[#2D3748]/60 mt-1">Literary treasures</div>
                </div>
              </div>

              {/* Decorative circles */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#E6B8D7]/20 rounded-full blur-2xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-[#B4E7CE]/20 rounded-full blur-2xl animate-pulse animation-delay-2000" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards - Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2D3748] mb-4">Why Explore With Us?</h2>
          <p className="text-lg text-[#2D3748]/60">Uncover the soul of Kolkata, one hidden gem at a time</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 - Discover */}
          <div className="group relative bg-gradient-to-br from-white/90 to-[#FFDAC1]/30 backdrop-blur-sm p-8 rounded-3xl border border-[#FF9B82]/20 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF9B82]/0 to-[#FF9B82]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF9B82] to-[#FFDAC1] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <MapPin size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#2D3748]">Discover</h3>
              <p className="text-[#2D3748]/70 leading-relaxed">
                Explore a curated map of Kolkata&apos;s hidden treasures, from heritage buildings to cozy corners.
              </p>
            </div>
          </div>

          {/* Card 2 - Contribute */}
          <div className="group relative bg-gradient-to-br from-white/90 to-[#E6B8D7]/30 backdrop-blur-sm p-8 rounded-3xl border border-[#E6B8D7]/20 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105 md:mt-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E6B8D7]/0 to-[#E6B8D7]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E6B8D7] to-[#FF9B82] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Heart size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#2D3748]">Contribute</h3>
              <p className="text-[#2D3748]/70 leading-relaxed">
                Know a special spot? Share it with the community and help others discover the city&apos;s soul.
              </p>
            </div>
          </div>

          {/* Card 3 - Explore */}
          <div className="group relative bg-gradient-to-br from-white/90 to-[#B4E7CE]/30 backdrop-blur-sm p-8 rounded-3xl border border-[#B4E7CE]/20 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-[#B4E7CE]/0 to-[#B4E7CE]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[#A8D8EA] to-[#B4E7CE] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Compass size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#2D3748]">Explore</h3>
              <p className="text-[#2D3748]/70 leading-relaxed">
                Plan your journey through Kolkata&apos;s lanes and discover stories that don&apos;t make it to guidebooks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gems Gallery - IMAGE PLACEHOLDERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2D3748] mb-4">Featured Hidden Gems</h2>
          <p className="text-lg text-[#2D3748]/60">Explore some of Kolkata&apos;s most beloved secret spots</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Featured Gem 1 */}
          <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
            {/* TODO: Add actual gem image (e.g., College Street, Prinsep Ghat) */}
            <div className="w-full h-56 bg-gradient-to-br from-[#FF9B82] to-[#FFDAC1] flex items-center justify-center">
              <div className="text-center">
                <div className="text-white font-bold text-lg mb-2">Featured Gem Image 1</div>
                <div className="text-white/80 text-sm">e.g., College Street</div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#2D3748] mb-2">College Street</h3>
              <p className="text-sm text-[#2D3748]/70">The world&apos;s largest second-hand book market</p>
            </div>
          </div>

          {/* Featured Gem 2 */}
          <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
            {/* TODO: Add actual gem image */}
            <div className="w-full h-56 bg-gradient-to-br from-[#E6B8D7] to-[#A8D8EA] flex items-center justify-center">
              <div className="text-center">
                <div className="text-white font-bold text-lg mb-2">Featured Gem Image 2</div>
                <div className="text-white/80 text-sm">e.g., Prinsep Ghat</div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#2D3748] mb-2">Prinsep Ghat</h3>
              <p className="text-sm text-[#2D3748]/70">Riverside heritage spot with stunning sunsets</p>
            </div>
          </div>

          {/* Featured Gem 3 */}
          <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
            {/* TODO: Add actual gem image */}
            <div className="w-full h-56 bg-gradient-to-br from-[#B4E7CE] to-[#FFDAC1] flex items-center justify-center">
              <div className="text-center">
                <div className="text-white font-bold text-lg mb-2">Featured Gem Image 3</div>
                <div className="text-white/80 text-sm">e.g., Marble Palace</div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#2D3748] mb-2">Marble Palace</h3>
              <p className="text-sm text-[#2D3748]/70">A 19th-century mansion with art treasures</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-[#FF9B82]/10 via-[#E6B8D7]/10 to-[#A8D8EA]/10 backdrop-blur-sm rounded-3xl p-12 border border-white/40 shadow-xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full mb-6">
            <TrendingUp size={16} className="text-[#FF9B82]" />
            <span className="text-sm font-medium text-[#2D3748]">Trending This Week</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2D3748] mb-4">
            Ready to Uncover Kolkata&apos;s Secrets?
          </h2>
          <p className="text-lg text-[#2D3748]/70 mb-8 max-w-2xl mx-auto">
            Join our community of explorers and start discovering hidden gems today.
          </p>
          <Link
            href="/map"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-[#FF9B82] to-[#E6B8D7] text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105"
          >
            <Map size={24} />
            Start Exploring Now
          </Link>
        </div>
      </section>
    </div>
  );
}
