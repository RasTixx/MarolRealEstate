import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase, Property } from '../lib/supabase';
import Header from '../components/Header';
import Hero from '../components/Hero';
import PropertyList from '../components/PropertyList';
import About from '../components/About';
import Services from '../components/Services';
import FinancingSection from '../components/FinancingSection';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.querySelector(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProperties(data || []);
      setFilteredProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm: string, transactionType: string, propertyType: string, stav: string) => {
    let filtered = [...properties];

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (transactionType) {
      filtered = filtered.filter((p) => p.transaction_type === transactionType);
    }

    if (propertyType) {
      filtered = filtered.filter((p) => p.property_type === propertyType);
    }

    if (stav) {
      filtered = filtered.filter((p) => p.stav === stav);
    }

    setFilteredProperties(filtered);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <Hero onSearch={handleSearch} />
        <PropertyList properties={filteredProperties} loading={loading} />
        <About />
        <Services />
        <FinancingSection />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
