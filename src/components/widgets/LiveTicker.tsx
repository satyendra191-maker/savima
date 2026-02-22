import React from 'react';
import { Clock, Globe, Users, Award, Factory, Truck } from 'lucide-react';

export const LiveTicker: React.FC = () => {
  return (
    <div className="bg-saviman-900 text-white py-3 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-saviman-900 to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-saviman-900 to-transparent z-10"></div>
      
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Duplicated for seamless loop */}
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center gap-8 px-8">
            <span className="flex items-center gap-2">
              <Clock size={16} className="text-brass-400" />
              <span className="text-sm font-medium">Production Time: <strong>2-3 Weeks</strong></span>
            </span>
            <span className="flex items-center gap-2">
              <Globe size={16} className="text-brass-400" />
              <span className="text-sm font-medium">Exporting to <strong>50+ Countries</strong></span>
            </span>
            <span className="flex items-center gap-2">
              <Users size={16} className="text-brass-400" />
              <span className="text-sm font-medium">Happy Clients: <strong>500+</strong></span>
            </span>
            <span className="flex items-center gap-2">
              <Award size={16} className="text-brass-400" />
              <span className="text-sm font-medium">ISO <strong>9001:2015</strong> Certified</span>
            </span>
            <span className="flex items-center gap-2">
              <Factory size={16} className="text-brass-400" />
              <span className="text-sm font-medium">Since <strong>1990</strong></span>
            </span>
            <span className="flex items-center gap-2">
              <Truck size={16} className="text-brass-400" />
              <span className="text-sm font-medium">Global Shipping</span>
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};
