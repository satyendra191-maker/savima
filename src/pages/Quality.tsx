import React from 'react';
import { Shield, CheckCircle, FileText, Award, Microscope, Ruler, TestTube } from 'lucide-react';

const CERTIFICATIONS = [
  { name: 'ISO 9001:2015', desc: 'Quality Management System', issuer: 'Bureau Veritas' },
  { name: 'IATF 16949', desc: 'Automotive Quality', issuer: 'Bureau Veritas' },
  { name: 'ISO 14001', desc: 'Environmental Management', issuer: 'Bureau Veritas' },
  { name: 'ISO 13485', desc: 'Medical Devices Quality', issuer: 'Bureau Veritas' },
];

const PROCESSES = [
  {
    title: 'Incoming Inspection',
    desc: 'Raw materials are tested for chemical composition and physical properties before entering production.',
    icon: TestTube
  },
  {
    title: 'In-Process Control',
    desc: 'Statistical Process Control (SPC) ensures consistency throughout the manufacturing cycle.',
    icon: Ruler
  },
  {
    title: 'Final Inspection',
    desc: '100% dimensional inspection using advanced Coordinate Measuring Machines (CMM).',
    icon: Microscope
  },
  {
    title: 'Documentation',
    desc: 'Complete test reports, material certificates, and traceability documentation provided.',
    icon: FileText
  }
];

export const Quality: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 pt-24">
      <section className="relative bg-saviman-900 py-20 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Quality Assurance</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Quality is not just a department—it's embedded in everything we do. Our zero-defect philosophy ensures consistent excellence.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Certifications</h2>
          <p className="text-gray-500 dark:text-gray-400">We are certified by leading international bodies</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {CERTIFICATIONS.map((cert, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg text-center border-t-4 border-brass-500">
              <div className="w-16 h-16 bg-brass-100 dark:bg-brass-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-brass-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{cert.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{cert.desc}</p>
              <p className="text-xs text-brass-600 font-medium">{cert.issuer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900 py-20 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Quality Process</h2>
            <p className="text-gray-500 dark:text-gray-400">A systematic approach to quality management</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(PROCESSES ?? []).map((process, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-14 h-14 bg-brass-100 dark:bg-brass-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {process?.icon ? <process.icon className="text-brass-600" size={28} /> : <Shield className="text-brass-600" size={28} />}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{process?.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{process?.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-gradient-to-br from-brass-500 to-brass-700 rounded-2xl p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Quality Commitment</h2>
              <p className="text-white/90 text-lg max-w-2xl">
                We guarantee zero-defect delivery through rigorous testing, advanced inspection equipment, and a culture of continuous improvement.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Shield size={64} className="text-white/30" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Testing Capabilities</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Dimensional Inspection', items: ['CMM Machines', 'Surface Roughness Tester', 'Profile Projector', 'Digital Micrometers'] },
            { title: 'Material Testing', items: ['Spectral Analyzer', 'Hardness Tester (Rockwell/Vickers)', 'Tensile Testing Machine', 'Impact Tester'] },
            { title: 'Environmental Testing', items: ['Salt Spray Test', 'Corrosion Test', 'Heat Resistance Test', 'Dimensional Stability'] },
          ].map((cap, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{cap.title}</h3>
              <ul className="space-y-2">
                {cap.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <CheckCircle size={16} className="text-green-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
