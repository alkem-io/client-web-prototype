/**
 * PhotoSurface — drop the live screens into a photographed device.
 *
 * A template is a photograph plus, per device, the four corners of its screen
 * as they appear in that photograph. The screen is rendered flat at its design
 * size and mapped onto those corners with a projective transform, so the text
 * inside stays real text at export time instead of a stretched bitmap.
 */
import type { ReactNode } from 'react';
import { quadToMatrix3d } from '../core/homography';
import type { MockupTemplate, TemplateSlot } from '../templates/registry';

export function PhotoSlot({
  slot,
  children,
}: {
  slot: TemplateSlot;
  children: ReactNode;
}) {
  const matrix = quadToMatrix3d(slot.width, slot.height, slot.quad);
  if (!matrix) {
    return (
      <div className="absolute left-2 top-2 rounded bg-red-600 px-2 py-1 text-[11px] text-white">
        Slot "{slot.id}" has a degenerate quad — recalibrate it
      </div>
    );
  }
  return (
    <div
      data-mockup-screen={slot.id}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: slot.width,
        height: slot.height,
        transform: matrix,
        transformOrigin: '0 0',
        overflow: 'hidden',
        background: 'var(--background)',
        // A photographed screen is never perfectly flat-lit; a whisper of the
        // plate's own shading keeps the composite from looking pasted on.
        boxShadow: 'inset 0 0 60px rgba(16,35,50,.10)',
      }}
    >
      {children}
    </div>
  );
}

export function PhotoSurface({
  template,
  screens,
}: {
  template: MockupTemplate;
  /** Screen node per slot id. */
  screens: Record<string, ReactNode>;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: template.canvas.width,
        height: template.canvas.height,
      }}
    >
      <img
        src={template.image}
        alt=""
        width={template.canvas.width}
        height={template.canvas.height}
        style={{ position: 'absolute', inset: 0, display: 'block' }}
        data-mockup-ignore=""
      />
      {template.slots.map(slot => (
        <PhotoSlot key={slot.id} slot={slot}>
          {screens[slot.id] ?? null}
        </PhotoSlot>
      ))}
    </div>
  );
}
