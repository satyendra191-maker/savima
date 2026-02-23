import React, { useState, useEffect } from 'react';
import { X, Globe, Award, TrendingUp, Calendar } from 'lucide-react';

interface Announcement {
  id: string;
  text: string;
  link?: string;
  icon: React.ReactNode;
}

const ANNOUNCEMENTS: Announcement[] = [
  { id: '1', text: "🌍 Exporting to 50+ Countries Worldwide | ISO 9001:2015 Certified", icon: <Globe size={14} /> },
  { id: '2', text: "🏆 Awarded 'Best Export Excellence' by Export Promotion Council 2024", icon: <Award size={14} /> },
  { id: '3', text: "📈 40% Faster Lead Times | Serving Global Fortune 500 Companies", icon: <TrendingUp size={14} /> },
  { id: '4', text: "📅 Book Your Virtual Factory Tour | Limited Slots Available This Month", icon: <Calendar size={14} /> },
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (isDismissed) return null;

  const current = ANNOUNCEMENTS[currentIndex];
  const currentAnnouncement = current ?? ANNOUNCEMENTS[0];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-2.5 px-4 relative z-40 border-b border-slate-700">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <div className="flex items-center gap-2 text-amber-400">
          {currentAnnouncement?.icon ?? <Globe size={14} />}
        </div>
        
        <div className="flex-1 text-center overflow-hidden">
          <div className="flex justify-center gap-4">
            {ANNOUNCEMENTS.map((announcement, idx) => (
              <a
                key={announcement.id}
                href={announcement.link || '#'}
                className={`text-sm font-medium whitespace-nowrap transition-all duration-500 ${
                  idx === currentIndex 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 absolute -translate-y-4'
                }`}
                style={{
                  display: idx === currentIndex ? 'inline-block' : 'none'
                }}
              >
                {announcement.text}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {ANNOUNCEMENTS.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-amber-400 w-6' : 'bg-slate-600 w-2'
                }`}
              />
            ))}
          </div>
          <button 
            onClick={() => setIsDismissed(true)}
            className="ml-2 hover:bg-white/10 rounded p-1 transition-colors"
          >
            <X size={14} className="text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
