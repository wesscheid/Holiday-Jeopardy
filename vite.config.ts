import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    // Use relative base path to ensure assets work on GitHub Pages subdirectories
    base: './', 
    define: {
      // Define process.env.API_KEY so the frontend code can access the key
      // injected during the build process or from the .env file.
      // Falls back to the provided key if env variable is missing.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || "AIzaSyCcT_LQqi_VWpc8ZSsO4XT38sDlWBCmY_w"),
    },
  };
});