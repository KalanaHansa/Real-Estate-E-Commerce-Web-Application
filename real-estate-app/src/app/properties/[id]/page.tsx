'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  MapPin, BedDouble, Bath, Maximize, Heart, Share2, ArrowLeft,
  Phone, Mail, Calendar, Eye, Shield, ChevronLeft, ChevronRight,
  Building2, Loader2, CheckCircle, Home
} from 'lucide-react';

interface PropertyDetail {
  id: number;
  title: string;
  description: string;
  property_type: 'sale' | 'rent';
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  address: string;
  province_name: string;
  district_name: string;
  city_name: string;
  images?: string;
  features?: string;
  status: string;
  is_featured: boolean;
  view_count: number;
  created_at: string;
  owner_name: string;
  owner_id: number;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});
  const [liked, setLiked] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProperty();
    }
  }, [params.id]);

  const fetchProperty = async () => {
    try {
      const res = await fetch(`/api/properties/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setProperty(data.property);
      } else {
        router.push('/properties?type=sale');
      }
    } catch (error) {
      console.error('Failed to fetch property');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    setPurchasing(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: property?.id,
          transaction_type: property?.property_type === 'sale' ? 'buy' : 'rent',
          amount: property?.price,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPurchaseSuccess(true);
      }
    } catch (error) {
      console.error('Transaction failed');
    } finally {
      setPurchasing(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`;
    if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`;
    return `$${price.toLocaleString()}`;
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!property) return null;

  const images: string[] = property.images ? JSON.parse(property.images as any) : [];
  const features: string[] = property.features ? JSON.parse(property.features as any) : [];
  const displayImages = images.length > 0 ? images : ['/placeholder-property.jpg'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Nav */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href).catch(() => {})}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              <Share2 className="h-4 w-4" /> Share
            </button>
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                liked ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              {liked ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Images + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              {/* Main Image */}
              <div className="relative h-96 md:h-[480px] group">
                {!imageError[activeImage] ? (
                  <Image
                    src={displayImages[activeImage]}
                    alt={property.title}
                    fill
                    className="object-cover"
                    onError={() => setImageError(prev => ({ ...prev, [activeImage]: true }))}
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Building2 className="h-20 w-20 text-gray-300" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                    property.property_type === 'sale' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                  }`}>
                    For {property.property_type === 'sale' ? 'Sale' : 'Rent'}
                  </span>
                  {property.is_featured && (
                    <span className="bg-amber-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold">Featured</span>
                  )}
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold capitalize ${
                    property.status === 'available'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {property.status}
                  </span>
                </div>

                {/* Navigation Arrows */}
                {displayImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((prev) => (prev - 1 + displayImages.length) % displayImages.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-800" />
                    </button>
                    <button
                      onClick={() => setActiveImage((prev) => (prev + 1) % displayImages.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-800" />
                    </button>

                    {/* Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1.5 rounded-full">
                      {activeImage + 1} / {displayImages.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {displayImages.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {displayImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === idx ? 'border-blue-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-90'
                      }`}
                    >
                      <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Location */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-blue-500" />
                    <span className="text-sm">{property.address}, {property.city_name}, {property.district_name}, {property.province_name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-sm ml-4 flex-shrink-0">
                  <Eye className="h-4 w-4" />
                  <span>{property.view_count} views</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-gray-100">
                {property.bedrooms && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <div className="p-2 bg-blue-50 rounded-lg"><BedDouble className="h-5 w-5 text-blue-600" /></div>
                    <div>
                      <p className="text-lg font-bold">{property.bedrooms}</p>
                      <p className="text-xs text-gray-500">Bedrooms</p>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <div className="p-2 bg-blue-50 rounded-lg"><Bath className="h-5 w-5 text-blue-600" /></div>
                    <div>
                      <p className="text-lg font-bold">{property.bathrooms}</p>
                      <p className="text-xs text-gray-500">Bathrooms</p>
                    </div>
                  </div>
                )}
                {property.area_sqft && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <div className="p-2 bg-blue-50 rounded-lg"><Maximize className="h-5 w-5 text-blue-600" /></div>
                    <div>
                      <p className="text-lg font-bold">{property.area_sqft.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">sq ft</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="p-2 bg-blue-50 rounded-lg"><Calendar className="h-5 w-5 text-blue-600" /></div>
                  <div>
                    <p className="text-sm font-semibold">{formatDate(property.created_at)}</p>
                    <p className="text-xs text-gray-500">Listed on</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-3">About this Property</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Price + Contact */}
          <div className="space-y-4">
            {/* Price Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-36">
              <div className="mb-4">
                <div className="text-3xl font-bold text-blue-600">
                  {formatPrice(property.price)}
                  {property.property_type === 'rent' && <span className="text-base font-normal text-gray-500"> /month</span>}
                </div>
                {property.area_sqft && property.price && (
                  <p className="text-sm text-gray-500 mt-1">
                    ${Math.round(property.price / property.area_sqft).toLocaleString()} per sqft
                  </p>
                )}
              </div>

              {/* Owner */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">
                    {property.owner_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{property.owner_name}</p>
                  <p className="text-xs text-gray-500">Property Owner</p>
                </div>
              </div>

              {purchaseSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">
                    {property.property_type === 'sale' ? 'Purchase' : 'Rental'} request submitted!
                  </p>
                  <p className="text-xs text-green-600 mt-1">Check your history for status updates</p>
                  <Link href="/history" className="mt-3 inline-block text-sm text-blue-600 font-medium hover:underline">
                    View History →
                  </Link>
                </div>
              ) : (
                <>
                  {property.status === 'available' ? (
                    <button
                      onClick={handlePurchase}
                      disabled={purchasing || user?.id === property.owner_id}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-3"
                    >
                      {purchasing && <Loader2 className="h-5 w-5 animate-spin" />}
                      {user?.id === property.owner_id
                        ? 'Your Listing'
                        : property.property_type === 'sale'
                          ? '🏠 Buy Now'
                          : '🔑 Rent Now'
                      }
                    </button>
                  ) : (
                    <div className="w-full bg-gray-100 text-gray-500 py-3.5 rounded-xl font-semibold text-center mb-3">
                      Not Available
                    </div>
                  )}

                  <button
                    onClick={() => setShowContact(!showContact)}
                    className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="h-5 w-5" />
                    Contact Owner
                  </button>

                  {showContact && (
                    <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
                      {user ? (
                        <>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Phone className="h-4 w-4 text-blue-600" />
                            <span>Contact via platform messaging</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail className="h-4 w-4 text-blue-600" />
                            <span>Send inquiry through your account</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-3">Sign in to view contact details</p>
                          <Link href="/auth/signin" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Sign In
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Trust Badges */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="h-4 w-4 text-green-500" />
                  Verified listing
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Home className="h-4 w-4 text-blue-500" />
                  {property.property_type === 'sale' ? 'Freehold property' : 'Rental property'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
