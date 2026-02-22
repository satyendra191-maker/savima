import React from 'react';
import { FileText, Settings, Zap, CheckCircle, Truck, Package } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    title: "Inquiry Received",
    description: "We receive your technical drawings and requirements.",
    icon: FileText,
    duration: "Day 1"
  },
  {
    id: 2,
    title: "Engineering Review",
    description: "Our team analyzes feasibility and suggests optimizations.",
    icon: Settings,
    duration: "Day 1-2"
  },
  {
    id: 3,
    title: "Material Sourcing",
    description: "High-quality raw materials procured from certified suppliers.",
    icon: Zap,
    duration: "Day 3-5"
  },
  {
    id: 4,
    title: "Production",
    description: "Precision manufacturing with in-process quality checks.",
    icon: CheckCircle,
    duration: "Day 6-15"
  },
  {
    id: 5,
    title: "Quality Assurance",
    description: "Final inspection and testing (dimensional, material, functional).",
    icon: CheckCircle,
    duration: "Day 16-18"
  },
  {
    id: 6,
    title: "Packaging & Dispatch",
    description: "Export-grade packaging and logistics arrangement.",
    icon: Package,
    duration: "Day 19-20"
  },
  {
    id: 7,
    title: "Delivery",
    description: "Safe delivery to your doorstep anywhere in the world.",
    icon: Truck,
    duration: "Day 20-30"
  }
];

export const ProcessTimeline: React.FC = () => {
  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Manufacturing Process</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            From inquiry to delivery, we ensure precision at every step.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 dark:bg-gray-800 hidden md:block"></div>

          <div className="space-y-12">
            {STEPS.map((step, index) => (
              <div key={step.id} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                    <div className={`mt-2 text-sm text-brass-600 font-medium ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      {step.duration}
                    </div>
                  </div>
                </div>

                {/* Icon / Dot */}
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-brass-500 text-white shadow-lg z-10 flex-shrink-0">
                  <step.icon size={20} />
                </div>

                {/* Empty space for alternating layout */}
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
