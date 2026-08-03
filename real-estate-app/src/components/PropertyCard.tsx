'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, BedDouble, Bath, Maximize, Heart } from 'lucide-react';
import { Property } from '@/types';
import { useState } from 'react';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [imageError, setImageError] = useState(false);
  const images = property.images ? JSON.parse(property.images as any) : [];
  const imageUrl = images[0] || '/placeholder-property.jpg';

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`;
    return `$${price}`;
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        {!imageError ? (
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <MapPin className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            property.property_type === 'sale' 
              ? 'bg-blue-600 text-white' 
              : 'bg-green-600 text-white'
          }`}>
            For {property.property_type === 'sale' ? 'Sale' : 'Rent'}
          </span>
          {property.is_featured && (
            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
        </button>

        {/* Price Overlay */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg font-bold text-lg text-gray-900 shadow-sm">
            {formatPrice(property.price)}
            {property.property_type === 'rent' && <span className="text-sm font-normal text-gray-500">/mo</span>}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {property.title}
        </h3>
        
        <div className="flex items-center gap-1 text-gray-500 mb-3">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm truncate">
            {property.address}, {property.city_name}, {property.district_name}
          </span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 py-3 border-t border-gray-100">
          {property.bedrooms && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <BedDouble className="h-4 w-4" />
              <span className="text-sm font-medium">{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Bath className="h-4 w-4" />
              <span className="text-sm font-medium">{property.bathrooms}</span>
            </div>
          )}
          {property.area_sqft && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Maximize className="h-4 w-4" />
              <span className="text-sm font-medium">{property.area_sqft} sqft</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">
                {property.owner_name?.charAt(0) || 'U'}
              </span>
            </div>
            <span className="text-sm text-gray-600">{property.owner_name}</span>
          </div>
          <Link
            href={`/properties/${property.id}`}
            className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}