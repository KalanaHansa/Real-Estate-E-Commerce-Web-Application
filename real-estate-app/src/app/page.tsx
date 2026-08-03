import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import { Building2, Shield, Clock, TrendingUp, Star, MapPin, Home } from 'lucide-react';
import Link from 'next/link';

async function getRecentProperties() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/properties?type=sale&recent=true&limit=6`, {
      next: { revalidate: 60 }
    });
    const data = await res.json();
    return data.properties || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const recentProperties = await getRecentProperties();

  const features = [
    {
      icon: Building2,
      title: 'Wide Selection',
      desc: 'Thousands of properties across all provinces',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Shield,
      title: 'Verified Listings',
      desc: 'All properties are manually verified by our team',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      desc: 'Round-the-clock assistance for all your queries',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: TrendingUp,
      title: 'Best Prices',
      desc: 'Competitive pricing with transparent deals',
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  const stats = [
    { value: '12K+', label: 'Properties Listed', icon: Home },
    { value: '98%', label: 'Satisfaction Rate', icon: Star },
    { value: '50+', label: 'Cities Covered', icon: MapPin },
    { value: '8K+', label: 'Happy Clients', icon: Shield },
  ];

  return (
    <div>
      {/* ── Hero Section ────────────────────────────────── */}
      <section className="relative text-white overflow-hidden" style={{ minHeight: '580px' }}>
        {/* Layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-800 to-blue-900" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-transparent to-transparent" />

        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center mb-12">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-blue-100 mb-6">
              <Star className="h-4 w-4 text-amber-400 fill-current" />
              #1 Real Estate Platform in the Country
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
              Find Your{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  Dream Home
                </span>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed mb-10">
              Discover thousands of verified properties for sale and rent across the country.
              Your perfect home is just a search away.
            </p>

            {/* Quick links */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10 text-sm">
              {['Colombo', 'Gampaha', 'Kandy', 'Galle'].map((city) => (
                <Link
                  key={city}
                  href={`/properties?type=sale&q=${city}`}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/20 text-blue-100"
                >
                  <MapPin className="h-3.5 w-3.5" /> {city}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-5xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3 py-5 px-6">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <stat.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Why Choose EstateHub?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">We provide everything you need to find, buy, rent, or sell your property with confidence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Properties ───────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Recently Added</h2>
              <p className="text-gray-500 mt-1">Fresh properties just listed on our platform</p>
            </div>
            <Link
              href="/properties?type=sale"
              className="hidden md:inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              View All <TrendingUp className="h-4 w-4" />
            </Link>
          </div>

          {recentProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {recentProperties.map((property: any) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="h-20 w-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Yet</h3>
              <p className="text-gray-500 mb-6">Be the first to list your property on our platform!</p>
              <Link href="/sell" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                List a Property
              </Link>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/properties?type=sale"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold"
            >
              View All Properties <TrendingUp className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Rent Section ────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Properties for Rent</h2>
              <p className="text-gray-500 mt-1">Find your next rental home or apartment</p>
            </div>
            <Link
              href="/properties?type=rent"
              className="hidden md:inline-flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-600 font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              View All <TrendingUp className="h-4 w-4" />
            </Link>
          </div>
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Rental properties will appear here once listed.</p>
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80')", backgroundSize: 'cover' }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <span className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-blue-100 mb-6">
            For Property Owners
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
            Ready to Sell or Rent<br />Your Property?
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            List your property with us and reach thousands of potential buyers and renters.
            Get the best price with our expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            >
              <Home className="h-5 w-5" />
              List Your Property
            </Link>
            <Link
              href="/properties?type=sale"
              className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}