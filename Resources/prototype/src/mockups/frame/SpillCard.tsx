/**
 * SpillCard — the floating card shell.
 *
 * Opaque by rule: a card paints over the device, so it must cover what is
 * under it completely or clear it completely. The lift is deliberately heavier
 * than the platform's own --elevation-sm; a card at screen elevation reads as
 * part of the UI rather than lifted out of it.
 */
import type { CSSProperties, ReactNode } from 'react';
import { SPILL_SHADOW } from '../core/tokens';

export function SpillCard({
  id,
  style,
  children,
  padded = true,
  bare = false,
}: {
  id: string;
  style?: CSSProperties;
  children: ReactNode;
  padded?: boolean;
  /** The content brings its own surface (a real Card, say) — contribute only
   *  the lift, so the two borders don't stack. */
  bare?: boolean;
}) {
  return (
    <div
      data-mockup-card={id}
      style={{
        background: bare ? 'transparent' : 'var(--card)',
        border: bare ? 'none' : '1px solid var(--border)',
        borderRadius: 10,
        boxShadow: SPILL_SHADOW,
        padding: bare || !padded ? 0 : 15,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Small uppercase label used at the head of most cards. 11px is the floor. */
export function CardLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase leading-tight tracking-[0.06em] text-muted-foreground">
      {children}
    </div>
  );
}
