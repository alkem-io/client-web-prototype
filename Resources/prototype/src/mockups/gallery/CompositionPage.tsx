/**
 * /mockups/:id — one composition, with the knobs.
 *
 * Overflow mode is the knob that gets turned most: the same composition ships
 * as a spill for a website hero and as a contained layout for a print
 * one-pager, where cards crossing the device edge fight the page grid.
 */
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { compositionById } from '../compositions';
import { MockupStage } from '../frame/MockupStage';
import type { Finding, OverflowMode, Surface } from '../core/types';

const MODES: OverflowMode[] = ['spill', 'contained', 'none'];

export default function CompositionPage() {
  const { id = '' } = useParams();
  const base = compositionById(id);
  const [mode, setMode] = useState<OverflowMode | null>(null);
  const [surface, setSurface] = useState<Surface | null>(null);
  const [showFindings, setShowFindings] = useState(true);
  const [findings, setFindings] = useState<Finding[]>([]);

  const composition = useMemo(() => {
    if (!base) return null;
    return {
      ...base,
      overflow: mode ?? base.overflow,
      surface: surface ?? base.surface,
    };
  }, [base, mode, surface]);

  if (!composition) {
    return (
      <div className="p-10">
        <p className="text-body">
          No composition <code>{id}</code>. <Link className="underline" to="/mockups">Back to the gallery</Link>.
        </p>
      </div>
    );
  }

  const errors = findings.filter(f => f.severity === 'error');
  const warns = findings.filter(f => f.severity === 'warn');

  return (
    <div className="min-h-screen bg-muted/40 px-8 py-10">
      <div className="mx-auto max-w-6xl">
        <Link className="text-caption text-muted-foreground underline" to="/mockups">
          ← all compositions
        </Link>
        <h1 className="mt-3 text-page-title">{composition.claim}</h1>
        {composition.story ? (
          <p className="mt-2 max-w-3xl text-body italic text-muted-foreground">
            {composition.story}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-caption text-muted-foreground">Overflow</span>
          {MODES.map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className="rounded-md border px-3 py-1 text-[12px] font-medium transition-colors"
              style={{
                borderColor: composition.overflow === m ? 'var(--primary)' : 'var(--border)',
                background: composition.overflow === m ? 'var(--primary)' : 'var(--card)',
                color:
                  composition.overflow === m ? 'var(--primary-foreground)' : 'var(--foreground)',
              }}
            >
              {m}
            </button>
          ))}

          {composition.template ? (
            <>
              <span className="ml-4 text-caption text-muted-foreground">Surface</span>
              {(['flat', 'photo'] as Surface[]).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSurface(s)}
                  className="rounded-md border px-3 py-1 text-[12px] font-medium"
                  style={{
                    borderColor: composition.surface === s ? 'var(--primary)' : 'var(--border)',
                    background: composition.surface === s ? 'var(--primary)' : 'var(--card)',
                    color:
                      composition.surface === s ? 'var(--primary-foreground)' : 'var(--foreground)',
                  }}
                >
                  {s}
                </button>
              ))}
            </>
          ) : null}

          <label className="ml-4 flex items-center gap-2 text-caption text-muted-foreground">
            <input
              type="checkbox"
              checked={showFindings}
              onChange={e => setShowFindings(e.target.checked)}
            />
            highlight findings
          </label>
        </div>

        <div className="mt-5 overflow-hidden rounded-md border border-border bg-background">
          <MockupStage
            key={`${composition.overflow}-${composition.surface}`}
            composition={composition}
            showFindings={showFindings}
            onValidated={setFindings}
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Validation
            </h2>
            {findings.length === 0 ? (
              <p className="mt-3 text-body text-muted-foreground">Nothing to report.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {[...errors, ...warns].map((f, i) => (
                  <li key={i} className="text-caption leading-relaxed">
                    <span
                      className="mr-2 rounded px-1.5 py-0.5 font-mono text-[10px] uppercase"
                      style={{
                        background:
                          f.severity === 'error' ? 'rgba(220,38,38,.12)' : 'rgba(217,119,6,.14)',
                        color: f.severity === 'error' ? '#B91C1C' : '#92400E',
                      }}
                    >
                      {f.rule}
                    </span>
                    {f.message}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Components used
            </h2>
            <ul className="mt-3 space-y-1 font-mono text-[11px] text-muted-foreground">
              {composition.uses.map(u => (
                <li key={u}>{u}</li>
              ))}
            </ul>
            {composition.notes ? (
              <p className="mt-4 text-caption leading-relaxed text-muted-foreground">
                {composition.notes}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
