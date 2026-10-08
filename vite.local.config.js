import {defineConfig} from 'vite';
export default defineConfig({root:'dist',base:'./',build:{outDir:'../local-build',emptyOutDir:true,assetsInlineLimit:30000000,cssCodeSplit:false}});
