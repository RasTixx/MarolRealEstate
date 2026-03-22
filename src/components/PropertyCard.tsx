import { Bed, Bath, Square, MapPin, ArrowRight, Wind, TreePine, ArrowUpCircle, Package, LandPlot, Car, Warehouse, ParkingCircle, Flower2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '../lib/supabase';

interface PropertyCardProps {
  property: Property;
}

const truncate = (str: string, max: number) =>
  str.length > max ? str.slice(0, max).trimEnd() + '…' : str;

const isPozemok = (type: string) => type === 'pozemok' || type === 'stavebny_pozemok';

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number, transactionType: string) => {
    if (transactionType === 'cena_dohodou') return 'Cena Dohodou';
    if (transactionType === 'ponuknite') return 'Ponuknite';
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getBadge = (): { text: string; color: string } | null => {
    if (property.featured) return { text: 'Odporúčame', color: 'bg-gradient-to-br from-amber-400 to-yellow-500 text-black' };
    if (property.rezervovane) return { text: 'Rezervované', color: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' };
    if (property.predane) return { text: 'Predané', color: 'bg-gradient-to-br from-amber-500 to-amber-600 text-black' };
    if (property.transaction_type === 'predaj') return { text: 'Predaj', color: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white' };
    if (property.transaction_type === 'prenajom') return { text: 'Prenájom', color: 'bg-gradient-to-br from-sky-500 to-sky-600 text-white' };
    return null;
  };

  const badge = getBadge();
  const isLand = isPozemok(property.property_type);

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

        {badge && (
          <div className="absolute top-0 left-0 overflow-hidden w-32 h-32 pointer-events-none">
            <div
              className={`absolute -left-9 top-7 w-40 text-center text-[11px] font-bold uppercase tracking-wider py-1.5 shadow-md rotate-[-45deg] ${badge.color}`}
            >
              {badge.text}
            </div>
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
          {!isLand && property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5 text-amber-500" />
              <span className="font-medium">{property.bedrooms}</span>
            </div>
          )}
          {!isLand && property.bathrooms > 0 && (
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

        {(property.balkon || property.terasa || property.vytah || property.pivnica || property.vlastny_pozemok || property.vlastny_parking || property.garaz || property.parkovacie_miesto || property.zahradka) && (
          <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-gray-400">
            {property.balkon && (
              <div className="flex items-center gap-1" title="Balkón">
                <Wind className="h-3.5 w-3.5 text-amber-500" />
                <span>Balkón</span>
              </div>
            )}
            {property.terasa && (
              <div className="flex items-center gap-1" title="Terasa">
                <TreePine className="h-3.5 w-3.5 text-amber-500" />
                <span>Terasa</span>
              </div>
            )}
            {property.vytah && (
              <div className="flex items-center gap-1" title="Výťah">
                <ArrowUpCircle className="h-3.5 w-3.5 text-amber-500" />
                <span>Výťah</span>
              </div>
            )}
            {property.pivnica && (
              <div className="flex items-center gap-1" title="Pivnica">
                <Package className="h-3.5 w-3.5 text-amber-500" />
                <span>Pivnica</span>
              </div>
            )}
            {property.vlastny_pozemok && (
              <div className="flex items-center gap-1" title="Vlastny pozemok">
                <LandPlot className="h-3.5 w-3.5 text-amber-500" />
                <span>Pozemok</span>
              </div>
            )}
            {property.vlastny_parking && (
              <div className="flex items-center gap-1" title="Vlastny parking">
                <Car className="h-3.5 w-3.5 text-amber-500" />
                <span>Parking</span>
              </div>
            )}
            {property.garaz && (
              <div className="flex items-center gap-1" title="Garaz">
                <Warehouse className="h-3.5 w-3.5 text-amber-500" />
                <span>Garaz</span>
              </div>
            )}
            {property.parkovacie_miesto && (
              <div className="flex items-center gap-1" title="Parkovacie miesto">
                <ParkingCircle className="h-3.5 w-3.5 text-amber-500" />
                <span>Parkovanie</span>
              </div>
            )}
            {property.zahradka && (
              <div className="flex items-center gap-1" title="Záhradka">
                <Flower2 className="h-3.5 w-3.5 text-amber-500" />
                <span>Záhradka</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg md:text-xl font-bold text-amber-500">{formatPrice(property.price, property.transaction_type)}</span>
          <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 text-black rounded-lg font-bold text-xs transition-all duration-200 opacity-0 group-hover:opacity-100 whitespace-nowrap">
            Detaily
          </span>
        </div>
      </div>
    </Link>
  );
}
