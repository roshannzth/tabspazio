import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const browser = process.argv[2];

if (!browser) {
  console.error('Please specify a browser (chrome, firefox, chromium, edge, opera)');
  process.exit(1);
}

const manifestMap = {
  chrome: 'chrome.json',
  firefox: 'firefox.json',
  chromium: 'chromium.json',
  edge: 'chromium.json',
  opera: 'chromium.json'
};

const manifestFile = manifestMap[browser];

if (!manifestFile) {
  console.error(`Unknown browser: ${browser}`);
  process.exit(1);
}

const distDir = path.join(rootDir, 'dist', browser);
const manifestsDir = path.join(rootDir, 'manifests');
const publicIconsDir = path.join(rootDir, 'public', 'icons');
const distIconsDir = path.join(distDir, 'icons');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.cpSync(
  path.join(manifestsDir, manifestFile),
  path.join(distDir, 'manifest.json')
);

if (fs.existsSync(publicIconsDir)) {
  if (!fs.existsSync(distIconsDir)) {
    fs.mkdirSync(distIconsDir, { recursive: true });
  }
  fs.cpSync(publicIconsDir, distIconsDir, { recursive: true });
}

console.log(`Successfully built for ${browser}`);
