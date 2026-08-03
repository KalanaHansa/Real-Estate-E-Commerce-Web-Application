'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Home, BedDouble } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Province { id: number; name: string; }
interface District { id: number; name: string; }
interface City { id: number; name: string; }

export default function SearchBar() {
  const router = useRouter();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  
  const [provinceId, setProvinceId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [cityId, setCityId] = useState('');
  const [propertyType, setPropertyType] = useState('sale');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  useEffect(() => {
    fetch('/api/locations/provinces')
      .then(res => res.json())
      .then(data => { if (data.success) setProvinces(data.provinces); });
  }, []);

  useEffect(() => {
    if (provinceId) {
      fetch(`/api/locations/districts?provinceId=${provinceId}`)
        .then(res => res.json())
        .then(data => { if (data.success) setDistricts(data.districts); });
      setDistrictId('');
      setCityId('');
    } else {
      setDistricts([]);
      setCities([]);
    }
  }, [provinceId]);

  useEffect(() => {
    if (districtId) {
      fetch(`/api/locations/cities?districtId=${districtId}`)
        .then(res => res.json())
        .then(data => { if (data.success) setCities(data.cities); });
      setCityId('');
    } else {
      setCities([]);
    }
  }, [districtId]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('type', propertyType);
    if (provinceId) params.set('provinceId', provinceId);
    if (districtId) params.set('districtId', districtId);
    if (cityId) params.set('cityId', cityId);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bedrooms) params.set('bedrooms', bedrooms);
    
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
      {/* Property Type Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { value: 'sale', label: 'Buy', icon: Home },
          { value: 'rent', label: 'Rent', icon: BedDouble },
        ].map((type) => (
          <button
            key={type.value}
            onClick={() => setPropertyType(type.value)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
              propertyType === type.value
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <type.icon className="h-4 w-4" />
            {type.label}
          </button>
        ))}
      </div>

      {/* Location Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={provinceId}
            onChange={(e) => setProvinceId(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none text-gray-700"
          >
            <option value="">All Provinces</option>
            {provinces.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={districtId}
            onChange={(e) => setDistrictId(e.target.value)}
            disabled={!provinceId}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none text-gray-700 disabled:opacity-50"
          >
            <option value="">All Districts</option>
            {districts.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            disabled={!districtId}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none text-gray-700 disabled:opacity-50"
          >
            <option value="">All Cities</option>
            {cities.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Price & Bedrooms */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 select-none">LKR</span>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 select-none">LKR</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <div className="relative">
          <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
          >
            <option value="">Bedrooms</option>
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>{n}+ Beds</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-200 active:scale-95"
        >
          <Search className="h-5 w-5" />
          Search Properties
        </button>
      </div>
    </div>
  );
}