/**
 * /mockups — every composition, its claim, and whether it passes.
 *
 * The gallery is the review surface: a composition that validates clean here
 * is one `mockup:build` away from being an image someone can put on a slide.
 */
import { useState } from 'react';
import { Link } from 'react-router';
import { allCompositions } from '../compositions';
import { MockupStage } from '../frame/MockupStage';
import type { Finding } from '../core/types';

export default function GalleryPage() {
  const compositions = allCompositions();
  const [status, setStatus] = useState<Record<string, Finding[]>>({});

  return (
    <div className="min-h-screen bg-muted/40 px-8 py-10">
      <header className="mx-auto max-w-6xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Alkemio · mockup generator
        </p>
        <h1 className="mt-2 text-page-title">Compositions</h1>
        <p className="mt-2 max-w-2xl text-body text-muted-foreground">
          Built from the platform's own components. Every image below is generated from a
          declarative file — change the product and regenerate, don't redraw.
        </p>
      </header>

      <div className="mx-auto mt-10 grid max-w-6xl gap-8">
        {compositions.map(c => {
          const findings = status[c.id] ?? [];
          const errors = findings.filter(f => f.severity === 'error').length;
          const warns = findings.filter(f => f.severity === 'warn').length;
          return (
            <section key={c.id} className="rounded-lg border border-border bg-card p-6">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-mono text-[12px] text-muted-foreground">{c.id}</span>
                <h2 className="text-subsection-title">{c.claim}</h2>
                <span
                  className="ml-auto rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                  style={{
                    background: errors ? 'rgba(220,38,38,.10)' : 'rgba(22,163,74,.10)',
                    color: errors ? '#B91C1C' : '#15803D'
                  }}
                >
                  {errors ? `${errors} error${errors > 1 ? 's' : ''}` : 'passes'}
                  {warns ? ` · ${warns} warn` : ''}
                </span>
              </div>

              {c.story ? (
                <p className="mt-2 max-w-3xl text-caption italic text-muted-foreground">
                  {c.story}
                </p>
              ) : null}

              <div className="mt-5 overflow-hidden rounded-md border border-border bg-background">
                <MockupStage
                  composition={c}
                  onValidated={f => setStatus(s => (s[c.id] ? s : { ...s, [c.id]: f }))}
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                <span>{c.canvas.width}×{c.canvas.height}</span>
                <span>{c.devices.map(d => d.kind).join(' + ')}</span>
                <span>{c.cards.length} cards</span>
                <span>overflow: {c.overflow}</span>
                <span>{c.cursors.length} cursors</span>
                <Link className="ml-auto underline" to={`/mockups/${c.id}`}>
                  open →
                </Link>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
