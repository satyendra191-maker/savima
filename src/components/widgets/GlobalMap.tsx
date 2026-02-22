import React, { useEffect, useRef } from 'react';

const COUNTRIES = [
  { name: "USA", x: 18, y: 35 },
  { name: "Canada", x: 17, y: 25 },
  { name: "Germany", x: 48, y: 28 },
  { name: "UK", x: 45, y: 26 },
  { name: "France", x: 46, y: 32 },
  { name: "Italy", x: 50, y: 34 },
  { name: "Spain", x: 43, y: 36 },
  { name: "Netherlands", x: 48, y: 26 },
  { name: "UAE", x: 58, y: 45 },
  { name: "Saudi Arabia", x: 56, y: 45 },
  { name: "Australia", x: 82, y: 65 },
  { name: "Japan", x: 85, y: 35 },
  { name: "South Korea", x: 82, y: 36 },
  { name: "Indonesia", x: 78, y: 58 },
  { name: "India", x: 65, y: 45 },
];

export const GlobalMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw connections
    const drawConnections = () => {
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      ctx.lineWidth = 1;
      
      // Draw animated dots moving from India to other countries
      COUNTRIES.forEach((country, index) => {
        if (country.name === "India") return;
        
        const targetX = (country.x / 100) * canvas.width;
        const targetY = (country.y / 100) * canvas.height;
        const originX = (65 / 100) * canvas.width;
        const originY = (45 / 100) * canvas.height;

        // Simple line
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
      });
    };

    drawConnections();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawConnections();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="py-20 bg-saviman-900 relative overflow-hidden">
      {/* Background Map (SVG Placeholder) */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 100 60" className="w-full h-full fill-current text-gray-700">
           <circle cx="65" cy="45" r="2" fill="white" />
           {COUNTRIES.map(c => (
             <circle key={c.name} cx={c.x} cy={c.y} r="0.5" fill="white" />
           ))}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white">Global Reach</h2>
          <p className="mt-4 text-lg text-gray-300">
            Exporting precision components to over 50 countries worldwide
          </p>
        </div>

        <div className="relative h-[400px] md:h-[500px] bg-saviman-800/50 rounded-2xl border border-white/10 backdrop-blur-sm p-4">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          
          {/* India Marker */}
          <div className="absolute top-[45%] left-[65%] transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-brass-500 rounded-full animate-pulse"></div>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs font-bold text-white bg-brass-600 px-2 py-1 rounded">INDIA (HQ)</span>
            </div>
          </div>

          {/* Country Dots */}
          {COUNTRIES.map((country) => (
            country.name !== "India" && (
              <div 
                key={country.name}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${country.x}%`, top: `${country.y}%` }}
              >
                <div className="w-2 h-2 bg-white/50 rounded-full group-hover:bg-brass-500 transition-colors"></div>
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  <span className="text-xs text-white bg-black/70 px-2 py-1 rounded">{country.name}</span>
                </div>
              </div>
            )
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/5 rounded-lg p-4">
                <div className="text-3xl font-bold text-brass-500">50+</div>
                <div className="text-gray-300">Countries</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
                <div className="text-3xl font-bold text-brass-500">500+</div>
                <div className="text-gray-300">Clients</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
                <div className="text-3xl font-bold text-brass-500">1000+</div>
                <div className="text-gray-300">Containers</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
                <div className="text-3xl font-bold text-brass-500">99%</div>
                <div className="text-gray-300">On-Time Delivery</div>
            </div>
        </div>
      </div>
    </div>
  );
};
