import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, CheckCircle, Award, FileCheck, Microscope, 
  TestTube, Users, TrendingUp, ArrowRight, Star,
  Activity, Zap, Clock, Target, BadgeCheck, Wrench
} from 'lucide-react';
import { SEO } from '../components/SEO';

export const Quality: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SEO 
        title="Quality Control & Assurance | Saviman Precision Manufacturing"
        description="ISO 9001:2015 certified quality control for precision CNC machining in Jamnagar, Gujarat. Advanced CMM inspection, zero-defect policy, 99.9% on-time delivery."
      />

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[150px]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full text-amber-400 font-semibold mb-6">
            <Shield size={18} />
            ISO 9001:2015 Certified
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Uncompromising Quality:<br />
            <span className="text-amber-400">Precision You Can Trust</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
            World-class quality control systems for precision machined components. 
            Every part inspected. Every tolerance verified. Zero compromises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Schedule Quality Audit
              <ArrowRight className="ml-2" size={22} />
            </Link>
            <Link 
              to="/about" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white border-2 border-white/30 hover:bg-white/10 rounded-xl transition-all"
            >
              Our Certifications
            </Link>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> 99.9% On-Time Delivery</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> {'<'}0.5% Rejection Rate</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> 100% Inspection Available</span>
          </div>
        </div>
      </section>

      {/* ============================================
          QUALITY PHILOSOPHY
          ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Quality <span className="text-amber-500">Philosophy</span>
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                At Saviman, quality isn't just a department — it's embedded in everything we do. 
                Since our founding in Jamnagar, Gujarat, we've maintained an unwavering commitment 
                to <strong>zero-defect manufacturing</strong>.
              </p>
              <p>
                In precision CNC machining, where tolerances of ±0.005mm can determine success or failure 
                of critical components, we believe quality is non-negotiable. Every part we manufacture 
                impacts someone's safety, reputation, and trust.
              </p>
              <p>
                Our quality culture is built on three pillars: <strong>Prevention over detection</strong>, 
                <strong> continuous improvement</strong>, and <strong>customer partnership</strong>. 
                We don't just meet specifications — we anticipate challenges and deliver solutions that 
                exceed expectations.
              </p>
            </div>
            
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="text-3xl font-black text-amber-600">34+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="text-3xl font-black text-blue-600">200+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Clients Worldwide</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="text-3xl font-black text-green-600">2M+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Parts Delivered</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80" 
              alt="Quality control technician inspecting precision component"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <BadgeCheck className="text-green-600" size={24} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">Zero Defect Policy</div>
                  <div className="text-sm text-gray-500">Every part verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CERTIFICATIONS
          ============================================ */}
      <section className="bg-white dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Certifications & <span className="text-amber-500">Standards</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              International certifications that validate our commitment to quality management
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: 'ISO 9001:2015', desc: 'Quality Management System', color: 'bg-blue-500' },
              { icon: Shield, title: 'IATF 16949', desc: 'Automotive Quality', color: 'bg-amber-500' },
              { icon: Star, title: 'AS9100D', desc: 'Aerospace Quality', color: 'bg-purple-500' },
              { icon: CheckCircle, title: 'ISO 13485', desc: 'Medical Devices', color: 'bg-green-500' },
            ].map((cert, i) => (
              <div key={i} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className={`w-14 h-14 ${cert.color} rounded-xl flex items-center justify-center mb-4`}>
                  <cert.icon className="text-white" size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{cert.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          QC PROCESSES - TIMELINE
          ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Quality Control <span className="text-amber-500">Processes</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Comprehensive inspection at every stage of manufacturing
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: 1, title: 'Incoming Inspection', desc: 'Raw material verification, mill test reports, chemical composition analysis' },
            { step: 2, title: 'In-Process Monitoring', desc: 'First-article inspection, in-process checks, tool wear monitoring' },
            { step: 3, title: 'Final Inspection', desc: '100% dimensional inspection, surface finish verification, visual check' },
            { step: 4, title: 'Documentation', desc: 'Inspection reports, material certificates, full traceability' },
          ].map((process, i) => (
            <div key={i} className="relative">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 h-full">
                <div className="w-10 h-10 bg-amber-500 text-white font-bold rounded-full flex items-center justify-center mb-4">
                  {process.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{process.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{process.desc}</p>
              </div>
              {i < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-300">
                  <ArrowRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================
          INSPECTION EQUIPMENT
          ============================================ */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Advanced Inspection <span className="text-amber-400">Equipment</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              State-of-the-art measurement technology for absolute precision
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Microscope, title: 'CMM Machines', desc: 'Coordinate Measuring Machines (Zeiss, Mitutoyo) for 3D measurement down to ±0.001mm' },
              { icon: Activity, title: 'Optical Comparators', desc: 'Profile projection for 2D inspection of complex geometries' },
              { icon: TestTube, title: 'Spectrometers', desc: 'OES analyzers for precise chemical composition verification' },
              { icon: Target, title: 'Surface Roughness Testers', desc: 'Ra, Rz measurements to ensure perfect finishes' },
              { icon: Zap, title: 'Hardness Testers', desc: 'Rockwell, Vickers, and micro-hardness testing' },
              { icon: FileCheck, title: 'Digital Calipers', desc: 'High-precision hand tools with ±0.001mm accuracy' },
            ].map((equipment, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                  <equipment.icon className="text-amber-400" size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{equipment.title}</h3>
                <p className="text-gray-400 text-sm">{equipment.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          TEAM & TRAINING
          ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Skilled Quality <span className="text-amber-500">Team</span>
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Users className="text-amber-500" size={24} />
                  Expert Inspectors
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our quality team includes certified CMM operators, NDT inspectors, and quality engineers 
                  with 10+ years of experience in precision manufacturing.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="text-amber-500" size={24} />
                  Continuous Training
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Regular upskilling programs, Kaizen workshops, and certification courses keep our 
                  team at the forefront of quality methodologies.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Wrench className="text-amber-500" size={24} />
                  Calibrated Tools
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  All measurement equipment is traceable to national standards and calibrated 
                  at regular intervals per ISO requirements.
                </p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" 
              alt="Quality control team at Saviman facility"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ============================================
          METRICS & SUCCESS STORIES
          ============================================ */}
      <section className="bg-white dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Quality <span className="text-amber-500">Metrics</span>
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { value: '99.9%', label: 'On-Time Delivery', icon: Clock },
              { value: '<0.5%', label: 'Rejection Rate', icon: TrendingUp },
              { value: '100%', label: 'Traceability', icon: Shield },
              { value: '24hrs', label: 'Quote Response', icon: Zap },
            ].map((metric, i) => (
              <div key={i} className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <metric.icon className="mx-auto text-amber-500 mb-3" size={32} />
                <div className="text-4xl font-black text-gray-900 dark:text-white mb-1">{metric.value}</div>
                <div className="text-gray-500 dark:text-gray-400">{metric.label}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Aerospace Component Success', desc: 'Delivered 50,000+ aerospace brackets with zero defects to a European aircraft manufacturer. First-article approval on first submission.' },
              { title: 'Medical Device Precision', desc: 'Manufactured surgical instrument components meeting ISO 13485 with 100% inspection and full traceability for a US medical device company.' },
              { title: 'Automotive Volume Excellence', desc: 'Achieved 99.97% quality score with a major automotive Tier 1 supplier, processing 200,000+ parts monthly.' },
            ].map((story, i) => (
              <div key={i} className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{story.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{story.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          FINAL CTA
          ============================================ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-[150px]"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Partner with Saviman for Flawless Precision
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Experience the confidence that comes with working with a quality-driven manufacturing partner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/rfq" 
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Get a Quote
              <ArrowRight className="ml-2" size={22} />
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white border-2 border-white/30 hover:bg-white/10 rounded-xl transition-all"
            >
              Contact Our Quality Team
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          SEO CONTENT
          ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Precision Quality Control Jamnagar | ISO Certified CNC Machining</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Saviman offers world-class quality control for precision CNC machining in Jamnagar, Gujarat, India. 
            Our ISO 9001:2015 certified facility features advanced CMM inspection, coordinate measuring machines, 
            and comprehensive testing capabilities. We serve automotive (IATF 16949), aerospace (AS9100D), 
            and medical device (ISO 13485) industries with zero-defect manufacturing policies. With {'<'}0.5% 
            rejection rate and 99.9% on-time delivery, we are a trusted quality-focused manufacturing partner 
            for precision machined components.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Quality;
