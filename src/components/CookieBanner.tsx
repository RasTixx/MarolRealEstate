import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';

const COOKIE_KEY = 'mr_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      setTimeout(() => setVisible(true), 800);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto bg-zinc-900 border border-amber-500/30 rounded-2xl shadow-2xl shadow-black/50 p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
            <Cookie className="w-5 h-5 text-amber-500" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm md:text-base mb-1">Používame súbory cookie</h3>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
              Na zlepšenie Vášho zážitku používame nevyhnutné súbory cookie. Môžu zahŕňať analytické a funkčné cookies na personalizáciu obsahu.{' '}
              <Link to="/ochrana-osobnych-udajov" className="text-amber-500 hover:text-amber-400 underline underline-offset-2 transition-colors">
                Zásady ochrany osobných údajov
              </Link>
            </p>
          </div>

          <button
            onClick={decline}
            className="flex-shrink-0 p-1.5 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            aria-label="Zavrieť"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:justify-end">
          <button
            onClick={decline}
            className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-gray-300 hover:text-white font-medium text-sm rounded-lg transition-colors border border-stone-700"
          >
            Odmietnuť
          </button>
          <button
            onClick={accept}
            className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 text-black font-bold text-sm rounded-lg transition-all duration-200 shadow-lg hover:shadow-amber-500/30"
          >
            Prijať všetky
          </button>
        </div>
      </div>
    </div>
  );
}
