import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Property } from '../lib/supabase';
import { useProperties } from '../hooks/useProperties';
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
  const [searchFilters, setSearchFilters] = useState({ term: '', transactionType: '', propertyType: '' });
  const location = useLocation();
  const { data: properties = [], isLoading: loading, isError, refetch } = useProperties();

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

  const filteredProperties = useMemo<Property[]>(() => {
    let filtered = [...properties];
    const { term, transactionType, propertyType } = searchFilters;

    if (term) {
      const lower = term.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.location.toLowerCase().includes(lower) ||
          p.address.toLowerCase().includes(lower) ||
          p.title.toLowerCase().includes(lower)
      );
    }

    if (transactionType) {
      filtered = filtered.filter((p) => p.transaction_type === transactionType);
    }

    if (propertyType) {
      filtered = filtered.filter((p) => p.property_type === propertyType);
    }

    return filtered;
  }, [properties, searchFilters]);

  const handleSearch = (searchTerm: string, transactionType: string, propertyType: string) => {
    setSearchFilters({ term: searchTerm, transactionType, propertyType });
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <Hero onSearch={handleSearch} />
        <PropertyList properties={filteredProperties} loading={loading} isError={isError} onRetry={refetch} />
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
