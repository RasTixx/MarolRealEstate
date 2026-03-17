import { Link } from 'react-router-dom';
import { ChevronRight, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LegalDocumentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function LegalDocumentLayout({ title, children }: LegalDocumentLayoutProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-gradient-to-b from-amber-900/20 to-black py-16 border-b border-amber-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm mb-6">
            <Link to="/" className="text-gray-400 hover:text-amber-500 transition-colors">
              Domov
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-600" />
            <span className="text-amber-500">{title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-amber-500/20 p-8 md:p-12">
          <div className="prose prose-invert prose-amber max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-amber-400
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-amber-300
            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
            prose-strong:text-white prose-strong:font-semibold
            prose-ul:text-gray-300 prose-ul:my-4
            prose-ol:text-gray-300 prose-ol:my-4
            prose-li:my-2
            prose-a:text-amber-500 prose-a:no-underline hover:prose-a:text-amber-400">
            {children}
          </div>
        </div>
      </div>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-amber-500 hover:bg-amber-600 text-black p-3 rounded-full shadow-lg transition-all transform hover:scale-110"
          aria-label="Späť na začiatok"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
