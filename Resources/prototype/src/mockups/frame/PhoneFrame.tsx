/**
 * PhoneFrame — bezel, screen clip, and the one piece of OS decoration the
 * spec allows: a status bar. Drawn rather than typed so it never trips the
 * 11px type floor.
 */
import type { ReactNode } from 'react';
import type { Rect } from '../core/types';
import { BEZEL, DEVICE_SHADOW } from '../core/tokens';

export function StatusBar({ time = '09:41' }: { time?: string }) {
  return (
    <div
      className="absolute inset-x-0 top-0 flex h-6 items-center justify-between px-3.5 text-[11px] font-semibold text-foreground"
      data-mockup-ignore=""
    >
      <span>{time}</span>
      <span className="flex items-center gap-1.5" aria-hidden>
        <span className="flex items-end gap-[1.5px]">
          {[4, 6, 8, 10].map(h => (
            <i key={h} className="block w-[2.5px] rounded-[1px] bg-foreground" style={{ height: h }} />
          ))}
        </span>
        <span className="relative h-[9px] w-[17px] rounded-[2.5px] border border-foreground">
          <i className="absolute inset-y-[1.5px] left-[1.5px] w-[9px] rounded-[1px] bg-foreground" />
        </span>
      </span>
    </div>
  );
}

export function PhoneFrame({
  id,
  at,
  statusBar = true,
  children
}: {
  id: string;
  at: Rect;
  statusBar?: boolean;
  children: ReactNode;
}) {
  const bezel = BEZEL.phone;
  return (
    <div
      style={{
        position: 'absolute',
        left: at.x,
        top: at.y,
        width: at.width,
        height: at.height,
        background: '#2A3B47',
        borderRadius: 34,
        padding: bezel,
        boxShadow: DEVICE_SHADOW.phone
      }}
    >
      <div
        data-mockup-screen={id}
        style={{
          position: 'relative',
          width: at.width - bezel * 2,
          height: at.height - bezel * 2,
          background: 'var(--background)',
          borderRadius: 25,
          overflow: 'hidden'
        }}
      >
        {statusBar ? <StatusBar /> : null}
        <div style={{ position: 'absolute', inset: 0, top: statusBar ? 24 : 0 }}>{children}</div>
      </div>
    </div>
  );
}
