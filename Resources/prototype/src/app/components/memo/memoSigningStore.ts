/**
 * memoSigningStore — the signing state the whole app reads.
 *
 * Signing shows up in four places at once: the feed card, the post dialog, the
 * memo itself, and the user's security settings. They all have to agree — sign
 * a memo and the byline count has to move; unlink the Cleverbase account in
 * settings and every Sign button has to grey out. So the state lives outside
 * React and the surfaces subscribe to it, rather than each holding a copy.
 *
 * `useSyncExternalStore` rather than a context: nothing here needs a provider,
 * and a provider would mean touching the root layout to demonstrate a feature
 * that is still a proposal.
 */
import { useSyncExternalStore } from "react";
import { DEMO_SIGNERS, type SignedCopy, type Signer } from "./signingData";

interface SigningState {
  /** Space-level switch. Off hides the Sign button entirely; on always shows it. */
  signingEnabled: boolean;
  /** Whether the current user has a Cleverbase account linked to Alkemio. */
  cleverbaseLinked: boolean;
  /** Signed copies, keyed by memo (post) id. */
  copies: Record<string, SignedCopy[]>;
}

/** Who is driving the prototype. */
export const CURRENT_USER: Signer = DEMO_SIGNERS.jeroen;

/**
 * kb-03 starts with two copies so the byline affordance is visible without
 * anyone having to sign first; every other memo starts empty, which is the
 * state most memos are actually in.
 */
let state: SigningState = {
  signingEnabled: true,
  cleverbaseLinked: true,
  copies: {
    "kb-03": [
      {
        id: "kb-03-b",
        signer: DEMO_SIGNERS.neil,
        signedAt: "2026-09-11T16:57:50",
        pages: 1,
        fileSize: "84 KB",
        verification: "verified",
        editsSince: 0,
        excerpt: [92, 84, 90, 66, 0, 88, 80],
      },
      {
        id: "kb-03-a",
        signer: DEMO_SIGNERS.robin,
        signedAt: "2026-09-09T11:12:04",
        pages: 1,
        fileSize: "81 KB",
        verification: "verified",
        editsSince: 3,
        excerpt: [90, 82, 74, 0, 86, 78],
      },
    ],
  },
};

const listeners = new Set<() => void>();

function emit(next: SigningState) {
  state = next;
  listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useMemoSigning(): SigningState {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

/** Signed copies for one memo, newest first. */
export function useSignedCopies(memoId: string | undefined): SignedCopy[] {
  const { copies } = useMemoSigning();
  return memoId ? (copies[memoId] ?? []) : [];
}

export function setCleverbaseLinked(linked: boolean) {
  emit({ ...state, cleverbaseLinked: linked });
}

export function setSigningEnabled(enabled: boolean) {
  emit({ ...state, signingEnabled: enabled });
}

/** Faux page lines, so no two thumbnails look identical. */
function excerptFor(seed: number): number[] {
  const widths = [96, 88, 92, 70, 0, 94, 86, 62, 78];
  return widths.slice(0, 6 + (seed % 3)).map((w, i) => (w === 0 ? 0 : w - ((seed + i) % 7)));
}

/**
 * What coming back from Cleverbase does: a new copy at the top, signed by the
 * current user, and every existing copy gains an edit of distance from the live
 * memo — the thing the whole feature is trying to make legible.
 */
export function signMemo(memoId: string): SignedCopy {
  const existing = state.copies[memoId] ?? [];
  const copy: SignedCopy = {
    id: `${memoId}-${Date.now()}`,
    signer: CURRENT_USER,
    signedAt: new Date().toISOString(),
    pages: 1,
    fileSize: "84 KB",
    verification: "verified",
    editsSince: 0,
    excerpt: excerptFor(existing.length),
  };
  emit({
    ...state,
    copies: { ...state.copies, [memoId]: [copy, ...existing] },
  });
  return copy;
}
