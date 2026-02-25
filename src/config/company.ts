/**
 * Company Statistics and Configuration
 * Central source of truth for all company-related data
 * This ensures consistency across all pages and components
 */

export const COMPANY_STATS = {
    // Company founded in 1990, current year calculation for years of experience
    foundingYear: 1990,
    yearsExperience: 34, // 2024 - 1990 = 34 years (will be dynamically calculated)

    // Global reach
    countriesServed: 50,

    // Client relationships
    happyClients: 500,

    // Projects
    projectsCompleted: 1000,

    // Components manufactured
    componentsMade: '2M+',

    // Facility
    facilitySize: 25000, // sq ft
    workforce: 75,

    // Certifications
    certifications: ['ISO 9001:2015', 'ISO 14001:2018', 'OHSAS 18001'],

    // Tolerances
    precisionTolerance: '±0.005mm',
} as const;

// Helper function to get dynamic years of experience
export const getYearsExperience = (): number => {
    const currentYear = new Date().getFullYear();
    return currentYear - COMPANY_STATS.foundingYear;
};

// Format for display
export const getFormattedStats = () => ({
    yearsExperience: `${getYearsExperience()}+`,
    countriesServed: `${COMPANY_STATS.countriesServed}+`,
    happyClients: `${COMPANY_STATS.happyClients}+`,
    projectsCompleted: `${COMPANY_STATS.projectsCompleted}+`,
    componentsMade: COMPANY_STATS.componentsMade,
});

// Company contact information
export const COMPANY_INFO = {
    name: 'Saviman',
    legalName: 'Savita Global Enterprises',
    tagline: 'Precision Engineering, Global Standards',
    description: 'Global manufacturer and exporter of precision Brass and Stainless Steel components.',

    // Contact
    email: 'info@saviman.com',
    phone: '+91-288-2550123',
    whatsapp: '+91-9876543210',

    // Address
    address: {
        line1: 'Plot No. 123, Industrial Estate',
        line2: 'Jamnagar, Gujarat',
        pincode: '361008',
        country: 'India',
    },

    // Social links
    social: {
        facebook: 'https://www.facebook.com/saviman',
        linkedin: 'https://www.linkedin.com/company/saviman',
        twitter: 'https://twitter.com/saviman',
        telegram: 'https://t.me/saviman',
        youtube: 'https://www.youtube.com/@saviman',
    },
} as const;

// Video URLs
export const MEDIA_URLS = {
    factoryTourYoutube: 'https://www.youtube.com/watch?v=example',
    factoryTourEmbed: 'https://www.youtube.com/embed/example',
} as const;

export default COMPANY_STATS;