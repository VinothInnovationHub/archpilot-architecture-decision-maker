import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served as a GitHub Pages project site at
// https://vinothinnovationhub.github.io/archpilot-architecture-decision-maker/
// so all asset URLs must be prefixed with the repo path, not the domain root.
export default defineConfig({
  base: '/archpilot-architecture-decision-maker/',
  plugins: [react()],
});
