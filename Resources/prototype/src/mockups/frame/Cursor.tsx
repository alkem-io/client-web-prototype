/**
 * Cursor — a named remote cursor, in its person's accent.
 *
 * Whiteboards, documents and memos only. The validator enforces that; this
 * component just draws it, and takes its colour from the person so the same
 * face is the same colour in every composition.
 */
import type { Person } from '../core/types';

export function Cursor({
  person,
  at,
  label
}: {
  person: Person;
  at: [number, number];
  label?: string;
}) {
  return (
    <div
      style={{ position: 'absolute', left: at[0], top: at[1], pointerEvents: 'none' }}
      data-mockup-cursor={person.id}
    >
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none" aria-hidden>
        <path
          d="M1 1L1 15.5L4.8 12.1L7.4 18L10.2 16.8L7.6 11L12.5 10.6L1 1Z"
          fill={person.accent}
          stroke="#fff"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="absolute whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-semibold text-white"
        style={{ left: 13, top: 15, background: person.accent }}
      >
        {label ?? person.name.split(' ')[0]}
      </span>
    </div>
  );
}
