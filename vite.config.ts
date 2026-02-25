
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Define safe defaults
  const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || 'https://nvqntsrpxphgafsfpkjq.supabase.co';
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52cW50c3JweHBoZ2Fmc2Zwa2pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNTQwNzgsImV4cCI6MjA4NjczMDA3OH0.7ht0BquM2jOJU6EAO47pTyFrX6OCLHaMnWP2lmIBbdo';
  const apiKey = env.API_KEY || '';

  return {
    base: './',
    plugins: [react()],
    define: {
      // Explicitly define environment variables needed by the app
      'process.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  };
});
