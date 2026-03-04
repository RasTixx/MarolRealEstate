import { Award, Users, TrendingUp, Shield } from 'lucide-react';

export default function About() {
  return (
    <section id="o-nas" className="py-16 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              O našej realitnej kancelárii
            </h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Sme profesionálna realitná kancelária s viac ako 15-ročnými skúsenosťami na slovenskom trhu.
              Špecializujeme sa na sprostredkovanie predaja a prenájmu nehnuteľností v celom Slovensku.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Našim klientom poskytujeme komplexné služby od prvotnej konzultácie až po úspešné odovzdanie
              nehnuteľnosti. Vďaka našim skúsenostiam a individuálnemu prístupu dokážeme nájsť riešenie pre
              každého klienta.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Award className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-white">15+ rokov</h3>
                  <p className="text-sm text-gray-400">skúseností</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-white">500+</h3>
                  <p className="text-sm text-gray-400">spokojných klientov</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-black border border-amber-500/20 p-6 rounded-lg">
              <TrendingUp className="h-10 w-10 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Trhová expertíza</h3>
              <p className="text-gray-300">
                Neustále sledujeme trendy na trhu nehnuteľností a vieme vám poradiť s najlepším riešením.
              </p>
            </div>

            <div className="bg-black border border-amber-500/20 p-6 rounded-lg">
              <Shield className="h-10 w-10 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Bezpečnosť transakcií</h3>
              <p className="text-gray-300">
                Všetky transakcie realizujeme s maximálnou opatrnosťou a v súlade so zákonom.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
