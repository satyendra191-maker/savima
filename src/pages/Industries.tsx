import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, CheckCircle, FileText, Award } from 'lucide-react';

const INDUSTRIES = [
  {
    id: 'aerospace',
    title: 'Aerospace Components',
    description: 'High-precision components for aircraft and space applications.',
    image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80',
    capabilities: ['Tolerances up to +/- 0.005mm', 'Materials: Titanium, Inconel, Aluminum', 'AN/AS/NAS Standards'],
    applications: ['Landing Gear', 'Hydraulic Systems', 'Avionics Mounts', 'Fuel System Components']
  },
  {
    id: 'medical',
    title: 'Medical Devices',
    description: 'Surgical-grade stainless steel and titanium components for medical equipment.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    capabilities: ['ISO 13485 Certified', 'Biocompatible Materials', 'Clean Room Assembly', 'Sterilization Compatible'],
    applications: ['Surgical Instruments', 'Implant Components', 'Diagnostic Equipment', 'Dental Tools']
  },
  {
    id: 'energy',
    title: 'Energy & Power',
    description: 'Durable components for renewable energy and power generation systems.',
    image: 'https://images.unsplash.com/photo-1466611653911-954554331f4f?auto=format&fit=crop&w=800&q=80',
    capabilities: ['Corrosion Resistant', 'High Temperature Grades', 'Pressure Rated', 'Long Lifecycle'],
    applications: ['Solar Panel Mounts', 'Wind Turbine Parts', 'Nuclear Equipment', 'Oil & Gas Drilling']
  },
  {
    id: 'automotive',
    title: 'Automotive',
    description: 'Precision components for automotive manufacturing and EV applications.',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
    capabilities: ['IATF 16949 Compliant', 'High-Volume Production', 'EV Components', 'Just-in-Time Delivery'],
    applications: ['Engine Parts', 'Transmission Components', 'EV Battery Housings', 'Fuel Systems']
  },
  {
    id: 'electronics',
    title: 'Electronics & Electrical',
    description: 'Precision components for consumer electronics and power distribution.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    capabilities: ['Miniaturization', 'High Conductivity', 'PCB Components', 'Custom Designs'],
    applications: ['Circuit Breakers', 'Power Connectors', 'Switchgear', 'Renewable Energy Systems']
  },
  {
    id: 'plumbing',
    title: 'Plumbing & Sanitary',
    description: 'Premium brass fixtures and fittings for residential and commercial plumbing.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    capabilities: ['Lead-Free Options', 'WRAS Certified', 'Multiple Finishes', 'International Standards'],
    applications: ['Bathroom Fixtures', 'Kitchen Fittings', 'Water Treatment', 'Irrigation']
  }
];

export const Industries: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Industries We Serve</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Specialized manufacturing capabilities for critical applications across various sectors.
          </p>
        </div>

        <div className="space-y-24">
          {INDUSTRIES.map((industry, index) => (
            <div key={industry.id} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>

              {/* Image */}
              <div className="lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img src={industry.image} alt={industry.title} className="w-full h-[400px] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold">{industry.title}</h3>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{industry.title}</h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">{industry.description}</p>

                <div className="mb-8">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Shield size={20} className="text-brass-500" /> Key Capabilities
                  </h4>
                  <ul className="grid grid-cols-1 gap-2">
                    {industry.capabilities.map((cap, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <CheckCircle size={16} className="text-green-500" /> {cap}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-8">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Award size={20} className="text-brass-500" /> Applications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {industry.applications.map((app, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-300">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                  Request Quote for {industry.title} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications Section */}
        <div className="mt-24 bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Industry Certifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brass-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award size={32} className="text-brass-600" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">ISO 9001:2015</h4>
              <p className="text-sm text-gray-500">Quality Management</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brass-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield size={32} className="text-brass-600" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">ISO 13485</h4>
              <p className="text-sm text-gray-500">Medical Devices</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brass-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText size={32} className="text-brass-600" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">AS9100D</h4>
              <p className="text-sm text-gray-500">Aerospace</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brass-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield size={32} className="text-brass-600" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">IATF 16949</h4>
              <p className="text-sm text-gray-500">Automotive</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
