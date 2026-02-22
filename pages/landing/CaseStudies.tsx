import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

export const CaseStudies: React.FC = () => {
  const cases = [
    {
      id: 1,
      client: "Global Automotive Tier-1 Supplier",
      title: "High-Precision Brass Inserts for EV Battery Modules",
      category: "Automotive",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      challenge: "Required 50,000 units of custom brass inserts with micron-level tolerance for electric vehicle battery packs. Previous supplier failed to meet consistency standards.",
      solution: "SAVIMAN implemented a custom multi-stage cold-forging process with in-line statistical process control (SPC). We also designed custom jigs to ensure perfect concentricity during assembly.",
      result: "Zero defects in first 50k units. 30% reduction in assembly time for the client. Awarded 'Preferred Supplier' status."
    },
    {
      id: 2,
      client: "European Hydraulic Equipment Manufacturer",
      title: "Corrosion-Resistant SS Fittings for Marine Application",
      category: "Hydraulics",
      image: "https://images.unsplash.com/photo-1535952642077-c77874e28633?auto=format&fit=crop&w=800&q=80",
      challenge: "Needed AISI 316L stainless steel fittings capable of withstanding saltwater corrosion for offshore drilling equipment. Required extensive testing documentation.",
      solution: "We sourced premium Swedish steel and implemented a passivation process exceeding ASTM A967 standards. Full test reports provided for every batch.",
      result: "Client reported zero corrosion issues in 2 years of field operation. Replicated success for 3 other product lines."
    },
    {
      id: 3,
      client: "North American Electrical Giant",
      title: "Precision Turned Components for Smart Grid Switchgear",
      category: "Electrical",
      image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80",
      challenge: "Complex geometry components requiring high conductivity brass (Cw004a) with silver plating. Batch sizes varied from 500 to 50,000.",
      solution: "Our CNC Swiss-type automatics handled the complexity, while our ERP system seamlessly managed the demand variability. Silver plating was outsourced to an certified partner but quality was inspected in-house.",
      result: "On-time delivery rate of 99.8% over 5 years. Featured in client's 'Supplier Innovation' newsletter."
    },
    {
      id: 4,
      client: "Indian Defense Research Org",
      title: "Specialized Fasteners for Aerospace Application",
      category: "Aerospace",
      image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80",
      challenge: "Strict tolerance fasteners for airborne communication systems. Material traceability and batch testing were mandatory.",
      solution: "Setup dedicated production line with full material traceability (MTC). Implemented 100% dimensional inspection using automated vision systems.",
      result: "Approved for ongoing supply contract. Quality scores consistently above 98%."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Case Studies</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Real-world examples of how SAVIMAN solves complex manufacturing challenges for global clients.
          </p>
        </div>

        <div className="grid gap-12">
          {cases.map((study) => (
            <div key={study.id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col md:flex-row">
              <div className="md:w-1/3 h-64 md:h-auto relative">
                <img src={study.image} alt={study.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-brass-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {study.category}
                </div>
              </div>
              <div className="p-8 md:w-2/3 flex flex-col justify-center">
                <div className="text-sm text-brass-600 font-semibold mb-2">{study.client}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{study.title}</h3>
                
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span> Challenge
                    </h4>
                    <p>{study.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Solution
                    </h4>
                    <p>{study.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span> Result
                    </h4>
                    <p>{study.result}</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                   <button className="text-brass-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                     Read Full Case Study <ArrowRight size={18} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-brass-50 dark:bg-gray-800 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Have a similar challenge?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Let's discuss how we can apply our expertise to your project.</p>
            <Link to="/contact" className="btn-primary">
                Contact Our Engineers
            </Link>
        </div>
      </div>
    </div>
  );
};
