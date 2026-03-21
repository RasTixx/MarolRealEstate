import { Search, MapPin, Home, Repeat2, Quote } from 'lucide-react';
import { useState } from 'react';

interface HeroProps {
  onSearch: (searchTerm: string, transactionType: string, propertyType: string) => void;
}

const PROPERTY_TYPES = [
  { value: 'garsonka', label: 'Garsónka' },
  { value: 'apartman', label: 'Apartmán' },
  { value: '1izbovy', label: '1 izbový byt' },
  { value: '2izbovy', label: '2 izbový byt' },
  { value: '3izbovy', label: '3 izbový byt' },
  { value: '4izbovy', label: '4 izbový byt' },
  { value: '5izbovy', label: '5 a viac izbový byt' },
  { value: 'dom', label: 'Rodinný dom' },
  { value: 'zrubovy', label: 'Zrubový dom' },
  { value: 'vidiecky', label: 'Vidiecky dom' },
  { value: 'komercne', label: 'Komerčný priestor' },
  { value: 'pozemok', label: 'Pozemok' },
];


const selectClass = "w-full px-4 py-3 pr-10 bg-stone-800/80 border border-stone-700 rounded-lg text-white appearance-none focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all";

function SelectArrow() {
  return (
    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function Hero({ onSearch }: HeroProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, transactionType, propertyType);

    setTimeout(() => {
      const el = document.querySelector('#nehnutelnosti');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section id="domov" className="relative py-16 md:py-24 pt-28 md:pt-44">
      <div className="absolute inset-0">
        <img
          src="/luxury-authentic-dining-room-interior-design.jpg"
          alt="Luxury interior"
          className="w-full h-full object-cover object-center"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white">
                Nájdite svoj
                <span className="bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent"> ideálny domov</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                Vyberte si z našej ponuky nehnuteľností práve tú Vašu. Profesionálny prístup, riešenia na mieru, odborná prezentácia Vašej nehnuteľnosti a vždy overené ponuky.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center space-x-2 text-amber-500">
                <span className="text-3xl font-bold">100%</span>
                <span className="text-sm text-gray-400">Overené ponuky</span>
              </div>
              <div className="flex items-center space-x-2 text-amber-500">
                <span className="text-3xl font-bold">15+</span>
                <span className="text-sm text-gray-400">Rokov v odbore</span>
              </div>
            </div>

            <div className="bg-stone-900/40 backdrop-blur-sm rounded-lg p-4 border-l-4 border-amber-500">
              <div className="flex gap-3">
                <Quote className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                <p className="text-gray-300 italic text-sm md:text-base leading-relaxed">
                  Nerozhodujte sa dlho, rozhodujte sa správne.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-stone-900/20 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/30 shadow-2xl shadow-amber-900/50">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">Typ transakcie</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'predaj', label: 'Predaj', icon: Home },
                    { value: 'prenajom', label: 'Prenájom', icon: Repeat2 },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTransactionType(transactionType === value ? '' : value)}
                      className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                        transactionType === value
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'border-stone-700 text-gray-300 hover:border-amber-500/50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">Typ nehnuteľnosti</label>
                <div className="relative">
                  <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className={selectClass}>
                    <option value="">Všetky typy</option>
                    {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <SelectArrow />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">Lokalita</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Bratislava, Košice, Žilina..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-stone-800/80 border border-stone-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-500 text-black font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/50"
              >
                <Search className="h-5 w-5" />
                Hľadať nehnuteľnosti
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
