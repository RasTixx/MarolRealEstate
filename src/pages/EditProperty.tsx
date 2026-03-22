import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Upload, X, Save } from 'lucide-react';

interface ImagePreview {
  id?: string;
  file?: File;
  preview: string;
  order: number;
  is_primary: boolean;
  existing: boolean;
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
  { value: 'chata', label: 'Chata' },
  { value: 'komercne', label: 'Komerčný priestor' },
  { value: 'pozemok', label: 'Pozemok' },
  { value: 'stavebny_pozemok', label: 'Stavebný pozemok' },
];

const STAV_OPTIONS = [
  { value: 'novostavba', label: 'Novostavba' },
  { value: 'ciastocna_rekonstrukcia', label: 'Čiastočná rekonštrukcia' },
  { value: 'kompletna_rekonstrukcia', label: 'Kompletná rekonštrukcia' },
  { value: 'povodny_stav', label: 'Pôvodný stav' },
  { value: 'vo_vystavbe', label: 'Vo výstavbe' },
  { value: 'developersky_projekt', label: 'Developerský projekt' },
];

const KONSTRUKCIA_OPTIONS = [
  { value: 'tehlovy', label: 'Tehlový' },
  { value: 'panelovy', label: 'Panelový' },
  { value: 'drevodom', label: 'Drevodom' },
  { value: 'murovana', label: 'Murovaná' },
  { value: 'kovova', label: 'Kovová' },
];

const isPozemok = (type: string) => type === 'pozemok' || type === 'stavebny_pozemok' || type === 'land';

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [error, setError] = useState('');
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);
  const [priceOption, setPriceOption] = useState<'number' | 'cena_dohodou' | 'ponuknite'>('number');

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
    konstrukcia: '',
    year_built: '',
    floor: '',
    pocet_poschodii: '',
    latitude: '',
    longitude: '',
    featured: false,
    rezervovane: false,
    predane: false,
    vytah: false,
    pivnica: false,
    balkon: false,
    terasa: false,
    vlastny_pozemok: false,
    vlastny_parking: false,
    garaz: false,
    parkovacie_miesto: false,
    zahradka: false,
    image_url: '',
  });

  useEffect(() => {
    if (id) {
      fetchProperty();
      fetchImages();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setError('Nehnuteľnosť nenájdená');
        return;
      }

      if (data.transaction_type === 'cena_dohodou') {
        setPriceOption('cena_dohodou');
      } else if (data.transaction_type === 'ponuknite') {
        setPriceOption('ponuknite');
      } else {
        setPriceOption('number');
      }

      setFormData({
        title: data.title,
        description: data.description,
        price: data.price?.toString() || '',
        location: data.location,
        address: data.address,
        property_type: data.property_type,
        transaction_type: ['cena_dohodou', 'ponuknite'].includes(data.transaction_type) ? 'predaj' : data.transaction_type,
        bedrooms: data.bedrooms?.toString() || '',
        bathrooms: data.bathrooms?.toString() || '',
        area: data.area?.toString() || '',
        uzitkova_plocha: data.uzitkova_plocha?.toString() || '',
        zastavana_plocha: data.zastavana_plocha?.toString() || '',
        stav: data.stav || '',
        konstrukcia: data.konstrukcia || '',
        year_built: data.year_built?.toString() || '',
        floor: data.floor?.toString() || '',
        pocet_poschodii: data.pocet_poschodii?.toString() || '',
        latitude: data.latitude?.toString() || '',
        longitude: data.longitude?.toString() || '',
        featured: data.featured || false,
        rezervovane: data.rezervovane || false,
        predane: data.predane || false,
        vytah: data.vytah || false,
        pivnica: data.pivnica || false,
        balkon: data.balkon || false,
        terasa: data.terasa || false,
        vlastny_pozemok: data.vlastny_pozemok || false,
        vlastny_parking: data.vlastny_parking || false,
        garaz: data.garaz || false,
        parkovacie_miesto: data.parkovacie_miesto || false,
        zahradka: data.zahradka || false,
        image_url: data.image_url,
      });
    } catch (err: any) {
      setError(err.message || 'Chyba pri načítaní nehnuteľnosti');
    } finally {
      setFetching(false);
    }
  };

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', id)
        .order('display_order', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setImages(
          data.map((img) => ({
            id: img.id,
            preview: img.image_url,
            order: img.display_order,
            is_primary: img.is_primary,
            existing: true,
          }))
        );
      }
    } catch (err: any) {
      console.error('Error fetching images:', err);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = 30 - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const readFile = (file: File): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    };

    const newImages: ImagePreview[] = [];
    for (let i = 0; i < filesToAdd.length; i++) {
      const file = filesToAdd[i];
      const preview = await readFile(file);
      newImages.push({ file, preview, order: images.length + i + 1, is_primary: images.length === 0 && i === 0, existing: false });
    }

    setImages((prev) => {
      const combined = [...prev, ...newImages];
      return combined.map((img, i) => ({ ...img, order: i + 1, is_primary: i === 0 }));
    });

    e.target.value = '';
  };

  const removeImage = async (index: number) => {
    const imageToRemove = images[index];

    if (imageToRemove.existing && imageToRemove.id) {
      const { error } = await supabase.from('property_images').delete().eq('id', imageToRemove.id);
      if (error) {
        console.error('Error deleting image:', error);
        return;
      }
    }

    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((img, i) => ({ ...img, order: i + 1, is_primary: i === 0 }));
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
      return updated.map((img, i) => ({ ...img, order: i + 1, is_primary: i === 0 }));
    });
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const uploadNewImages = async (): Promise<void> => {
    if (!id) return;

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      if (image.existing && image.id) {
        await supabase
          .from('property_images')
          .update({ display_order: image.order, is_primary: image.is_primary })
          .eq('id', image.id);
      } else if (image.file) {
        const fileExt = image.file.name.split('.').pop();
        const fileName = `${id}/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from('property-images').upload(fileName, image.file);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(fileName);

        await supabase.from('property_images').insert({
          property_id: id,
          image_url: publicUrl,
          display_order: image.order,
          is_primary: image.is_primary,
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const isLand = isPozemok(formData.property_type);

      const finalTransactionType = priceOption === 'cena_dohodou'
        ? 'cena_dohodou'
        : priceOption === 'ponuknite'
        ? 'ponuknite'
        : formData.transaction_type;

      const { error: updateError } = await supabase
        .from('properties')
        .update({
          title: formData.title,
          description: formData.description,
          price: priceOption === 'number' ? (parseFloat(formData.price) || 0) : 0,
          location: formData.location,
          address: formData.address,
          property_type: formData.property_type,
          transaction_type: finalTransactionType,
          bedrooms: isLand ? 0 : (parseInt(formData.bedrooms) || 0),
          bathrooms: isLand ? 0 : (parseInt(formData.bathrooms) || 0),
          area: parseFloat(formData.area) || 0,
          uzitkova_plocha: formData.uzitkova_plocha ? parseFloat(formData.uzitkova_plocha) : null,
          zastavana_plocha: formData.zastavana_plocha ? parseFloat(formData.zastavana_plocha) : null,
          stav: formData.stav || null,
          konstrukcia: isLand ? null : (formData.konstrukcia || null),
          year_built: formData.year_built ? parseInt(formData.year_built) : null,
          floor: formData.floor ? parseInt(formData.floor) : null,
          pocet_poschodii: formData.pocet_poschodii ? parseInt(formData.pocet_poschodii) : null,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          featured: formData.featured,
          rezervovane: formData.rezervovane,
          predane: formData.predane,
          vytah: formData.vytah,
          pivnica: formData.pivnica,
          balkon: formData.balkon,
          terasa: formData.terasa,
          vlastny_pozemok: formData.vlastny_pozemok,
          vlastny_parking: formData.vlastny_parking,
          garaz: formData.garaz,
          parkovacie_miesto: formData.parkovacie_miesto,
          zahradka: formData.zahradka,
          image_url: images.length > 0 ? images[0].preview : formData.image_url,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      await uploadNewImages();

      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Nastala chyba pri aktualizácii nehnuteľnosti');
      setLoading(false);
    }
  };

  const RIBBON_BADGES = ['featured', 'rezervovane', 'predane', 'predaj', 'prenajom'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    if (type === 'checkbox' && RIBBON_BADGES.includes(name)) {
      if (name === 'predaj' || name === 'prenajom') {
        setFormData((prev) => ({
          ...prev,
          featured: false,
          rezervovane: false,
          predane: false,
          transaction_type: name,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          featured: false,
          rezervovane: false,
          predane: false,
          transaction_type: 'predaj',
          [name]: checked,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const inputClass = "w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500";
  const labelClass = "block text-sm font-medium text-gray-300 mb-2";

  const isLand = isPozemok(formData.property_type);

  if (fetching) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Načítavam nehnuteľnosť...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-stone-900 border-b border-stone-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Späť
            </button>
            <h1 className="text-xl font-bold text-white">Upraviť nehnuteľnosť</h1>
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
                    key={image.id || index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative group cursor-grab active:cursor-grabbing rounded-lg overflow-hidden border-2 transition-all ${
                      dragOverIndex === index ? 'border-amber-500 scale-105' : 'border-transparent'
                    }`}
                  >
                    <img src={image.preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover" />
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
                <label className={labelClass}>Názov</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputClass} />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Popis</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Typ nehnuteľnosti</label>
                <select name="property_type" value={formData.property_type} onChange={handleChange} className={inputClass}>
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

              {!isLand && (
                <div>
                  <label className={labelClass}>Konštrukcia</label>
                  <select name="konstrukcia" value={formData.konstrukcia} onChange={handleChange} className={inputClass}>
                    <option value="">-- Vyberte konštrukciu --</option>
                    {KONSTRUKCIA_OPTIONS.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
                  </select>
                </div>
              )}

              <div className="md:col-span-2">
                <label className={labelClass}>Cena</label>
                <div className="flex gap-2 mb-3">
                  {[
                    { value: 'number', label: 'Zadať cenu' },
                    { value: 'cena_dohodou', label: 'Cena dohodou' },
                    { value: 'ponuknite', label: 'Ponúknite' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPriceOption(opt.value as 'number' | 'cena_dohodou' | 'ponuknite')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        priceOption === opt.value
                          ? 'bg-amber-500 text-black'
                          : 'bg-stone-800 text-gray-300 border border-stone-700 hover:border-amber-500/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {priceOption === 'number' && (
                  <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" className={inputClass} placeholder="150000" />
                )}
              </div>

              <div>
                <label className={labelClass}>{isLand ? 'Výmera pozemku (m²)' : 'Plocha (m²)'}</label>
                <input type="number" name="area" value={formData.area} onChange={handleChange} min="0" step="0.01" className={inputClass} />
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
                    <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} min="0" className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Počet kúpeľní</label>
                    <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} min="0" className={inputClass} />
                  </div>
                </>
              )}

              <div>
                <label className={labelClass}>Rok výstavby</label>
                <input type="number" name="year_built" value={formData.year_built} onChange={handleChange} min="1800" max={new Date().getFullYear()} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Poschodie</label>
                <input type="number" name="floor" value={formData.floor} onChange={handleChange} min="0" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Počet poschodí</label>
                <input type="number" name="pocet_poschodii" value={formData.pocet_poschodii} onChange={handleChange} min="0" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-stone-900 rounded-xl border border-stone-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Lokalita</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Mesto/Obec</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Adresa</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className={inputClass} />
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'vytah', label: 'Výťah' },
                { name: 'pivnica', label: 'Pivnica' },
                { name: 'balkon', label: 'Balkón' },
                { name: 'terasa', label: 'Terasa' },
                { name: 'vlastny_pozemok', label: 'Vlastný pozemok' },
                { name: 'vlastny_parking', label: 'Vlastný parking' },
                { name: 'garaz', label: 'Garáž' },
                { name: 'parkovacie_miesto', label: 'Parkovacie miesto' },
                { name: 'zahradka', label: 'Záhradka' },
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
            <p className="text-gray-400 text-sm mb-4">Vyberte jeden štítok, ktorý sa zobrazí na karte nehnuteľnosti</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { name: 'predaj', label: 'Predaj', desc: 'Nehnuteľnosť na predaj' },
                { name: 'prenajom', label: 'Prenájom', desc: 'Nehnuteľnosť na prenájom' },
                { name: 'featured', label: 'Odporúčame', desc: 'Zobrazí sa medzi top ponukami' },
                { name: 'rezervovane', label: 'Rezervované', desc: 'Nehnuteľnosť je rezervovaná' },
                { name: 'predane', label: 'Predané', desc: 'Nehnuteľnosť bola predaná' },
              ].map(({ name, label, desc }) => {
                const isSelected = name === 'predaj' || name === 'prenajom'
                  ? formData.transaction_type === name && !formData.featured && !formData.rezervovane && !formData.predane
                  : (formData as any)[name];
                return (
                  <label key={name} className={`flex items-start gap-3 cursor-pointer p-4 rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500'
                      : 'bg-stone-800 border-stone-700 hover:border-amber-500/50'
                  }`}>
                    <input
                      type="checkbox"
                      name={name}
                      checked={isSelected}
                      onChange={handleChange}
                      className="w-4 h-4 mt-0.5 rounded border-stone-600 bg-stone-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                    />
                    <div>
                      <span className="text-white font-medium block">{label}</span>
                      <span className="text-gray-400 text-xs">{desc}</span>
                    </div>
                  </label>
                );
              })}
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
                  Uložiť zmeny
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
