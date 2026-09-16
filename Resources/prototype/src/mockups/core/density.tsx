/**
 * density — the mid-fidelity dial.
 *
 * Real headings, labels, names, numbers and status chips carry the meaning, so
 * they stay written out. Everything else drops to a placeholder at token greys.
 * That is what lets a composition survive being scaled to a slide inset, and
 * what stops a viewer reading the mockup as a promise about specific copy.
 */
import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Body copy, reduced to a stack of rules. Widths taper like real text. */
export function TextLines({
  lines = 3,
  widths,
  height = 8,
  gap = 8,
  className,
}: {
  lines?: number;
  widths?: number[];
  height?: number;
  gap?: number;
  className?: string;
}) {
  const w = widths ?? defaultWidths(lines);
  return (
    <div className={cn('flex flex-col', className)} style={{ gap }} data-mockup-ignore="">
      {w.slice(0, lines).map((pct, i) => (
        <span
          key={i}
          className="block rounded-full bg-muted"
          style={{ height, width: `${pct}%`, backgroundColor: 'rgb(228,235,241)' }}
        />
      ))}
    </div>
  );
}

function defaultWidths(n: number): number[] {
  const base = [100, 97, 99, 94, 62];
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(i === n - 1 ? 62 : base[i % (base.length - 1)]);
  return out;
}

/**
 * A table cut to a header row plus two or three data rows. Real column names
 * and real numbers — those are the part a reader is meant to believe.
 */
export function TruncatedTable({
  columns,
  rows,
  moreCount,
  className,
}: {
  columns: string[];
  rows: (string | number)[][];
  moreCount?: number;
  className?: string;
}) {
  return (
    <div className={cn('overflow-hidden rounded-md border border-border', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted/60">
            {columns.map(c => (
              <th
                key={c}
                className="px-2.5 py-1.5 text-left text-[11px] font-semibold text-muted-foreground"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 3).map((row, i) => (
            <tr key={i} className="border-t border-border">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-2.5 py-1.5 text-[11px] tabular-nums text-foreground"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {moreCount ? (
        <div className="border-t border-border px-2.5 py-1.5 text-[11px] text-muted-foreground">
          +{moreCount} more rows
        </div>
      ) : null}
    </div>
  );
}

/**
 * Photography stands in as a token-coloured gradient until a real asset is
 * supplied — a grey box would read as "not built", which is the opposite of
 * what these images are for.
 */
export function MediaPlaceholder({
  className,
  style,
  tone = 'brand',
  children,
}: {
  className?: string;
  style?: CSSProperties;
  tone?: 'brand' | 'muted';
  children?: ReactNode;
}) {
  const bg =
    tone === 'brand'
      ? 'linear-gradient(112deg,#1D384A 0%,#2F5468 46%,#6E93A4 100%)'
      : 'linear-gradient(120deg,#E2E8F0 0%,#F1F5F9 60%,#CBD5E1 100%)';
  return (
    <div className={cn('relative overflow-hidden', className)} style={{ background: bg, ...style }}>
      {children}
    </div>
  );
}

/** Overlapping faces. Initials on the person's own accent, never a grey blob. */
export function AvatarStack({
  people,
  size = 22,
  max = 4,
}: {
  people: { initials: string; accent: string; name?: string }[];
  size?: number;
  max?: number;
}) {
  const shown = people.slice(0, max);
  return (
    <div className="flex items-center">
      {shown.map((p, i) => (
        <span
          key={i}
          title={p.name}
          className="grid place-items-center rounded-full border-2 border-card font-semibold text-white"
          style={{
            width: size,
            height: size,
            marginRight: -size * 0.3,
            background: p.accent,
            fontSize: Math.max(9, Math.round(size * 0.42)),
          }}
        >
          {p.initials}
        </span>
      ))}
    </div>
  );
}
