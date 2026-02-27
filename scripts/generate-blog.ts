import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { fileURLToPath } from 'url';
import { build } from 'vite';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_SOURCE_DIR = path.join(__dirname, '../blog');
const BLOG_MD_DIR = path.join(__dirname, '../blog/markdowns');
const DIST_DIR = path.join(__dirname, '../dist/blog');
const TEMPLATE_FILE = path.join(BLOG_SOURCE_DIR, '_template.html');
const INDEX_FILE = path.join(BLOG_SOURCE_DIR, 'index.html');

const bundledAssets = '<script src="/assets/blog/index.js"></script>';

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

  const result = await postcss([tailwindcss({ config: configPath }), autoprefixer()]).process(css, {
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

function parseMarkdownToHtml(markdown: string): string {
  return marked.parse(markdown) as string;
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

function loadTemplate(templatePath: string): string {
  if (fs.existsSync(templatePath)) {
    return fs.readFileSync(templatePath, 'utf-8');
  }
  return DEFAULT_TEMPLATE;
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

  const template = loadTemplate(TEMPLATE_FILE);
  const mdFiles = walkDir(BLOG_MD_DIR);

  const posts: Post[] = [];

  for (const relativePath of mdFiles) {
    const fullPath = path.join(BLOG_MD_DIR, relativePath);
    const { metadata, content: markdownContent } = getMetadata(fullPath);
    const processedMarkdown = stripFirstHeading(markdownContent);
    const htmlContent = parseMarkdownToHtml(processedMarkdown);
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
      tagsHtml = tags.map((tag) => `<span class="blog-tag">${tag}</span>`).join('');
    }

    const formattedDate = date
      ? new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : '';

    let outputHtml = template
      .replace(/\{\{title\}\}/g, title)
      .replace(/\{\{date\}\}/g, formattedDate)
      .replace(/\{\{rawDate\}\}/g, date || '')
      .replace(/\{\{tags\}\}/g, Array.isArray(tags) ? tags.join(', ') : tags || '')
      .replace(/\{\{tagsHtml\}\}/g, tagsHtml)
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

          return `<li>
      <a href="/blog/${post.slug}" class="post-link">
        <span class="post-title">${post.title}</span>
        ${dateStr ? `<span class="post-date">${dateStr}</span>` : ''}
      </a>
    </li>`;
        })
        .join('\n');

      return `<li class="year-group">
      <h2 class="year-title">${year}</h2>
      <ul class="post-list">
        ${postsHtml}
      </ul>
    </li>`;
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
