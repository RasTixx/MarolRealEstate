import { Phone, Mail } from 'lucide-react';

export default function ContactCard() {
  return (
    <div className="bg-black border border-stone-800 rounded-2xl p-8 shadow-xl">
      <div className="flex flex-col items-center text-center gap-6">
        <div className="relative flex-shrink-0">
          <div className="w-36 h-36 rounded-lg overflow-hidden bg-stone-900">
            <img
              src="/man_logo copy.png"
              alt="Karol Maslík"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="w-full">
          <h3 className="text-xl font-bold text-white mb-1">Karol Maslík</h3>
          <p className="text-amber-600 font-medium mb-6">Maklér, konateľ</p>

          <div className="space-y-3">
            <a
              href="tel:0903296559"
              className="flex items-center justify-center gap-3 text-white hover:text-amber-600 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-amber-600/10 flex items-center justify-center group-hover:bg-amber-600/20 transition-colors">
                <Phone className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-md">+421 948 192 272</span>
            </a>

            <a
              href="mailto:inffomre@gmail.com"
              className="flex items-center justify-center gap-3 text-white hover:text-amber-600 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-amber-600/10 flex items-center justify-center group-hover:bg-amber-600/20 transition-colors">
                <Mail className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-md md:text-base break-all">inffomre@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
