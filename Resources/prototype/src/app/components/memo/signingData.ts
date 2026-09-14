/**
 * signingData — the shapes the memo signing screens work with, plus the
 * fixtures the exploration page runs on.
 *
 * Signing is a Cleverbase handoff: Alkemio renders the memo to a PDF, the user
 * identifies themselves at Cleverbase, and a *signed copy* comes back. The copy
 * is frozen; the memo is not. Every screen in this folder has to keep saying so,
 * because "signing" sounds like "locking" to most people and it is the single
 * thing users get wrong about the feature.
 */

export interface Signer {
  id: string;
  name: string;
  /** Optional portrait; the initials fallback is always populated. */
  avatar?: string;
  initials: string;
}

/**
 * A signed PDF is verified by re-hashing it against the signature embedded in
 * the file. `checking` is the transient state while that runs; `modified` means
 * the bytes no longer match — the one genuinely alarming outcome, so it is the
 * only one allowed to use destructive colour.
 */
export type VerificationState = "verified" | "checking" | "modified";

export interface SignedCopy {
  id: string;
  signer: Signer;
  /** ISO timestamp of the moment Cleverbase recorded the signature. */
  signedAt: string;
  pages: number;
  fileSize: string;
  verification: VerificationState;
  /**
   * Edits made to the memo after this copy was signed. Zero means the copy and
   * the live memo still read the same; anything above zero is why the "the memo
   * stays editable" line matters, so the card prints it.
   */
  editsSince: number;
  /** Faux body lines for the page thumbnail — widths in percent. */
  excerpt: number[];
}

export const DEMO_SIGNERS: Record<string, Signer> = {
  jeroen: {
    id: "u1",
    name: "Jeroen Nijkamp",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
    initials: "JN",
  },
  neil: {
    id: "u2",
    name: "Neil Smyth",
    avatar:
      "https://images.unsplash.com/photo-1651097681268-851acda33b18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
    initials: "NS",
  },
  robin: {
    id: "u3",
    name: "Robin Z. Tharakan",
    avatar:
      "https://images.unsplash.com/photo-1651634099348-e4c38cfaa6d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
    initials: "RT",
  },
};

export const DEMO_COPIES: SignedCopy[] = [
  {
    id: "c3",
    signer: DEMO_SIGNERS.robin,
    signedAt: "2026-09-11T17:04:20",
    pages: 1,
    fileSize: "84 KB",
    verification: "verified",
    editsSince: 0,
    excerpt: [96, 88, 92, 70, 0, 94, 86, 62],
  },
  {
    id: "c2",
    signer: DEMO_SIGNERS.neil,
    signedAt: "2026-09-11T16:57:50",
    pages: 1,
    fileSize: "84 KB",
    verification: "verified",
    editsSince: 2,
    excerpt: [92, 84, 90, 66, 0, 88, 80],
  },
  {
    id: "c1",
    signer: DEMO_SIGNERS.jeroen,
    signedAt: "2026-09-09T11:12:04",
    pages: 1,
    fileSize: "81 KB",
    verification: "verified",
    editsSince: 7,
    excerpt: [90, 82, 74, 0, 86, 78],
  },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * "11 September 2026 at 17:04" — the screenshot's "09/11/2026, 17:04:20" is a
 * machine timestamp: ambiguous day/month order for a platform used on both
 * sides of the Atlantic, and seconds nobody reads. Seconds survive only in the
 * detail line, where an auditor might actually want them.
 */
export function formatSignedAt(iso: string): string {
  const d = new Date(iso);
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} at ${time}`;
}

/** "Today at 17:04" where that reads better, falling back to the full date. */
export function formatSignedAtRelative(iso: string, now = new Date()): string {
  const d = new Date(iso);
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const sameDay = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameDay) return `Today at ${time}`;
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday at ${time}`;
  return formatSignedAt(iso);
}

/** Full precision, for the one line where an auditor wants it. */
export function formatSignedAtPrecise(iso: string): string {
  const d = new Date(iso);
  const time = d.toTimeString().slice(0, 8);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${time}`;
}

/** De-duplicated signers in list order, for avatar stacks. */
export function uniqueSigners(copies: SignedCopy[]): Signer[] {
  const seen = new Set<string>();
  return copies.reduce<Signer[]>((acc, copy) => {
    if (!seen.has(copy.signer.id)) {
      seen.add(copy.signer.id);
      acc.push(copy.signer);
    }
    return acc;
  }, []);
}

/** Where "you need a Cleverbase account" sends people. Placeholder URL. */
export const CLEVERBASE_DOCS_URL = "https://docs.alkemio.org/signing/cleverbase";
