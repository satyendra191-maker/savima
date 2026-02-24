import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Settings, Search, ChevronDown, ChevronRight, Phone, Mail, MapPin, ArrowRight, Heart, Home, Package, Building2, FileText, MessageSquare, MoreHorizontal, Briefcase, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { VisitorAIAssistant } from './VisitorAIAssistant';
import { DarkModeToggle } from './ui/DarkModeToggle';
import { CookieConsent, BackToTop } from './ui/CookieConsent';
import { AnnouncementBar } from './ui/AnnouncementBar';
import { ProgressBar } from './ui/ProgressBar';
import { LanguageSwitcher } from './ui/I18n';
import { useTheme } from '../context/ThemeContext';
import { CMSService } from '../lib/supabase';

export const SavimanLogo: React.FC<{ size?: 'sm' | 'md' | 'lg', onClick?: () => void }> = ({ size = 'md', onClick }) => {
    const scale = size === 'sm' ? 'scale-75 origin-left' : size === 'lg' ? 'scale-125 origin-left' : 'scale-100';

    return (
        <div onClick={onClick} className={`flex items-center gap-3 select-none ${scale} group cursor-pointer`}>
            <div className="relative w-12 h-12 perspective-500">
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full drop-shadow-lg transform transition-transform duration-700 ease-in-out group-hover:rotate-180"
                    style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.2))' }}
                >
                    <defs>
                        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FDE68A" />
                            <stop offset="50%" stopColor="#D4AF37" />
                            <stop offset="100%" stopColor="#D4AF37" />
                        </linearGradient>
                        <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#F9FAFB" />
                            <stop offset="50%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                        <filter id="bevel">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="0.5" result="blur" />
                            <feSpecularLighting in="blur" surfaceScale="5" specularConstant="1" specularExponent="20" lightingColor="#ffffff" result="specOut">
                                <fePointLight x="-5000" y="-10000" z="20000" />
                            </feSpecularLighting>
                            <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
                            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint" />
                        </filter>
                    </defs>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#silverGrad)" strokeWidth="4" strokeDasharray="10 6" className="opacity-50" />
                    <path
                        d="M50 10 L55 20 L65 20 L70 10 L80 15 L75 25 L82 32 L92 30 L95 40 L85 45 L85 55 L95 60 L92 70 L82 68 L75 75 L80 85 L70 90 L65 80 L55 80 L50 90 L40 85 L45 75 L38 68 L28 70 L25 60 L35 55 L35 45 L25 40 L28 30 L38 32 L45 25 L40 15 Z"
                        fill="url(#goldGrad)"
                        stroke="url(#silverGrad)"
                        strokeWidth="1.5"
                        filter="url(#bevel)"
                    />
                    <path d="M65 35 C55 25, 45 25, 35 35 C25 45, 25 55, 35 65 L65 35 Z" fill="url(#silverGrad)" className="opacity-90" />
                    <path d="M35 65 C45 75, 55 75, 65 65 C75 55, 75 45, 65 35 L35 65 Z" fill="url(#goldGrad)" className="opacity-90" />
                </svg>
            </div>
            <div className="flex flex-col justify-center translate-y-[-2px]">
                <div className="flex text-3xl font-black tracking-tighter leading-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    <span className="relative text-gradient-gold">SAVI</span>
                    <span className="relative text-neutral-800 dark:text-white">MAN</span>
                </div>
            </div>
        </div>
    );
};

const SearchOverlay: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-32 animate-fade-in">
            <div className="w-full max-w-2xl px-4">
                <div className="relative">
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search products, categories, specs..."
                        className="w-full bg-white dark:bg-gray-800 text-xl px-6 py-4 rounded-xl shadow-2xl outline-none border-2 border-brass-500"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Start typing to search...</p>
                </div>
            </div>
        </div>
    );
};

const MegaMenu: React.FC<{ isOpen: boolean, onClose: () => void, onMouseEnter?: () => void, onMouseLeave?: () => void }> = ({ isOpen, onClose, onMouseEnter, onMouseLeave }) => {
    if (!isOpen) return null;

    const productCategories = [
        { name: 'Brass Inserts', path: '/products/brass', desc: 'Threaded, press-fit & molding inserts' },
        { name: 'Precision Turned Parts', path: '/products/precision', desc: 'CNC turned components with high precision' },
        { name: 'SS Fasteners', path: '/products/steel', desc: 'Stainless steel bolts, nuts & custom fasteners' },
        { name: 'Hydraulic Fittings', path: '/products/hydraulic', desc: 'Compression & flare fittings for fluid systems' },
    ];

    return (
        <div 
            className="absolute top-full left-0 w-80 bg-white dark:bg-gray-900 shadow-xl border-t-4 border-primary-500 z-40 animate-fade-in-up rounded-b-xl"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="py-2">
                {productCategories.map((category) => (
                    <Link
                        key={category.name}
                        to={category.path}
                        onClick={onClose}
                        className="flex flex-col px-5 py-3 hover:bg-primary-50 dark:hover:bg-primary-800/30 transition-colors"
                    >
                        <span className="font-semibold text-gray-900 dark:text-white hover:text-primary-600">
                            {category.name}
                        </span>
                        <span className="text-sm text-gray-500">{category.desc}</span>
                    </Link>
                ))}
                <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                    <Link 
                        to="/products" 
                        onClick={onClose} 
                        className="flex items-center justify-between px-5 py-3 text-primary-600 font-semibold hover:bg-primary-50 dark:hover:bg-primary-800/30"
                    >
                        View All Products
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [megaMenuTimeout, setMegaMenuTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
    const location = useLocation();
    const { isAdmin } = useAuth();
    const { theme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMegaMenuOpen(false);
    }, [location]);

    const handleMegaMenuEnter = () => {
        if (megaMenuTimeout) {
            clearTimeout(megaMenuTimeout);
            setMegaMenuTimeout(null);
        }
        setIsMegaMenuOpen(true);
    };

    const handleMegaMenuLeave = () => {
        const timeout = setTimeout(() => {
            setIsMegaMenuOpen(false);
        }, 200);
        setMegaMenuTimeout(timeout);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products', hasMegaMenu: true },
        { name: 'Industries', path: '/industries' },
        { name: 'Case Studies', path: '/case-studies' },
        { name: 'Donate', path: '/donate' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <>
            <nav
                className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md shadow-lg border-b border-gray-100 dark:border-slate-800"
            >
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link to="/">
                                <SavimanLogo />
                            </Link>
                        </div>

                        <div className="hidden md:flex items-center gap-0.5">
                            {navLinks.map((link) => (
                                <div
                                    key={link.name}
                                    className="relative"
                                    onMouseEnter={() => link.hasMegaMenu && handleMegaMenuEnter()}
                                    onMouseLeave={() => link.hasMegaMenu && handleMegaMenuLeave()}
                                >
                                    <Link
                                        to={link.path}
                                        onClick={(e) => {
                                            if (link.hasMegaMenu) {
                                                e.preventDefault();
                                                setIsMegaMenuOpen(!isMegaMenuOpen);
                                            }
                                        }}
                                        className={`flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 group ${
                                            location.pathname === link.path
                                                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                                                : 'text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        }`}
                                    >
                                        {link.name}
                                        {link.hasMegaMenu && <ChevronDown size={14} className={`ml-1 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />}
                                    </Link>
                                    {link.hasMegaMenu && (
                                        <MegaMenu 
                                            isOpen={isMegaMenuOpen} 
                                            onClose={() => setIsMegaMenuOpen(false)} 
                                            onMouseEnter={handleMegaMenuEnter} 
                                            onMouseLeave={handleMegaMenuLeave} 
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                            <DarkModeToggle />
                            <LanguageSwitcher />

                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="p-2.5 rounded-xl bg-primary-500 text-white"
                                >
                                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[60] md:hidden animate-fade-in">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                    <div className="absolute inset-y-0 right-0 w-[80%] max-w-sm bg-white dark:bg-gray-950 shadow-2xl animate-slide-in-right flex flex-col pt-24 px-6 overflow-y-auto">
                        <div className="flex flex-col space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center justify-between px-6 py-4 rounded-2xl text-lg font-bold transition-all ${location.pathname === link.path
                                        ? 'bg-brass-500/10 text-brass-600'
                                        : 'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900'
                                        }`}
                                >
                                    <span>{link.name}</span>
                                    <ArrowRight size={18} className={location.pathname === link.path ? 'opacity-100' : 'opacity-0'} />
                                </Link>
                            ))}

                            {/* Mobile Product Categories */}
                            <div className="pt-4 pb-2">
                                <p className="px-6 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Products</p>
                            </div>
                            <Link to="/products/brass" onClick={() => setIsOpen(false)} className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl">
                                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                                Brass Inserts
                            </Link>
                            <Link to="/products/precision" onClick={() => setIsOpen(false)} className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                Precision Turned Parts
                            </Link>
                            <Link to="/products/steel" onClick={() => setIsOpen(false)} className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl">
                                <span className="w-2 h-2 bg-gray-500 rounded-full mr-3"></span>
                                SS Fasteners
                            </Link>
                            <Link to="/products/steel" onClick={() => setIsOpen(false)} className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                Hydraulic Fittings
                            </Link>
                        </div>

                        <div className="mt-auto pb-12 pt-8 border-t border-gray-100 dark:border-gray-900">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                    <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Theme Mode</span>
                                    <DarkModeToggle />
                                </div>
                                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                    <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Language</span>
                                    <LanguageSwitcher />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-center space-x-6">
                                {/* Social links or other info */}
                                <SavimanLogo size="sm" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export const Footer: React.FC = () => {
    const socialLinks = {
        facebook: 'https://www.facebook.com/saviman',
        linkedin: 'https://www.linkedin.com/company/saviman',
        twitter: 'https://twitter.com/saviman',
        telegram: 'https://t.me/saviman',
        youtube: 'https://www.youtube.com/@saviman'
    };

    return (
        <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white pt-16 pb-8 border-t border-slate-800">
            <div className="w-full px-4 md:px-12 lg:px-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <SavimanLogo size="md" />
                        <div className="text-xs font-bold tracking-widest text-amber-400 uppercase mt-2">
                            A Unit of Savita Global Enterprises
                        </div>
                        <p className="text-slate-400 text-sm mt-4 leading-relaxed">
                            Global manufacturer and exporter of precision Brass and Stainless Steel components. 
                            Serving 50+ countries worldwide with ISO 9001:2015 Certification.
                        </p>
                        <div className="flex gap-3 mt-5">
                            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-all hover:scale-110">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z" /></svg>
                            </a>
                            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-all hover:scale-110">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a1.38 1.38 0 012.7-.7c1.52 0 2.4.9 2.4 2.58V19z" /></svg>
                            </a>
                            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-all hover:scale-110">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.95 4.57a10 10 0 01-2.82.77 4.96 4.96 0 002.16-2.72 9.9 9.9 0 01-3.12 1.19 4.96 4.96 0 00-8.46 4.52A14 14 0 011.64 3.16 4.96 4.96 0 003.2 9.72 4.86 4.86 0 01.96 9.1v.06a4.96 4.96 0 003.97 4.86 4.96 4.96 0 01-2.22.08 4.96 4.96 0 004.63 3.44A9.93 9.93 0 010 20.54a14 14 0 007.5 2.22c9.24 0 14-7.67 14-14.34v-.8A9.87 9.87 0 0023.95 4.57z" /></svg>
                            </a>
                            <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-all hover:scale-110">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                            </a>
                            <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-all hover:scale-110">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                            </a>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-medium text-slate-300">ISO 9001:2015</span>
                            <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-medium text-slate-300">IATF 16949</span>
                            <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-medium text-slate-300">CE Certified</span>
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="font-bold mb-5 text-white text-sm uppercase tracking-wider">Products</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link to="/products/brass" className="hover:text-amber-400 transition-colors">Brass Inserts</Link></li>
                            <li><Link to="/products/precision" className="hover:text-amber-400 transition-colors">Precision Turned Parts</Link></li>
                            <li><Link to="/products/steel" className="hover:text-amber-400 transition-colors">SS Fasteners</Link></li>
                            <li><Link to="/products/hydraulic" className="hover:text-amber-400 transition-colors">Hydraulic Fittings</Link></li>
                            <li><Link to="/products" className="hover:text-amber-400 transition-colors">View All Products</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-bold mb-5 text-white text-sm uppercase tracking-wider">Company</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link to="/about" className="hover:text-amber-400 transition-colors">About Us</Link></li>
                            <li><Link to="/infrastructure" className="hover:text-amber-400 transition-colors">Infrastructure</Link></li>
                            <li><Link to="/quality" className="hover:text-amber-400 transition-colors">Quality Control</Link></li>
                            <li><Link to="/careers" className="hover:text-amber-400 transition-colors">Careers</Link></li>
                            <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold mb-5 text-white text-sm uppercase tracking-wider">Resources</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link to="/case-studies" className="hover:text-amber-400 transition-colors">Case Studies</Link></li>
                            <li><Link to="/blog" className="hover:text-amber-400 transition-colors">Blog</Link></li>
                            <li><Link to="/catalog" className="hover:text-amber-400 transition-colors">Download Catalog</Link></li>
                            <li><Link to="/rfq" className="hover:text-amber-400 transition-colors">Request Quote</Link></li>
                            <li><Link to="/industries" className="hover:text-amber-amber-400 transition-colors">Industries Served</Link></li>
                        </ul>
                    </div>

                    {/* Support & Donate */}
                    <div>
                        <h4 className="font-bold mb-5 text-white text-sm uppercase tracking-wider">Support Us</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link to="/donate" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                                <Heart size={14} className="text-amber-400" />
                                Donate Now
                            </Link></li>
                            <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Get Quote</Link></li>
                            <li><Link to="/careers" className="hover:text-amber-400 transition-colors">Careers</Link></li>
                        </ul>
                        

                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold mb-5 text-white text-sm uppercase tracking-wider">Global Export</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-start gap-2">
                                <MapPin size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                                <span>302, Parth A, 3/11, Patel Colony,<br />Jamnagar-361008 Gujarat, INDIA</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={14} className="text-amber-400 flex-shrink-0" />
                                <span>+91 95069 43134</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={14} className="text-amber-400 flex-shrink-0" />
                                <span>export@saviman.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>&copy; 2024 Saviman Industries. All rights reserved. | Exporting to 50+ Countries Worldwide</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> ISO 9001:2015</span>
                        <span className="text-amber-400">Designed by SaviTech</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const [moreMenuOpen, setMoreMenuOpen] = useState(false);

    const mobileNavItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Products', href: '/products', icon: Package },
        { name: 'Industries', href: '/industries', icon: Building2 },
        { name: 'Catalog', href: '/catalog', icon: FileText },
    ];

    const moreNavItems = [
        { name: 'Careers', href: '/careers', icon: Briefcase },
        { name: 'Blog', href: '/blog', icon: FileText },
        { name: 'About', href: '/about', icon: Globe },
        { name: 'Contact', href: '/contact', icon: MessageSquare },
        { name: 'Donate', href: '/donate', icon: Heart },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-background-dark transition-colors duration-300">
            <ProgressBar />
            <Navbar />
            <AnnouncementBar />
            <main className="flex-grow pb-16 md:pb-0">
                {children}
            </main>
            <Footer />
            
            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:    gray-700 z-50 safe-area-pb">
            <div className="flex items-center justify-around h-14">
                {(mobileNavItems ?? []).filter(Boolean).map((item) => {
                    const Icon = item?.icon;
                    return (
                        <Link
                            key={item?.name || Math.random()}
                            to={item?.href || "/"}
                            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 ${
                                location.pathname === item?.href
                                    ? 'text-brass-600'
                                    : 'text-gray-500 dark:text-gray-400'
                            }`}
                        >
                            {Icon ? <Icon size={20} /> : null}
                            <span className="text-[10px] font-medium">
                                {item?.name}
                            </span>
                        </Link>
                    );
                })}

                <div className="relative">
                    <button
                        onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                        className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 ${
                            moreMenuOpen ? 'text-brass-600' : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <MoreHorizontal size={20} />
                        <span className="text-[10px] font-medium">More</span>
                    </button>

                    {moreMenuOpen && (
                        <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 min-w-[180px]">
                            {(moreNavItems ?? []).filter(Boolean).map((item) => {
                                const Icon = item?.icon;
                                return (
                                    <Link
                                        key={item?.name || Math.random()}
                                        to={item?.href || "/"}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                                            item?.name === 'Donate'
                                                ? 'text-red-600'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {Icon ? <Icon size={16} /> : null}
                                        {item?.name}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </nav>

            <VisitorAIAssistant />
            <CookieConsent />
            <BackToTop />
            <style>{`.safe-area-pb { padding-bottom: env(safe-area-inset-bottom, 0); }`}</style>
        </div>
    );
};
