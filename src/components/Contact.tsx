import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <section id="kontakt" className="py-16 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Kontaktujte nás
          </h2>
          <p className="text-lg text-gray-400">
            Radi vám pomôžeme nájsť vašu vysnívanú nehnuteľnosť
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 justify-items-center text-center">
        <div className="space-y-6">
      
          <div className="flex items-center space-x-4 justify-center">
            <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
              <MapPin className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Adresa</h3>
              <p className="text-gray-300">
                Námestie SNP 47/36<br />
                Lehota pod Vtáčnikom 972 42<br />
                Slovensko
              </p>
            </div>
          </div>
      
          <div className="flex items-center space-x-4 justify-center">
            <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
              <Phone className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Telefón</h3>
              <p className="text-gray-300">
                +421 900 123 456<br />
                +421 2 1234 5678
              </p>
            </div>
          </div>
      
          <div className="flex items-center space-x-4 justify-center">
            <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
              <Mail className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Email</h3>
              <p className="text-gray-300">inffomre@gmail.com</p>
            </div>
          </div>
      
        </div>
      </div>

          <div className="bg-black border border-amber-500/20 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-6">Napíšte nám</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-amber-500 mb-1">
                  Meno a priezvisko
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-zinc-700 bg-zinc-800 text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-amber-500 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-zinc-700 bg-zinc-800 text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-amber-500 mb-1">
                  Telefón
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border border-zinc-700 bg-zinc-800 text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-amber-500 mb-1">
                  Správa
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-zinc-700 bg-zinc-800 text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold py-3 px-6 rounded-lg hover:from-amber-500 hover:to-amber-400 transition-all shadow-lg hover:shadow-amber-500/50"
              >
                Odoslať správu
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
