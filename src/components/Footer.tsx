import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <img
                src="/logo_new_gold.png"
                alt="Marol Real Estate"
                className="h-17 w-auto"
              />
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Profesionálna realitná kancelária s dlhoročnými skúsenosťami na slovenskom trhu.
              Pomáhame nájsť vysnívaný domov pre vás a vašu rodinu.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Rýchle odkazy</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Domov
                </Link>
              </li>
              <li>
                <a href="/#nehnutelnosti" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Nehnuteľnosti
                </a>
              </li>
              <li>
                <a href="/#o-nas" className="text-gray-400 hover:text-amber-500 transition-colors">
                  O nás
                </a>
              </li>
              <li>
                <a href="/#sluzby" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Služby
                </a>
              </li>
              <li>
                <a href="/#kontakt" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Kontakt
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Pre klientov</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/chcem-kupit" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Chcem kúpiť
                </Link>
              </li>
              <li>
                <Link to="/chcem-predat" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Chcem predať
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Ochrana osobných údajov
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Obchodné podmienky
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-500/20 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Marol Real Estate. Všetky práva vyhradené.</p>
        </div>
      </div>
    </footer>
  );
}
