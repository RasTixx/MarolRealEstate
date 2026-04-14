import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Property } from '../lib/supabase';
import PropertyCard from './PropertyCard';

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 3;

interface PropertyListProps {
  properties: Property[];
  loading: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export default function PropertyList({ properties, loading, isError, onRetry }: PropertyListProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [properties]);

  if (loading) {
    return (
      <section id="nehnutelnosti" className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-400">Načítavam nehnuteľnosti...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section id="nehnutelnosti" className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 mb-4">Nepodarilo sa načítať nehnuteľnosti. Skúste to prosím znova.</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg hover:bg-amber-500/20 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Skúsiť znova
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section id="nehnutelnosti" className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">Žiadne nehnuteľnosti neboli nájdené.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="nehnutelnosti" className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Naše nehnuteľnosti
          </h2>
          <p className="text-lg text-gray-400">
            Preskúmajte našu aktuálnu ponuku nehnuteľností
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...properties]
            .sort((a, b) => {
              if (a.predane === b.predane) return 0;
              return a.predane ? 1 : -1;
            })
            .slice(0, visibleCount)
            .map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
        </div>

        {visibleCount < properties.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
              className="px-8 py-3 bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 text-black font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-amber-500/20 hover:scale-105"
            >
              Ukázať viac
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
