#!/usr/bin/env node
/**
 * mockup:build — render every composition to PNG.
 *
 * Writes `export/<id>/<crop>@<scale>x.png`. Print is 4x the design canvas,
 * which is the 300dpi equivalent for the sizes these get placed at. A crop
 * that a composition does not declare is skipped rather than invented.
 *
 *   npm run mockup:build            all compositions
 *   npm run mockup:build 01         just the ones whose id starts with 01
 *   npm run mockup:build -- --overflow contained
 */
import { mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson, screenshot } from './browser.mjs';
import { withServer } from './server.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outRoot = join(root, 'export');

const argv = process.argv.slice(2);
const flag = name => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? null : argv[i + 1];
};
const only = argv.filter(a => !a.startsWith('--') && argv[argv.indexOf(a) - 1]?.startsWith('--') !== true);
const overflow = flag('overflow');
const clean = argv.includes('--clean');

const SCALES = { default: [1, 2], wide: [1, 2], print: [4], transparent: [1, 2] };

const dim = s => `\x1b[2m${s}\x1b[0m`;
const green = s => `\x1b[32m${s}\x1b[0m`;

await withServer(async origin => {
  const manifest = await readJson({ url: `${origin}/mockups/manifest`, id: 'mockup-manifest' });
  if (!manifest) throw new Error('could not read the composition manifest');

  const targets = only.length
    ? manifest.filter(m => only.some(o => m.id.startsWith(o)))
    : manifest;

  if (clean) rmSync(outRoot, { recursive: true, force: true });

  let written = 0;
  for (const c of targets) {
    const dir = join(outRoot, c.id);
    mkdirSync(dir, { recursive: true });
    console.log(`\n${c.id} ${dim(c.claim)}`);

    for (const crop of c.crops) {
      const height =
        crop === 'wide' ? Math.round(c.canvas.width / 3) : c.canvas.height;
      for (const scale of SCALES[crop] ?? [1]) {
        const params = new URLSearchParams({ crop });
        if (overflow) params.set('overflow', overflow);
        if (crop === 'transparent') params.set('transparent', '1');

        const out = join(dir, `${crop}@${scale}x.png`);
        await screenshot({
          url: `${origin}/mockups/${c.id}/export?${params}`,
          out,
          width: c.canvas.width,
          height,
          scale,
        });
        written++;
        console.log(`  ${green('✓')} ${crop}@${scale}x  ${dim(`${c.canvas.width * scale}×${height * scale}`)}`);
      }
    }
  }

  console.log(`\n${written} images → ${dim(outRoot)}`);
});
