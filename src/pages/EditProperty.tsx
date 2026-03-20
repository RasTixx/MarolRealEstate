import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase, Property } from '../lib/supabase';
import { ArrowLeft, Upload, X, Save, GripVertical } from 'lucide-react';

interface ImagePreview {
  id?: string;
  file?: File;
  preview: string;
  order: number;
  is_primary: boolean;
  existing: boolean;
}

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [images, setImages] = useState<ImagePreview[]>([]);
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
    latitude: '',
    longitude: '',
    featured: false,
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

      setFormData({
        title: data.title,
        description: data.description,
        price: data.price.toString(),
        location: data.location,
        address: data.address,
        property_type: data.property_type,
        transaction_type: data.transaction_type,
        bedrooms: data.bedrooms.toString(),
        bathrooms: data.bathrooms.toString(),
        area: data.area.toString(),
        year_built: data.year_built?.toString() || '',
        floor: data.floor?.toString() || '',
        latitude: data.latitude?.toString() || '',
        longitude: data.longitude?.toString() || '',
        featured: data.featured,
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
          {
            file,
            preview: reader.result as string,
            order: prev.length + 1,
            is_primary: prev.length === 0,
            existing: false,
          },
        ]);
      };
      reader.readAsDataURL(file);
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

  const moveImage = (fromIndex: number, toIndex: number) => {
    setImages((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated.map((img, i) => ({ ...img, order: i + 1, is_primary: i === 0 }));
    });
  };

  const uploadNewImages = async (): Promise<void> => {
    if (!id) return;

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      if (image.existing && image.id) {
        await supabase
          .from('property_images')
          .update({
            display_order: image.order,
            is_primary: image.is_primary,
          })
          .eq('id', image.id);
      } else if (image.file) {
        const fileExt = image.file.name.split('.').pop();
        const fileName = `${id}/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from('property-images').upload(fileName, image.file);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          continue;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('property-images').getPublicUrl(fileName);

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
      const { error: updateError } = await supabase
        .from('properties')
        .update({
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
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          featured: formData.featured,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600/30 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
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
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
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

          <div className="bg-stone-900 rounded-xl border border-stone-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Fotografie ({images.length}/30)</h2>
              {images.length < 30 && (
                <label className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-lg cursor-pointer transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Pridať fotografie
                  <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
                </label>
              )}
            </div>

            {images.length === 0 ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-stone-700 rounded-lg cursor-pointer hover:border-amber-600 transition-colors">
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
                  <div key={index} className="relative group">
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-amber-600 text-white text-xs font-semibold rounded">
                        Hlavná
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => moveImage(index, index - 1)}
                          className="p-1.5 bg-black/70 hover:bg-black text-white rounded transition-colors"
                          title="Posunúť doľava"
                        >
                          <GripVertical className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
                      #{image.order}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Zemepisná šírka</label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  step="any"
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  placeholder="48.1486"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Zemepisná dĺžka</label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  step="any"
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  placeholder="17.1077"
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
