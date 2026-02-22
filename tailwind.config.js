/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary - Friendly Blue (#007BFF)
        primary: {
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CBFF',
          300: '#66B0FF',
          400: '#3396FF',
          500: '#007BFF',
          600: '#0062CC',
          700: '#004999',
          800: '#003166',
          900: '#001833',
          DEFAULT: '#007BFF',
        },
        // Secondary - Emerald Green
        secondary: {
          50: '#E6F7EF',
          100: '#CCEFDF',
          200: '#99DFBF',
          300: '#66CF9F',
          400: '#33C07F',
          500: '#10B981',
          600: '#0D9668',
          700: '#0A714F',
          800: '#074C36',
          900: '#03271D',
          DEFAULT: '#10B981',
        },
        // Accent - Metallic Gold
        accent: {
          50: '#FEF9E7',
          100: '#FDF3CF',
          200: '#FBE79F',
          300: '#F9DB6F',
          400: '#F8CF3F',
          500: '#D4AF37',
          600: '#AA8C2C',
          700: '#806921',
          800: '#554616',
          900: '#2B230B',
          DEFAULT: '#D4AF37',
        },
        // Support - Emerald
        support: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#059669',
          600: '#047857',
          700: '#065F46',
          800: '#064E3B',
          900: '#022C22',
          DEFAULT: '#059669',
        },
        // Neutral
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          DEFAULT: '#64748B',
        },
        // Background
        background: {
          light: '#F8FAFC',
          dark: '#0F172A',
        },
        // Surface
        surface: {
          light: '#FFFFFF',
          dark: '#1E293B',
        },
        // Text - WCAG compliant
        text: {
          primary: '#111827',
          secondary: '#4B5563',
          muted: '#6B7280',
          inverse: '#FFFFFF',
        },
        // Industrial
        industrial: {
          navy: '#0F172A',
          blue: '#1E40AF',
          gold: '#D4AF37',
          emerald: '#059669',
          steel: '#64748B',
          light: '#F8FAFC',
        },
        // Legacy colors for compatibility
        brass: {
          50: '#FEF9E7',
          100: '#FDF3CF',
          200: '#FBE79F',
          300: '#F9DB6F',
          400: '#F8CF3F',
          500: '#D4AF37',
          600: '#AA8C2C',
          700: '#806921',
          800: '#554616',
          900: '#2B230B',
          DEFAULT: '#D4AF37',
        },
        saviman: {
          50: '#FEF9E7',
          100: '#FDF3CF',
          200: '#FBE79F',
          300: '#F9DB6F',
          400: '#F8CF3F',
          500: '#D4AF37',
          600: '#AA8C2C',
          700: '#806921',
          800: '#554616',
          900: '#2B230B',
          DEFAULT: '#D4AF37',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'premium': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      },
    },
  },
  plugins: [],
}
