import { useState } from 'react';
import { Home, MapPin, DollarSign, Bed, Bath, Square, Calendar } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomSelect from '../components/CustomSelect';
import { supabase } from '../lib/supabase';

export default function SellProperty() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    propertyType: '',
    address: '',
    city: '',
    postalCode: '',
    askingPrice: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    yearBuilt: '',
    propertyCondition: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

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

  const propertyConditionOptions = [
    { value: '', label: 'Vyberte stav' },
    { value: 'nove', label: 'Nové' },
    { value: 'velmi-dobre', label: 'Veľmi dobré' },
    { value: 'dobre', label: 'Dobré' },
    { value: 'potrebuje-rekonstrukciu', label: 'Potrebuje rekonštrukciu' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const { error } = await supabase.from('property_inquiries').insert([
        {
          inquiry_type: 'sell',
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          property_type: formData.propertyType,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          asking_price: formData.askingPrice ? parseFloat(formData.askingPrice) : null,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          area: formData.area ? parseFloat(formData.area) : null,
          year_built: formData.yearBuilt ? parseInt(formData.yearBuilt) : null,
          property_condition: formData.propertyCondition,
          description: formData.description,
        },
      ]);

      if (error) throw error;

      setSubmitMessage('Ďakujeme! Vaša požiadavka bola úspešne odoslaná. Čoskoro vás budeme kontaktovať.');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        propertyType: '',
        address: '',
        city: '',
        postalCode: '',
        askingPrice: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        yearBuilt: '',
        propertyCondition: '',
        description: '',
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

      <main className="flex-grow pt-20">
        <div className="bg-gradient-to-b from-amber-500/10 to-black py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Home className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Chcem predať nehnuteľnosť
              </h1>
              <p className="text-xl text-gray-300">
                Vyplňte formulár a my vám pomôžeme úspešne predať vašu nehnuteľnosť
              </p>
            </div>

            <div className="bg-zinc-900 rounded-lg shadow-xl p-8 border border-amber-500/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-amber-500/20 pb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Kontaktné údaje</h2>
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

                    <div className="md:col-span-2">
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
                  </div>
                </div>

                <div className="border-b border-amber-500/20 pb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Informácie o nehnuteľnosti</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <div>
                      <label htmlFor="askingPrice" className="block text-sm font-medium text-gray-300 mb-2">
                        <DollarSign className="inline h-4 w-4 mr-1" />
                        Požadovaná cena (€) *
                      </label>
                      <input
                        type="number"
                        id="askingPrice"
                        name="askingPrice"
                        required
                        value={formData.askingPrice}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                        placeholder="150000"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
                        <MapPin className="inline h-4 w-4 mr-1" />
                        Adresa nehnuteľnosti *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                        placeholder="Ulica a číslo domu"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                        Mesto *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                        placeholder="Napríklad: Bratislava"
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300 mb-2">
                        PSČ *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                        placeholder="821 01"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-b border-amber-500/20 pb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    Popis nehnuteľnosti
                  </h2>
                
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    placeholder="Popíšte vašu nehnuteľnosť - vybavenie, výhody, zvláštnosti..."
                  />
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
