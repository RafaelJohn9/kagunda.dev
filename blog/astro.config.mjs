import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { visit } from 'unist-util-visit';


function remarkMermaid() {
  return (tree) => {
    visit(tree, 'code', (node) => {
      if (node.lang === 'mermaid') {
        node.type = 'html';
        node.value = `<pre class="mermaid">${node.value}</pre>`;
      }
    });
  };
}

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
    // Enable Mermaid diagrams in markdown
    remarkPlugins: [remarkMermaid],
  },
  // Vite configuration for better development experience
  vite: {
    optimizeDeps: {
      exclude: ['astro:content'],
    },
  },
});