import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHashNavigation = (hash: string) => {
    if (isHomePage) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollTo: hash } });
    }
  };

  return (
   <header className="bg-black/95 backdrop-blur-md border-b border-amber-500/20 fixed top-0 left-0 right-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 lg:py-6">
          <Link to="/" onClick={handleLogoClick} className="flex items-center space-x-3">
            <img
              src="/logo_new.png"
              alt="Marol Real Estate"
              className="h-16 lg:h-24 w-auto"
            />
          </Link>

          <nav className="hidden md:flex space-x-1">
            {isHomePage ? (
              <>
                {[
                  { href: '#domov', label: 'Domov', isAnchor: true },
                  { href: '#nehnutelnosti', label: 'Nehnuteľnosti', isAnchor: true },
                  { href: '#o-nas', label: 'O nás', isAnchor: true },
                  { href: '#sluzby', label: 'Služby', isAnchor: true },
                  { href: '/referencie', label: 'Referencie', isAnchor: false },
                  { href: '#kontakt', label: 'Kontakt', isAnchor: true },
                ].map((item) =>
                  item.isAnchor ? (
                    <a
                      key={item.href}
                      href={item.href}
                      className="px-4 py-2 lg:px-5 lg:py-3 text-sm lg:text-base font-medium text-gray-300 hover:text-amber-500 hover:bg-white/5 rounded-lg transition-all duration-200"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="px-4 py-2 lg:px-5 lg:py-3 text-sm lg:text-base font-medium text-gray-300 hover:text-amber-500 hover:bg-white/5 rounded-lg transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </>
            ) : (
              <>
                {[
                  { href: '/', label: 'Domov', isRoute: true, hash: null },
                  { href: '/#nehnutelnosti', label: 'Nehnuteľnosti', isRoute: false, hash: '#nehnutelnosti' },
                  { href: '/#o-nas', label: 'O nás', isRoute: false, hash: '#o-nas' },
                  { href: '/#sluzby', label: 'Služby', isRoute: false, hash: '#sluzby' },
                  { href: '/referencie', label: 'Referencie', isRoute: true, hash: null },
                  { href: '/#kontakt', label: 'Kontakt', isRoute: false, hash: '#kontakt' },
                ].map((item) =>
                  item.isRoute ? (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="px-4 py-2 lg:px-5 lg:py-3 text-sm lg:text-base font-medium text-gray-300 hover:text-amber-500 hover:bg-white/5 rounded-lg transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.href}
                      onClick={() => handleHashNavigation(item.hash!)}
                      className="px-4 py-2 lg:px-5 lg:py-3 text-sm lg:text-base font-medium text-gray-300 hover:text-amber-500 hover:bg-white/5 rounded-lg transition-all duration-200"
                    >
                      {item.label}
                    </button>
                  )
                )}
              </>
            )}
          </nav>

          <a href="mailto:inffomre@gmail.com" className="hidden lg:block px-6 py-2 lg:px-7 lg:py-3 bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 text-black rounded-lg font-bold text-sm lg:text-base hover:shadow-lg hover:shadow-amber-500/50 hover:scale-105 transition-all duration-200">
            Kontaktujte nás
          </a>

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
                  { href: '#domov', label: 'Domov', isAnchor: true },
                  { href: '#nehnutelnosti', label: 'Nehnuteľnosti', isAnchor: true },
                  { href: '#o-nas', label: 'O nás', isAnchor: true },
                  { href: '#sluzby', label: 'Služby', isAnchor: true },
                  { href: '/referencie', label: 'Referencie', isAnchor: false },
                  { href: '#kontakt', label: 'Kontakt', isAnchor: true },
                ].map((item) =>
                  item.isAnchor ? (
                    <a
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-500 hover:bg-white/5 rounded-lg transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-500 hover:bg-white/5 rounded-lg transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </>
            ) : (
              <>
                {[
                  { href: '/', label: 'Domov', isRoute: true, hash: null },
                  { href: '/#nehnutelnosti', label: 'Nehnuteľnosti', isRoute: false, hash: '#nehnutelnosti' },
                  { href: '/#o-nas', label: 'O nás', isRoute: false, hash: '#o-nas' },
                  { href: '/#sluzby', label: 'Služby', isRoute: false, hash: '#sluzby' },
                  { href: '/referencie', label: 'Referencie', isRoute: true, hash: null },
                  { href: '/#kontakt', label: 'Kontakt', isRoute: false, hash: '#kontakt' },
                ].map((item) =>
                  item.isRoute ? (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-500 hover:bg-white/5 rounded-lg transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.href}
                      onClick={() => {
                        handleHashNavigation(item.hash!);
                        setIsOpen(false);
                      }}
                      className="block px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-500 hover:bg-white/5 rounded-lg transition-all text-left w-full"
                    >
                      {item.label}
                    </button>
                  )
                )}
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
