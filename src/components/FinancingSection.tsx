import { Calculator, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FinancingSection() {
  const [loanAmount, setLoanAmount] = useState<string>('150000');
  const [interestRate, setInterestRate] = useState<string>('3.5');
  const [loanTerm, setLoanTerm] = useState<string>('25');
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);

  useEffect(() => {
    calculateMonthlyPayment();
  }, [loanAmount, interestRate, loanTerm]);

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(loanAmount) || 0;
    const annualRate = parseFloat(interestRate) || 0;
    const years = parseFloat(loanTerm) || 0;

    if (principal <= 0 || annualRate <= 0 || years <= 0) {
      setMonthlyPayment(0);
      return;
    }

    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;

    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    setMonthlyPayment(payment);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('sk-SK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getYearsLabel = (years: string) => {
    const num = parseInt(years) || 0;
    if (num === 1) return 'rok';
    if (num >= 2 && num <= 4) return 'roky';
    return 'rokov';
  };

  return (
    <section className="py-16 bg-gradient-to-b from-amber-900/20 via-amber-800/10 to-amber-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Financing Options - Left Side */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                <Calculator className="h-8 w-8 text-amber-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Možnosti financovania
              </h2>
            </div>

            <p className="text-lg text-gray-300 leading-relaxed">
              Pri kúpe nehnuteľnosti vám zabezpečíme kompletnú pomoc s financovaním.
              Spolupracujeme s renomovanými finančnými inštitúciami a bankami, ktoré
              zabezpečujú výhodné podmienky úverov. Vždy hľadáme riešenie šité na mieru
              podľa vašich individuálnych potrieb a finančných možností.{' '}
              <span className="text-amber-400 font-semibold">
                Táto služba je pre našich klientov bezplatná.
              </span>
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-3">
                <div className="bg-amber-500/20 rounded-full p-1 mt-1">
                  <Check className="h-5 w-5 text-amber-400" />
                </div>
                <p className="text-gray-200 text-lg">
                  Partnerstvo so širokým spektrom bánk
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-amber-500/20 rounded-full p-1 mt-1">
                  <Check className="h-5 w-5 text-amber-400" />
                </div>
                <p className="text-gray-200 text-lg">
                  Individuálne nastavenie financovania podľa potrieb
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-amber-500/20 rounded-full p-1 mt-1">
                  <Check className="h-5 w-5 text-amber-400" />
                </div>
                <p className="text-gray-200 text-lg">
                  Hľadáme najlepšie podmienky pre vašu situáciu
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-amber-500/20 rounded-full p-1 mt-1">
                  <Check className="h-5 w-5 text-amber-400" />
                </div>
                <p className="text-gray-200 text-lg">
                  Poskytujeme túto službu bezplatne pri kúpe nehnuteľnosti
                </p>
              </div>
            </div>
          </div>

          {/* Mortgage Calculator - Right Side */}
          <div className="bg-black/40 border border-amber-500/20 p-8 rounded-lg backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                <Calculator className="h-8 w-8 text-amber-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Hypotekárna kalkulačka
              </h2>
            </div>

            <p className="text-gray-300 mb-8 leading-relaxed">
              Vypočítajte si orientačnú výšku mesačnej splátky vašej hypotéky rýchlo a jednoducho.
              Zadajte výšku úveru, percentuálnu sadzbu a dobu splatnosti.
            </p>

            <div className="space-y-6">
              {/* Loan Amount Input */}
              <div>
                <label className="block text-amber-400 font-medium mb-2">
                  Výška úveru
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-zinc-900 border border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="150000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    €
                  </span>
                </div>
              </div>

              {/* Interest Rate Input */}
              <div>
                <label className="block text-amber-400 font-medium mb-2">
                  Percentuálna sadzba
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-zinc-900 border border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="3.5"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    %
                  </span>
                </div>
              </div>

              {/* Loan Term Input */}
              <div>
                <label className="block text-amber-400 font-medium mb-2">
                  Splatnosť (roky)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    className="w-full px-4 py-3 pr-16 bg-zinc-900 border border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="25"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    {getYearsLabel(loanTerm)}
                  </span>
                </div>
              </div>

              {/* Monthly Payment Output */}
              <div className="pt-4 border-t border-amber-500/20">
                <label className="block text-amber-400 font-medium mb-2">
                  Mesačná splátka
                </label>
                <div className="relative">
                  <div className="w-full px-4 py-3 pr-12 bg-zinc-950 border border-amber-500/30 text-white rounded-lg font-bold text-xl">
                    {formatCurrency(monthlyPayment)}
                  </div>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400 font-bold">
                    €
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  * Orientačný výpočet, presné podmienky záležia od konkrétnej banky
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
