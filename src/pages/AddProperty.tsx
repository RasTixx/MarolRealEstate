import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Upload, X, Save } from 'lucide-react';

interface ImagePreview {
  file: File;
  preview: string;
  order: number;
}

const PROPERTY_TYPES = [
  { value: 'garsonka', label: 'Garsónka' },
  { value: 'apartman', label: 'Apartmán' },
  { value: '1izbovy', label: '1 izbový byt' },
  { value: '2izbovy', label: '2 izbový byt' },
  { value: '3izbovy', label: '3 izbový byt' },
  { value: '4izbovy', label: '4 izbový byt' },
  { value: '5izbovy', label: '5 a viac izbový byt' },
  { value: 'dom', label: 'Rodinný dom' },
  { value: 'zrubovy', label: 'Zrubový dom' },
  { value: 'vidiecky', label: 'Vidiecky dom' },
  { value: 'komercne', label: 'Komerčný priestor' },
  { value: 'pozemok', label: 'Pozemok' },
];

const TRANSACTION_TYPES = [
  { value: 'predaj', label: 'Predaj' },
  { value: 'prenajom', label: 'Prenájom' },
  { value: 'cena_dohodou', label: 'Cena dohodou' },
  { value: 'ponuknite', label: 'Ponúknite' },
];

const STAV_OPTIONS = [
  { value: 'novostavba', label: 'Novostavba' },
  { value: 'ciastocna_rekonstrukcia', label: 'Čiastočná rekonštrukcia' },
  { value: 'kompletna_rekonstrukcia', label: 'Kompletná rekonštrukcia' },
  { value: 'povodny_stav', label: 'Pôvodný stav' },
  { value: 'vo_vystavbe', label: 'Vo výstavbe' },
  { value: 'developersky_projekt', label: 'Developerský projekt' },
];

const isPozemok = (type: string) => type === 'pozemok';

export default function AddProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [error, setError] = useState('');
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);

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
    uzitkova_plocha: '',
    zastavana_plocha: '',
    stav: '',
    year_built: '',
    floor: '',
    latitude: '',
    longitude: '',
    featured: false,
    rezervovane: false,
    pridane: false,
    vytah: false,
    pivnica: false,
    balkon: false,
    terasa: false,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = 30 - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [
          ...prev,
          { file, preview: reader.result as string, order: prev.length + 1 },
        ]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((img, i) => ({ ...img, order: i + 1 }));
    });
  };

  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = dragIndexRef.current;
    if (fromIndex === null || fromIndex === toIndex) {
      setDragOverIndex(null);
      return;
    }
    setImages((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated.map((img, i) => ({ ...img, order: i + 1 }));
    });
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const uploadImages = async (propertyId: string): Promise<void> => {
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const fileExt = image.file.name.split('.').pop();
      const fileName = `${propertyId}/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(fileName, image.file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(fileName);

      await supabase.from('property_images').insert({
        property_id: propertyId,
        image_url: publicUrl,
        display_order: image.order,
        is_primary: i === 0,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const imageUrl = images.length > 0
        ? images[0].preview
        : 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg';

      const isLand = isPozemok(formData.property_type);

      const { data: property, error: insertError } = await supabase
        .from('properties')
        .insert([{
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price) || 0,
          location: formData.location,
          address: formData.address,
          property_type: formData.property_type,
          transaction_type: formData.transaction_type,
          bedrooms: isLand ? 0 : (parseInt(formData.bedrooms) || 0),
          bathrooms: isLand ? 0 : (parseInt(formData.bathrooms) || 0),
          area: parseFloat(formData.area) || 0,
          uzitkova_plocha: formData.uzitkova_plocha ? parseFloat(formData.uzitkova_plocha) : null,
          zastavana_plocha: formData.zastavana_plocha ? parseFloat(formData.zastavana_plocha) : null,
          stav: formData.stav || null,
          year_built: formData.year_built ? parseInt(formData.year_built) : null,
          floor: formData.floor ? parseInt(formData.floor) : null,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          featured: formData.featured,
          rezervovane: formData.rezervovane,
          pridane: formData.pridane,
          vytah: formData.vytah,
          pivnica: formData.pivnica,
          balkon: formData.balkon,
          terasa: formData.terasa,
          image_url: imageUrl,
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      if (!property) throw new Error('Property not created');

      if (images.length > 0) {
        await uploadImages(property.id);
      }

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

  const inputClass = "w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500";
  const labelClass = "block text-sm font-medium text-gray-300 mb-2";

  const isLand = isPozemok(formData.property_type);

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

          {/* Images */}
          <div className="bg-stone-900 rounded-xl border border-stone-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Fotografie ({images.length}/30)</h2>
              {images.length < 30 && (
                <label className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-lg cursor-pointer transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Pridať fotografie
                  <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
                </label>
              )}
            </div>

            {images.length === 0 ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-stone-700 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 text-gray-500 mb-3" />
                  <p className="mb-2 text-sm text-gray-400">
                    <span className="font-semibold">Kliknite pre nahratie</span> alebo pretiahnite fotografie
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG alebo WebP (až 30 fotografií)</p>
                </div>
                <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
              </label>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative group cursor-grab active:cursor-grabbing rounded-lg overflow-hidden border-2 transition-all ${
                      dragOverIndex === index ? 'border-amber-500 scale-105' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-black text-xs font-semibold rounded">
                        Hlavná
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
                      #{image.order}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                      <div className="bg-black/50 rounded-lg px-2 py-1 text-white text-xs">Pretiahnuť</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Basic info */}
          <div className="bg-stone-900 rounded-xl border border-stone-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Základné informácie</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Názov *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className={inputClass} placeholder="Napr. Luxusný 3-izbový byt v centre" />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Popis *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className={inputClass} placeholder="Podrobný popis nehnuteľnosti..." />
              </div>

              <div>
                <label className={labelClass}>Typ transakcie *</label>
                <select name="transaction_type" value={formData.transaction_type} onChange={handleChange} required className={inputClass}>
                  {TRANSACTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>Typ nehnuteľnosti *</label>
                <select name="property_type" value={formData.property_type} onChange={handleChange} required className={inputClass}>
                  {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>Stav nehnuteľnosti</label>
                <select name="stav" value={formData.stav} onChange={handleChange} className={inputClass}>
                  <option value="">-- Vyberte stav --</option>
                  {STAV_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>Cena (€) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className={inputClass} placeholder="150000" />
              </div>

              <div>
                <label className={labelClass}>Plocha (m²) *</label>
                <input type="number" name="area" value={formData.area} onChange={handleChange} required min="0" step="0.01" className={inputClass} placeholder="75" />
              </div>

              <div>
                <label className={labelClass}>Užitková plocha (m²)</label>
                <input type="number" name="uzitkova_plocha" value={formData.uzitkova_plocha} onChange={handleChange} min="0" step="0.01" className={inputClass} placeholder="65" />
              </div>

              <div>
                <label className={labelClass}>Zastavaná plocha (m²)</label>
                <input type="number" name="zastavana_plocha" value={formData.zastavana_plocha} onChange={handleChange} min="0" step="0.01" className={inputClass} placeholder="120" />
              </div>

              {!isLand && (
                <>
                  <div>
                    <label className={labelClass}>Počet izieb</label>
                    <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} min="0" className={inputClass} placeholder="3" />
                  </div>

                  <div>
                    <label className={labelClass}>Počet kúpeľní</label>
                    <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} min="0" className={inputClass} placeholder="1" />
                  </div>
                </>
              )}

              <div>
                <label className={labelClass}>Rok výstavby</label>
                <input type="number" name="year_built" value={formData.year_built} onChange={handleChange} min="1800" max={new Date().getFullYear()} className={inputClass} placeholder="2020" />
              </div>

              <div>
                <label className={labelClass}>Poschodie</label>
                <input type="number" name="floor" value={formData.floor} onChange={handleChange} className={inputClass} placeholder="3" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-stone-900 rounded-xl border border-stone-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Lokalita</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Mesto/Obec *</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required className={inputClass} placeholder="Bratislava" />
              </div>
              <div>
                <label className={labelClass}>Adresa *</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required className={inputClass} placeholder="Hlavná 123" />
              </div>
              <div>
                <label className={labelClass}>Zemepisná šírka</label>
                <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} step="any" className={inputClass} placeholder="48.1486" />
              </div>
              <div>
                <label className={labelClass}>Zemepisná dĺžka</label>
                <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} step="any" className={inputClass} placeholder="17.1077" />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-stone-900 rounded-xl border border-stone-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Vybavenie a vlastnosti</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'vytah', label: 'Výťah' },
                { name: 'pivnica', label: 'Pivnica' },
                { name: 'balkon', label: 'Balkón' },
                { name: 'terasa', label: 'Terasa' },
              ].map(({ name, label }) => (
                <label key={name} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-stone-800 border border-stone-700 hover:border-amber-500/50 transition-colors">
                  <input
                    type="checkbox"
                    name={name}
                    checked={(formData as any)[name]}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-stone-600 bg-stone-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                  />
                  <span className="text-white text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Labels */}
          <div className="bg-stone-900 rounded-xl border border-stone-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Štítky</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'featured', label: 'Odporúčame', desc: 'Zobrazí sa medzi top ponukami' },
                { name: 'rezervovane', label: 'Rezervované', desc: 'Nehnuteľnosť je rezervovaná' },
                { name: 'pridane', label: 'Pridané', desc: 'Zvýraznenie ako novinky' },
              ].map(({ name, label, desc }) => (
                <label key={name} className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-stone-800 border border-stone-700 hover:border-amber-500/50 transition-colors">
                  <input
                    type="checkbox"
                    name={name}
                    checked={(formData as any)[name]}
                    onChange={handleChange}
                    className="w-4 h-4 mt-0.5 rounded border-stone-600 bg-stone-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                  />
                  <div>
                    <span className="text-white font-medium block">{label}</span>
                    <span className="text-gray-400 text-xs">{desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => navigate('/admin')} className="flex-1 px-6 py-3 bg-stone-800 hover:bg-stone-700 text-white font-medium rounded-lg transition-colors">
              Zrušiť
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 text-black font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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
