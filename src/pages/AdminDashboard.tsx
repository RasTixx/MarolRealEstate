import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Property } from '../lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LogOut, Home, Building2, Mail, BarChart3, Plus, CreditCard as Edit, Trash2, Star, StarOff, Search, MessageSquare, CheckCircle, XCircle, User, Inbox, TrendingUp, Globe, Calendar, Clock } from 'lucide-react';

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

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
}

interface PropertyInquiry {
  id: string;
  inquiry_type: 'buy' | 'sell';
  full_name: string;
  email: string;
  phone: string | null;
  property_type?: string;
  location?: string;
  min_price?: number;
  max_price?: number;
  address?: string;
  city?: string;
  asking_price?: number;
  additional_requirements?: string;
  description?: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'properties' | 'testimonials' | 'messages' | 'analytics'>('properties');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [testimonialFilter, setTestimonialFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [messageFilter, setMessageFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState<'all' | 'buy' | 'sell' | 'contact'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: properties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ['admin', 'properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 60 * 1000,
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['admin', 'testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 60 * 1000,
  });

  const { data: contactMessages = [] } = useQuery<ContactMessage[]>({
    queryKey: ['admin', 'contact_messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 60 * 1000,
  });

  const { data: propertyInquiries = [] } = useQuery<PropertyInquiry[]>({
    queryKey: ['admin', 'property_inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 60 * 1000,
  });

  const { data: pageViews = [] } = useQuery<{ page_path: string; session_id: string; created_at: string }[]>({
    queryKey: ['admin', 'page_views'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const { data, error } = await supabase
        .from('page_views')
        .select('page_path, session_id, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 60 * 1000,
    enabled: activeTab === 'analytics',
  });

  const loading = propertiesLoading;

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
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
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
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
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
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['admin', 'contact_messages'] });
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('property_inquiries')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['admin', 'property_inquiries'] });
    } catch (error) {
      console.error('Error updating inquiry status:', error);
    }
  };

  const deleteContactMessage = async (id: string) => {
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['admin', 'contact_messages'] });
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting contact message:', error);
    }
  };

  const deletePropertyInquiry = async (id: string) => {
    try {
      const { error } = await supabase.from('property_inquiries').delete().eq('id', id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['admin', 'property_inquiries'] });
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting property inquiry:', error);
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

  const messageStats = {
    totalMessages: contactMessages.length,
    newMessages: contactMessages.filter((m) => m.status === 'new').length + propertyInquiries.filter((i) => i.status === 'new').length,
    totalInquiries: propertyInquiries.length,
    buyInquiries: propertyInquiries.filter((i) => i.inquiry_type === 'buy').length,
    sellInquiries: propertyInquiries.filter((i) => i.inquiry_type === 'sell').length,
  };

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29).toISOString();

  const analyticsStats = {
    total: pageViews.length,
    today: pageViews.filter((v) => v.created_at >= todayStart).length,
    thisWeek: pageViews.filter((v) => v.created_at >= weekStart).length,
    thisMonth: pageViews.filter((v) => v.created_at >= monthStart).length,
    uniqueSessions: new Set(pageViews.map((v) => v.session_id)).size,
  };

  const pagePathCounts = pageViews.reduce<Record<string, number>>((acc, v) => {
    acc[v.page_path] = (acc[v.page_path] || 0) + 1;
    return acc;
  }, {});

  const topPages = Object.entries(pagePathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const dailyCounts: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dailyCounts[key] = 0;
  }
  pageViews.forEach((v) => {
    const key = v.created_at.slice(0, 10);
    if (key in dailyCounts) dailyCounts[key]++;
  });
  const dailyData = Object.entries(dailyCounts);
  const maxDailyCount = Math.max(...dailyData.map(([, c]) => c), 1);

  const pageLabels: Record<string, string> = {
    '/': 'Domov',
    '/chcem-kupit': 'Chcem kúpiť',
    '/chcem-predat': 'Chcem predať',
    '/referencie': 'Referencie',
    '/ochrana-osobnych-udajov': 'GDPR',
    '/vseobecne-obchodne-podmienky': 'VOP',
    '/reklamacny-poriadok': 'Reklamačný poriadok',
    '/eticky-kodex': 'Etický kódex',
  };

  const filteredMessages = contactMessages.filter((m) => {
    if (messageFilter === 'all') return true;
    return m.status === messageFilter;
  });

  const parseContactMessage = (message: string): { propertyTitle: string | null; body: string } => {
    const prefix = 'Záujem o nehnuteľnosť: ';
    const newlineIndex = message.indexOf('\n');
    if (message.startsWith(prefix) && newlineIndex !== -1) {
      return {
        propertyTitle: message.slice(prefix.length, newlineIndex).trim(),
        body: message.slice(newlineIndex).trim(),
      };
    }
    return { propertyTitle: null, body: message };
  };

  const filteredInquiries = propertyInquiries.filter((i) => {
    if (inquiryTypeFilter === 'all') return true;
    if (inquiryTypeFilter === 'contact') return false;
    return i.inquiry_type === inquiryTypeFilter;
  });

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
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'properties'
                ? 'bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 text-black shadow-lg'
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
                ? 'bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 text-black shadow-lg'
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
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'messages'
                ? 'bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 text-black shadow-lg'
                : 'bg-stone-800 text-gray-400 hover:bg-stone-700'
            }`}
          >
            <Inbox className="w-5 h-5" />
            Správy a dopyt
            {messageStats.newMessages > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {messageStats.newMessages}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 text-black shadow-lg'
                : 'bg-stone-800 text-gray-400 hover:bg-stone-700'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Návštevnosť
          </button>
        </div>

        {activeTab === 'properties' && (
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
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 text-black font-medium rounded-lg transition-all shadow-lg"
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
        )}

        {activeTab === 'testimonials' && (
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
                            <div className="text-sm text-gray-300 max-w-md">
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

        {activeTab === 'messages' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 border border-stone-700">
                <div className="flex items-center justify-between mb-2">
                  <Inbox className="w-8 h-8 text-amber-600" />
                  <span className="text-3xl font-bold text-white">{messageStats.totalMessages}</span>
                </div>
                <p className="text-gray-400 text-sm">Kontaktné správy</p>
              </div>

              <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 border border-stone-700">
                <div className="flex items-center justify-between mb-2">
                  <Home className="w-8 h-8 text-blue-500" />
                  <span className="text-3xl font-bold text-white">{messageStats.buyInquiries}</span>
                </div>
                <p className="text-gray-400 text-sm">Záujem o kúpu</p>
              </div>

              <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 border border-stone-700">
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="w-8 h-8 text-green-500" />
                  <span className="text-3xl font-bold text-white">{messageStats.sellInquiries}</span>
                </div>
                <p className="text-gray-400 text-sm">Záujem o predaj</p>
              </div>

              <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 border border-stone-700">
                <div className="flex items-center justify-between mb-2">
                  <Mail className="w-8 h-8 text-red-500" />
                  <span className="text-3xl font-bold text-white">{messageStats.newMessages}</span>
                </div>
                <p className="text-gray-400 text-sm">Nové správy</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden">
                <div className="p-6 border-b border-stone-800">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <h2 className="text-2xl font-bold text-white">Kontaktné správy</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setMessageFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          messageFilter === 'all'
                            ? 'bg-amber-600 text-white'
                            : 'bg-stone-800 text-gray-400 hover:bg-stone-700'
                        }`}
                      >
                        Všetky
                      </button>
                      <button
                        onClick={() => setMessageFilter('new')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          messageFilter === 'new'
                            ? 'bg-amber-600 text-white'
                            : 'bg-stone-800 text-gray-400 hover:bg-stone-700'
                        }`}
                      >
                        Nové ({messageStats.newMessages})
                      </button>
                      <button
                        onClick={() => setMessageFilter('contacted')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          messageFilter === 'contacted'
                            ? 'bg-amber-600 text-white'
                            : 'bg-stone-800 text-gray-400 hover:bg-stone-700'
                        }`}
                      >
                        Kontaktované
                      </button>
                      <button
                        onClick={() => setMessageFilter('closed')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          messageFilter === 'closed'
                            ? 'bg-amber-600 text-white'
                            : 'bg-stone-800 text-gray-400 hover:bg-stone-700'
                        }`}
                      >
                        Uzavreté
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {filteredMessages.length === 0 ? (
                    <div className="p-12 text-center">
                      <Inbox className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Žiadne správy nenájdené</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-stone-800/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Kontakt
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Správa
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
                        {filteredMessages.map((message) => (
                          <tr key={message.id} className="hover:bg-stone-800/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-white">{message.name}</div>
                              <div className="text-xs text-gray-400">{message.email}</div>
                              {message.phone && (
                                <div className="text-xs text-gray-400">{message.phone}</div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {(() => {
                                const { propertyTitle, body } = parseContactMessage(message.message);
                                return (
                                  <div className="max-w-md">
                                    {propertyTitle && (
                                      <div className="text-xs text-amber-500 font-medium mb-1 truncate">
                                        {propertyTitle}
                                      </div>
                                    )}
                                    <div className="text-sm text-gray-300">{body}</div>
                                  </div>
                                );
                              })()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={message.status}
                                onChange={(e) => updateMessageStatus(message.id, e.target.value)}
                                className="px-3 py-1 text-xs font-medium rounded bg-stone-700 text-white border border-stone-600 focus:outline-none focus:border-amber-600"
                              >
                                <option value="new">Nové</option>
                                <option value="contacted">Kontaktované</option>
                                <option value="closed">Uzavreté</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-400">
                                {new Date(message.created_at).toLocaleDateString('sk-SK')}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(message.created_at).toLocaleTimeString('sk-SK')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => setDeleteConfirm(message.id)}
                                className="p-2 bg-red-900/20 hover:bg-red-900/30 text-red-500 rounded-lg transition-colors"
                                title="Vymazať"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden">
                <div className="p-6 border-b border-stone-800">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <h2 className="text-2xl font-bold text-white">Dopyty po nehnuteľnostiach</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setInquiryTypeFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          inquiryTypeFilter === 'all'
                            ? 'bg-amber-600 text-white'
                            : 'bg-stone-800 text-gray-400 hover:bg-stone-700'
                        }`}
                      >
                        Všetky
                      </button>
                      <button
                        onClick={() => setInquiryTypeFilter('buy')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          inquiryTypeFilter === 'buy'
                            ? 'bg-amber-600 text-white'
                            : 'bg-stone-800 text-gray-400 hover:bg-stone-700'
                        }`}
                      >
                        Kúpa ({messageStats.buyInquiries})
                      </button>
                      <button
                        onClick={() => setInquiryTypeFilter('sell')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          inquiryTypeFilter === 'sell'
                            ? 'bg-amber-600 text-white'
                            : 'bg-stone-800 text-gray-400 hover:bg-stone-700'
                        }`}
                      >
                        Predaj ({messageStats.sellInquiries})
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {filteredInquiries.length === 0 ? (
                    <div className="p-12 text-center">
                      <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Žiadne dopyty nenájdené</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-stone-800/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Typ
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Kontakt
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Detaily
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
                        {filteredInquiries.map((inquiry) => (
                          <tr key={inquiry.id} className="hover:bg-stone-800/30 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded ${
                                  inquiry.inquiry_type === 'buy'
                                    ? 'bg-blue-900/30 text-blue-400'
                                    : 'bg-green-900/30 text-green-400'
                                }`}
                              >
                                {inquiry.inquiry_type === 'buy' ? 'Kúpa' : 'Predaj'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-white">{inquiry.full_name}</div>
                              <div className="text-xs text-gray-400">{inquiry.email}</div>
                              {inquiry.phone && (
                                <div className="text-xs text-gray-400">{inquiry.phone}</div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {inquiry.inquiry_type === 'buy' ? (
                                <div className="text-sm text-gray-300 space-y-1">
                                  <div><strong>Lokalita:</strong> {inquiry.location}</div>
                                  <div><strong>Typ:</strong> {inquiry.property_type}</div>
                                  {inquiry.min_price && inquiry.max_price && (
                                    <div><strong>Rozpočet:</strong> {inquiry.min_price}€ - {inquiry.max_price}€</div>
                                  )}
                                  {inquiry.additional_requirements && (
                                    <div className="mt-2 pt-2 border-t border-stone-700">
                                      <div className="text-xs text-gray-400 font-medium mb-1">Vaše požiadavky:</div>
                                      <div className="text-gray-300">{inquiry.additional_requirements}</div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-sm text-gray-300 space-y-1">
                                  <div><strong>Adresa:</strong> {inquiry.address}, {inquiry.city}</div>
                                  <div><strong>Typ:</strong> {inquiry.property_type}</div>
                                  {inquiry.asking_price && (
                                    <div><strong>Cena:</strong> {inquiry.asking_price}€</div>
                                  )}
                                  {inquiry.description && (
                                    <div className="mt-2 pt-2 border-t border-stone-700">
                                      <div className="text-xs text-gray-400 font-medium mb-1">Vaša referencia / popis:</div>
                                      <div className="text-gray-300">{inquiry.description}</div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={inquiry.status || 'new'}
                                onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                                className="px-3 py-1 text-xs font-medium rounded bg-stone-700 text-white border border-stone-600 focus:outline-none focus:border-amber-600"
                              >
                                <option value="new">Nové</option>
                                <option value="contacted">Kontaktované</option>
                                <option value="closed">Uzavreté</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-400">
                                {new Date(inquiry.created_at).toLocaleDateString('sk-SK')}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(inquiry.created_at).toLocaleTimeString('sk-SK')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => setDeleteConfirm(inquiry.id)}
                                className="p-2 bg-red-900/20 hover:bg-red-900/30 text-red-500 rounded-lg transition-colors"
                                title="Vymazať"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 border border-stone-700">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-8 h-8 text-amber-600" />
                  <span className="text-3xl font-bold text-white">{analyticsStats.today}</span>
                </div>
                <p className="text-gray-400 text-sm">Dnes</p>
              </div>
              <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 border border-stone-700">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-8 h-8 text-amber-600" />
                  <span className="text-3xl font-bold text-white">{analyticsStats.thisWeek}</span>
                </div>
                <p className="text-gray-400 text-sm">Posledných 7 dní</p>
              </div>
              <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 border border-stone-700">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-amber-600" />
                  <span className="text-3xl font-bold text-white">{analyticsStats.thisMonth}</span>
                </div>
                <p className="text-gray-400 text-sm">Posledných 30 dní</p>
              </div>
              <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 border border-stone-700">
                <div className="flex items-center justify-between mb-2">
                  <User className="w-8 h-8 text-amber-600" />
                  <span className="text-3xl font-bold text-white">{analyticsStats.uniqueSessions}</span>
                </div>
                <p className="text-gray-400 text-sm">Unikátnych návštev (30 dní)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-stone-900 rounded-xl border border-stone-800 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-amber-600" />
                  Najnavštevovanejšie stránky
                </h2>
                {topPages.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Žiadne dáta za posledných 30 dní</p>
                ) : (
                  <div className="space-y-3">
                    {topPages.map(([path, count]) => (
                      <div key={path} className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-300 truncate">
                              {path.startsWith('/nehnutelnost/') ? 'Detail nehnuteľnosti' : (pageLabels[path] || path)}
                            </span>
                            <span className="text-sm font-semibold text-amber-500 ml-2 shrink-0">{count}</span>
                          </div>
                          <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-600 to-yellow-500 rounded-full transition-all"
                              style={{ width: `${(count / (topPages[0]?.[1] || 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-stone-900 rounded-xl border border-stone-800 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                  Denná návštevnosť (30 dní)
                </h2>
                {dailyData.every(([, c]) => c === 0) ? (
                  <p className="text-gray-500 text-center py-8">Žiadne dáta za posledných 30 dní</p>
                ) : (
                  <div className="flex items-end gap-0.5 h-40">
                    {dailyData.map(([date, count]) => {
                      const height = maxDailyCount > 0 ? (count / maxDailyCount) * 100 : 0;
                      const d = new Date(date + 'T12:00:00');
                      const label = d.toLocaleDateString('sk-SK', { day: 'numeric', month: 'numeric' });
                      return (
                        <div key={date} className="flex-1 flex flex-col items-center justify-end group relative">
                          <div
                            className="w-full bg-gradient-to-t from-amber-600 to-yellow-500 rounded-t transition-all group-hover:from-amber-500 group-hover:to-yellow-400"
                            style={{ height: `${Math.max(height, count > 0 ? 4 : 0)}%` }}
                          />
                          <div className="absolute bottom-full mb-1 bg-stone-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            {label}: {count}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>{dailyData[0]?.[0] ? new Date(dailyData[0][0] + 'T12:00:00').toLocaleDateString('sk-SK', { day: 'numeric', month: 'numeric' }) : ''}</span>
                  <span>{dailyData[dailyData.length - 1]?.[0] ? new Date(dailyData[dailyData.length - 1][0] + 'T12:00:00').toLocaleDateString('sk-SK', { day: 'numeric', month: 'numeric' }) : ''}</span>
                </div>
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
              Naozaj chcete vymazať {activeTab === 'properties' ? 'túto nehnuteľnosť' : activeTab === 'testimonials' ? 'túto referenciu' : 'túto položku'}? Táto akcia sa nedá vrátiť späť.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg transition-colors"
              >
                Zrušiť
              </button>
              <button
                onClick={() => {
                  if (activeTab === 'properties') {
                    deleteProperty(deleteConfirm);
                  } else if (activeTab === 'testimonials') {
                    deleteTestimonial(deleteConfirm);
                  } else if (activeTab === 'messages') {
                    const isContactMessage = contactMessages.some(m => m.id === deleteConfirm);
                    if (isContactMessage) {
                      deleteContactMessage(deleteConfirm);
                    } else {
                      deletePropertyInquiry(deleteConfirm);
                    }
                  }
                }}
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
