/**
 * MockupStage — the design canvas.
 *
 * Fixed size, scaled to fit its container. A composition never reflows: it is
 * an image, so the same layout has to hold at 2400px and at 400px. Everything
 * the exporter and the checker need is on the DOM by the time `onValidated`
 * fires, which is also when fonts have settled — measuring text before that
 * produces occlusion findings that vanish on reload.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MemoryRouter } from 'react-router';
import { TooltipProvider } from '@/app/components/ui/tooltip';
import type { Composition, Finding } from '../core/types';
import { placeCard, toStyle } from '../core/layout';
import { validate } from '../core/validate';
import { LaptopFrame } from './LaptopFrame';
import { PhoneFrame } from './PhoneFrame';
import { SpillCard } from './SpillCard';
import { Cursor } from './Cursor';
import { PhotoSurface } from './PhotoSurface';
import { templateById } from '../templates/registry';

declare global {
  interface Window {
    __mockup?: Record<string, { findings: Finding[]; ready: boolean }>;
  }
}

export function MockupStage({
  composition,
  fit = true,
  scale: fixedScale,
  showFindings = false,
  onValidated,
}: {
  composition: Composition;
  fit?: boolean;
  scale?: number;
  showFindings?: boolean;
  onValidated?: (f: Finding[]) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(fixedScale ?? 1);
  const [findings, setFindings] = useState<Finding[]>([]);

  const { canvas } = composition;

  useLayoutEffect(() => {
    if (!fit || fixedScale != null) {
      setScale(fixedScale ?? 1);
      return;
    }
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / canvas.width);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fit, fixedScale, canvas.width]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      // Text measurement before the webfont lands reports the fallback's ink.
      if (document.fonts?.ready) await document.fonts.ready;
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (cancelled || !stageRef.current) return;
      const found = validate({ stage: stageRef.current, composition, scale });
      setFindings(found);
      onValidated?.(found);
      window.__mockup = window.__mockup ?? {};
      window.__mockup[composition.id] = { findings: found, ready: true };
    };
    void run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [composition, scale]);

  const template = composition.template ? templateById(composition.template) : undefined;
  const usePhoto = composition.surface === 'photo' && template;

  const cardsVisible = composition.overflow !== 'none';

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${canvas.width} / ${canvas.height}`,
        overflow: 'hidden',
      }}
    >
      <TooltipProvider delayDuration={0}>
        <MemoryRouter initialEntries={['/space/zuidplein-2030']}>
          <div
            ref={stageRef}
            data-mockup-stage={composition.id}
            style={{
              position: 'relative',
              width: canvas.width,
              height: canvas.height,
              transformOrigin: 'top left',
              transform: `scale(${scale})`,
            }}
          >
            {usePhoto ? (
              <PhotoSurface
                template={template}
                screens={Object.fromEntries(
                  composition.devices.map(d => [d.slot ?? d.id, d.screen]),
                )}
              />
            ) : (
              composition.devices.map(device =>
                device.kind === 'laptop' ? (
                  <LaptopFrame key={device.id} id={device.id} at={device.at!}>
                    {device.screen}
                  </LaptopFrame>
                ) : (
                  <PhoneFrame key={device.id} id={device.id} at={device.at!}>
                    {device.screen}
                  </PhoneFrame>
                ),
              )
            )}

            {cardsVisible &&
              composition.cards.map(card => {
                const device =
                  composition.devices.find(d => d.id === card.from) ?? composition.devices[0];
                const placement = placeCard(card, device.at!, canvas, composition.overflow);
                return (
                  <SpillCard
                    key={card.id}
                    id={card.id}
                    bare={card.bare}
                    style={toStyle(placement)}
                  >
                    {card.node}
                  </SpillCard>
                );
              })}

            {composition.cursors.map((c, i) => (
              <Cursor key={`${c.person.id}-${i}`} person={c.person} at={c.at} label={c.label} />
            ))}

            {showFindings &&
              findings
                .filter(f => f.rect)
                .map((f, i) => (
                  <div
                    key={i}
                    title={f.message}
                    style={{
                      position: 'absolute',
                      left: f.rect!.x,
                      top: f.rect!.y,
                      width: f.rect!.width,
                      height: f.rect!.height,
                      outline: `2px solid ${f.severity === 'error' ? '#DC2626' : '#D97706'}`,
                      background:
                        f.severity === 'error' ? 'rgba(220,38,38,.14)' : 'rgba(217,119,6,.12)',
                      pointerEvents: 'none',
                    }}
                  />
                ))}
          </div>
        </MemoryRouter>
      </TooltipProvider>
    </div>
  );
}
