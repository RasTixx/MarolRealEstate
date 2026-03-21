import { Bed, Bath, Square, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '../lib/supabase';

interface PropertyCardProps {
  property: Property;
}

const truncate = (str: string, max: number) =>
  str.length > max ? str.slice(0, max).trimEnd() + '…' : str;

const getTransactionLabel = (type: string) => {
  switch (type) {
    case 'predaj':
    case 'sale': return 'Predaj';
    case 'prenajom':
    case 'rent': return 'Prenájom';
    case 'cena_dohodou': return 'Cena dohodou';
    case 'ponuknite': return 'Ponúknite';
    default: return type;
  }
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const labels: { text: string; color: string }[] = [];
  if (property.featured) labels.push({ text: 'Odporúčame', color: 'bg-gradient-to-br from-amber-400 to-yellow-500 text-black' });
  if (property.rezervovane) labels.push({ text: 'Rezervované', color: 'bg-gradient-to-br from-stone-400 to-stone-500 text-white' });
  if (property.pridane) labels.push({ text: 'Predané', color: 'bg-gradient-to-br from-amber-500 to-amber-600 text-black' });

  const transactionLabel = getTransactionLabel(property.transaction_type);

  return (
    <Link
      to={`/nehnutelnost/${property.id}`}
      className="group bg-zinc-900 rounded-xl overflow-hidden border border-amber-500/20 hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 block cursor-pointer"
    >
      <div className="relative h-56 overflow-hidden bg-zinc-800">
        <img
          src={property.image_url}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-0 right-0 overflow-hidden w-32 h-32 pointer-events-none">
          <div className="absolute -right-10 top-7 w-45 text-center text-[11px] font-bold uppercase tracking-wider py-1.5 shadow-md rotate-[45deg] bg-black/80 border-y border-amber-500/40 text-amber-400">
            {transactionLabel}
          </div>
        </div>

        {labels.length > 0 && (
          <div className="absolute top-0 left-0 overflow-hidden w-32 h-32 pointer-events-none">
            {labels.slice(0, 1).map((label, i) => (
              <div
                key={i}
                className={`absolute -left-10 top-7 w-45 text-center text-[11px] font-bold uppercase tracking-wider py-1.5 shadow-md rotate-[-45deg] ${label.color}`}
              >
                {label.text}
              </div>
            ))}
          </div>
        )}

        {labels.length > 1 && (
          <div className="absolute top-10 left-2 flex flex-col gap-1">
            {labels.slice(1).map((label, i) => (
              <span key={i} className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${label.color}`}>
                {label.text}
              </span>
            ))}
          </div>
        )}

        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-amber-500 p-2.5 rounded-lg shadow-lg">
            <ArrowRight className="h-4 w-4 text-black" />
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-sm md:text-base font-bold text-white mb-2 leading-snug line-clamp-2 min-h-[2.5rem]">
            {truncate(property.title, 80)}
          </h3>

          <div className="flex items-center text-gray-400 mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1.5 text-amber-500 flex-shrink-0" />
            <span className="text-xs font-medium truncate">{property.location}</span>
          </div>

          <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">
            {truncate(property.description, 120)}
          </p>
        </div>

        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-800 text-xs text-gray-400">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5 text-amber-500" />
              <span className="font-medium">{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5 text-amber-500" />
              <span className="font-medium">{property.bathrooms}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Square className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-medium">{property.area || property.area_sqm} m²</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg md:text-xl font-bold text-amber-500">{formatPrice(property.price)}</span>
          <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 text-black rounded-lg font-bold text-xs transition-all duration-200 opacity-0 group-hover:opacity-100 whitespace-nowrap">
            Detaily
          </span>
        </div>
      </div>
    </Link>
  );
}
