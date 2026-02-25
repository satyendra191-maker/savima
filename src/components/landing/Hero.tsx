import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ChevronDown, X } from 'lucide-react';
import { getFormattedStats } from '../../config/company';

// Fallback image for when Unsplash fails to load
const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9IiMwQjFGM0EiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4Ij5QcmVjaXNpb24gTWFudWZhY3R1cmluZzwvdGV4dD48L3N2Zz4=';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const stats = getFormattedStats();

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showVideoModal) {
        setShowVideoModal(false);
      }
    };
    if (showVideoModal) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showVideoModal]);

  return (
    <div className="relative min-h-[700px] md:h-screen md:min-h-[800px] overflow-hidden bg-navy-900">
      {/* Background Image with Fallback */}
      <div className="absolute inset-0 z-0">
        {/* Strong gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-900/70 z-10"></div>

        {/* Background image with loading state */}
        {!imageError ? (
          <img
            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1920&q=80"
            alt="Precision Manufacturing"
            className={`absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity duration-500 ${imageLoaded ? 'opacity-50' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900"
            aria-hidden="true"
          />
        )}

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] animate-pulse z-0"></div>
      </div>

      <div ref={heroRef} className="relative z-30 h-full flex flex-col items-center justify-center text-center px-4 pt-20 md:pt-16 pb-28 md:pb-0">
        <div className="max-w-5xl mx-auto">
          {/* Badge with improved contrast */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brass-500/20 border border-brass-500/30 text-brass-300 text-sm font-medium mb-6 animate-fade-in-up backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-brass-400 animate-pulse"></span>
            Global Precision Manufacturing Partner
          </div>

          {/* Main heading with text shadow for better readability */}
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter animate-fade-in-up delay-100"
            style={{
              fontFamily: 'Outfit, sans-serif',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
            }}
          >
            Precision Engineering <br className="hidden md:block" />
            <span className="text-gradient-gold drop-shadow-lg">Global Standards</span>
          </h1>

          {/* Description with improved contrast */}
          <p
            className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200"
            style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}
          >
            Leading manufacturer and exporter of precision Brass and Stainless Steel components.
            ISO 9001:2015 Certified with a legacy of excellence since 1990.
          </p>

          {/* CTA Buttons with proper touch targets (44px minimum) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Link
              to="/products"
              className="btn-primary group flex items-center gap-2 text-lg px-8 py-4 min-h-[52px] font-semibold"
            >
              Explore Products <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => setShowVideoModal(true)}
              className="flex items-center gap-2 px-8 py-4 min-h-[52px] rounded-xl border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-md transition-all font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-brass-500 focus:ring-offset-2 focus:ring-offset-navy-900"
              aria-label="Watch Factory Tour Video"
            >
              <Play size={20} className="fill-current text-brass-400" /> Watch Factory Tour
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown size={24} />
        </div>
      </div>

      {/* Stats Bar with improved contrast and mobile responsiveness */}
      <div className="relative md:absolute bottom-0 w-full bg-navy-900/80 backdrop-blur-md border-t border-white/10 py-6 z-40">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              {stats.yearsExperience}
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Years Experience</div>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              {stats.countriesServed}
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Countries Served</div>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              {stats.happyClients}
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Happy Clients</div>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              {stats.projectsCompleted}
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Projects Completed</div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowVideoModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Factory Tour Video"
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Close video"
            >
              <X size={24} />
            </button>
            {/* YouTube embed placeholder - replace with actual video ID */}
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0"
              title="Factory Tour Video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};
