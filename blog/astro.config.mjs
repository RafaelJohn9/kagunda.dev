import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kagunda.dev',
  base: "/",
  integrations: [
    mdx(),
    sitemap(),
  ],
  markdown: {
    // Enable syntax highlighting
    shikiConfig: {
      theme: 'github-dark',
      // Alternative themes: 'github-light', 'dracula', 'nord', 'monokai'
      wrap: true,
    },
    // Enable GitHub-flavored markdown
    gfm: true,
  },
  // Vite configuration for better development experience
  vite: {
    optimizeDeps: {
      exclude: ['astro:content'],
    },
  },
});