import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { fileURLToPath } from 'url';
import { build } from 'vite';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Navbar } from '../src/components/Navbar';
import { Badge } from '../src/components/Badge';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_SOURCE_DIR = path.join(__dirname, '../blog');
const BLOG_MD_DIR = path.join(__dirname, '../blog/markdowns');
const DIST_DIR = path.join(__dirname, '../dist/blog');
const TEMPLATE_FILE = path.join(BLOG_SOURCE_DIR, '_template.html');
const INDEX_FILE = path.join(BLOG_SOURCE_DIR, 'index.html');

const bundledAssets = '';

function renderNavbar(activePath: string = '/'): string {
  return renderToString(React.createElement(Navbar, { activePath, showThemeToggle: false }));
}

interface Post {
  slug: string;
  title: string;
  date: string | null;
  tags: string[];
  relativePath: string;
}

interface Metadata {
  title?: string;
  date?: string;
  tags?: string[];
}

async function buildTailwind(): Promise<void> {
  const cssInput = path.join(BLOG_SOURCE_DIR, '_assets/index.css');
  if (!fs.existsSync(cssInput)) {
    console.log('No blog CSS found');
    return;
  }

  console.log('Building blog Tailwind CSS...');

  const css = fs.readFileSync(cssInput, 'utf-8');
  const configPath = path.join(__dirname, '../tailwind.config.blog.js');

  const result = await postcss([
    postcssImport(),
    tailwindcss({ config: configPath }),
    autoprefixer(),
  ]).process(css, {
    from: cssInput,
  });

  const outputPath = path.resolve(__dirname, '../dist/assets/blog/blog.css');
  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, result.css);
  console.log('Generated: assets/blog/blog.css');
}

async function bundleAssets(): Promise<string> {
  const assetsInput = path.join(BLOG_SOURCE_DIR, '_assets/index.ts');
  if (!fs.existsSync(assetsInput)) {
    console.log('No blog assets found');
    return '';
  }

  console.log('Bundling blog assets...');

  const tempOutDir = path.join(__dirname, '../dist/assets/blog');

  await build({
    input: assetsInput,
    build: {
      outDir: tempOutDir,
      emptyOutDir: false,
      lib: {
        entry: assetsInput,
        formats: ['iife'],
        name: 'BlogAssets',
        fileName: () => 'index.js',
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          name: 'BlogAssets',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
      minify: false,
      sourcemap: false,
    },
  } as any);

  const jsPath = path.join(tempOutDir, 'index.js');
  if (fs.existsSync(jsPath)) {
    return fs.readFileSync(jsPath, 'utf-8');
  }

  return '';
}

function walkDir(dir: string, baseDir: string = dir): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.name.startsWith('_')) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(relativePath);
    }
  }

  return files;
}

function parseMarkdownToHtml(markdown: string): { html: string; toc: string } {
  const renderer = new marked.Renderer();

  const createSlug = (text: string): string => {
    return text
      .replace(/[\u4e00-\u9fa5]/g, (match) => `-${match.charCodeAt(0).toString(16)}-`)
      .toLowerCase()
      .replace(/[^\w]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  renderer.heading = function ({ depth, text }: { depth: number; text: string }) {
    const slug = createSlug(text);
    return `<h${depth} id="${slug}">${text}</h${depth}>`;
  };

  const html = marked.parse(markdown, { renderer }) as string;

  const headingRegex = /<h([2-3]) id="([^"]+)">([^<]+)<\/h[2-3]>/g;
  const tocItems: { level: number; id: string; text: string }[] = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    tocItems.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3],
    });
  }

  const toc = tocItems
    .map((item) => `<a href="#${item.id}" class="toc-link level-${item.level}">${item.text}</a>`)
    .join('');

  return { html, toc };
}

function getMetadata(filePath: string): { metadata: Metadata; content: string } {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: markdownContent } = matter(content);

  return {
    metadata: data as Metadata,
    content: markdownContent,
  };
}

function generateSlug(filePath: string): string {
  return filePath.replace(/\.md$/, '.html').replace(/\\/g, '/');
}

function getTitleFromContent(markdownContent: string): string {
  const lines = markdownContent.split('\n');
  for (const line of lines) {
    const match = line.match(/^#\s+(.+)$/);
    if (match) {
      return match[1].trim();
    }
  }
  return 'Untitled';
}

function stripFirstHeading(markdownContent: string): string {
  const lines = markdownContent.split('\n');
  const result: string[] = [];
  let foundFirstHeading = false;

  for (const line of lines) {
    if (!foundFirstHeading && line.match(/^#\s+/)) {
      foundFirstHeading = true;
      continue;
    }
    result.push(line);
  }

  return result.join('\n').trim();
}

function loadTemplate(templatePath: string, activePath: string): string {
  let template = '';
  if (fs.existsSync(templatePath)) {
    template = fs.readFileSync(templatePath, 'utf-8');
  } else {
    template = DEFAULT_TEMPLATE;
  }
  const navbarHtml = renderNavbar(activePath);
  template = template.replace(/\{\{navbar\}\}/g, navbarHtml);
  return template;
}

const DEFAULT_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <link rel="stylesheet" href="/assets/index.css">
</head>
<body>
  <div id="root">
    <article class="blog-content">
      {{{content}}}
    </article>
  </div>
</body>
</html>`;

async function buildBlog(): Promise<void> {
  console.log('Building blog...');

  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  await buildTailwind();

  await bundleAssets();

  const template = loadTemplate(TEMPLATE_FILE, '/blog');
  const mdFiles = walkDir(BLOG_MD_DIR);

  const posts: Post[] = [];

  for (const relativePath of mdFiles) {
    const fullPath = path.join(BLOG_MD_DIR, relativePath);
    const { metadata, content: markdownContent } = getMetadata(fullPath);
    const processedMarkdown = stripFirstHeading(markdownContent);
    const { html: htmlContent, toc: tocHtml } = parseMarkdownToHtml(processedMarkdown);
    const slug = generateSlug(relativePath);
    const title = metadata.title || getTitleFromContent(markdownContent);
    const date = metadata.date || null;
    const tags = metadata.tags || [];

    posts.push({
      slug,
      title,
      date,
      tags,
      relativePath,
    });

    let tagsHtml = '';
    if (tags && tags.length > 0) {
      tagsHtml = tags.map((tag) => renderToString(React.createElement(Badge, null, tag))).join('');
    }

    const formattedDate = date
      ? new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : '';

    const wordCount = htmlContent
      .replace(/<[^>]*>/g, '')
      .split(/\s+/)
      .filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min read';

    let outputHtml = template
      .replace(/\{\{title\}\}/g, title)
      .replace(/\{\{date\}\}/g, formattedDate)
      .replace(/\{\{rawDate\}\}/g, date || '')
      .replace(/\{\{tags\}\}/g, Array.isArray(tags) ? tags.join(', ') : tags || '')
      .replace(/\{\{tagsHtml\}\}/g, tagsHtml)
      .replace(/\{\{readingTime\}\}/g, readingTime)
      .replace(/\{\{toc\}\}/g, tocHtml)
      .replace(/\{\{content\}\}/g, htmlContent)
      .replace(/\{\{assets\}\}/g, bundledAssets);

    if (date) {
      outputHtml = outputHtml.replace('class="meta-date"', 'class="meta-date has-date"');
    }
    if (tagsHtml) {
      outputHtml = outputHtml.replace(
        'class="blog-tags meta-tags"',
        'class="blog-tags meta-tags has-tags"',
      );
    }

    const outputPath = path.join(DIST_DIR, slug);
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, outputHtml);
    console.log(`Generated: ${slug}`);
  }

  posts.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  let indexContent = fs.readFileSync(INDEX_FILE, 'utf-8');
  const navbarHtml = renderNavbar('/blog');
  indexContent = indexContent.replace(/\{\{navbar\}\}/g, navbarHtml);

  const postsByYear = posts.reduce(
    (acc, post) => {
      const year = post.date ? new Date(post.date).getFullYear().toString() : 'Unknown';
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(post);
      return acc;
    },
    {} as Record<string, Post[]>,
  );

  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  const tocItems = years
    .map((year) => {
      const yearPosts = postsByYear[year];
      const postsHtml = yearPosts
        .map((post) => {
          const dateStr = post.date
            ? new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : '';

          const tagsHtml =
            post.tags.length > 0
              ? post.tags
                  .map((tag: string) => renderToString(React.createElement(Badge, null, tag)))
                  .join('')
              : '';

          return `<article class="group">
      <h3 class="font-serif text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors cursor-pointer leading-tight mb-3">
        <a href="/blog/${post.slug}">${post.title}</a>
      </h3>
      <div class="flex flex-wrap items-center gap-4">
        <time class="text-xs uppercase tracking-widest text-muted-ink font-bold">${dateStr}</time>
        ${tagsHtml ? `<span class="text-ink/20">|</span><div class="flex flex-wrap gap-2">${tagsHtml}</div>` : ''}
      </div>
    </article>`;
        })
        .join('\n');

      return `<section class="mb-20" id="${year}">
  <div class="flex items-baseline gap-4 border-b border-subtle pb-4 mb-10">
    <h2 class="font-serif text-3xl italic">${year}</h2>
  </div>
  <div class="space-y-12">
    ${postsHtml}
  </div>
</section>`;
    })
    .join('\n');

  indexContent = indexContent.replace(/\{\{posts\}\}/g, tocItems);
  indexContent = indexContent.replace(/\{\{postCount\}\}/g, String(posts.length));
  indexContent = indexContent.replace(/\{\{assets\}\}/g, bundledAssets);

  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), indexContent);
  console.log('Generated: index.html');

  console.log(`\nBlog build complete! Generated ${posts.length} posts.`);
}

buildBlog().catch(console.error);
