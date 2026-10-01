import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Required by the vendored CRD layer: several components import icons as
    // `...svg?react` (SocialLinks, OrgProfileTabView, UserProfileTabView,
    // CrdAddToCalendarIcons). Matches client-web's own vite config.
    svgr(),
  ],
  resolve: {
    alias: {
      // `@` maps to src, so the vendored layer's own `@/crd/...` imports
      // resolve unchanged — that is what keeps the copy byte-identical.
      '@': path.resolve(__dirname, './src'),
    },
  },
});
