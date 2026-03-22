import { Star, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFeaturedTestimonials } from '../hooks/useTestimonials';

export default function Testimonials() {
  const { data: testimonials = [], isLoading: loading } = useFeaturedTestimonials();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-amber-600 text-amber-600' : 'text-gray-600'
        }`}
      />
    ));
  };

  if (loading || testimonials.length === 0) {
    return null;
  }

  return (
    <section id="referencie" className="py-20 bg-gradient-to-b from-black to-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Referencie klientov
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Prečítajte si skúsenosti našich spokojných klientov
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 border border-stone-700 hover:border-amber-600 transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/20 transform hover:-translate-y-1"
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

              <p className="text-gray-300 leading-relaxed line-clamp-4">
                {testimonial.testimonial_text}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/referencie"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 text-black font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Zobraziť všetky referencie
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
