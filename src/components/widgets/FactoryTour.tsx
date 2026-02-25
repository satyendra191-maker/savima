import React, { useState } from 'react';
import { Play, X, ChevronRight, ChevronLeft, MapPin, Factory } from 'lucide-react';
import { ImageWithFallback, FACTORY_PLACEHOLDER } from '../ui/ImageWithFallback';

const STATIONS = [
  {
    id: 1,
    title: "CNC Machining Center",
    description: "State-of-the-art CNC machining centers with 4-axis and 5-axis capabilities. Precision tolerance up to +/- 0.005mm.",
    image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80",
    stats: ["20+ CNC Machines", "24/7 Operation", "Swiss Type Autos"]
  },
  {
    id: 2,
    title: "Cold Forging Unit",
    description: "High-speed cold forging production line for brass and steel components. Annual capacity of 500+ tons.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    stats: ["250T - 1000T Presses", "Automated Feeding", "Flash Free Forging"]
  },
  {
    id: 3,
    title: "Quality Control Lab",
    description: "In-house testing facility with CMM, spectral analyzer, and salt spray testing. ISO 9001:2015 compliant processes.",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
    stats: ["CMM Inspection", "Material Testing", "Dimensional Reports"]
  },
  {
    id: 4,
    title: "Warehouse & Logistics",
    description: "Organized inventory management with barcoding system. Export-grade packaging and loading docks.",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80",
    stats: ["5000 sq ft Storage", "Air/Sea Freight", "Custom Clearance"]
  }
];

export const FactoryTour: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStation, setCurrentStation] = useState(0);

  const nextStation = () => setCurrentStation((prev) => (prev + 1) % STATIONS.length);
  const prevStation = () => setCurrentStation((prev) => (prev - 1 + STATIONS.length) % STATIONS.length);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextStation();
    if (e.key === 'ArrowLeft') prevStation();
    if (e.key === 'Escape') setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div
        className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full overflow-hidden group cursor-pointer"
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen(true)}
        aria-label="Open virtual factory tour"
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80"
          alt="Factory Tour"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          fallbackClassName="w-full h-full"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/40 transition-colors">
          <div className="text-center text-white px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm group-hover:bg-brass-500/80 transition-colors">
              <Play size={32} className="sm:w-10 sm:h-10" fill="currentColor" />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              Virtual Factory Tour
            </h2>
            <p className="mt-2 opacity-80 text-sm sm:text-base">Click to explore our manufacturing facility</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onKeyDown={handleKeyDown}>
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 p-3 text-white hover:text-brass-500 z-10 bg-black/50 rounded-full"
        aria-label="Close tour"
      >
        <X size={32} />
      </button>

      <div className="w-full max-w-6xl mx-4 relative">
        <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
          {/* Main Image */}
          <div className="relative h-[50vh] sm:h-[60vh]">
            <ImageWithFallback
              src={STATIONS[currentStation].image}
              alt={STATIONS[currentStation].title}
              className="w-full h-full object-cover"
              fallbackClassName="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

            {/* Navigation */}
            <button
              onClick={prevStation}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-full text-white transition min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Previous station"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={nextStation}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-full text-white transition min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Next station"
            >
              <ChevronRight size={28} />
            </button>

            {/* Station Info */}
            <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-brass-500 text-xs font-bold px-2 py-1 rounded">STATION {currentStation + 1}/{STATIONS.length}</span>
                <span className="flex items-center gap-1 text-sm"><MapPin size={14} /> Jamnagar, Gujarat</span>
              </div>
              <h2
                className="text-xl sm:text-2xl md:text-3xl font-bold mb-2"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
              >
                {STATIONS[currentStation].title}
              </h2>
              <p className="text-gray-300 max-w-2xl text-sm sm:text-base">{STATIONS[currentStation].description}</p>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="bg-gray-800 p-3 sm:p-4 flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar">
            {STATIONS.map((station, index) => (
              <button
                key={station.id}
                onClick={() => setCurrentStation(index)}
                className={`flex-shrink-0 w-24 sm:w-32 relative rounded-lg overflow-hidden border-2 transition min-h-[48px] ${currentStation === index ? 'border-brass-500' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                aria-label={`Go to ${station.title}`}
              >
                <ImageWithFallback
                  src={station.image}
                  alt={station.title}
                  className="w-full h-16 sm:h-20 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-xs text-white truncate">{station.title}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
