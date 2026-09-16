#!/usr/bin/env node
/**
 * mockup:check — spec §7, headless, CI-shaped.
 *
 * Exits non-zero on any error-severity finding, and on any component a
 * composition imports that COMPONENT-MAP.md does not record. Warnings print
 * but do not fail: contrast on a token pair is worth seeing, not worth
 * blocking a build over.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson } from './browser.mjs';
import { withServer } from './server.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const only = process.argv.slice(2).filter(a => !a.startsWith('-'));

const red = s => `\x1b[31m${s}\x1b[0m`;
const yellow = s => `\x1b[33m${s}\x1b[0m`;
const green = s => `\x1b[32m${s}\x1b[0m`;
const dim = s => `\x1b[2m${s}\x1b[0m`;

function mappedComponents() {
  try {
    const md = readFileSync(join(root, 'src/mockups/COMPONENT-MAP.md'), 'utf8');
    return new Set([...md.matchAll(/`(@\/[^`]+)`/g)].map(m => m[1]));
  } catch {
    return null;
  }
}

await withServer(async origin => {
  const manifest = await readJson({ url: `${origin}/mockups/manifest`, id: 'mockup-manifest' });
  if (!manifest) {
    console.error(red('could not read the composition manifest — is the app building?'));
    process.exit(2);
  }

  const targets = only.length
    ? manifest.filter(m => only.some(o => m.id.startsWith(o)))
    : manifest;

  if (!targets.length) {
    console.error(red(`no composition matches ${only.join(', ')}`));
    process.exit(2);
  }

  const mapped = mappedComponents();
  if (!mapped) {
    console.log(yellow('! COMPONENT-MAP.md is missing — skipping the unmapped-component rule'));
  }

  let errors = 0;
  let warns = 0;

  for (const c of targets) {
    const findings =
      (await readJson({ url: `${origin}/mockups/${c.id}/export`, id: 'mockup-findings' })) ?? [];

    const unmapped = mapped ? c.uses.filter(u => !mapped.has(u)) : [];
    const rows = [
      ...findings,
      ...unmapped.map(u => ({
        rule: 'unmapped-component',
        severity: 'error',
        message: `${u} is not recorded in COMPONENT-MAP.md`,
      })),
    ];

    const e = rows.filter(f => f.severity === 'error');
    const w = rows.filter(f => f.severity === 'warn');
    errors += e.length;
    warns += w.length;

    const badge = e.length ? red(`${e.length} error${e.length > 1 ? 's' : ''}`) : green('pass');
    console.log(`\n${c.id}  ${badge}${w.length ? dim(` · ${w.length} warn`) : ''}`);
    console.log(dim(`  ${c.claim}`));
    for (const f of e) console.log(`  ${red('✕')} ${dim(f.rule)} ${f.message}`);
    for (const f of w) console.log(`  ${yellow('!')} ${dim(f.rule)} ${f.message}`);
  }

  console.log(
    `\n${targets.length} composition${targets.length > 1 ? 's' : ''} · ` +
      `${errors ? red(`${errors} errors`) : green('0 errors')} · ${warns} warnings`,
  );
  process.exit(errors ? 1 : 0);
});
