/**
 * LaptopFrame — neutral bezel, screen clip, base.
 *
 * No brand, no browser chrome, no OS furniture (spec §6.10). The screen slot
 * clips, so a feed that runs past the fold reads as scrolled rather than
 * truncated by the mockup.
 */
import type { ReactNode } from 'react';
import type { Rect } from '../core/types';
import { BEZEL, DEVICE_SHADOW } from '../core/tokens';

export function LaptopFrame({
  id,
  at,
  children,
}: {
  id: string;
  at: Rect;
  children: ReactNode;
}) {
  const bezel = BEZEL.laptop;
  const baseWidth = Math.round(at.width * 1.11);
  return (
    <>
      {/* base sits behind so a bottom-anchored card can spill across it */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: at.x + at.width / 2 - baseWidth / 2,
          top: at.y + at.height,
          width: baseWidth,
          height: 16,
          background: '#22323D',
          borderRadius: '0 0 10px 10px',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: at.x + at.width / 2 - baseWidth / 2 + 60,
          top: at.y + at.height + 16,
          width: baseWidth - 120,
          height: 22,
          background:
            'radial-gradient(ellipse at center, rgba(16,35,50,.20), rgba(16,35,50,0) 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: at.x,
          top: at.y,
          width: at.width,
          height: at.height,
          background: '#2A3B47',
          borderRadius: 16,
          padding: bezel,
          boxShadow: DEVICE_SHADOW.laptop,
        }}
      >
        <div
          data-mockup-screen={id}
          style={{
            position: 'relative',
            width: at.width - bezel * 2,
            height: at.height - bezel * 2,
            background: 'var(--background)',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
