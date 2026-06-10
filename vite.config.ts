import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    base: './',
    define: {
      'process.env': {
        API_KEY: env.VITE_GEMINI_API_KEY || env.VITE_API_KEY || env.API_KEY || '',
        SUPABASE_URL: env.VITE_SUPABASE_URL || env.SUPABASE_URL || '',
        SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || '',
      },
      'global': 'globalThis',
    }
  };
});