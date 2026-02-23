import React from 'react';
import { Award, Trophy, Medal, Shield, BadgeCheck } from 'lucide-react';

const AWARDS = [
  {
    year: 2024,
    title: "Best Export Excellence Award",
    organization: "Export Promotion Council",
    description: "Recognized for outstanding performance in engineering goods export.",
    icon: Trophy,
    category: "Export"
  },
  {
    year: 2023,
    title: "Quality Excellence Award",
    organization: " Confederation of Indian Industry (CII)",
    description: "Awarded for maintaining highest quality standards in manufacturing.",
    icon: Award,
    category: "Quality"
  },
  {
    year: 2022,
    title: "Fastest Growing Manufacturing SME",
    organization: "India SME Forum",
    description: "Recognized among top 100 rapidly growing SMEs in Gujarat.",
    icon: Medal,
    category: "Growth"
  },
  {
    year: 2021,
    title: "ISO 9001:2015 Certification",
    organization: "Bureau Veritas",
    description: "Successfully recertified for Quality Management Systems.",
    icon: BadgeCheck,
    category: "Certification"
  },
  {
    year: 2020,
    title: "Green Manufacturing Award",
    organization: "Gujarat Pollution Control Board",
    description: "Recognized for sustainable and eco-friendly manufacturing practices.",
    icon: Shield,
    category: "Sustainability"
  },
  {
    year: 2018,
    title: "Best Supplier Award",
    organization: "Tata Motors",
    description: "Awarded as preferred supplier for precision components.",
    icon: Award,
    category: "Partnership"
  }
];

export const Awards: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Awards & Recognition</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Our commitment to quality and excellence has been recognized by leading industry bodies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(AWARDS ?? []).map((award, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-brass-100 dark:bg-brass-900/30 rounded-xl flex items-center justify-center">
                  {award?.icon ? <award.icon className="text-brass-600" size={28} /> : <Award className="text-brass-600" size={28} />}
                </div>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300">
                  {award?.category}
                </span>
              </div>
              
              <div className="text-sm text-brass-600 font-bold mb-1">{award?.year}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{award?.title}</h3>
              <p className="text-sm font-medium text-gray-500 mb-3">{award?.organization}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{award?.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-saviman-900 dark:bg-black rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Our Quality Philosophy</h3>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            We believe that awards are milestones, not destinations. Our focus remains on continuous improvement and delivering maximum value to our clients.
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-70">
            <div className="text-white font-bold text-2xl">ISO 9001:2015</div>
            <div className="text-white font-bold text-2xl">IATF 16949</div>
            <div className="text-white font-bold text-2xl">ISO 14001</div>
          </div>
        </div>

        {/* Trusted By - Rainbow Text */}
        <div className="mt-16 py-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Trusted By Industry Leaders</h3>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {['TATA', 'BHEL', 'L&T', 'ABB', 'GODREJ'].map((company, index) => (
              <span 
                key={company}
                className="text-2xl md:text-3xl font-black tracking-wide"
                style={{
                  background: `linear-gradient(to right, 
                    ${['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'][index % 7]}, 
                    ${['#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3', '#ff0000'][index % 7]})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: `rainbow ${2 + index * 0.3}s ease-in-out infinite alternate`
                }}
              >
                {company}
              </span>
            ))}
          </div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Our Quality Philosophy Drive Your Manufacturing Innovation
          </p>
          <style>{`
            @keyframes rainbow {
              0% { filter: hue-rotate(0deg); }
              100% { filter: hue-rotate(30deg); }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
};
