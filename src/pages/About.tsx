import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Globe, Award, Shield, Factory, Clock, Target, Zap, CheckCircle, TrendingUp, Wrench, Star, Heart, Leaf } from 'lucide-react';
import { getFormattedStats, getYearsExperience, COMPANY_STATS } from '../config/company';

// Image component with fallback
const ImageWithFallback: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className }) => {
  const [error, setError] = useState(false);

  return error ? (
    <div className={`${className} bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center`}>
      <Factory className="w-16 h-16 text-slate-500" />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

export const About: React.FC = () => {
  const stats = getFormattedStats();
  const yearsExperience = getYearsExperience();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ============================================
          HERO BLOCK - Full Width
          ============================================ */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Image with fallback */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1920&q=80"
            alt="Modern CNC machine shop floor with high-tech equipment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
            >
              Precision Manufacturing <span className="text-amber-400">Excellence</span><br />
              <span className="text-3xl md:text-4xl lg:text-5xl">From Jamnagar, For the World</span>
            </h1>
            <p
              className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
            >
              World-class <strong className="text-white">CNC machining in Gujarat</strong> — delivering high-accuracy precision components to global OEMs since 1990.
              German & Japanese technology. Indian pricing. Global quality standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/rfq"
                className="inline-flex items-center justify-center px-8 py-4 min-h-[52px] text-lg font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Get Instant Quote
                <ArrowRight className="ml-2" size={22} />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-4 min-h-[52px] text-lg font-bold text-white border-2 border-white/30 hover:bg-white/10 rounded-xl transition-all backdrop-blur-sm"
              >
                View Our Capabilities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          STATS BAR - Using centralized config
          ============================================ */}
      <section className="relative -mt-16 relative z-20 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Years Experience', value: stats.yearsExperience },
              { label: 'Countries Served', value: stats.countriesServed },
              { label: 'Happy Clients', value: stats.happyClients },
              { label: 'Components Made', value: COMPANY_STATS.componentsMade },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl text-center border border-gray-100 dark:border-gray-800">
                <div className="text-4xl font-black text-amber-500 mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          OUR STORY / JOURNEY
          ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our <span className="text-amber-500">Story</span>
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                <strong>Founded in 1990</strong> with a vision to transform precision manufacturing in India, Saviman began as a small CNC turning unit in Jamnagar's industrial zone.
              </p>
              <p>
                Recognizing the gap between global quality expectations and domestic capabilities, we invested in <strong>German and Japanese CNC machines</strong> — a bold move that set us apart from the beginning. Our commitment to <strong>±0.005mm tolerances</strong> quickly earned trust among automotive and aerospace suppliers.
              </p>
              <p>
                Today, with {stats.countriesServed} country exports and certifications including <strong>ISO 9001:2015</strong>, we continue to champion "Make in India" excellence — delivering the precision of Germany, the innovation of Japan, and the value of India to manufacturers worldwide.
              </p>
            </div>
          </div>
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
              alt="Saviman manufacturing facility exterior"
              className="rounded-2xl shadow-2xl w-full"
            />
            <div className="absolute -bottom-6 -left-6 bg-amber-500 text-slate-900 px-6 py-4 rounded-xl shadow-lg">
              <div className="text-3xl font-black">{stats.yearsExperience}</div>
              <div className="text-sm font-bold">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          MISSION & VISION
          ============================================ */}
      <section className="bg-white dark:bg-gray-900 py-20 mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10 p-8 rounded-2xl border border-amber-200 dark:border-amber-800">
              <div className="w-16 h-16 bg-amber-500 rounded-xl flex items-center justify-center mb-6">
                <Target className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                To empower global manufacturers with <strong>precision-engineered components</strong> that exceed expectations — delivering unmatched quality, competitive Indian pricing, and on-time delivery that makes "Made in India" synonymous with world-class precision.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 p-8 rounded-2xl border border-blue-200 dark:border-blue-800">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Globe className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                To be the most trusted <strong>CNC machining partner</strong> for OEMs worldwide — building India's premier precision manufacturing hub in Gujarat and setting new benchmarks for quality, innovation, and customer success in the industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CORE VALUES - 5 Values as Icon Cards
          ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Core <span className="text-amber-500">Values</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The principles that guide every component we manufacture
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { icon: Target, title: 'Precision', desc: '±0.005mm tolerance. Every component measured to perfection.', color: 'bg-amber-500' },
            { icon: Zap, title: 'Innovation', desc: 'Continuous improvement in processes, technology, and techniques.', color: 'bg-blue-600' },
            { icon: Award, title: 'Quality', desc: 'ISO 9001:2015 certified. Zero-defect delivery commitment.', color: 'bg-green-600' },
            { icon: Clock, title: 'Reliability', desc: 'On-time delivery. Every project. Guaranteed.', color: 'bg-purple-600' },
            { icon: Heart, title: 'Customer Success', desc: 'Your goals become our mission. Partnership, not just supply.', color: 'bg-red-500' },
          ].map((value, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 text-center hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className={`w-14 h-14 ${value.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <value.icon className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================
          WHAT SETS US APART
          ============================================ */}
      <section className="bg-slate-900 py-20 mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Sets <span className="text-amber-400">Saviman Apart</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Why leading OEMs worldwide trust us for their precision component needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'German & Japanese Machines', desc: 'Hass, Mazak, DMG MORI — world-class CNC equipment for unmatched precision', icon: Factory },
              { title: 'Tightest Tolerances', desc: '±0.005mm precision — meeting aerospace and medical device standards', icon: Target },
              { title: 'ISO 9001:2015 Certified', desc: 'Rigorous quality management system with full traceability', icon: Award },
              { title: 'Fast Turnaround', desc: '5-7 day lead times for prototypes. Mass production on schedule.', icon: Clock },
              { title: 'Competitive Pricing', desc: 'Indian manufacturing costs with global quality benchmarks', icon: TrendingUp },
              { title: 'End-to-End Solutions', desc: 'From CAD design to finished parts — we handle the entire process', icon: Wrench },
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="text-amber-400" size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          OUR FACILITIES & TEAM
          ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Facilities & <span className="text-amber-500">Team</span>
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Factory className="text-amber-500" size={24} />
                  State-of-the-Art Facility
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our {COMPANY_STATS.facilitySize.toLocaleString()} sq ft facility in Jamnagar houses <strong>CNC turning centers, 4-axis and 5-axis machining centers, VMCs</strong>, and automated inspection equipment. We run triple-shift operations to meet global demand.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Users className="text-amber-500" size={24} />
                  Skilled Workforce
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {COMPANY_STATS.workforce}+ trained technicians and engineers — including <strong>CNC programmers, quality inspectors, and process engineers</strong>. Regular upskilling on latest manufacturing technologies.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Shield className="text-amber-500" size={24} />
                  Quality Assurance Lab
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  In-house CMM, surface roughness testers, hardness testers, and spectral analysis. Every component inspected before dispatch.
                </p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&q=80"
              alt="Quality control technician using CMM machine"
              className="rounded-2xl shadow-lg w-full h-48 object-cover"
            />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=600&q=80"
              alt="CNC 5-axis machining center operation"
              className="rounded-2xl shadow-lg w-full h-48 object-cover mt-8"
            />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=600&q=80"
              alt="Precision machined components ready for dispatch"
              className="rounded-2xl shadow-lg w-full h-48 object-cover"
            />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80"
              alt="Modern industrial facility exterior"
              className="rounded-2xl shadow-lg w-full h-48 object-cover mt-8"
            />
          </div>
        </div>
      </section>

      {/* ============================================
          WHY PARTNER WITH US - Trust Builder
          ============================================ */}
      <section className="bg-white dark:bg-gray-900 py-20 mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Partner with <span className="text-amber-500">Saviman</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Proven Track Record', desc: `${yearsExperience}+ years. ${stats.happyClients} clients. ${stats.countriesServed} countries. We deliver what we promise.`, icon: Star },
              { title: 'Technical Expertise', desc: 'Deep knowledge of materials: Aluminum, Stainless Steel, Brass, Titanium, Engineering Plastics.', icon: Wrench },
              { title: 'Scalable Capacity', desc: 'From 10 prototypes to 100,000+ production runs — we scale with your needs.', icon: TrendingUp },
              { title: 'Transparent Communication', desc: 'Dedicated project managers. Real-time updates. No surprises.', icon: Clock },
              { title: 'Sustainability Focus', desc: 'Solar-powered facility. Coolant recycling. Eco-conscious manufacturing.', icon: Leaf },
              { title: 'Risk-Free Quality', desc: 'Quality guarantee on every order. Rework or replace — no questions asked.', icon: Shield },
            ].map((reason, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <reason.icon className="text-amber-600 dark:text-amber-400" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{reason.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{reason.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          FINAL CTA SECTION
          ============================================ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[150px]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
          >
            Ready to Experience Precision Manufacturing Excellence?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join {stats.happyClients} global manufacturers who trust Saviman for their most critical components.
            Get a quote today — we'll respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/rfq"
              className="inline-flex items-center justify-center px-10 py-5 min-h-[52px] text-lg font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Get Instant Quote
              <ArrowRight className="ml-2" size={22} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-10 py-5 min-h-[52px] text-lg font-bold text-white border-2 border-white/30 hover:bg-white/10 rounded-xl transition-all"
            >
              Talk to Our Engineers
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> ISO 9001:2015 Certified</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> {stats.yearsExperience} Years Experience</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> {stats.countriesServed} Country Exports</span>
          </div>
        </div>
      </section>

      {/* ============================================
          SEO CONTENT - Hidden but valuable for search
          ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Precision Manufacturing Jamnagar | CNC Machining Gujarat</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Saviman is a leading precision manufacturing company in Jamnagar, Gujarat, India, specializing in CNC turning, CNC milling, VMC, and 5-axis machining services. We manufacture custom precision parts for automotive, aerospace, defense, medical devices, electronics, and general engineering industries. With German and Japanese CNC machines, we achieve ±0.005mm tolerances and are ISO 9001:2015 certified. Our export footprint spans {stats.countriesServed} countries including USA, UK, Germany, Japan, and Australia. Contact us for high-accuracy machined components at competitive Indian pricing with global quality standards.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
