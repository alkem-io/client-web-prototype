/**
 * browser — drive whatever Chrome is on this machine, with no extra deps.
 *
 * Two things are needed from a browser here: a pixel-exact screenshot, and the
 * validator's findings. Headless Chrome gives the first with --screenshot and
 * the second with --dump-dom, because the export page writes its findings into
 * the DOM as JSON. That is the whole reason to avoid a driver library: adding
 * Playwright to a design prototype costs ~200MB for two calls.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

export function findChrome() {
  const found = CANDIDATES.find(p => existsSync(p));
  if (!found) {
    throw new Error(
      'No Chrome found. Set CHROME_PATH to a Chrome, Chromium or Edge binary.',
    );
  }
  return found;
}

function run(args, { capture = false } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(findChrome(), args, {
      stdio: capture ? ['ignore', 'pipe', 'ignore'] : 'ignore',
    });
    let out = '';
    if (capture) child.stdout.on('data', d => (out += d));
    child.on('error', reject);
    child.on('exit', code =>
      code === 0 || capture ? resolve(out) : reject(new Error(`chrome exited ${code}`)),
    );
  });
}

const baseFlags = () => [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'mockup-'))}`,
];

export async function screenshot({ url, out, width, height, scale = 1, wait = 4000 }) {
  await run([
    ...baseFlags(),
    `--window-size=${width},${height}`,
    `--force-device-scale-factor=${scale}`,
    `--virtual-time-budget=${wait}`,
    `--screenshot=${out}`,
    url,
  ]);
}

/** Pull a `<script type="application/json" id="...">` payload out of a page. */
export async function readJson({ url, id, wait = 4000 }) {
  const dom = await run(
    [...baseFlags(), `--virtual-time-budget=${wait}`, '--dump-dom', url],
    { capture: true },
  );
  const re = new RegExp(`id="${id}"[^>]*>([\\s\\S]*?)</script>`);
  const match = dom.match(re);
  if (!match) return null;
  try {
    return JSON.parse(
      match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#x27;/g, "'"),
    );
  } catch {
    return null;
  }
}
