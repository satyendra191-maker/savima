import React from 'react';
import { ArrowRight, Users, Globe, Award, Shield, Factory, Clock, Target } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 pt-24">
      {/* Hero */}
      <section className="relative bg-saviman-900 py-20 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About SAVIMAN</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Delivering precision engineering excellence since 1990. We are a global leader in manufacturing high-quality brass and stainless steel components.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Years Experience', value: '34+' },
            { label: 'Countries Served', value: '50+' },
            { label: 'Happy Clients', value: '500+' },
            { label: 'Components Made', value: '10M+' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg text-center">
              <div className="text-4xl font-bold text-brass-500 mb-2">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg">
            <div className="w-14 h-14 bg-brass-100 dark:bg-brass-900/30 rounded-xl flex items-center justify-center mb-6">
              <Target className="text-brass-600" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              To be the most trusted partner for precision component manufacturing worldwide, delivering exceptional quality, innovative solutions, and unmatched value to our clients across automotive, electrical, hydraulic, and industrial sectors.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg">
            <div className="w-14 h-14 bg-brass-100 dark:bg-brass-900/30 rounded-xl flex items-center justify-center mb-6">
              <Globe className="text-brass-600" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              To become a global benchmark in precision manufacturing by embracing cutting-edge technology, fostering sustainable practices, and building lasting relationships with clients and communities.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white dark:bg-gray-900 py-20 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Quality', desc: 'Uncompromising commitment to precision and excellence' },
              { icon: Clock, title: 'Timeliness', desc: 'Delivering on schedule, every single time' },
              { icon: Users, title: 'Collaboration', desc: 'Working as partners in your success' },
              { icon: Award, title: 'Innovation', desc: 'Continuous improvement in processes and products' },
            ].map((value, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-brass-50 dark:bg-brass-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {value?.icon ? <value.icon className="text-brass-600" size={32} /> : <Shield className="text-brass-600" size={32} />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{value?.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{value?.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Leadership Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Satyendra Singh', role: 'Managing Director', exp: '30+ years in Manufacturing' },
            { name: 'Rajesh Kumar', role: 'Head of Engineering', exp: '15+ years in Precision Machining' },
            { name: 'Priya Sharma', role: 'Quality Manager', exp: 'ISO Certified Lead Auditor' },
          ].map((member, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
              <div className="h-48 bg-gradient-to-br from-brass-400 to-brass-600 flex items-center justify-center">
                <Users size={64} className="text-white/30" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-brass-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.exp}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
