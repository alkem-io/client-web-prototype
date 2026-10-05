#!/usr/bin/env node
/**
 * Re-sync src/crd/ from client-web.
 *
 *   npm run sync:crd          # show the diff, then apply it
 *   npm run sync:crd:check    # show the diff only, change nothing (CI-friendly)
 *
 * src/crd/ is a byte-identical copy of client-web's design system. Nothing in
 * it is hand-edited, so syncing is a wholesale replace — the value of this
 * script is the *report*: it tells you exactly what production changed before
 * you adopt it, so a surprise (a renamed prop, a new required prop, a dropped
 * component) is visible rather than discovered at build time.
 *
 * Exit codes: 0 = no changes (or applied), 1 = error, 2 = drift found (--check).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { readdirSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = 'https://github.com/alkem-io/client-web.git';
const BRANCH = process.env.CRD_BRANCH ?? 'develop';
const HERE = dirname(fileURLToPath(import.meta.url));
const CRD_DIR = resolve(HERE, '..', 'src', 'crd');
const AHEAD_DIR = resolve(HERE, '..', 'src', 'ahead');
// `src/app/components/ui/` is ahead-of-production too: the primitives the
// prototype has and production does not. Same graduation risk, so same check.
const OUR_PRIMITIVES_DIR = resolve(HERE, '..', 'src', 'app', 'components', 'ui');
const PROVENANCE = join(CRD_DIR, 'PROVENANCE.md');

const checkOnly = process.argv.includes('--check');
const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts });

if (!existsSync(CRD_DIR)) {
  console.error(`No vendored layer at ${CRD_DIR}`);
  process.exit(1);
}

const currentSha = (readFileSync(PROVENANCE, 'utf8').match(/^\| Commit \| `([0-9a-f]{40})` \|$/m) ?? [])[1];

const work = mkdtempSync(join(tmpdir(), 'crd-sync-'));
const clonePath = join(work, 'client-web');

try {
  console.log(`Fetching ${REPO} @ ${BRANCH} …`);
  run('git', ['clone', '--depth', '1', '--branch', BRANCH, '--filter=blob:none', '--sparse', REPO, clonePath]);
  run('git', ['sparse-checkout', 'set', '--skip-checks', 'src/crd', 'src/index.css'], { cwd: clonePath });

  const newSha = run('git', ['rev-parse', 'HEAD'], { cwd: clonePath }).trim();
  const newDate = run('git', ['log', '-1', '--format=%ad', '--date=iso'], { cwd: clonePath }).trim();
  const source = join(clonePath, 'src', 'crd');

  if (newSha === currentSha) {
    console.log(`\nAlready at ${newSha.slice(0, 8)} — nothing to sync.`);
    // Still run the graduation check: a component can land upstream and sit
    // here as a duplicate long before the next sync-worthy change.
    reportAhead(source);
    process.exit(0);
  }

  // `diff -rq` lists added / removed / changed files without dumping contents.
  let report = '';
  try {
    run('diff', ['-rq', '-x', 'PROVENANCE.md', CRD_DIR, source]);
  } catch (e) {
    // diff exits 1 when differences exist — that is the normal path here.
    report = e.stdout ?? '';
  }

  const lines = report.split('\n').filter(Boolean);
  const changed = lines.filter(l => l.startsWith('Files ')).length;
  const added = lines.filter(l => l.includes(`Only in ${source}`)).length;
  const removed = lines.filter(l => l.includes(`Only in ${CRD_DIR}`)).length;

  console.log(`\n${currentSha?.slice(0, 8) ?? '(unknown)'} → ${newSha.slice(0, 8)}  (${newDate})`);
  console.log(`  ${changed} changed, ${added} added, ${removed} removed\n`);
  for (const line of lines) console.log('  ' + line.replace(CRD_DIR, 'local').replace(source, 'upstream'));

  reportAhead(source);

  if (checkOnly) {
    console.log('\n--check: nothing written.');
    process.exit(lines.length ? 2 : 0);
  }

  // Wholesale replace, then restore the provenance record with the new SHA.
  const provenance = readFileSync(PROVENANCE, 'utf8');
  rmSync(CRD_DIR, { recursive: true, force: true });
  run('cp', ['-R', source, CRD_DIR]);
  writeFileSync(
    PROVENANCE,
    provenance
      .replace(/^\| Commit \| `[0-9a-f]{40}` \|$/m, `| Commit | \`${newSha}\` |`)
      .replace(/^\| Commit date \| .* \|$/m, `| Commit date | ${newDate} |`)
      .replace(/^\| Vendored on \| .* \|$/m, `| Vendored on | ${new Date().toISOString().slice(0, 10)} |`)
  );

  // The global app stylesheet lives outside src/crd/ but is just as much a part
  // of what production renders (scrollbar gutter, .markdown/.tiptap type, #root
  // layout). Vendored alongside — see src/vendor/README.md.
  const GLOBAL_SRC = join(clonePath, 'src', 'index.css');
  const GLOBAL_DEST = resolve(HERE, '..', 'src', 'vendor', 'client-web-index.css');
  if (existsSync(GLOBAL_SRC)) {
    const before = existsSync(GLOBAL_DEST) ? readFileSync(GLOBAL_DEST, 'utf8') : '';
    const after = readFileSync(GLOBAL_SRC, 'utf8');
    if (before !== after) {
      writeFileSync(GLOBAL_DEST, after);
      console.log('\n  ! src/vendor/client-web-index.css updated (global app stylesheet changed)');
    }
  }

  console.log(`\nSynced to ${newSha.slice(0, 8)}. Run \`npm run build\` — a failure here is the`);
  console.log('signal that a CRD API changed and prototype code needs updating.');
} finally {
  rmSync(work, { recursive: true, force: true });
}

/**
 * Graduation check — the step that quietly rots without it.
 *
 * `src/ahead/` holds components the prototype has and production does not.
 * When production builds one, our copy becomes a duplicate that nobody
 * remembers to delete, and the two drift apart silently.
 *
 * So: after every sync, compare the component names in `src/ahead/` against
 * every component name upstream. A match means production now owns it.
 *
 * Matching on filename is deliberately loose. A near-match is worth a human
 * look, and a false positive costs ten seconds; a miss costs months.
 */
function reportAhead(upstreamCrdDir) {
  const upstream = upstreamComponentNames(upstreamCrdDir);
  reportGraduations(AHEAD_DIR, 'src/ahead/', 'component', upstream);
  reportGraduations(OUR_PRIMITIVES_DIR, 'src/app/components/ui/', 'primitive', upstream);
  reportWatchlist(upstream);
}

/** Every component name upstream, flattened — the thing both checks ask about. */
function upstreamComponentNames(dir, into = new Set()) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) upstreamComponentNames(full, into);
    else if (extname(entry.name) === '.tsx' && !entry.name.includes('.test.') && !entry.name.includes('.spec.'))
      into.add(basename(entry.name, '.tsx'));
  }
  return into;
}

function reportGraduations(dir, label, noun, upstream) {
  if (!existsSync(dir)) return;

  const ours = readdirSync(dir)
    .filter(f => extname(f) === '.tsx')
    .map(f => basename(f, '.tsx'));

  if (ours.length === 0) return;

  const graduated = ours.filter(name => upstream.has(name));

  console.log(`\nAhead-of-production check — ${ours.length} ${noun}(s) in ${label}`);
  if (graduated.length === 0) {
    console.log('  None have landed upstream yet.');
    return;
  }

  console.log('\n  GRADUATED — production now has these, so ours are duplicates:');
  for (const name of graduated) {
    console.log(`    • ${name}`);
  }
  console.log(`\n  Next: delete ${label}<name>.tsx, repoint its imports to @/crd/…,`);
  console.log('  and record it in the "Recently graduated" table in src/ahead/README.md.');
}

/**
 * The same check for things too big to be a single file in `src/ahead/`:
 * whole pages, flows and tab sets. They stay where they live; `watchlist.json`
 * is what gets them checked anyway.
 *
 * Reported as a fraction, because a surface lands upstream a piece at a time.
 * Anything above zero is worth a look before more work goes into ours.
 */
function reportWatchlist(upstreamNames) {
  const manifest = join(AHEAD_DIR, 'watchlist.json');
  if (!existsSync(manifest)) return;

  let surfaces;
  try {
    surfaces = JSON.parse(readFileSync(manifest, 'utf8')).surfaces ?? [];
  } catch (e) {
    console.log(`\n  ! src/ahead/watchlist.json could not be read: ${e.message}`);
    return;
  }
  if (surfaces.length === 0) return;

  console.log(`\nAhead-of-production surfaces — ${surfaces.length} tracked in src/ahead/watchlist.json`);
  for (const surface of surfaces) {
    const watch = surface.watchFor ?? [];
    const landed = watch.filter(name => upstreamNames.has(name));
    const mark = landed.length === 0 ? ' ' : landed.length === watch.length ? '!' : '~';
    console.log(`  [${mark}] ${surface.name} — ${landed.length}/${watch.length} upstream`);
    if (landed.length > 0) {
      console.log(`        ours: ${surface.ours}`);
      console.log(`        has:  ${landed.join(', ')}`);
    }
  }
  console.log('\n  [ ] still ours alone   [~] production started it   [!] production has it');
}
