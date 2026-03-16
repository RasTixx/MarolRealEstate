import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Property } from '../lib/supabase';
import { LogOut, Home, Building2, Mail, BarChart3, Plus, CreditCard as Edit, Trash2, Star, StarOff, Search, MessageSquare, CheckCircle, XCircle, User } from 'lucide-react';

interface Testimonial {
  id: string;
  customer_name: string;
  customer_role: string | null;
  testimonial_text: string;
  rating: number;
  featured: boolean;
  approved: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeTab, setActiveTab] = useState<'properties' | 'testimonials'>('properties');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [testimonialFilter, setTestimonialFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
    fetchTestimonials();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const toggleFeatured = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ featured: !currentValue })
        .eq('id', id);

      if (error) throw error;
      await fetchProperties();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);

      if (error) throw error;
      await fetchProperties();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const toggleTestimonialApproval = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ approved: !currentValue })
        .eq('id', id);

      if (error) throw error;
      await fetchTestimonials();
    } catch (error) {
      console.error('Error toggling approval:', error);
    }
  };

  const toggleTestimonialFeatured = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ featured: !currentValue })
        .eq('id', id);

      if (error) throw error;
      await fetchTestimonials();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);

      if (error) throw error;
      await fetchTestimonials();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      searchTerm === '' ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === '' || p.property_type === filterType;

    return matchesSearch && matchesType;
  });

  const filteredTestimonials = testimonials.filter((t) => {
    if (testimonialFilter === 'pending') return !t.approved;
    if (testimonialFilter === 'approved') return t.approved;
    return true;
  });

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

  const stats = {
    total: properties.length,
    featured: properties.filter((p) => p.featured).length,
    forSale: properties.filter((p) => p.transaction_type === 'predaj').length,
    forRent: properties.filter((p) => p.transaction_type === 'prenajom').length,
  };

  const testimonialStats = {
    total: testimonials.length,
    pending: testimonials.filter((t) => !t.approved).length,
    approved: testimonials.filter((t) => t.approved).length,
    featured: testimonials.filter((t) => t.featured).length,
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-stone-900 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-amber-600" />
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-gray-300 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Odhlásiť sa
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'properties'
                ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-lg'
                : 'bg-stone-800 text-gray-400 hover:bg-stone-700'
            }`}
          >
            <Building2 className="w-5 h-5" />
            Nehnuteľnosti
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'testimonials'
                ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-lg'
                : 'bg-stone-800 text-gray-400 hover:bg-stone-700'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Referencie
            {testimonialStats.pending > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {testimonialStats.pending}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'properties' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 border border-stone-700">
            <div className="flex items-center justify-between mb-2">
              <Home className="w-8 h-8 text-amber-600" />
              <span className="text-3xl font-bold text-white">{stats.total}</span>
            </div>
            <p className="text-gray-400 text-sm">Celkový počet</p>
          </div>

          <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 border border-stone-700">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-amber-600" />
              <span className="text-3xl font-bold text-white">{stats.featured}</span>
            </div>
            <p className="text-gray-400 text-sm">Odporúčané</p>
          </div>

          <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 border border-stone-700">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 text-amber-600" />
              <span className="text-3xl font-bold text-white">{stats.forSale}</span>
            </div>
            <p className="text-gray-400 text-sm">Na predaj</p>
          </div>

          <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 border border-stone-700">
            <div className="flex items-center justify-between mb-2">
              <Mail className="w-8 h-8 text-amber-600" />
              <span className="text-3xl font-bold text-white">{stats.forRent}</span>
            </div>
            <p className="text-gray-400 text-sm">Na prenájom</p>
          </div>
        </div>

        <div className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden">
          <div className="p-6 border-b border-stone-800">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <h2 className="text-2xl font-bold text-white">Správa nehnuteľností</h2>
              <button
                onClick={() => navigate('/admin/properties/new')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-medium rounded-lg transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Pridať nehnuteľnosť
              </button>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Hľadať podľa názvu, lokality..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-stone-800 border border-stone-700 rounded-lg text-white focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              >
                <option value="">Všetky typy</option>
                <option value="byt">Byt</option>
                <option value="dom">Rodinný dom</option>
                <option value="komercne">Komerčný priestor</option>
                <option value="pozemok">Pozemok</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 border-4 border-amber-600/30 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Načítavam nehnuteľnosti...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="p-12 text-center">
                <Home className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Žiadne nehnuteľnosti nenájdené</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-stone-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Obrázok
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Názov
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Lokalita
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Cena
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Typ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Akcie
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-stone-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={property.image_url}
                          alt={property.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{property.title}</div>
                        <div className="text-xs text-gray-500">
                          {property.bedrooms} izby • {property.area} m²
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{property.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-amber-500">
                          {property.price.toLocaleString()} €
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-stone-700 text-gray-300 rounded">
                          {property.property_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleFeatured(property.id, property.featured)}
                            className={`p-2 rounded-lg transition-colors ${
                              property.featured
                                ? 'bg-amber-600/20 text-amber-500 hover:bg-amber-600/30'
                                : 'bg-stone-700 text-gray-400 hover:bg-stone-600'
                            }`}
                            title={property.featured ? 'Odstrániť z odporúčaných' : 'Pridať do odporúčaných'}
                          >
                            {property.featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => navigate(`/admin/properties/edit/${property.id}`)}
                            className="p-2 bg-stone-700 hover:bg-stone-600 text-gray-300 rounded-lg transition-colors"
                            title="Upraviť"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(property.id)}
                            className="p-2 bg-red-900/20 hover:bg-red-900/30 text-red-500 rounded-lg transition-colors"
                            title="Vymazať"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 border border-stone-700">
                <div className="flex items-center justify-between mb-2">
                  <MessageSquare className="w-8 h-8 text-amber-600" />
                  <span className="text-3xl font-bold text-white">{testimonialStats.total}</span>
                </div>
                <p className="text-gray-400 text-sm">Celkový počet</p>
              </div>

              <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 border border-stone-700">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <span className="text-3xl font-bold text-white">{testimonialStats.approved}</span>
                </div>
                <p className="text-gray-400 text-sm">Schválené</p>
              </div>

              <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 border border-stone-700">
                <div className="flex items-center justify-between mb-2">
                  <XCircle className="w-8 h-8 text-red-500" />
                  <span className="text-3xl font-bold text-white">{testimonialStats.pending}</span>
                </div>
                <p className="text-gray-400 text-sm">Čakajú na schválenie</p>
              </div>

              <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 border border-stone-700">
                <div className="flex items-center justify-between mb-2">
                  <Star className="w-8 h-8 text-amber-600" />
                  <span className="text-3xl font-bold text-white">{testimonialStats.featured}</span>
                </div>
                <p className="text-gray-400 text-sm">Odporúčané</p>
              </div>
            </div>

            <div className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden">
              <div className="p-6 border-b border-stone-800">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <h2 className="text-2xl font-bold text-white">Správa referencií</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTestimonialFilter('all')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        testimonialFilter === 'all'
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-800 text-gray-400 hover:bg-stone-700'
                      }`}
                    >
                      Všetky
                    </button>
                    <button
                      onClick={() => setTestimonialFilter('pending')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        testimonialFilter === 'pending'
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-800 text-gray-400 hover:bg-stone-700'
                      }`}
                    >
                      Čakajúce ({testimonialStats.pending})
                    </button>
                    <button
                      onClick={() => setTestimonialFilter('approved')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        testimonialFilter === 'approved'
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-800 text-gray-400 hover:bg-stone-700'
                      }`}
                    >
                      Schválené
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                {filteredTestimonials.length === 0 ? (
                  <div className="p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Žiadne referencie nenájdené</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-stone-800/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Zákazník
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Hodnotenie
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Referencia
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Stav
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Dátum
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Akcie
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                      {filteredTestimonials.map((testimonial) => (
                        <tr key={testimonial.id} className="hover:bg-stone-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-stone-700 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-amber-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white">{testimonial.customer_name}</div>
                                {testimonial.customer_role && (
                                  <div className="text-xs text-gray-500">{testimonial.customer_role}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-1">
                              {renderStars(testimonial.rating)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-300 max-w-md line-clamp-2">
                              {testimonial.testimonial_text}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded ${
                                  testimonial.approved
                                    ? 'bg-green-900/30 text-green-400'
                                    : 'bg-yellow-900/30 text-yellow-400'
                                }`}
                              >
                                {testimonial.approved ? 'Schválené' : 'Čakajúce'}
                              </span>
                              {testimonial.featured && (
                                <span className="px-2 py-1 text-xs font-medium bg-amber-900/30 text-amber-400 rounded">
                                  Odporúčané
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400">
                              {new Date(testimonial.created_at).toLocaleDateString('sk-SK')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleTestimonialApproval(testimonial.id, testimonial.approved)}
                                className={`p-2 rounded-lg transition-colors ${
                                  testimonial.approved
                                    ? 'bg-green-600/20 text-green-500 hover:bg-green-600/30'
                                    : 'bg-yellow-600/20 text-yellow-500 hover:bg-yellow-600/30'
                                }`}
                                title={testimonial.approved ? 'Zrušiť schválenie' : 'Schváliť'}
                              >
                                {testimonial.approved ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => toggleTestimonialFeatured(testimonial.id, testimonial.featured)}
                                className={`p-2 rounded-lg transition-colors ${
                                  testimonial.featured
                                    ? 'bg-amber-600/20 text-amber-500 hover:bg-amber-600/30'
                                    : 'bg-stone-700 text-gray-400 hover:bg-stone-600'
                                }`}
                                title={testimonial.featured ? 'Odstrániť z odporúčaných' : 'Pridať do odporúčaných'}
                              >
                                {testimonial.featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(testimonial.id)}
                                className="p-2 bg-red-900/20 hover:bg-red-900/30 text-red-500 rounded-lg transition-colors"
                                title="Vymazať"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-stone-900 rounded-xl border border-stone-800 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Potvrdiť vymazanie</h3>
            <p className="text-gray-400 mb-6">
              Naozaj chcete vymazať {activeTab === 'properties' ? 'túto nehnuteľnosť' : 'túto referenciu'}? Táto akcia sa nedá vrátiť späť.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg transition-colors"
              >
                Zrušiť
              </button>
              <button
                onClick={() => activeTab === 'properties' ? deleteProperty(deleteConfirm) : deleteTestimonial(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Vymazať
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
