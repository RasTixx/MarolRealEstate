import { useState } from 'react';
import { Home } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomSelect from '../components/CustomSelect';
import { supabase } from '../lib/supabase';
import { useFormChangeDetection } from '../hooks/useFormChangeDetection';

export default function BuyProperty() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    propertyType: '',
    additionalRequirements: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const hasFormData = Object.values(formData).some(value => value !== '');
  const { clearDirtyFlag } = useFormChangeDetection(hasFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const propertyTypeOptions = [
    { value: '', label: 'Vyberte typ' },
    { value: 'byt', label: 'Byt' },
    { value: 'rodinny-dom', label: 'Rodinný dom' },
    { value: 'pozemok', label: 'Pozemok' },
    { value: 'komercna', label: 'Komerčná nehnuteľnosť' },
    { value: 'ine', label: 'Iné' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const { error } = await supabase.from('property_inquiries').insert([
        {
          inquiry_type: 'buy',
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          property_type: formData.propertyType,
          additional_requirements: formData.additionalRequirements,
        },
      ]);

      if (error) throw error;

      fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-inquiry-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'buy',
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            propertyType: formData.propertyType,
            message: formData.additionalRequirements,
          }),
        }
      ).catch((err) => console.error('Email notification failed:', err));

      setSubmitMessage('Ďakujeme! Vaša požiadavka bola úspešne odoslaná. Čoskoro vás budeme kontaktovať.');
      clearDirtyFlag();
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        propertyType: '',
        additionalRequirements: '',
      });
    } catch (error) {
      setSubmitMessage('Nastala chyba pri odosielaní formulára. Skúste to prosím znova.');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      <main className="flex-grow pt-28 lg:pt-36">
        <div className="bg-gradient-to-b from-amber-500/10 to-black py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Home className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Chcem kúpiť nehnuteľnosť
              </h1>
              <p className="text-xl text-gray-300">
                Vyplňte formulár a my vám pomôžeme najsť vašu vysnívanú nehnuteľnosť
              </p>
            </div>

            <div className="bg-zinc-900 rounded-lg shadow-xl p-8 border border-amber-500/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                      Celé meno *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="Vaše meno"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="vas@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Telefón *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="+421 XXX XXX XXX"
                    />
                  </div>

                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-300 mb-2">
                      Typ nehnuteľnosti *
                    </label>
                    <CustomSelect
                      id="propertyType"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      options={propertyTypeOptions}
                      placeholder="Vyberte typ"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="additionalRequirements" className="block text-sm font-medium text-gray-300 mb-2">
                      Vaše požiadavky
                    </label>
                    <textarea
                      id="additionalRequirements"
                      name="additionalRequirements"
                      rows={7}
                      value={formData.additionalRequirements}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                      placeholder={`Popíšte vaše požiadavky, napríklad:\n\nPreferovaná lokalita: Bratislava, Košice...\nMinimálna cena: 100 000 €\nMaximálna cena: 250 000 €\nPočet izieb: 3\nPočet kúpeľní: 1\nMinimálna výmera: 60 m²\nMaximálna výmera: 120 m²\nĎalšie požiadavky: parkovacie miesto, záhrada, balkón...`}
                    />
                  </div>
                </div>

                {submitMessage && (
                  <div className={`p-4 rounded-lg ${submitMessage.includes('Ďakujeme') ? 'bg-green-500/20 border border-green-500/50 text-green-300' : 'bg-red-500/20 border border-red-500/50 text-red-300'}`}>
                    {submitMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 text-black font-semibold py-4 px-6 rounded-lg border border-yellow-400/40 hover:from-amber-600 hover:to-amber-500 transition-all duration-200 shadow-lg hover:shadow-amber-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Odosielam...' : 'Odoslať požiadavku'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
