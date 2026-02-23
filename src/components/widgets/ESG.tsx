import React from 'react';
import { Leaf, Recycle, Wind, Droplets, Sun, Award } from 'lucide-react';

const INITIATIVES = [
  {
    icon: Leaf,
    title: "Carbon Neutrality",
    description: "We are committed to achieving net-zero carbon emissions by 2040 through renewable energy adoption and process optimization.",
    progress: 45
  },
  {
    icon: Recycle,
    title: "Waste Management",
    description: "Zero-waste-to-landfill initiative. 95% of our metal scrap is recycled back into the production cycle.",
    progress: 95
  },
  {
    icon: Droplets,
    title: "Water Conservation",
    description: "Closed-loop water cooling systems and rainwater harvesting have reduced our water consumption by 60%.",
    progress: 70
  },
  {
    icon: Sun,
    title: "Renewable Energy",
    description: "1.5 MW solar power plant installed to meet 40% of our energy requirements.",
    progress: 40
  }
];

export const ESG: React.FC = () => {
  return (
    <section className="py-20 bg-saviman-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-4">
            <Award size={16} /> Sustainability
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">ESG Commitment</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Manufacturing with responsibility. We believe in sustainable growth that benefits our planet and communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {(INITIATIVES ?? []).map((item, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-brass-500/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brass-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  {item?.icon ? <item.icon className="text-brass-400" size={24} /> : <Leaf className="text-brass-400" size={24} />}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{item?.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{item?.description}</p>
                  
                  <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-brass-500 rounded-full transition-all duration-1000"
                      style={{ width: `${item?.progress || 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>Progress</span>
                    <span>{item?.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 text-center">
          <h3 className="text-2xl font-bold mb-4">United Nations Sustainable Development Goals</h3>
          <p className="text-gray-300 mb-6">
            Our operations align with 6 of the 17 UN SDGs, focusing on responsible consumption, affordable clean energy, and decent work.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['SDG 7', 'SDG 8', 'SDG 9', 'SDG 12', 'SDG 13', 'SDG 17'].map((goal) => (
              <span key={goal} className="px-4 py-2 bg-gray-800 rounded-lg text-sm font-mono text-green-400">
                {goal}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
