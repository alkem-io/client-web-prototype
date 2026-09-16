/**
 * /mockups/:id/export — the capture surface.
 *
 * No page chrome, no scaling, no scroll: the stage renders at exactly its
 * design size so a headless window of the same size captures it pixel for
 * pixel. Findings are written into the DOM as JSON, which is how `mockup:check`
 * reads them back without a browser automation dependency.
 */
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { allCompositions, compositionById } from '../compositions';
import { MockupStage } from '../frame/MockupStage';
import type { CropName, Finding, OverflowMode } from '../core/types';

/** Crop windows, as a fraction of the design canvas. */
export function cropBox(crop: CropName, canvas: { width: number; height: number }) {
  if (crop === 'wide') {
    const height = Math.round(canvas.width / 3);
    return { width: canvas.width, height, offsetY: Math.round((canvas.height - height) / 2) };
  }
  return { width: canvas.width, height: canvas.height, offsetY: 0 };
}

export default function ExportPage() {
  const { id = '' } = useParams();
  const [params] = useSearchParams();
  const [findings, setFindings] = useState<Finding[] | null>(null);

  const base = compositionById(id);
  if (!base) return <pre id="mockup-error">unknown composition: {id}</pre>;

  const overflow = (params.get('overflow') as OverflowMode | null) ?? base.overflow;
  const crop = (params.get('crop') as CropName | null) ?? 'default';
  const transparent = params.get('transparent') === '1' || crop === 'transparent';
  const composition = { ...base, overflow };
  const box = cropBox(crop, composition.canvas);

  return (
    <>
      <style>{`html,body{margin:0;padding:0;overflow:hidden;background:${
        transparent ? 'transparent' : 'var(--background)'
      }}`}</style>
      <div
        style={{
          position: 'relative',
          width: box.width,
          height: box.height,
          overflow: 'hidden',
          background: transparent ? 'transparent' : 'var(--background)',
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: -box.offsetY }}>
          <div style={{ width: composition.canvas.width }}>
            <MockupStage composition={composition} fit={false} scale={1} onValidated={setFindings} />
          </div>
        </div>
      </div>
      {findings ? (
        <script
          type="application/json"
          id="mockup-findings"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(findings) }}
        />
      ) : null}
    </>
  );
}

/** /mockups/manifest — what the node scripts iterate over. */
export function ManifestPage() {
  const manifest = allCompositions().map(c => ({
    id: c.id,
    claim: c.claim,
    canvas: c.canvas,
    crops: c.crops,
    overflow: c.overflow,
    devices: c.devices.map(d => ({ id: d.id, kind: d.kind, screenKind: d.screenKind })),
    cards: c.cards.map(c2 => c2.id),
    uses: c.uses,
  }));
  return (
    <script
      type="application/json"
      id="mockup-manifest"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(manifest) }}
    />
  );
}
