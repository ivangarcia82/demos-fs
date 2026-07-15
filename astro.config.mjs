import { defineConfig } from 'astro/config';

// Sitio de demos para leads locales — https://demos.ivang.mx
// Cada demo vive en src/pages/<slug>/index.astro y se sirve en /<slug>
export default defineConfig({
  site: 'https://demos.ivang.mx',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
