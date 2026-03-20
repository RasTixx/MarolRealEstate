import { Phone, Mail } from 'lucide-react';

export default function ContactCard() {
  return (
    <div className="bg-black border border-stone-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-6">
        <div className="relative flex-shrink-0">
          <div className="w-32 h-32 rounded-lg overflow-hidden bg-stone-900">
            <img
              src="/mr_logo_circle.png"
              alt="Karol Maslík"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-black rounded-full flex items-center justify-center border-4 border-stone-900">
            <img
              src="/logo_goldennn.png"
              alt="Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-1">Karol Maslík</h3>
          <p className="text-amber-600 font-medium mb-4">Maklér, konateľ</p>

          <div className="space-y-2">
            <a
              href="tel:0903296559"
              className="flex items-center gap-3 text-white hover:text-amber-600 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-amber-600/10 flex items-center justify-center group-hover:bg-amber-600/20 transition-colors">
                <Phone className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-lg">0903296559</span>
            </a>

            <a
              href="mailto:peter@globalreality.sk"
              className="flex items-center gap-3 text-white hover:text-amber-600 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-amber-600/10 flex items-center justify-center group-hover:bg-amber-600/20 transition-colors">
                <Mail className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-lg">peter@globalreality.sk</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
