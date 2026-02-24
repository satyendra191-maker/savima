import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, ArrowRight, Package, Settings, Cpu, Wrench, 
  Shield, Zap, Clock, CheckCircle, X, ChevronLeft, ChevronRight,
  Layers, Box, Hexagon, Circle, Triangle, Maximize2
} from 'lucide-react';
import { SEO } from '../src/components/SEO';

const PRODUCTS = [
  {
    id: 'precision-cnc-turned',
    name: 'Precision CNC Turned Components',
    slug: 'precision-cnc-turned',
    shortDescription: 'High-precision CNC turned parts with tolerances up to ±0.005mm for automotive, electronics, and industrial applications.',
    fullDescription: 'Our precision CNC turning services deliver exceptional accuracy for complex geometries. Using advanced CNC turning centers with live tooling capabilities, we manufacture components with tolerances as tight as ±0.005mm. From simple shafts to complex profiles with internal/external threads, broaches, and knurls — we handle it all. Our facility in Jamnagar, Gujarat, serves global OEMs with consistent quality and competitive pricing. Every component undergoes 100% inspection with calibrated instruments and full traceability.',
    specifications: {
      tolerances: '±0.005mm to ±0.01mm',
      materials: 'Aluminum, Brass, SS 304/316, Mild Steel, Titanium, Copper',
      industries: 'Automotive, Electronics, Medical, Industrial Automation',
      leadTime: '5-7 days for prototypes, 2-3 weeks for production'
    },
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cnc-milled',
    name: 'High-Precision CNC Milled Components',
    slug: 'cnc-milled',
    shortDescription: 'Complex 3D milled parts with superior surface finish, manufactured on advanced HMC/VMC machines.',
    fullDescription: 'Our CNC milling capabilities include 3-axis, 4-axis, and 5-axis machining centers capable of producing intricate contours and complex geometries. We excel at manufacturing pocketed parts, cavity molds, heat sinks, and structural components with exceptional surface finishes (Ra 0.8μm or better). From aluminum enclosures to stainless steel manifolds, our team delivers precision with consistency. Located in Jamnagar, Gujarat, we serve as a reliable manufacturing partner for companies worldwide.',
    specifications: {
      tolerances: '±0.01mm to ±0.03mm',
      materials: 'Aluminum 6061/7075, SS 304/316, Brass, Mild Steel, Engineering Plastics',
      industries: 'Aerospace, Medical Devices, Electronics, Telecommunications',
      leadTime: '7-10 days for prototypes, 3-4 weeks for production'
    },
    image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'vmc-parts',
    name: 'VMC Machined Parts',
    slug: 'vmc-parts',
    shortDescription: 'Vertical machining center parts for medium to large components with excellent accuracy and repeatability.',
    fullDescription: 'Our VMC (Vertical Machining Center) capabilities enable efficient production of medium-sized components with superior accuracy. These machines excel at flat-surface machining, pocket creation, and drilling/tapping operations. We maintain strict process controls with in-process inspection and final dimensional verification. Our VMC fleet handles components up to 500mm x 500mm x 500mm with consistent precision. Export-quality packaging ensures safe delivery worldwide.',
    specifications: {
      tolerances: '±0.02mm to ±0.05mm',
      materials: 'Aluminum, Stainless Steel, Mild Steel, Cast Iron, Brass',
      industries: 'Automotive, Agricultural Machinery, Construction Equipment',
      leadTime: '7-10 days prototypes, 2-3 weeks production'
    },
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'five-axis',
    name: '5-Axis Complex Machined Parts',
    slug: 'five-axis',
    shortDescription: 'Single-setup 5-axis machining for highly complex geometries, reducing lead times and improving accuracy.',
    fullDescription: 'Our 5-axis machining capabilities represent the pinnacle of precision manufacturing. By programming complex tool paths in a single setup, we eliminate multiple clampings and achieve superior accuracy (IT7-IT9 grades). This technology is ideal for impellers, turbine blades, aerospace brackets, medical implants, and automotive dies. Our Jamnagar facility houses advanced 5-axis centers with simultaneous capabilities, delivering world-class quality with Indian pricing efficiency.',
    specifications: {
      tolerances: '±0.01mm to ±0.025mm',
      materials: 'Titanium, Inconel, Aluminum, Stainless Steel, Tool Steel',
      industries: 'Aerospace, Defense, Medical, Automotive Racing',
      leadTime: '10-15 days prototypes, 4-6 weeks production'
    },
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'shafts-pins',
    name: 'Precision Shafts & Pins',
    slug: 'shafts-pins',
    shortDescription: 'Ground and polished shafts, dowel pins, locator pins, and custom precision pins for industrial applications.',
    fullDescription: 'We manufacture precision shafts and pins for diverse industrial applications — from automotive transmission systems to medical device assemblies. Our capabilities include ground shafts (up to Ra 0.2μm), turned-polished shafts, and profile-ground complex geometries. We produce dowel pins, locating pins, hinge pins, and custom configurations in various materials including stainless steel, hardened steel, and aluminum. Full material certification and dimensional reports provided.',
    specifications: {
      tolerances: '±0.002mm to ±0.01mm',
      materials: 'SS 304/316, Hardened Steel, Aluminum, Brass, Titanium',
      industries: 'Automotive, Medical, Industrial Automation, Furniture',
      leadTime: '3-5 days prototypes, 1-2 weeks production'
    },
    image: 'https://images.unsplash.com/photo-1535952642077-c77874e28633?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bushings-sleeves',
    name: 'Bushes, Sleeves & Spacers',
    slug: 'bushings-sleeves',
    shortDescription: 'Precision machined bushings, sleeves, and spacers for automotive, industrial machinery, and hydraulic systems.',
    fullDescription: 'Our precision machining expertise extends to bushings, sleeves, and spacers — critical components in machinery, hydraulics, and automotive systems. We manufacture liner bushings, flange bushings, thrust washers, and custom sleeves with precise bore tolerances. Materials include bronze, brass, stainless steel, and self-lubricating alloys. Each part is manufactured to print with strict dimensional control and surface finish requirements.',
    specifications: {
      tolerances: '±0.01mm to ±0.03mm',
      materials: 'Bronze, Brass, SS 304/316, Aluminum, Delrin',
      industries: 'Automotive, Hydraulic Systems, Industrial Machinery, Pumps',
      leadTime: '5-7 days prototypes, 2-3 weeks production'
    },
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'flanges-fittings',
    name: 'Flanges & Pipe Fittings',
    slug: 'flanges-fittings',
    shortDescription: 'ISO-certified flanges, pipe fittings, and valve components for oil & gas, petrochemical, and process industries.',
    fullDescription: 'We manufacture precision flanges and pipe fittings meeting international standards (ANSI, DIN, JIS). Our product range includes weld neck flanges, slip-on flanges, blind flanges, and custom fittings in stainless steel and alloy materials. Each component undergoes pressure testing and material verification. With ISO 9001:2015 certification, we serve oil & gas, petrochemical, and process industries globally from our Jamnagar facility.',
    specifications: {
      tolerances: '±0.25mm to ±0.5mm (ASME B16.5)',
      materials: 'SS 304/304L/316/316L, Duplex, Alloy 625/825',
      industries: 'Oil & Gas, Petrochemical, Process Industries, Desalination',
      leadTime: '2-3 weeks for standard, 4-6 weeks for custom'
    },
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'couplings-adapters',
    name: 'Couplings & Adapters',
    slug: 'couplings-adapters',
    shortDescription: 'Precision shaft couplings, hydraulic adapters, and custom converter components for mechanical power transmission.',
    fullDescription: 'Our precision coupling and adapter manufacturing serves automotive, industrial machinery, and hydraulic systems. We produce rigid couplings, flexible couplings, jaw couplings, and custom hydraulic adapters in various materials. Threaded fittings, quick-connect couplings, and tube fittings are manufactured to exact specifications. Full traceability and material certifications ensure reliability in critical applications.',
    specifications: {
      tolerances: '±0.02mm to ±0.05mm',
      materials: 'Steel, Stainless Steel 304/316, Aluminum, Brass',
      industries: 'Automotive, Industrial Drives, Hydraulic Systems, HVAC',
      leadTime: '5-7 days prototypes, 2-3 weeks production'
    },
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'automotive',
    name: 'Automotive Precision Components',
    slug: 'automotive',
    shortDescription: 'ISO/TS 16949 certified components for engine, transmission, chassis, and interior applications.',
    fullDescription: 'As an automotive supplier, we manufacture precision components meeting IATF 16949 (formerly TS 16949) standards. Our product portfolio includes engine components, transmission parts, chassis fittings, brake system parts, and interior hardware. From aluminum castings to precision-machined steel components, we deliver zero-defect quality with full PPAP documentation. Our Jamnagar facility supplies major Tier 1 and Tier 2 automotive suppliers globally.',
    specifications: {
      tolerances: '±0.01mm to ±0.03mm',
      materials: 'Aluminum, Steel, Stainless Steel, Brass, Nylon',
      industries: 'Automotive, Two-Wheelers, Commercial Vehicles',
      leadTime: '3-4 weeks for production (established parts)'
    },
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'medical',
    name: 'Medical & Surgical Machined Parts',
    slug: 'medical',
    shortDescription: 'ISO 13485 certified precision components for surgical instruments, implants, and diagnostic equipment.',
    fullDescription: 'Our medical device manufacturing follows ISO 13485 quality management system. We produce surgical instruments, implant components, diagnostic equipment parts, and pharmaceutical machinery parts with exceptional cleanliness and precision. Materials include medical-grade stainless steel (316LVM), titanium, and biocompatible plastics. Clean-room assembly available. Full traceability from raw material to finished component ensures regulatory compliance.',
    specifications: {
      tolerances: '±0.005mm to ±0.02mm',
      materials: 'SS 316LVM, Titanium, Aluminum, PEEK, Delrin',
      industries: 'Medical Devices, Surgical Instruments, Diagnostics, Pharma',
      leadTime: '4-6 weeks (with validation support)'
    },
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'aerospace-defense',
    name: 'Aerospace & Defense Components',
    slug: 'aerospace-defense',
    shortDescription: 'AS9100 certified precision parts for aircraft, defense equipment, and space applications.',
    fullDescription: 'Our aerospace and defense manufacturing operates under AS9100D quality management system. We produce structural components, engine parts, landing gear components, and defense equipment hardware. Capabilities include critical machining of aluminum alloys, titanium, and specialty alloys with full material traceability. We support both commercial aerospace and defense programs with precision and reliability.',
    specifications: {
      tolerances: '±0.005mm to ±0.02mm',
      materials: 'Aluminum 2024/7075, Titanium 6Al-4V, Inconel, Stainless Steel',
      industries: 'Aerospace, Defense, Space, Naval',
      leadTime: '6-10 weeks (based on complexity)'
    },
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prototypes',
    name: 'Custom Prototypes & Low-Volume Assemblies',
    slug: 'prototypes',
    shortDescription: 'Fast CNC prototypes and low-volume production runs with Design for Manufacturing (DFM) support.',
    fullDescription: 'Our rapid prototyping services help you bring ideas to life faster. From initial CAD review to first-article inspection, we provide end-to-end prototype support. Our engineering team offers Design for Manufacturing (DFM) suggestions to optimize parts for production. Low-volume assembly services include sub-assembly building, component kitting, and final product integration. Perfect for R&D projects, design validation, and market testing before full-scale production.',
    specifications: {
      tolerances: '±0.01mm to ±0.05mm',
      materials: 'All engineering materials available',
      industries: 'R&D, Product Development, Startups, Innovation Labs',
      leadTime: '3-7 days for prototypes'
    },
    image: 'https://images.unsplash.com/photo-1581095790444-1dfa35e37b52?auto=format&fit=crop&w=800&q=80'
  }
];

const INDUSTRIES = [
  'Automotive', 'Aerospace', 'Medical', 'Electronics', 
  'Oil & Gas', 'Industrial Machinery', 'Defense', 'Telecommunications'
];

const PROCESSES = [
  { id: 'all', name: 'All', icon: Box },
  { id: 'turning', name: 'Turning', icon: Hexagon },
  { id: 'milling', name: 'Milling', icon: Layers },
  { id: 'vmc', name: 'VMC', icon: Maximize2 },
  { id: 'five-axis', name: '5-Axis', icon: Triangle }
];

export const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcess, setSelectedProcess] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !selectedIndustry || product.specifications.industries.toLowerCase().includes(selectedIndustry.toLowerCase());
    return matchesSearch && matchesIndustry;
  });

  const openModal = (product: typeof PRODUCTS[0]) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    if (selectedProduct) {
      setCurrentImageIndex((prev) => (prev + 1) % 6);
    }
  };

  const prevImage = () => {
    if (selectedProduct) {
      setCurrentImageIndex((prev) => (prev - 1 + 6) % 6);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SEO 
        title="Precision CNC Machined Components | Saviman Manufacturing Gujarat"
        description="Leading precision CNC manufacturing in Jamnagar, Gujarat. ISO 9001:2015 certified. Turning, Milling, VMC, 5-Axis machining. Automotive, Aerospace, Medical sectors. Request quote today."
      />

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[150px]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Precision Machined <span className="text-amber-400">Components</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
            World-class CNC manufacturing from <strong>Jamnagar, Gujarat</strong>. German & Japanese machines. 
            ±0.005mm tolerances. Serving global OEMs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/rfq" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Request Quote
              <ArrowRight className="ml-2" size={22} />
            </Link>
            <a 
              href="#products" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white border-2 border-white/30 hover:bg-white/10 rounded-xl transition-all"
            >
              Browse Products
            </a>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> ISO 9001:2015</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> ±0.005mm Tolerance</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> 25+ Countries</span>
          </div>
        </div>
      </section>

      {/* ============================================
          PROCESS TABS & FILTERS
          ============================================ */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Process Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {PROCESSES.map((process) => (
            <button
              key={process.id}
              onClick={() => setSelectedProcess(process.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                selectedProcess === process.id
                  ? 'bg-amber-500 text-slate-900 shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <process.icon size={18} />
              {process.name}
            </button>
          ))}
        </div>

        {/* Search & Industry Filter */}
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search precision components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Industries</option>
            {INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>
      </section>

      {/* ============================================
          PRODUCT GRID
          ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              onClick={() => openModal(product)}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                  <span className="text-white font-semibold">View Details</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{product.shortDescription}</p>
                <div className="mt-4 flex items-center text-amber-600 dark:text-amber-400 text-sm font-semibold">
                  View Details <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Products Found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </section>

      {/* ============================================
          SEO CONTENT SECTION
          ============================================ */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Precision CNC Machining <span className="text-amber-500">Jamnagar Gujarat</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Saviman is a leading precision CNC machining company based in Jamnagar, Gujarat, India. 
                We specialize in high-accuracy CNC turning, CNC milling, VMC, and 5-axis machining for global OEMs. 
                Our facility houses German and Japanese CNC machines capable of achieving tolerances up to ±0.005mm.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                We serve diverse industries including <strong>automotive, aerospace, medical devices, electronics, 
                oil & gas, and industrial machinery</strong>. With ISO 9001:2015 certification and export to 25+ 
                countries, we deliver world-class quality at competitive Indian pricing.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl">
                  <div className="text-2xl font-black text-amber-600">±0.005mm</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tolerances</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                  <div className="text-2xl font-black text-blue-600">25+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                  <div className="text-2xl font-black text-green-600">15+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Years</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                  <div className="text-2xl font-black text-purple-600">200+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Clients</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Saviman?</h3>
              <ul className="space-y-4">
                {[
                  'German & Japanese CNC machines',
                  'ISO 9001:2015 certified facility',
                  'Tolerances up to ±0.005mm',
                  'Fast turnaround: 5-7 days prototypes',
                  'Full quality inspection & traceability',
                  'Competitive Indian pricing'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          PRODUCT DETAIL MODAL
          ============================================ */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} className="text-gray-700 dark:text-gray-300" />
            </button>

            {/* Image Gallery */}
            <div className="relative h-64 md:h-80 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <span className="px-3 py-1 bg-amber-500 text-slate-900 text-sm font-bold rounded-full">
                  {selectedProduct.specifications.materials.split(',')[0]}
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedProduct.name}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {selectedProduct.fullDescription}
              </p>

              {/* Specifications */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Key Specifications</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Zap className="text-amber-500 mt-1" size={18} />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Tolerances</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{selectedProduct.specifications.tolerances}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Wrench className="text-amber-500 mt-1" size={18} />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Materials</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{selectedProduct.specifications.materials}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Settings className="text-amber-500 mt-1" size={18} />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Industries</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{selectedProduct.specifications.industries}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="text-amber-500 mt-1" size={18} />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Lead Time</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{selectedProduct.specifications.leadTime}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/rfq" 
                  onClick={closeModal}
                  className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl transition-colors"
                >
                  Request Quote
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link 
                  to="/contact" 
                  onClick={closeModal}
                  className="flex-1 inline-flex items-center justify-center px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Talk to Engineer
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
