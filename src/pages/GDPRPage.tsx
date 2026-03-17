import LegalDocumentLayout from '../components/LegalDocumentLayout';

export default function GDPRPage() {
  return (
    <LegalDocumentLayout title="Ochrana osobných údajov">
      <div>
        <p className="text-lg font-semibold mb-6">
          Informácie o spracúvaní osobných údajov
        </p>

        <h2>1. Prevádzkovateľ osobných údajov</h2>
        <p>
          <strong>Marol Real Estate s.r.o.</strong><br />
          IČO: 12345678<br />
          Sídlo: Bratislava, Slovenská republika<br />
          E-mail: info@marolrealestate.sk<br />
          Telefón: +421 XXX XXX XXX
        </p>

        <h2>2. Účel spracúvania osobných údajov</h2>
        <p>
          Vaše osobné údaje spracúvame za nasledovnými účelmi:
        </p>
        <ul>
          <li>Poskytovanie realitných služieb a sprostredkovanie nehnuteľností</li>
          <li>Komunikácia s klientmi a vybavovanie požiadaviek</li>
          <li>Plnenie zmluvných záväzkov</li>
          <li>Marketingové účely (so súhlasom dotknutej osoby)</li>
          <li>Plnenie zákonných povinností prevádzkovateľa</li>
        </ul>

        <h2>3. Kategórie spracúvaných osobných údajov</h2>
        <p>
          Spracúvame nasledujúce kategórie osobných údajov:
        </p>
        <ul>
          <li>Identifikačné údaje (meno, priezvisko, titul)</li>
          <li>Kontaktné údaje (adresa, telefón, e-mail)</li>
          <li>Údaje o nehnuteľnosti (vlastníctvo, preferencie)</li>
          <li>Ekonomické údaje (cenové ponuky, finančné možnosti)</li>
        </ul>

        <h2>4. Právny základ spracúvania</h2>
        <p>
          Osobné údaje spracúvame na základe:
        </p>
        <ul>
          <li>Plnenia zmluvy alebo krokov pred uzatvorením zmluvy</li>
          <li>Oprávneného zájmu prevádzkovateľa</li>
          <li>Súhlasu dotknutej osoby</li>
          <li>Plnenia zákonných povinností</li>
        </ul>

        <h2>5. Doba uchovávania osobných údajov</h2>
        <p>
          Osobné údaje uchovávame po dobu:
        </p>
        <ul>
          <li>Trvania zmluvného vzťahu</li>
          <li>Nevyhnutnú na plnenie zákonných povinností (napr. archivačné povinnosti)</li>
          <li>V prípade súhlasu - do jeho odvolania alebo dosiahnutia účelu spracovania</li>
          <li>V prípade oprávneného zájmu - do vzniesenia námietky alebo dosiahnutia účelu</li>
        </ul>

        <h2>6. Príjemcovia osobných údajov</h2>
        <p>
          Vaše osobné údaje môžeme poskytnúť:
        </p>
        <ul>
          <li>Zmluvným sprostredkovateľom a partnerom pri poskytovaní služieb</li>
          <li>Orgánom verejnej moci v rozsahu stanoveným zákonom</li>
          <li>Osobám zabezpečujúcim technické a organizačné služby</li>
          <li>Notárom, advokátom a ďalším profesionálom pri uzatváraní transakcií</li>
        </ul>

        <h2>7. Práva dotknutých osôb</h2>
        <p>
          V súvislosti so spracúvaním osobných údajov máte nasledujúce práva:
        </p>
        <ul>
          <li><strong>Právo na prístup</strong> - získať informácie o spracúvaní vašich osobných údajov</li>
          <li><strong>Právo na opravu</strong> - požiadať o opravu nesprávnych osobných údajov</li>
          <li><strong>Právo na vymazanie</strong> - požiadať o vymazanie osobných údajov</li>
          <li><strong>Právo na obmedzenie spracovania</strong> - požiadať o obmedzenie spracovania</li>
          <li><strong>Právo na prenosnosť</strong> - získať osobné údaje v štruktúrovanom formáte</li>
          <li><strong>Právo namietať</strong> - namietať proti spracúvaniu na základe oprávneného zájmu</li>
          <li><strong>Právo odvolať súhlas</strong> - kedykoľvek odvolať udelený súhlas</li>
          <li><strong>Právo podať sťažnosť</strong> - podať sťažnosť na Úrad na ochranu osobných údajov SR</li>
        </ul>

        <h2>8. Zabezpečenie osobných údajov</h2>
        <p>
          Prijali sme primerané technické a organizačné opatrenia na ochranu vašich osobných údajov pred neoprávneným prístupom, zničením, stratou, zmenou alebo šírením.
        </p>

        <h2>9. Automatizované rozhodovanie a profilovanie</h2>
        <p>
          Vaše osobné údaje nepoužívame na automatizované rozhodovanie ani profilovanie.
        </p>

        <h2>10. Cookies</h2>
        <p>
          Naša webová stránka používa cookies na zabezpečenie funkčnosti a zlepšenie používateľského zážitku. Používanie cookies môžete ovládať v nastaveniach vášho prehliadača.
        </p>

        <h2>11. Kontakt</h2>
        <p>
          V prípade akýchkoľvek otázok týkajúcich sa spracovania osobných údajov nás môžete kontaktovať na:
        </p>
        <p>
          E-mail: <a href="mailto:gdpr@marolrealestate.sk">gdpr@marolrealestate.sk</a><br />
          Telefón: +421 XXX XXX XXX
        </p>

        <h2>12. Zmeny v zásadách ochrany osobných údajov</h2>
        <p>
          Tieto zásady môžeme aktualizovať. O akýchkoľvek významných zmenách vás budeme informovať prostredníctvom našej webovej stránky.
        </p>

        <p className="text-sm text-gray-400 mt-8 italic">
          Posledná aktualizácia: {new Date().toLocaleDateString('sk-SK')}
        </p>
      </div>
    </LegalDocumentLayout>
  );
}
