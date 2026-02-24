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

      {/* Saviman Global Platform v5 Architecture */}
      <section className="bg-saviman-900 py-20 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Saviman Global Platform v5 Architecture</h2>
          <p className="text-gray-400 text-center mb-12 max-w-3xl mx-auto">Enterprise-grade digital infrastructure powering precision manufacturing operations</p>
          
          <div className="space-y-8">
            {/* Public Layer */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-amber-400 mb-4">Public Layer</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Domestic UI', desc: 'INR, Local logistics' },
                  { title: 'International UI', desc: 'USD/EUR, Global logistics' },
                  { title: '159+ Language Translation', desc: 'Full localization support' },
                  { title: 'AI Engineer Chatbot', desc: 'Lead Capture & Qualification' },
                  { title: 'RFQ System', desc: 'Request for Quote workflow' },
                  { title: 'Real-time Shipment Tracking', desc: 'End-to-end visibility' },
                  { title: 'Donation Module', desc: 'Education for Vulnerable Children' },
                  { title: 'Career Portal', desc: 'Resume Upload (PDF), Application Tracking' },
                  { title: 'Social Media', desc: 'Facebook, Telegram, Twitter/X, LinkedIn' },
                ].map((item, i) => (
                  <div key={i} className="bg-saviman-800/50 rounded-xl p-4 border border-white/5">
                    <h4 className="font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Layer */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Application Layer</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'AI Pricing Engine', desc: 'Dynamic pricing with market intelligence' },
                  { title: 'Forecasting Engine', desc: 'Demand prediction & planning' },
                  { title: 'Machine Utilization Tracking', desc: 'Real-time OEE monitoring' },
                  { title: 'Vendor Performance Scoring', desc: 'Supplier quality metrics' },
                  { title: 'ISO Compliance Dashboard', desc: '9001:2015, IATF 16949' },
                  { title: 'Audit Logging System', desc: 'Complete activity trails' },
                  { title: 'Email Automation', desc: 'Trigger-based communications' },
                  { title: 'Real-time Dashboard Updates', desc: 'Live data streaming' },
                ].map((item, i) => (
                  <div key={i} className="bg-saviman-800/50 rounded-xl p-4 border border-white/5">
                    <h4 className="font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Role-Based Dashboards */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-green-400 mb-4">Role-Based Dashboards</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Super Admin', desc: 'Command Center' },
                  { title: 'Admin', desc: 'Full system oversight' },
                  { title: 'Sales Manager', desc: 'Pipeline & revenue' },
                  { title: 'Production Manager', desc: 'Manufacturing operations' },
                  { title: 'Inventory Manager', desc: 'Stock & materials' },
                  { title: 'HR Manager', desc: 'Workforce management' },
                  { title: 'Client Portal', desc: 'Self-service dashboard' },
                ].map((item, i) => (
                  <div key={i} className="bg-saviman-800/50 rounded-xl p-4 border border-white/5">
                    <h4 className="font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Automation Flow */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-purple-400 mb-4">Automation Flow</h3>
              <div className="flex flex-wrap justify-center items-center gap-3">
                {['RFQ', 'AI Price Suggestion', 'Quote', 'Production', 'Shipment', 'Tracking', 'Delivery', 'Feedback', 'Analytics'].map((step, i) => (
                  <React.Fragment key={step}>
                    <div className="bg-amber-500/20 text-amber-400 px-4 py-2 rounded-lg font-semibold text-sm border border-amber-500/30">
                      {step}
                    </div>
                    {i < 8 && <ArrowRight className="text-gray-500" size={16} />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Design System Documentation v1.0 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Official Design System Documentation v1.0</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Brand Philosophy */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Brand Philosophy</h3>
            <ul className="space-y-3">
              {['Data over decoration', 'Clarity over creativity', 'Structure over animation', 'Trust over trends'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <span className="w-2 h-2 bg-brass-500 rounded-full"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Color System */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Color System</h3>
            <div className="space-y-3">
              {[
                { name: 'Primary Base', value: '#0B1F3A', class: 'bg-[#0B1F3A]' },
                { name: 'Secondary', value: '#1F3A5F', class: 'bg-[#1F3A5F]' },
                { name: 'Surface', value: '#F4F6F8', class: 'bg-[#F4F6F8] border' },
                { name: 'Accent Blue', value: '#0052CC', class: 'bg-[#0052CC]' },
                { name: 'Success Green', value: '#1B7F5C', class: 'bg-[#1B7F5C]' },
                { name: 'Warning Amber', value: '#D9822B', class: 'bg-[#D9822B]' },
                { name: 'Danger Red', value: '#C23030', class: 'bg-[#C23030]' },
              ].map((color, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${color.class}`}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{color.name}</span>
                  <span className="text-xs text-gray-500 font-mono">{color.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Typography System */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Typography System</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Primary Font: Inter</p>
              </div>
              {[
                { name: 'H1', size: '24px', weight: 'SemiBold' },
                { name: 'H2', size: '18px', weight: 'SemiBold' },
                { name: 'Card Title', size: '16px', weight: 'Medium' },
                { name: 'Body', size: '14px', weight: 'Regular' },
                { name: 'Small Label', size: '12px', weight: 'Medium' },
              ].map((type, i) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{type.name}</span>
                  <span className="text-sm text-gray-500">{type.size} {type.weight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Layout System */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Layout System</h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex justify-between"><span>12-column grid</span><span className="font-mono text-sm">Yes</span></li>
              <li className="flex justify-between"><span>Desktop width</span><span className="font-mono text-sm">1440px</span></li>
              <li className="flex justify-between"><span>Margins/Gutters</span><span className="font-mono text-sm">24px</span></li>
              <li className="flex justify-between"><span>Spacing</span><span className="font-mono text-sm">8px system</span></li>
            </ul>
          </div>

          {/* Component Standards */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Component Standards</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
              <li><strong>Buttons:</strong> Primary, Secondary, Danger variants</li>
              <li><strong>Cards:</strong> White background, 8px radius, subtle shadow</li>
              <li><strong>Tables:</strong> Zebra striping, sticky header, pagination</li>
              <li><strong>Status Badges:</strong> Active, Pending, Rejected, Draft, Completed</li>
            </ul>
          </div>

          {/* Dashboard Architecture */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Dashboard Architecture</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
              <li>Super Admin Command Center</li>
              <li>Manufacturing Dashboard</li>
              <li>Sales Pipeline View</li>
              <li>Logistics Dispatch Board</li>
              <li>Finance & Compliance Control Panels</li>
            </ul>
          </div>

          {/* AI Engine Visual Language */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. AI Engine Visual Language</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
              <li>AI-generated badge indicator</li>
              <li>Confidence score display</li>
              <li>Manual override toggle</li>
              <li>Usage analytics dashboard</li>
            </ul>
          </div>

          {/* Client Portal Guidelines */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">8. Client Portal Guidelines</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
              <li>Lighter theme variation</li>
              <li>Simplified analytics</li>
              <li>Order tracking and invoice downloads</li>
              <li>Certificate and batch history access</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
