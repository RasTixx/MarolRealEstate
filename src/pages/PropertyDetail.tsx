import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useProperty, usePropertyImages } from '../hooks/useProperties';
import ContactCard from '../components/ContactCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  ArrowLeft,
  MapPin,
  Home,
  BedDouble,
  Bath,
  Maximize,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
  Ruler,
  Star,
  Wind,
  TreePine,
  ArrowUpCircle,
  Package,
  LayoutGrid,
  Car,
  Warehouse,
  ParkingCircle,
  Flower2,
  LandPlot,
  Hammer,
  Euro,
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  property_type: string;
  transaction_type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  uzitkova_plocha?: number | null;
  zastavana_plocha?: number | null;
  stav?: string | null;
  vytah?: boolean;
  pivnica?: boolean;
  balkon?: boolean;
  terasa?: boolean;
  rezervovane?: boolean;
  predane?: boolean;
  vlastny_pozemok?: boolean;
  vlastny_parking?: boolean;
  garaz?: boolean;
  parkovacie_miesto?: boolean;
  zahradka?: boolean;
  konstrukcia?: string | null;
  year_built: number | null;
  floor: number | null;
  pocet_poschodii?: number | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string;
  featured: boolean;
  created_at: string;
}

interface PropertyImage {
  id: string;
  image_url: string;
  display_order: number;
  is_primary: boolean;
}

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const { data: property, isLoading: loading, error: fetchError } = useProperty(id);
  const { data: images = [] } = usePropertyImages(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      const message = `Záujem o nehnuteľnosť: ${property?.title}\n\n${formData.message}`;

      const { error } = await supabase.from('contact_messages').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: message,
          status: 'new',
        },
      ]);

      if (error) throw error;

      setFormSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });

      setTimeout(() => setFormSuccess(false), 5000);
    } catch (err: any) {
      console.error('Error submitting form:', err);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const displayImages = images.length > 0 ? images : property ? [{ id: '1', image_url: property.image_url, display_order: 1, is_primary: true }] : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      garsonka: 'Garsónka',
      apartman: 'Apartmán',
      '1izbovy': '1 izbový byt',
      '2izbovy': '2 izbový byt',
      '3izbovy': '3 izbový byt',
      '4izbovy': '4 izbový byt',
      '5izbovy': '5 a viac izbový byt',
      byt: 'Byt',
      apartment: 'Byt',
      dom: 'Rodinný dom',
      house: 'Rodinný dom',
      zrubovy: 'Zrubový dom',
      vidiecky: 'Vidiecky dom',
      chata: 'Chata',
      komercne: 'Komerčný priestor',
      commercial: 'Komerčný priestor',
      pozemok: 'Pozemok',
      stavebny_pozemok: 'Stavebný pozemok',
      land: 'Pozemok',
    };
    return types[type] || type;
  };

  const getKonstrukciaLabel = (konstrukcia: string) => {
    const konstrukciaMap: Record<string, string> = {
      tehlovy: 'Tehlový',
      panelovy: 'Panelový',
      drevodom: 'Drevodom',
      murovana: 'Murovaná',
      kovova: 'Kovová',
    };
    return konstrukciaMap[konstrukcia] || konstrukcia;
  };

  const isPozemok = (type: string) => type === 'pozemok' || type === 'stavebny_pozemok' || type === 'land';


  const formatPrice = (price: number, transactionType: string) => {
    if (transactionType === 'cena_dohodou') return 'Cena Dohodou';
    if (transactionType === 'ponuknite') return 'Ponuknite';
    return `${price.toLocaleString('sk-SK')} €`;
  };

  const getStavLabel = (stav: string) => {
    const stavMap: Record<string, string> = {
      novostavba: 'Novostavba',
      ciastocna_rekonstrukcia: 'Čiastočná rekonštrukcia',
      kompletna_rekonstrukcia: 'Kompletná rekonštrukcia',
      povodny_stav: 'Pôvodný stav',
      vo_vystavbe: 'Vo výstavbe',
      developersky_projekt: 'Developerský projekt',
    };
    return stavMap[stav] || stav.replace(/_/g, ' ');
  };

  const getTransactionTypeLabel = (type: string) => {
    if (type === 'predaj' || type === 'sale') return 'Predaj';
    if (type === 'prenajom' || type === 'rent') return 'Prenájom';
    return type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600/30 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Načítavam nehnuteľnosť...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !property) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Nehnuteľnosť nenájdená</h1>
          <p className="text-gray-400 mb-8">{fetchError ? (fetchError as Error).message : 'Požadovaná nehnuteľnosť neexistuje.'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Späť na hlavnú stránku
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="relative bg-black pt-20 md:pt-28 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 text-black font-bold rounded-lg transition-all duration-200 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Späť
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative bg-stone-900 rounded-2xl overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={displayImages[currentImageIndex]?.image_url}
                  alt={property.title}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setShowLightbox(true)}
                />
                {displayImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {displayImages.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {displayImages.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? 'border-amber-600 scale-105' : 'border-stone-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.image_url} alt={`Thumbnail ${index + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-stone-900 rounded-2xl p-6 md:p-8">
              <div className="mb-4">
                <h1 className="text-lg md:text-2xl font-bold text-white mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span className="text-sm">{property.address}, {property.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6 border-y border-stone-800">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-amber-500/10 rounded-full flex items-center justify-center">
                    <Home className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="text-sm text-gray-400">Typ nehnuteľnosti</div>
                  <div className="text-white font-semibold">{getPropertyTypeLabel(property.property_type)}</div>
                </div>
                {property.stav && (
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-amber-500/10 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="text-sm text-gray-400">Stav nehnuteľnosti</div>
                    <div className="text-white font-semibold">{getStavLabel(property.stav)}</div>
                  </div>
                )}
                {!isPozemok(property.property_type) && property.bedrooms > 0 && (
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-amber-500/10 rounded-full flex items-center justify-center">
                      <BedDouble className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="text-sm text-gray-400">Izby</div>
                    <div className="text-white font-semibold">{property.bedrooms}</div>
                  </div>
                )}
                {!isPozemok(property.property_type) && property.bathrooms > 0 && (
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-amber-500/10 rounded-full flex items-center justify-center">
                      <Bath className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="text-sm text-gray-400">Kúpeľne</div>
                    <div className="text-white font-semibold">{property.bathrooms}</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-amber-500/10 rounded-full flex items-center justify-center">
                    <Maximize className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="text-sm text-gray-400">{isPozemok(property.property_type) ? 'Výmera pozemku' : 'Výmera'}</div>
                  <div className="text-white font-semibold">{property.area} m²</div>
                </div>
                {property.uzitkova_plocha && (
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-amber-500/10 rounded-full flex items-center justify-center">
                      <Ruler className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="text-sm text-gray-400">Úžitková plocha</div>
                    <div className="text-white font-semibold">{property.uzitkova_plocha} m²</div>
                  </div>
                )}
                {property.zastavana_plocha && (
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-amber-500/10 rounded-full flex items-center justify-center">
                      <LayoutGrid className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="text-sm text-gray-400">Zastavaná plocha</div>
                    <div className="text-white font-semibold">{property.zastavana_plocha} m²</div>
                  </div>
                )}
                {!isPozemok(property.property_type) && property.konstrukcia && (
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-amber-500/10 rounded-full flex items-center justify-center">
                      <Hammer className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="text-sm text-gray-400">Konštrukcia</div>
                    <div className="text-white font-semibold">{getKonstrukciaLabel(property.konstrukcia)}</div>
                  </div>
                )}
                {property.year_built && (
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-amber-500/10 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="text-sm text-gray-400">Rok výstavby</div>
                    <div className="text-white font-semibold">{property.year_built}</div>
                  </div>
                )}
                {property.floor !== null && (
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-amber-500/10 rounded-full flex items-center justify-center">
                      <Layers className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="text-sm text-gray-400">Poschodie</div>
                    <div className="text-white font-semibold">{property.floor}</div>
                  </div>
                )}
                {!isPozemok(property.property_type) && property.pocet_poschodii !== null && property.pocet_poschodii !== undefined && (
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-amber-500/10 rounded-full flex items-center justify-center">
                      <Layers className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="text-sm text-gray-400">Počet poschodí</div>
                    <div className="text-white font-semibold">{property.pocet_poschodii}</div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h2 className="text-2xl font-bold text-white mb-4">Popis</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-stone-800">
                <h3 className="text-xl font-bold text-white mb-4">Cena</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                    <Euro className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="text-xl font-bold text-amber-500">
                    {formatPrice(property.price, property.transaction_type)}
                  </div>
                </div>
              </div>

              {(property.balkon || property.terasa || property.vytah || property.pivnica || property.vlastny_pozemok || property.vlastny_parking || property.garaz || property.parkovacie_miesto || property.zahradka) && (
                <div className="mt-6 pt-6 border-t border-stone-800">
                  <h3 className="text-xl font-bold text-white mb-4">Vybavenie</h3>
                  <div className="flex flex-wrap gap-3">
                    {property.balkon && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm font-medium">
                        <Wind className="w-4 h-4" />
                        Balkón
                      </div>
                    )}
                    {property.terasa && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm font-medium">
                        <TreePine className="w-4 h-4" />
                        Terasa
                      </div>
                    )}
                    {property.vytah && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm font-medium">
                        <ArrowUpCircle className="w-4 h-4" />
                        Výťah
                      </div>
                    )}
                    {property.pivnica && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm font-medium">
                        <Package className="w-4 h-4" />
                        Pivnica
                      </div>
                    )}
                    {property.vlastny_pozemok && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm font-medium">
                        <LandPlot className="w-4 h-4" />
                        Vlastný pozemok
                      </div>
                    )}
                    {property.vlastny_parking && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm font-medium">
                        <Car className="w-4 h-4" />
                        Vlastný parking
                      </div>
                    )}
                    {property.garaz && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm font-medium">
                        <Warehouse className="w-4 h-4" />
                        Garáž
                      </div>
                    )}
                    {property.parkovacie_miesto && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm font-medium">
                        <ParkingCircle className="w-4 h-4" />
                        Parkovacie miesto
                      </div>
                    )}
                    {property.zahradka && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm font-medium">
                        <Flower2 className="w-4 h-4" />
                        Záhradka
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {property.latitude && property.longitude && (
              <div className="bg-stone-900 rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Poloha</h2>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.google.com/maps?q=${property.latitude},${property.longitude}&hl=sk&z=14&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            )}

            <div className="bg-stone-900 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Kontaktujte nás</h2>

              {formSuccess && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-500">Správa bola úspešne odoslaná. Ozveme sa vám čoskoro.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Meno *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      placeholder="Vaše meno"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      placeholder="vas@email.sk"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Telefón</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="+421 900 000 000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Správa *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="Mám záujem o túto nehnuteľnosť..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 text-black font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Odosielam...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Odoslať správu
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 md:top-32 lg:top-36">
              <ContactCard />
            </div>
          </div>
        </div>
      </div>

      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-7xl w-full">
            <img
              src={displayImages[currentImageIndex]?.image_url}
              alt={property.title}
              className="w-full h-auto max-h-[90vh] object-contain"
            />
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
