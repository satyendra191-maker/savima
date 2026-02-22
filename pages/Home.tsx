import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Globe, Settings, Shield, Award, Users, Truck } from 'lucide-react';
import { Hero } from '../src/components/landing/Hero';
import { Newsletter } from '../src/components/widgets/Newsletter';
import { LiveTicker } from '../src/components/widgets/LiveTicker';
import { ProcessTimeline } from '../src/components/widgets/ProcessTimeline';
import { GlobalMap } from '../src/components/widgets/GlobalMap';
import { FactoryTour } from '../src/components/widgets/FactoryTour';
import { ESG } from '../src/components/widgets/ESG';
import { Awards } from '../src/components/widgets/Awards';
import { Milestones } from '../src/components/widgets/Milestones';

export const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <LiveTicker />

      {/* Trust Signals / Stats */}
      <section className="py-20 bg-saviman-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-xl font-bold mb-12 tracking-[0.3em] uppercase opacity-50 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-brass-500"></div>
            Global Partners
            <div className="h-px w-12 bg-brass-500"></div>
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="text-3xl font-black italic tracking-tighter">TATA</div>
            <div className="text-3xl font-black italic tracking-tighter">BHEL</div>
            <div className="text-3xl font-black italic tracking-tighter">L&T</div>
            <div className="text-3xl font-black italic tracking-tighter">ABB</div>
            <div className="text-3xl font-black italic tracking-tighter">GODREJ</div>
          </div>
        </div>
      </section>

      {/* Categories Spotlight - 4 Main Products */}
      <section className="py-24 bg-white dark:bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">Our <span className="text-gradient-gold">Products</span></h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Premium quality industrial components manufactured with precision and exported globally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Brass Inserts',
                img: 'https://images.unsplash.com/photo-1616432043562-3671ea0e5e84?auto=format&fit=crop&w=600&q=80',
                desc: 'Precision brass knurled inserts for plastic injection molding, superior torque & pull-out resistance.',
                specs: ['CW614N Brass', '±0.01mm Tolerance', 'RoHS Compliant'],
                path: '/products/brass'
              },
              {
                name: 'Precision Turned Parts',
                img: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=600&q=80',
                desc: 'CNC turned components with tight tolerances, ideal for automotive & electronics.',
                specs: ['5-Axis CNC', '±0.005mm', 'Custom Designs'],
                path: '/products/other'
              },
              {
                name: 'SS Fasteners',
                img: 'https://images.unsplash.com/photo-1535952642077-c77874e28633?auto=format&fit=crop&w=600&q=80',
                desc: 'Stainless steel nuts, bolts, anchor bolts & custom fasteners for industrial applications.',
                specs: ['SS 304/316/316L', 'High Tensile', 'ISO Certified'],
                path: '/products/steel'
              },
              {
                name: 'Hydraulic Fittings',
                img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
                desc: 'Zero-leakage hydraulic fittings for oil & gas, marine & heavy industrial use.',
                specs: ['SS 316L', '10,000 PSI', 'ISO 8434-1'],
                path: '/products/steel'
              }
            ].map((cat, i) => (
              <Link key={i} to={cat.path} className="group bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 dark:border-gray-800">
                <div className="h-48 overflow-hidden relative">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{cat.name}</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mb-3">{cat.desc}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {cat.specs.map((spec, idx) => (
                      <span key={idx} className="px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-[10px] rounded-md font-medium">{spec}</span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-500 text-xs font-bold">
                    View Products <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">
              View All Products <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <ProcessTimeline />

      {/* Global Reach */}
      <GlobalMap />

      {/* Factory Tour */}
      <FactoryTour />

      {/* Awards & Milestones */}
      <div className="bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <Awards />
        <Milestones />
      </div>

      {/* ESG */}
      <ESG />

      {/* CTA Section */}
      <section className="py-32 bg-saviman-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brass-400 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-saviman-400 rounded-full blur-[150px]"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
            Drive Your <span className="text-gradient-gold">Manufacturing</span> Innovation
          </h2>
          <p className="text-gray-300 mb-12 text-xl max-w-2xl mx-auto leading-relaxed">
            Join 500+ global brands who trust Saviman for mission-critical precision components.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/contact" className="btn-primary text-xl px-12 py-5">
              Consult an Engineer
            </Link>
            <Link to="/infrastructure" className="flex items-center justify-center gap-3 px-12 py-5 rounded-xl border-2 border-white/20 text-white hover:bg-white/10 transition-all font-bold text-xl backdrop-blur-md">
              Virtual Factory Tour
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
