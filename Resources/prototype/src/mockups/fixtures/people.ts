/**
 * people — one cast across every composition.
 *
 * The set reads as one product with a continuous story rather than ten
 * unrelated demos, so the same faces recur. Each person owns one accent, used
 * for their cursor, their name tag and their avatar fallback everywhere they
 * appear; the colours are drawn from the palette the prototype already uses
 * for entity avatars.
 */
import type { Person } from '../core/types';

export const people = {
  sanne: { id: 'sanne', name: 'Sanne Vermeer', initials: 'SV', accent: '#0891B2', role: 'Lead' },
  luca: { id: 'luca', name: 'Luca Bertani', initials: 'LB', accent: '#D97706', role: 'Member' },
  nadia: { id: 'nadia', name: 'Nadia Haddad', initials: 'NH', accent: '#7C3AED', role: 'Lead' },
  ines: { id: 'ines', name: 'Ines Duarte', initials: 'ID', accent: '#059669', role: 'Member' },
  tomasz: { id: 'tomasz', name: 'Tomasz Kowalski', initials: 'TK', accent: '#2563EB', role: 'Lead' },
  marek: { id: 'marek', name: 'Marek Nowak', initials: 'MN', accent: '#DB2777', role: 'Member' },
} satisfies Record<string, Person>;

export const cast = Object.values(people);
