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

// Posts open with a hand-written "Table of Contents" blockquote. The article page
// builds its own contents from the headings, so drop that blockquote (and the
// horizontal rule that usually follows it) at build time.
function remarkStripManualToc() {
  const text = (node) => (node.value ?? '') + (node.children ?? []).map(text).join('');
  return (tree) => {
    const i = tree.children.findIndex(
      (node) => node.type === 'blockquote' && /^\s*table of contents?\b/i.test(text(node)),
    );
    if (i === -1) return;
    const removeRule = tree.children[i + 1]?.type === 'thematicBreak';
    tree.children.splice(i, removeRule ? 2 : 1);
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://kagunda.dev',
  base: "/",
  redirects: {
    ...legacyIndexRedirects(),
    '/archive': '/blog',
  },
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
    remarkPlugins: [remarkMermaid, remarkStripManualToc],
  },
  // Vite configuration for better development experience
  vite: {
    optimizeDeps: {
      exclude: ['astro:content'],
    },
  },
});