import { Bed, Bath, Square, MapPin, ArrowRight } from 'lucide-react';
import { Property } from '../lib/supabase';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group bg-zinc-900 rounded-xl overflow-hidden border border-amber-500/20 hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
      <div className="relative h-72 overflow-hidden bg-zinc-800">
        <img
          src={property.image_url}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-4 left-4 flex gap-2">
          {property.featured && (
            <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider">
              Odporúčané
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur px-4 py-2 rounded-lg text-xs font-bold text-amber-500 capitalize border border-amber-500/30">
          {property.transaction_type === 'predaj' ? 'Predaj' : 'Prenájom'}
        </div>

        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-amber-500 backdrop-blur p-3 rounded-lg shadow-lg">
            <ArrowRight className="h-5 w-5 text-black" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-white line-clamp-2">{property.title}</h3>
        </div>

        <div className="flex items-center text-gray-400 mb-3">
          <MapPin className="h-4 w-4 mr-2 text-amber-500 flex-shrink-0" />
          <span className="text-sm font-medium">{property.location}</span>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{property.description}</p>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800">
          <div className="flex gap-4 text-xs text-gray-400">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4 text-amber-500" />
                <span className="font-medium">{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-amber-500" />
                <span className="font-medium">{property.bathrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Square className="h-4 w-4 text-amber-500" />
              <span className="font-medium">{property.area_sqm} m²</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-amber-500">{formatPrice(property.price)}</span>
          <button className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-black rounded-lg font-bold text-sm hover:from-amber-500 hover:to-amber-400 transition-all duration-200 opacity-0 group-hover:opacity-100">
            Detaily
          </button>
        </div>
      </div>
    </div>
  );
}
