import {defineConfig} from 'vite';

// Relative asset URLs keep the same build portable across the Sites host,
// GitHub Pages project subpaths, and local static servers.
export default defineConfig({
  root: 'dist',
  base: './',
  server: {host: '0.0.0.0', allowedHosts: ['terminal.local']},
  build: {outDir: '../build', emptyOutDir: true, assetsInlineLimit: 0},
});
