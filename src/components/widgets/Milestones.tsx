import React from 'react';
import { Factory, Users, Globe, Award, TrendingUp } from 'lucide-react';

const MILESTONES = [
  {
    year: "1990",
    title: "Foundation",
    description: "SAVIMAN Industries established in Jamnagar, Gujarat with a vision for precision manufacturing.",
    icon: Factory,
    stats: "Started with 5 employees"
  },
  {
    year: "1995",
    title: "First Export",
    description: "Expanded operations to serve international clients in Middle East and Europe.",
    icon: Globe,
    stats: "Exported to 5 countries"
  },
  {
    year: "2000",
    title: "ISO Certification",
    description: "Achieved ISO 9001:2000 certification, establishing robust quality management systems.",
    icon: Award,
    stats: "Quality-first approach"
  },
  {
    year: "2005",
    title: "Capacity Expansion",
    description: "Invested in advanced CNC machines and cold forging technology to increase production capacity.",
    icon: TrendingUp,
    stats: "10x capacity increase"
  },
  {
    year: "2010",
    title: "Global Presence",
    description: "Established presence in 30+ countries across 5 continents.",
    icon: Globe,
    stats: "500+ global clients"
  },
  {
    year: "2015",
    title: "New Facility",
    description: "Inaugurated new 50,000 sq ft manufacturing unit in GIDC Phase III.",
    icon: Factory,
    stats: "200+ employees"
  },
  {
    year: "2020",
    title: "Tech Integration",
    description: "Implemented ERP and advanced QA systems for seamless operations.",
    icon: TrendingUp,
    stats: "Industry 4.0 ready"
  },
  {
    year: "2024",
    title: "Sustainability Goal",
    description: "Launched ESG initiatives targeting carbon neutrality by 2040.",
    icon: Award,
    stats: "1.5MW Solar Plant"
  }
];

export const Milestones: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Journey</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            From a small workshop to a global precision manufacturing leader.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

          <div className="space-y-12">
            {MILESTONES.map((milestone, index) => (
              <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl hover:shadow-md transition-shadow">
                    <div className="text-brass-600 font-bold text-lg mb-1">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{milestone.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{milestone.description}</p>
                    <div className={`inline-flex items-center gap-2 text-sm font-medium text-brass-500 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                      <milestone.icon size={16} /> {milestone.stats}
                    </div>
                  </div>
                </div>

                {/* Icon / Dot */}
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-brass-500 text-white shadow-lg z-10 flex-shrink-0 mx-4">
                  <milestone.icon size={20} />
                </div>

                {/* Empty space */}
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
