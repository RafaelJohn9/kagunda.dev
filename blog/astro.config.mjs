import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { visit } from 'unist-util-visit';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

// Posts used to be served at /blog/<category>/<slug>/index/. Keep those links working.
function legacyIndexRedirects(dir = './src/content/blog', prefix = '') {
  const redirects = {};
  for (const entry of readdirSync(join(dir, prefix), { withFileTypes: true })) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      Object.assign(redirects, legacyIndexRedirects(dir, path));
    } else if (/^index\.mdx?$/.test(entry.name) && prefix) {
      redirects[`/blog/${prefix}/index`] = `/blog/${prefix}`;
    }
  }
  return redirects;
}


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
  redirects: legacyIndexRedirects(),
  integrations: [
    mdx(),
    sitemap(),
  ],
  markdown: {
    // Enable syntax highlighting
    shikiConfig: {
      theme: 'github-dark',
      // Alternative themes: 'github-light', 'dracula', 'nord', 'monokai'
      wrap: false, // Disable line wrapping for better readability of code blocks
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