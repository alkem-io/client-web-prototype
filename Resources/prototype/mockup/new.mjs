#!/usr/bin/env node
/**
 * mockup:new — scaffold a composition from a user story.
 *
 *   npm run mockup:new -- --story "As a member I want to …" \
 *                         --id 07-joining --device phone --cards 3
 *
 * What this does and does not do matters. It writes the file, wires the
 * import, picks the canvas and lays out the card anchors — the mechanical part
 * that used to be copy-paste. It does not choose *which* moments become cards:
 * that is the judgement the whole spec is about, and it needs someone who knows
 * what the platform can actually do. The scaffold names the decisions it wants
 * and leaves them as TODOs.
 */
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const compDir = join(root, 'src/mockups/compositions');

const argv = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};

const story = flag('story');
if (!story) {
  console.error(
    'usage: npm run mockup:new -- --story "As a … I want … so that …" [--id 07-slug] [--device laptop|phone|duo] [--cards 4]',
  );
  process.exit(2);
}

const slugFromStory = () =>
  story
    .replace(/^as an? [^,]+,?\s*/i, '')
    .replace(/^i want (to )?/i, '')
    .split(/\s+/)
    .slice(0, 4)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');

const id = flag('id') ?? `xx-${slugFromStory()}`;
const device = flag('device', 'laptop');
const cardCount = Math.min(5, Math.max(0, Number(flag('cards', '4'))));
const file = join(compDir, `${id}.tsx`);

if (existsSync(file)) {
  console.error(`${id}.tsx already exists — pick another --id`);
  process.exit(2);
}

const ANCHORS = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'left-margin'];
const WIDTHS = [336, 348, 320, 364, 300];

const devices =
  device === 'duo'
    ? `      {
        id: 'laptop',
        kind: 'laptop',
        // TODO screenKind drives cursor legality — cursors are only legal on
        // 'whiteboard' | 'document' | 'memo'.
        screenKind: 'subspace',
        screen: <div className="p-8 text-body">TODO: the laptop screen</div>,
      },
      {
        id: 'phone',
        kind: 'phone',
        screenKind: 'space',
        screen: <div className="p-4 text-body">TODO: the phone screen</div>,
      },`
    : `      {
        id: '${device}',
        kind: '${device}',
        screenKind: '${device === 'phone' ? 'space' : 'subspace'}',
        screen: <div className="p-8 text-body">TODO: what the device shows</div>,
      },`;

const cards = Array.from({ length: cardCount })
  .map(
    (_, i) => `      {
        id: 'card-${i + 1}',
        at: '${ANCHORS[i]}',
        width: ${WIDTHS[i]},
        // TODO the moment this card carries. Outcomes, not features — and
        // nothing the platform cannot actually produce.
        node: <CardLabel>TODO</CardLabel>,
      },`,
  )
  .join('\n');

writeFileSync(
  file,
  `/**
 * ${id}
 *
 * Scaffolded from a user story. Fill the TODOs, then:
 *   npm run mockup:check ${id.slice(0, 2)}
 *   npm run mockup:build ${id.slice(0, 2)}
 */
import { defineComposition, register } from '../core/defineComposition';
import { CardLabel } from '../frame/SpillCard';
import { people } from '../fixtures/people';

export default register(
  defineComposition({
    id: '${id}',

    // TODO one sentence. If it needs two, it is two compositions.
    claim: 'TODO',

    story: ${JSON.stringify(story)},

    // 'spill' breaks the device edge, 'contained' keeps cards clear of it,
    // 'none' renders the device alone.
    overflow: 'spill',

    devices: [
${devices}
    ],

    cards: [
${cards}
    ],

    crops: ['default', 'wide'],

    // Every repo component this renders. mockup:check fails on anything not
    // recorded in COMPONENT-MAP.md.
    uses: [],
  }),
);
`,
  'utf8',
);

const indexFile = join(compDir, 'index.ts');
const index = readFileSync(indexFile, 'utf8');
if (!index.includes(`'./${id}'`)) {
  const line = `import './${id}';\n`;
  const marker = "export { allCompositions";
  writeFileSync(
    indexFile,
    index.includes(marker) ? index.replace(marker, `${line}\n${marker}`) : index + line,
    'utf8',
  );
}

console.log(`\n  created  src/mockups/compositions/${id}.tsx`);
console.log(`  wired    src/mockups/compositions/index.ts`);
console.log(`\n  next:    npm run mockup:dev    →  http://localhost:5173/mockups/${id}\n`);
console.log('  Fill in, in this order:');
console.log('    1. claim — the single sentence the image has to carry');
console.log('    2. screen — what the device shows, from real components');
console.log(`    3. ${cardCount} cards — the moments that survive losing everything else`);
console.log('    4. uses — and add the same paths to COMPONENT-MAP.md\n');
