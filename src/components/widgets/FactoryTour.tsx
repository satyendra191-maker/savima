import React, { useState } from 'react';
import { Play, X, ChevronRight, ChevronLeft, MapPin } from 'lucide-react';

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

  if (!isOpen) {
    return (
      <div className="relative h-[500px] w-full overflow-hidden group cursor-pointer" onClick={() => setIsOpen(true)}>
        <img 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80" 
          alt="Factory Tour" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm group-hover:bg-brass-500/80 transition-colors">
              <Play size={40} fill="currentColor" />
            </div>
            <h2 className="text-3xl font-bold">Virtual Factory Tour</h2>
            <p className="mt-2 opacity-80">Click to explore our manufacturing facility</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <button 
        onClick={() => setIsOpen(false)} 
        className="absolute top-4 right-4 text-white hover:text-brass-500 z-10"
      >
        <X size={40} />
      </button>

      <div className="w-full max-w-6xl mx-4 relative">
        <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
          {/* Main Image */}
          <div className="relative h-[60vh]">
            <img 
              src={STATIONS[currentStation].image} 
              alt={STATIONS[currentStation].title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            
            {/* Navigation */}
            <button 
              onClick={prevStation}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full text-white transition"
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              onClick={nextStation}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full text-white transition"
            >
              <ChevronRight size={32} />
            </button>

            {/* Station Info */}
            <div className="absolute bottom-0 left-0 w-full p-8 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-brass-500 text-xs font-bold px-2 py-1 rounded">STATION {currentStation + 1}/{STATIONS.length}</span>
                <span className="flex items-center gap-1 text-sm"><MapPin size={14} /> Jamnagar, Gujarat</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">{STATIONS[currentStation].title}</h2>
              <p className="text-gray-300 max-w-2xl">{STATIONS[currentStation].description}</p>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="bg-gray-800 p-4 flex gap-4 overflow-x-auto">
            {STATIONS.map((station, index) => (
              <button
                key={station.id}
                onClick={() => setCurrentStation(index)}
                className={`flex-shrink-0 w-32 relative rounded-lg overflow-hidden border-2 transition ${
                  currentStation === index ? 'border-brass-500' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={station.image} alt={station.title} className="w-full h-20 object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-xs text-white truncate">{station.title}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
