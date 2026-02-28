import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';

interface PublishedAsset {
  img_path: string;
  uploaded_at: string;
}

const BLOG_ASSETS_DIR = path.join(process.cwd(), 'blog/markdowns/assets');
const DB_FILE = path.join(process.cwd(), 'blog-assets.db');
const JSON_FILE = path.join(os.tmpdir(), 'blog-assets.json');

function loadEnvVars(): Record<string, string> {
  const envPath = path.join(process.cwd(), '.dev.vars');
  const vars: Record<string, string> = {};
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        vars[match[1].trim()] = match[2].trim();
      }
    }
  }
  return vars;
}

const envVars = loadEnvVars();

const R2_CONFIG = {
  bucketName: envVars.R2_BUCKET_NAME || process.env.R2_BUCKET_NAME || 'personal-site-blog-assets',
  publicUrl:
    envVars.R2_PUBLIC_URL ||
    process.env.R2_PUBLIC_URL ||
    'https://imgs.jimiao.pics/personal-site-blog-assets/imgs',
};

function getPublishedAssets(): Map<string, PublishedAsset> {
  try {
    const data = fs.readFileSync(JSON_FILE, 'utf-8');
    console.log('json file: ', JSON_FILE);
    console.log('json data is: ', data);
    const assets: PublishedAsset[] = JSON.parse(data);
    return new Map(assets.map((a) => [a.img_path, a]));
  } catch {
    return new Map();
  }
}

function isUploadedToR2(imgPath: string): boolean {
  const assets = getPublishedAssets();
  return assets.has(imgPath);
}

function markAsUploaded(imgPath: string): void {
  try {
    const relativePath = path.relative(process.cwd(), imgPath);
    const timestamp = new Date().toISOString();
    execSync(
      `sqlite3 "${DB_FILE}" "INSERT OR REPLACE INTO published_assets (img_path, uploaded_at) VALUES ('${relativePath}', '${timestamp}')"`,
      {
        stdio: 'pipe',
      },
    );
  } catch (e) {
    console.error('Failed to mark as uploaded in DB:', e);
  }
}

function compressToWebP(inputPath: string, outputPath: string): boolean {
  try {
    execSync(`ffmpeg -i "${inputPath}" -c:v libwebp -quality 80 -y "${outputPath}"`, {
      stdio: 'pipe',
    });
    return true;
  } catch (e) {
    console.error('FFmpeg error:', e);
    return false;
  }
}

function uploadToR2(localPath: string, key: string): boolean {
  console.log(`  Uploading: ${localPath} -> ${R2_CONFIG.bucketName}/imgs/${key}`);
  try {
    const result = execSync(
      `wrangler r2 object put ${R2_CONFIG.bucketName}/imgs/${key} --file "${localPath}" --content-type image/webp --remote`,
      { stdio: 'pipe' },
    );
    console.log(`  Result: ${result.toString()}`);
    return true;
  } catch (e: any) {
    console.error('Wrangler upload error:', e.stdout?.toString() || e.message);
    return false;
  }
}

export function processAndRewireImageUrl(imageFilename: string): string {
  const ext = path.extname(imageFilename);
  const stem = path.basename(imageFilename, ext);
  const imgPath = path.join(BLOG_ASSETS_DIR, imageFilename);

  const isAlreadyCompressed = stem.toLowerCase().endsWith('.compressed');
  const webpStem = isAlreadyCompressed ? stem : `${stem}.compressed`;

  if (isUploadedToR2(imgPath)) {
    const webpName = `${webpStem}.webp`;
    return `${R2_CONFIG.publicUrl}/${webpName}`;
  }

  const compressedFilename = isAlreadyCompressed ? imageFilename : `${stem}.compressed${ext}`;
  const compressedPath = path.join(BLOG_ASSETS_DIR, compressedFilename);

  if (!fs.existsSync(compressedPath)) {
    throw new Error(
      `Compressed image not found: ${compressedPath}\n` +
        `Please run 'npm run compress:assets' first to compress images.`,
    );
  }

  const tmpDir = os.tmpdir();
  const tmpPath = path.join(tmpDir, `${webpStem}.webp`);

  if (!compressToWebP(compressedPath, tmpPath)) {
    throw new Error(
      `Failed to compress to WebP: ${compressedPath}\n` +
        `Please check if ffmpeg is installed correctly.`,
    );
  }

  const webpKey = `${webpStem}.webp`;
  if (!uploadToR2(tmpPath, webpKey)) {
    fs.unlinkSync(tmpPath);
    throw new Error(
      `Failed to upload to R2: ${webpKey}\n` +
        `Please check your R2 credentials in .dev.vars and ensure the bucket exists.`,
    );
  }

  markAsUploaded(imgPath);
  fs.unlinkSync(tmpPath);
  return `${R2_CONFIG.publicUrl}/${webpKey}`;
}

export function rewireImageUrls(content: string): string {
  return content.replace(/!\[([^\]]*)\]\(([^)]+\.compressed\.[^)]+)\)/g, (_, alt, imgPath) => {
    const filename = path.basename(imgPath);
    const rewiredUrl = processAndRewireImageUrl(filename);
    return `![${alt}](${rewiredUrl})`;
  });
}

async function uploadAllAssets(): Promise<void> {
  console.log('Uploading blog assets to R2...\n');

  const assets = getPublishedAssets();
  const total = assets.size;
  let processed = 0;

  for (const [imgPath] of assets) {
    const filename = path.basename(imgPath);
    try {
      processAndRewireImageUrl(filename);
      processed++;
      console.log(`Uploaded: ${filename}`);
    } catch (e) {
      console.error(`Failed: ${filename}`, e);
    }
  }

  console.log(`\nUploaded ${processed}/${total} assets to R2.`);
}

uploadAllAssets().catch(console.error);
