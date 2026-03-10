import { Property } from '../lib/supabase';
import PropertyCard from './PropertyCard';

interface PropertyListProps {
  properties: Property[];
  loading: boolean;
}

export default function PropertyList({ properties, loading }: PropertyListProps) {
  if (loading) {
    return (
      <section id="nehnutelnosti" className="relative py-16 bg-black -mt-32 md:-mt-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-400">Načítavam nehnuteľnosti...</p>
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section id="nehnutelnosti" className="relative py-16 bg-black -mt-32 md:-mt-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <p className="text-gray-400">Žiadne nehnuteľnosti neboli nájdené.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="nehnutelnosti" className="relative py-16 bg-black -mt-32 md:-mt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Naše nehnuteľnosti
          </h2>
          <p className="text-lg text-gray-400">
            Preskúmajte našu aktuálnu ponuku nehnuteľností
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
