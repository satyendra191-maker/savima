import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Get Supabase credentials from environment or use defaults
  const supabaseUrl = env.VITE_SUPABASE_URL || 'https://nvqntsrpxphgafsfpkjq.supabase.co';
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52cW50c3JweHBoZ2Fmc2Zwa2pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNTQwNzgsImV4cCI6MjA4NjczMDA3OH0.7ht0BquM2jOJU6EAO47pTyFrX6OCLHaMnWP2lmIBbdo';
  const apiKey = env.API_KEY || '';

  return {
    // Use root path for Vercel
    base: '/',
    plugins: [react()],
    build: {
      // Ensure proper asset handling for Vercel
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
    },
    define: {
      // Environment variables for Supabase
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
      'import.meta.env.VITE_SUPABASE_ADMIN_KEY': JSON.stringify(env.VITE_SUPABASE_ADMIN_KEY || 'saviman_admin_2024'),
      'import.meta.env.GEMINI_API_KEY': JSON.stringify(apiKey),
    },
    server: {
      port: 5175,
      host: true,
    },
  };
});
