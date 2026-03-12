import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Upload, X, Save } from 'lucide-react';

export default function AddProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    address: '',
    property_type: 'byt',
    transaction_type: 'predaj',
    bedrooms: '',
    bathrooms: '',
    area: '',
    year_built: '',
    floor: '',
    featured: false,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('property-images').getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let imageUrl = '';
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (!uploadedUrl) {
          throw new Error('Nepodarilo sa nahrať obrázok');
        }
        imageUrl = uploadedUrl;
      } else {
        imageUrl = 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg';
      }

      const { error: insertError } = await supabase.from('properties').insert([
        {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          location: formData.location,
          address: formData.address,
          property_type: formData.property_type,
          transaction_type: formData.transaction_type,
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          area: parseFloat(formData.area),
          year_built: formData.year_built ? parseInt(formData.year_built) : null,
          floor: formData.floor ? parseInt(formData.floor) : null,
          featured: formData.featured,
          image_url: imageUrl,
        },
      ]);

      if (insertError) throw insertError;

      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Nastala chyba pri vytváraní nehnuteľnosti');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-stone-900 border-b border-stone-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Späť
            </button>
            <h1 className="text-xl font-bold text-white">Pridať novú nehnuteľnosť</h1>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-stone-900 rounded-xl border border-stone-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Obrázok nehnuteľnosti</h2>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-stone-700 rounded-lg cursor-pointer hover:border-amber-600 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 text-gray-500 mb-3" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Kliknite pre nahratie</span> alebo pretiahnite obrázok
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG alebo WebP (MAX. 5MB)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          <div className="bg-stone-900 rounded-xl border border-stone-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Základné informácie</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Názov *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  placeholder="Napr. Luxusný 3-izbový byt v centre"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Popis *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  placeholder="Podrobný popis nehnuteľnosti..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Typ transakcie *</label>
                <select
                  name="transaction_type"
                  value={formData.transaction_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                >
                  <option value="predaj">Predaj</option>
                  <option value="prenajom">Prenájom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Typ nehnuteľnosti *</label>
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                >
                  <option value="byt">Byt</option>
                  <option value="dom">Rodinný dom</option>
                  <option value="komercne">Komerčný priestor</option>
                  <option value="pozemok">Pozemok</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cena (€) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  placeholder="150000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Výmera (m²) *</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  placeholder="75"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Počet izieb *</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  placeholder="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Počet kúpeľní *</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rok výstavby</label>
                <input
                  type="number"
                  name="year_built"
                  value={formData.year_built}
                  onChange={handleChange}
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  placeholder="2020"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Poschodie</label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  placeholder="3"
                />
              </div>
            </div>
          </div>

          <div className="bg-stone-900 rounded-xl border border-stone-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Lokalita</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mesto/Obec *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  placeholder="Bratislava"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Adresa *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  placeholder="Hlavná 123"
                />
              </div>
            </div>
          </div>

          <div className="bg-stone-900 rounded-xl border border-stone-800 p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-stone-700 bg-stone-800 text-amber-600 focus:ring-amber-600 focus:ring-offset-0"
              />
              <div>
                <span className="text-white font-medium">Odporúčaná nehnuteľnosť</span>
                <p className="text-sm text-gray-400">Zobrazí sa na hlavnej stránke medzi top ponukami</p>
              </div>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="flex-1 px-6 py-3 bg-stone-800 hover:bg-stone-700 text-white font-medium rounded-lg transition-colors"
            >
              Zrušiť
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-amber-500 text-black font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-600/50 border border-yellow-400/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ukladám...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Uložiť nehnuteľnosť
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
