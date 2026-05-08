import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const UNSPLASH_KEY = process.env.UNSPLASH_KEY;
if (!UNSPLASH_KEY) {
  console.error('Error: UNSPLASH_KEY environment variable is not set.');
  process.exit(1);
}

const UNITS = [
  { id: 'unit-hello-goodbye',       query: 'arabic greeting handshake' },
  { id: 'unit-how-are-you',         query: 'friendly conversation people' },
  { id: 'unit-introductions',       query: 'people meeting introduction' },
  { id: 'unit-numbers-1-10',        query: 'numbers counting colorful' },
  { id: 'unit-numbers-11-20',       query: 'numbers math learning' },
  { id: 'unit-numbers-larger',      query: 'large numbers abacus counting' },
  { id: 'unit-immediate-family',    query: 'family parents children home' },
  { id: 'unit-extended-family',     query: 'big family gathering grandparents' },
  { id: 'unit-family-descriptions', query: 'family portrait together' },
  { id: 'unit-common-foods',        query: 'arabic food mezze bread' },
  { id: 'unit-restaurant',          query: 'restaurant table dining arabic' },
  { id: 'unit-drinks',              query: 'tea coffee arabic drinks' },
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../assets/images/units');

fs.mkdirSync(OUT_DIR, { recursive: true });

function get(url, headers) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return get(res.headers.location, headers).then(resolve, reject);
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function downloadUnit({ id, query }) {
  const searchUrl =
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=squarish`;

  const searchRes = await get(searchUrl, { Authorization: `Client-ID ${UNSPLASH_KEY}` });
  if (searchRes.status !== 200) {
    throw new Error(`Unsplash search returned HTTP ${searchRes.status}`);
  }

  const data = JSON.parse(searchRes.body.toString());
  const photo = data.results?.[0];
  if (!photo) throw new Error('No results found');

  const imageUrl = photo.urls.small;
  const imageRes = await get(imageUrl, {});
  if (imageRes.status !== 200) {
    throw new Error(`Image download returned HTTP ${imageRes.status}`);
  }

  fs.writeFileSync(path.join(OUT_DIR, `${id}.jpg`), imageRes.body);
}

async function main() {
  let succeeded = 0;
  let failed = 0;

  for (const unit of UNITS) {
    try {
      await downloadUnit(unit);
      console.log(`✓ ${unit.id}`);
      succeeded++;
    } catch (err) {
      console.log(`✗ ${unit.id}: ${err.message}`);
      failed++;
    }
    if (unit !== UNITS[UNITS.length - 1]) await sleep(300);
  }

  console.log(`\nDone: ${succeeded} succeeded, ${failed} failed.`);
}

main();
