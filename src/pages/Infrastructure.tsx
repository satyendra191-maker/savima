import React from 'react';
import { Factory, Settings, Zap, Thermometer, Box, Truck, CheckCircle } from 'lucide-react';

const FACILITIES = [
  {
    title: 'CNC Machining Center',
    desc: 'State-of-the-art facility with 20+ CNC machines including 4-axis and 5-axis machining centers.',
    specs: [
      '20+ CNC Machines',
      '4-Axis & 5-Axis Capabilities',
      'Tolerance: +/- 0.005mm',
      '24/7 Operations'
    ],
    image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Cold Forging Unit',
    desc: 'High-speed production line for brass and steel components with automated feeding systems.',
    specs: [
      '250T - 1000T Presses',
      'Flash Free Forging',
      'Annual Capacity: 500+ Tons',
      'Automated Feeding'
    ],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Quality Control Lab',
    desc: 'Fully equipped in-house testing facility ensuring zero-defect delivery.',
    specs: [
      'CMM Inspection',
      'Salt Spray Testing',
      'Spectral Analyzer',
      'Hardness Testers'
    ],
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Warehouse & Logistics',
    desc: 'Organized inventory management with export-grade packaging and shipping capabilities.',
    specs: [
      '50,000 sq ft Storage',
      'Barcode System',
      'Custom Clearance',
      'Air & Sea Freight'
    ],
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80'
  }
];

export const Infrastructure: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 pt-24">
      <section className="relative bg-saviman-900 py-20 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">World-Class Infrastructure</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our state-of-the-art manufacturing facility in Jamnagar, Gujarat, is equipped with the latest technology to deliver precision and quality at scale.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid gap-12">
          {FACILITIES.map((facility, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8`}>
              <div className="md:w-1/2">
                <img src={facility.image} alt={facility.title} className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl" />
              </div>
              <div className="md:w-1/2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-brass-500 rounded-lg flex items-center justify-center">
                    <Factory className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{facility.title}</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{facility.desc}</p>
                <div className="grid grid-cols-2 gap-3">
                  {facility.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                      {spec}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-saviman-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Factory, value: '50,000', unit: 'sq ft Facility' },
              { icon: Settings, value: '50+', unit: 'Machines' },
              { icon: Zap, value: '1.5', unit: 'MW Solar Power' },
              { icon: Truck, value: '500+', unit: 'Containers/Year' },
            ].map((stat, i) => (
              <div key={i} className="text-white">
                <stat.icon className="mx-auto mb-3 text-brass-400" size={32} />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-gray-400">{stat.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
