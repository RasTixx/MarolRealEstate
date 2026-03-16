import { Home, Key, FileText, Calculator, ClipboardCheck, Handshake } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Home,
      title: 'Predaj nehnuteľností',
      description: 'Kompletné sprostredkovanie predaja vašej nehnuteľnosti za najlepšiu cenu na trhu.',
    },
    {
      icon: Key,
      title: 'Prenájom nehnuteľností',
      description: 'Pomôžeme vám nájsť spoľahlivých nájomcov a zabezpečíme všetky potrebné náležitosti.',
    },
    {
      icon: Calculator,
      title: 'Odhad hodnoty',
      description: 'Profesionálny odhad trhovej hodnoty vašej nehnuteľnosti.',
    },
    {
      icon: FileText,
      title: 'Právne poradenstvo',
      description: 'Poskytujeme komplexné právne poradenstvo pri kúpe a predaji nehnuteľností.',
    },
    {
      icon: ClipboardCheck,
      title: 'Kompletný servis',
      description: 'Zabezpečíme vám kompletný servis od náberu nehnuteľnosti, jej inzercie až po finálne odovzdanie nehnuteľnosti klientovi.',
    },
    {
      icon: Handshake,
      title: 'Investičné poradenstvo',
      description: 'Poradíme vám s investíciami do nehnuteľností a maximalizáciou výnosov.',
    },
  ];

  return (
    <section id="sluzby" className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Naše služby
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Poskytujeme komplexné služby v oblasti nehnuteľností
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-zinc-900 p-6 rounded-lg border border-amber-500/20 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/10 transition-all">
              <service.icon className="h-12 w-12 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-gray-300">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
