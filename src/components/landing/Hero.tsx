import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="relative min-h-[700px] md:h-screen md:min-h-[800px] overflow-hidden bg-saviman-900">
      {/* Background Video / Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-saviman-900 via-saviman-800/80 to-saviman-900/60 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1920&q=80"
          alt="Precision Manufacturing"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] animate-pulse z-0"></div>
      </div>

      <div ref={heroRef} className="relative z-30 h-full flex flex-col items-center justify-center text-center px-4 pt-16 pb-24 md:pb-0">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brass-500/10 border border-brass-500/20 text-brass-400 text-sm font-medium mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-brass-500 animate-pulse"></span>
            Global Precision Manufacturing Partner
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter animate-fade-in-up delay-100" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Precision Engineering <br className="hidden md:block" />
            <span className="text-gradient-gold">Global Standards</span>
          </h1>

          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Leading manufacturer and exporter of precision Brass and Stainless Steel components.
            ISO 9001:2015 Certified with a legacy of excellence since 1990.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Link to="/products" className="btn-primary group flex items-center gap-2 text-lg px-8 py-4">
              Explore Products <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/infrastructure" className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white hover:bg-white/10 backdrop-blur-md transition-all font-bold text-lg">
              <Play size={20} className="fill-current text-brass-500" /> Watch Factory Tour
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown size={24} />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative md:absolute bottom-0 w-full bg-black/60 backdrop-blur-md border-t border-white/10 py-6 z-40">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-white mb-1">30+</div>
            <div className="text-sm text-gray-200">Years Experience</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">50+</div>
            <div className="text-sm text-gray-200">Countries Served</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">500+</div>
            <div className="text-sm text-gray-200">Happy Clients</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">1000+</div>
            <div className="text-sm text-gray-200">Projects Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};
