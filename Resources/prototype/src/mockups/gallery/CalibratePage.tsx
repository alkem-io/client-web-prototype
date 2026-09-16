/**
 * /mockups/calibrate — teach the generator where a photograph's screens are.
 *
 * Load a plate, drag the four handles onto the corners of each screen, copy
 * the emitted block into templates/registry.ts. From then on any composition
 * can render onto that photograph with `surface: 'photo'`.
 *
 * Corners are stored in image pixels, so the calibration survives the preview
 * being any size.
 */
import { useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import type { Point, Quad } from '../core/homography';
import { quadToMatrix3d } from '../core/homography';

type Slot = {
  id: string;
  kind: 'laptop' | 'phone';
  width: number;
  height: number;
  quad: Quad;
};

const CORNER_NAMES = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];

const newSlot = (id: string, kind: Slot['kind'], w: number, h: number, box: Quad): Slot => ({
  id,
  kind,
  width: w,
  height: h,
  quad: box,
});

export default function CalibratePage() {
  const [src, setSrc] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 1600, height: 900 });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState<{ slot: number; corner: number } | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const onFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setSize({ width: img.naturalWidth, height: img.naturalHeight });
      setSrc(url);
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      setSlots([
        newSlot('laptop', 'laptop', 1440, 900, [
          [w * 0.18, h * 0.14],
          [w * 0.62, h * 0.14],
          [w * 0.62, h * 0.62],
          [w * 0.18, h * 0.62],
        ]),
      ]);
    };
    img.src = url;
  };

  const scale = useCallback(() => {
    const el = boxRef.current;
    return el ? el.clientWidth / size.width : 1;
  }, [size.width]);

  const onMove = (e: React.MouseEvent) => {
    if (!drag || !boxRef.current) return;
    const r = boxRef.current.getBoundingClientRect();
    const s = scale();
    const p: Point = [(e.clientX - r.left) / s, (e.clientY - r.top) / s];
    setSlots(prev =>
      prev.map((slot, i) => {
        if (i !== drag.slot) return slot;
        const quad = [...slot.quad] as Quad;
        quad[drag.corner] = [Math.round(p[0]), Math.round(p[1])];
        return { ...slot, quad };
      }),
    );
  };

  const emitted = useMemo(
    () =>
      [
        '{',
        `  id: 'my-template',`,
        `  label: 'Describe the plate',`,
        `  image: '/mockup-templates/FILENAME',`,
        `  canvas: { width: ${size.width}, height: ${size.height} },`,
        '  slots: [',
        ...slots.map(
          s =>
            `    { id: '${s.id}', kind: '${s.kind}', width: ${s.width}, height: ${s.height},\n` +
            `      quad: [${s.quad.map(p => `[${p[0]}, ${p[1]}]`).join(', ')}] },`,
        ),
        '  ],',
        '},',
      ].join('\n'),
    [slots, size],
  );

  return (
    <div className="min-h-screen bg-muted/40 px-8 py-10">
      <div className="mx-auto max-w-6xl">
        <Link className="text-caption text-muted-foreground underline" to="/mockups">
          ← all compositions
        </Link>
        <h1 className="mt-3 text-page-title">Calibrate a template</h1>
        <p className="mt-2 max-w-2xl text-body text-muted-foreground">
          Load a photographed plate and drag each handle onto the matching corner of the screen,
          clockwise from its top-left. The preview shows a grid mapped through the transform — when
          the grid sits flat on the screen, the calibration is right.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept="image/*"
            className="text-caption"
            onChange={e => e.target.files?.[0] && onFile(e.target.files[0])}
          />
          {slots.length > 0 ? (
            <>
              <span className="text-caption text-muted-foreground">Editing</span>
              {slots.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className="rounded-md border px-3 py-1 text-[12px]"
                  style={{
                    borderColor: active === i ? 'var(--primary)' : 'var(--border)',
                    background: active === i ? 'var(--primary)' : 'var(--card)',
                    color: active === i ? 'var(--primary-foreground)' : 'var(--foreground)',
                  }}
                >
                  {s.id}
                </button>
              ))}
              <button
                type="button"
                className="rounded-md border border-border bg-card px-3 py-1 text-[12px]"
                onClick={() =>
                  setSlots(prev => [
                    ...prev,
                    newSlot(`slot-${prev.length + 1}`, 'phone', 390, 844, [
                      [size.width * 0.7, size.height * 0.3],
                      [size.width * 0.85, size.height * 0.3],
                      [size.width * 0.85, size.height * 0.8],
                      [size.width * 0.7, size.height * 0.8],
                    ]),
                  ])
                }
              >
                + add screen
              </button>
            </>
          ) : null}
        </div>

        {src ? (
          <div
            ref={boxRef}
            className="relative mt-6 select-none overflow-hidden rounded-md border border-border bg-card"
            style={{ aspectRatio: `${size.width} / ${size.height}` }}
            onMouseMove={onMove}
            onMouseUp={() => setDrag(null)}
            onMouseLeave={() => setDrag(null)}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                width: size.width,
                height: size.height,
                transformOrigin: 'top left',
                transform: `scale(${scale()})`,
              }}
            >
              <img src={src} alt="" width={size.width} height={size.height} draggable={false} />

              {slots.map((slot, si) => {
                const m = quadToMatrix3d(slot.width, slot.height, slot.quad);
                return (
                  <div key={slot.id}>
                    {m ? (
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          width: slot.width,
                          height: slot.height,
                          transform: m,
                          transformOrigin: '0 0',
                          backgroundImage:
                            'linear-gradient(rgba(29,56,74,.55) 1px, transparent 1px), linear-gradient(90deg, rgba(29,56,74,.55) 1px, transparent 1px)',
                          backgroundSize: `${slot.width / 8}px ${slot.height / 8}px`,
                          outline: '2px solid rgba(29,56,74,.8)',
                          opacity: si === active ? 0.95 : 0.4,
                        }}
                      />
                    ) : null}
                    {slot.quad.map((p, ci) => (
                      <button
                        key={ci}
                        type="button"
                        title={`${slot.id} ${CORNER_NAMES[ci]}`}
                        onMouseDown={() => {
                          setActive(si);
                          setDrag({ slot: si, corner: ci });
                        }}
                        style={{
                          position: 'absolute',
                          left: p[0] - 11,
                          top: p[1] - 11,
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          border: '2px solid #fff',
                          background: si === active ? '#DC2626' : '#64748B',
                          boxShadow: '0 2px 6px rgba(0,0,0,.4)',
                          cursor: 'grab',
                        }}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-md border border-dashed border-border p-12 text-center text-body text-muted-foreground">
            Load a plate to begin. Put the file in <code>public/mockup-templates/</code> too, so the
            template can reference it.
          </div>
        )}

        {slots.length > 0 ? (
          <>
            <h2 className="mt-8 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Paste into templates/registry.ts
            </h2>
            <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-card p-4 font-mono text-[11px] leading-relaxed">
              {emitted}
            </pre>
          </>
        ) : null}
      </div>
    </div>
  );
}
