import { MapPin, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            message: formData.message,
            status: 'new',
          },
        ]);

      if (dbError) throw dbError;

      const emailResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-inquiry-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'contact',
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
          }),
        }
      );

      if (!emailResponse.ok) {
        console.error('Email sending failed, but message was saved');
      }

      setStatus({
        type: 'success',
        message: 'Vaša správa bola úspešne odoslaná! Čoskoro vás budeme kontaktovať.',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setStatus({
        type: 'error',
        message: 'Nastala chyba pri odosielaní správy. Prosím, skúste to znova.',
      });
    } finally {
      setLoading(false);
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[400px]">
          <div className="space-y-10">
            <div className="flex items-start space-x-4">
              <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                <MapPin className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Adresa</h3>
                <p className="text-gray-300">
                  Námestie SNP 47/36<br />
                  Lehota pod Vtáčnikom 972 42<br />
                  Slovensko<br /><br />
                  Marol Real Estate, s.r.o.<br />
                  IČO: 52221539<br />
                  DIČ: 2120932792
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                <Phone className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Telefón</h3>
                <a href="tel:+421948192272" className="text-gray-300 hover:text-amber-500 transition-colors">
                  +421 948 192 272
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                <Mail className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Email</h3>
                <a href="mailto:inffomre@gmail.com" className="text-gray-300 hover:text-amber-500 transition-colors">
                  inffomre@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="bg-black border border-amber-500/20 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-6">Napíšte nám</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-amber-500 mb-1">
                  Meno a priezvisko
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-700 bg-zinc-800 text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                ></textarea>
              </div>

              {status && (
                <div
                  className={`p-4 rounded-lg ${
                    status.type === 'success'
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                      : 'bg-red-500/10 border border-red-500/20 text-red-400'
                  }`}
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 text-black font-bold py-3 px-6 rounded-lg hover:from-amber-500 hover:to-amber-400 transition-all shadow-lg hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Odosielam...' : 'Odoslať správu'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
