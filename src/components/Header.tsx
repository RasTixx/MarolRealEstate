import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-black/95 backdrop-blur-md border-b border-amber-500/20 fixed top-0 left-0 right-0 z-50 w-full" style={{ transform: 'translate3d(0, 0, 0)', WebkitTransform: 'translateZ(0)', willChange: 'transform', backfaceVisibility: 'hidden' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/logo_dark_new.png"
              alt="Marol Real Estate"
              className="h-14 w-auto"
            />
          </Link>

          <nav className="hidden md:flex space-x-1">
            {isHomePage ? (
              <>
                {[
                  { href: '#domov', label: 'Domov' },
                  { href: '#nehnutelnosti', label: 'Nehnuteľnosti' },
                  { href: '#o-nas', label: 'O nás' },
                  { href: '#sluzby', label: 'Služby' },
                  { href: '#kontakt', label: 'Kontakt' },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-500 hover:bg-white/5 rounded-lg transition-all duration-200"
                  >
                    {item.label}
                  </a>
                ))}
              </>
            ) : (
              <>
                {[
                  { href: '/', label: 'Domov' },
                  { href: '/#nehnutelnosti', label: 'Nehnuteľnosti' },
                  { href: '/#o-nas', label: 'O nás' },
                  { href: '/#sluzby', label: 'Služby' },
                  { href: '/#kontakt', label: 'Kontakt' },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-500 hover:bg-white/5 rounded-lg transition-all duration-200"
                  >
                    {item.label}
                  </a>
                ))}
              </>
            )}
          </nav>

          <button className="hidden lg:block px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-black rounded-lg font-bold text-sm hover:shadow-lg hover:shadow-amber-500/50 hover:scale-105 transition-all duration-200">
            Kontaktujte nás
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <div className="w-6 h-6 flex flex-col justify-between">
              <span className={`h-0.5 bg-amber-500 transition-all ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`h-0.5 bg-amber-500 transition-all ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 bg-amber-500 transition-all ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </div>
          </button>
        </div>

        {isOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {isHomePage ? (
              <>
                {[
                  { href: '#domov', label: 'Domov' },
                  { href: '#nehnutelnosti', label: 'Nehnuteľnosti' },
                  { href: '#o-nas', label: 'O nás' },
                  { href: '#sluzby', label: 'Služby' },
                  { href: '#kontakt', label: 'Kontakt' },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-500 hover:bg-white/5 rounded-lg transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </>
            ) : (
              <>
                {[
                  { href: '/', label: 'Domov' },
                  { href: '/#nehnutelnosti', label: 'Nehnuteľnosti' },
                  { href: '/#o-nas', label: 'O nás' },
                  { href: '/#sluzby', label: 'Služby' },
                  { href: '/#kontakt', label: 'Kontakt' },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-500 hover:bg-white/5 rounded-lg transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
