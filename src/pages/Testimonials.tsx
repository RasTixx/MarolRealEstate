import { useState, useEffect } from 'react';
import { Star, Send, User } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

interface Testimonial {
  id: string;
  customer_name: string;
  customer_role: string | null;
  testimonial_text: string;
  rating: number;
  created_at: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_role: '',
    testimonial_text: '',
    rating: 5,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess(false);

    try {
      const { error } = await supabase.from('testimonials').insert([
        {
          customer_name: formData.customer_name,
          customer_role: formData.customer_role || null,
          testimonial_text: formData.testimonial_text,
          rating: formData.rating,
        },
      ]);

      if (error) throw error;

      setSubmitSuccess(true);
      setFormData({
        customer_name: '',
        customer_role: '',
        testimonial_text: '',
        rating: 5,
      });

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      alert('Chyba pri odosielaní referencie. Skúste to prosím znova.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'fill-amber-600 text-amber-600' : 'text-gray-600'
        }`}
      />
    ));
  };

  const renderRatingSelector = () => {
    return (
      <div className="flex gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setFormData({ ...formData, rating: i + 1 })}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                i < formData.rating
                  ? 'fill-amber-600 text-amber-600'
                  : 'text-gray-600 hover:text-amber-600'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <section className="relative pt-32 pb-24 lg:pt-40 bg-gradient-to-b from-black via-stone-950 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.1),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 mt-12">
            Referencie
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Prečítajte si skúsenosti našich spokojných klientov a pridajte svoju vlastnú referenciu
          </p>
        </div>
      </section>

      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                Zatiaľ žiadne referencie. Buďte prvý, kto nám zanechá spätnú väzbu!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 border border-stone-700 hover:border-amber-600 transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/20"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-stone-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-lg truncate">
                        {testimonial.customer_name}
                      </h3>
                      {testimonial.customer_role && (
                        <p className="text-gray-400 text-sm">
                          {testimonial.customer_role}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {renderStars(testimonial.rating)}
                  </div>

                  <p className="text-gray-300 leading-relaxed mb-4">
                    {testimonial.testimonial_text}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {new Date(testimonial.created_at).toLocaleDateString('sk-SK', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-black to-stone-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl p-8 border border-stone-700">
            <h2 className="text-3xl font-bold text-white mb-2 text-center">
              Pridajte svoju referenciu
            </h2>
            <p className="text-gray-400 text-center mb-8">
              Vaša spätná väzba nám pomáha zlepšovať naše služby
            </p>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg">
                <p className="text-green-300 text-center">
                  Ďakujeme za vašu referenciu! Bude zverejnená po schválení.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="customer_name" className="block text-gray-300 font-medium mb-2">
                  Vaše meno *
                </label>
                <input
                  type="text"
                  id="customer_name"
                  required
                  value={formData.customer_name}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 transition-colors"
                  placeholder="Zadajte vaše meno"
                />
              </div>

              <div>
                <label htmlFor="customer_role" className="block text-gray-300 font-medium mb-2">
                  Typ klienta (voliteľné)
                </label>
                <select
                  id="customer_role"
                  value={formData.customer_role}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_role: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white focus:outline-none focus:border-amber-600 transition-colors"
                >
                  <option value="">Nevybrané</option>
                  <option value="Kupujúci">Kupujúci</option>
                  <option value="Predávajúci">Predávajúci</option>
                  <option value="Nájomca">Nájomca</option>
                  <option value="Prenajímateľ">Prenajímateľ</option>
                </select>
              </div>

              <div>
                <label htmlFor="rating" className="block text-gray-300 font-medium mb-2">
                  Hodnotenie *
                </label>
                {renderRatingSelector()}
              </div>

              <div>
                <label htmlFor="testimonial_text" className="block text-gray-300 font-medium mb-2">
                  Vaša referencia *
                </label>
                <textarea
                  id="testimonial_text"
                  required
                  rows={6}
                  value={formData.testimonial_text}
                  onChange={(e) =>
                    setFormData({ ...formData, testimonial_text: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 transition-colors resize-none"
                  placeholder="Popíšte vašu zkúsenosť s našimi službami..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Odesoílám...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Odoslať referenciu
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
