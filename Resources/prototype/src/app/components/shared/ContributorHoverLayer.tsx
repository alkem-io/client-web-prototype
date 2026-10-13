/**
 * ContributorHoverLayer — shows the person, organisation or virtual
 * contributor hover card wherever one of them appears, including inside
 * production's components. A temporary stand-in, not a proposal: the proposal
 * is `@/ahead/ProfileHoverCard`, `OrgHoverCard` and `VCHoverCard`.
 *
 * WHAT IT DOES
 * Rest the pointer on a contributor and their card opens: an avatar, a name, or
 * a link to their profile, in a post, a comment, a chat, a list, a dialog.
 * Most of those are drawn by production's components (comments, chat bubbles,
 * post cards, contributor lists), which have no place to put a hover card, so
 * a card could only ever appear on the handful of screens the prototype draws
 * itself.
 *
 * HOW
 * One listener on the page, like `useAnchorRouting`. When the pointer rests on
 * something, it works out who that is, in this order:
 *   1. a link to /user/…, /organization/… or /vc/… — the kind is in the link;
 *   2. an avatar — by its picture's description, or, when it has none (chat
 *      bubbles), by the one known name next to it, checked against the
 *      avatar's initials;
 *   3. a known name in the text under the pointer, also as part of a longer
 *      line ("Simone Rietmeijer on Thu, 03/07/2025").
 * Names come from `@/app/data/contributors`. An avatar or text that matches no
 * known name gets no card, which is what keeps spaces and posts from getting
 * one. The card is anchored to what was found; nothing in `src/crd/` is
 * changed or copied.
 *
 * Left alone: places that already have their own card (`data-contributor-card`,
 * set by the three cards), links that are a whole card already, typing fields,
 * menus and pickers, the profile you are already on, and touch screens. Add
 * `data-no-contributor-card` to anything else that should stay quiet.
 *
 * WHEN IT GOES
 * When production's components that show a contributor (`CommentItem`,
 * `ChatMessageBubble`, `ContributorCard`, `PostCard`, `ActivityItem`, …)
 * accept a hover card — a `renderContributor` slot or an `onContributorHover`
 * — pass the cards into those, delete this file and its line in `RootWrapper`.
 */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router';
import { OrgHoverCard } from '@/ahead/OrgHoverCard';
import { ProfileHoverCard } from '@/ahead/ProfileHoverCard';
import { VCHoverCard } from '@/ahead/VCHoverCard';
import {
  CONTRIBUTOR_NAMES,
  type Contributor,
  type ContributorKind,
  findContributorByName,
  findContributorBySlug,
  initialsOf,
  profileUrlOf,
} from '@/app/data/contributors';

const OPEN_DELAY = 300;
const CLOSE_DELAY = 150;
/** Longer than any name; keeps whole sentences out of a link's name. */
const MAX_NAME_LENGTH = 60;
/** How far up from an unlabelled avatar to look for its name. */
const CONTEXT_DEPTH = 4;
/** A profile link bigger than this is a whole card, which already shows the details. */
const MAX_LINK_HEIGHT = 72;

const PROFILE_PATH = /^\/(user|organization|vc)\/([^/?#]+)\/?$/;
const KIND_BY_SEGMENT: Record<string, ContributorKind> = { user: 'user', organization: 'org', vc: 'vc' };

const CARD = '[data-slot="hover-card-content"]';
const LEAVE_ALONE = [
  '[data-contributor-card]',
  '[data-no-contributor-card]',
  'input, textarea, select, [contenteditable="true"]',
  '[role="menuitem"], [role="option"], [role="combobox"]',
  '[aria-haspopup="menu"], [aria-haspopup="listbox"]',
].join(', ');

/**
 * What the card is placed against: an element, or a name inside a longer
 * piece of text (`start` is where the name begins in it; -1 for an element).
 */
type Anchor = { node: Node; start: number; rect: () => DOMRect };
type Hit = { anchor: Anchor; contributor: Contributor };

const onElement = (el: Element): Anchor => ({ node: el, start: -1, rect: () => el.getBoundingClientRect() });
const sameAnchor = (a: Anchor | null, b: Anchor | null) => !!a && !!b && a.node === b.node && a.start === b.start;

const shortText = (el: Element) => {
  const text = el.textContent?.trim() ?? '';
  return text.length > 0 && text.length <= MAX_NAME_LENGTH ? text : '';
};

/** A link's own text, without the initials of an avatar inside it. */
const linkText = (link: Element) => {
  const copy = link.cloneNode(true) as Element;
  for (const avatar of copy.querySelectorAll('[data-slot="avatar"]')) avatar.remove();
  return shortText(copy);
};

/** "Sarah Chen (Person)" → "Sarah Chen". */
const withoutTypeNote = (label: string | null | undefined) => label?.replace(/\s*\([^)]*\)\s*$/, '').trim() ?? '';

const titleFromSlug = (slug: string) =>
  slug
    .split('-')
    .filter(Boolean)
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join(' ');

/** The card shows the picture that was hovered; the directory's is only for when there is none. */
const withPicture = (c: Contributor, src: string | undefined): Contributor => (src ? { ...c, avatarUrl: src } : c);

/** An avatar without a description: find the one known name beside it. */
function nameNear(avatar: Element): Contributor | undefined {
  const fallback = avatar.querySelector('[data-slot="avatar-fallback"]')?.textContent?.trim().toUpperCase();
  let el = avatar.parentElement;
  for (let depth = 0; el && depth < CONTEXT_DEPTH; depth++, el = el.parentElement) {
    // Reached a list of several people: any name found here could be someone else's.
    if (el.querySelectorAll('[data-slot="avatar"]').length > 1) return undefined;
    const text = el.textContent?.toLowerCase() ?? '';
    const name = CONTRIBUTOR_NAMES.find(n => text.includes(n));
    if (!name) continue;
    const contributor = findContributorByName(name);
    if (contributor && (!fallback || initialsOf(contributor.name).startsWith(fallback))) return contributor;
    return undefined;
  }
  return undefined;
}

/** The picture beside a name: the only avatar close above it, if there is exactly one. */
function pictureNear(node: Node): string | undefined {
  let el = node.parentElement;
  for (let depth = 0; el && depth < CONTEXT_DEPTH; depth++, el = el.parentElement) {
    const avatars = el.querySelectorAll('[data-slot="avatar"]');
    if (avatars.length > 1) return undefined;
    if (avatars.length === 1) return avatars[0].querySelector('img')?.src;
  }
  return undefined;
}

const isWordEdge = (text: string, index: number) => index < 0 || index >= text.length || !/[\p{L}\p{N}]/u.test(text[index]);

/** A known name in the text under the pointer, e.g. "Simone Rietmeijer on Thu, 03/07/2025". */
function nameAtPoint(x: number, y: number): Hit | null {
  let node: Node | undefined;
  let offset = 0;
  const position = document.caretPositionFromPoint?.(x, y);
  if (position) {
    node = position.offsetNode;
    offset = position.offset;
  } else {
    const range = document.caretRangeFromPoint?.(x, y);
    node = range?.startContainer;
    offset = range?.startOffset ?? 0;
  }
  if (!(node instanceof Text)) return null;

  const text = node.data.toLowerCase();
  for (const name of CONTRIBUTOR_NAMES) {
    for (let i = text.indexOf(name); i !== -1; i = text.indexOf(name, i + 1)) {
      const end = i + name.length;
      if (offset < i || offset > end || !isWordEdge(text, i - 1) || !isWordEdge(text, end)) continue;
      const range = document.createRange();
      range.setStart(node, i);
      range.setEnd(node, end);
      // The caret lands on the nearest letter even when the pointer is beside the text.
      const onIt = [...range.getClientRects()].some(r => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom);
      const contributor = findContributorByName(name);
      return onIt && contributor
        ? {
            anchor: { node, start: i, rect: () => range.getBoundingClientRect() },
            contributor: withPicture(contributor, pictureNear(node)),
          }
        : null;
    }
  }
  return null;
}

function resolve(target: Element, x: number, y: number): Hit | null {
  if (target.closest(LEAVE_ALONE)) return null;

  // 1. A link to a profile.
  const link = target.closest('a[href]');
  if (link) {
    const url = new URL(link.getAttribute('href') ?? '', window.location.origin);
    const match = url.origin === window.location.origin ? PROFILE_PATH.exec(url.pathname) : null;
    if (match && match[2] !== 'me') {
      if (link.getBoundingClientRect().height > MAX_LINK_HEIGHT) return null;
      const kind = KIND_BY_SEGMENT[match[1]];
      const slug = decodeURIComponent(match[2]);
      const img = link.querySelector<HTMLImageElement>('[data-slot="avatar-image"], img');
      const hint = withoutTypeNote(link.getAttribute('aria-label')) || withoutTypeNote(img?.alt) || linkText(link);
      const byName = findContributorByName(hint);
      const contributor =
        findContributorBySlug(kind, slug) ??
        (byName?.kind === kind ? byName : undefined) ??
        { kind, slug, name: hint || titleFromSlug(slug) };
      return { anchor: onElement(link), contributor: withPicture(contributor, img?.src ?? pictureNear(link)) };
    }
  }

  // 2. An avatar.
  const avatar = target.closest('[data-slot="avatar"]');
  if (avatar) {
    const img = avatar.querySelector('img');
    const label = withoutTypeNote(img?.getAttribute('alt')) || withoutTypeNote(avatar.getAttribute('aria-label'));
    // A described avatar that is not a known contributor is a space, a post, a template…
    const contributor = label ? findContributorByName(label) : nameNear(avatar);
    return contributor ? { anchor: onElement(avatar), contributor: withPicture(contributor, img?.src) } : null;
  }

  // 3. A name in the text.
  return nameAtPoint(x, y);
}

type Shown = { id: number; contributor: Contributor; rect: DOMRect };

export function ContributorHoverLayer() {
  const [shown, setShown] = useState<Shown | null>(null);
  const { pathname } = useLocation();

  const shownAnchor = useRef<Anchor | null>(null);
  const pendingAnchor = useRef<Anchor | null>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const nextId = useRef(0);

  useEffect(() => {
    const cancelOpen = () => {
      window.clearTimeout(openTimer.current);
      pendingAnchor.current = null;
    };
    const cancelClose = () => {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = undefined;
    };
    const hide = () => {
      cancelOpen();
      cancelClose();
      shownAnchor.current = null;
      setShown(null);
    };
    const scheduleClose = () => {
      if (!shownAnchor.current || closeTimer.current !== undefined) return;
      closeTimer.current = window.setTimeout(hide, CLOSE_DELAY);
    };

    const check = (target: Element, x: number, y: number) => {
      if (target.closest(CARD) && shownAnchor.current) {
        cancelOpen();
        cancelClose();
        return;
      }

      let hit = resolve(target, x, y);
      if (hit && profileUrlOf(hit.contributor) === window.location.pathname) hit = null;

      if (hit && sameAnchor(hit.anchor, shownAnchor.current)) {
        cancelOpen();
        cancelClose();
        return;
      }
      if (hit && sameAnchor(hit.anchor, pendingAnchor.current)) return;

      cancelOpen();
      scheduleClose();
      if (!hit) return;

      const { anchor, contributor } = hit;
      pendingAnchor.current = anchor;
      openTimer.current = window.setTimeout(() => {
        pendingAnchor.current = null;
        if (!anchor.node.isConnected) return;
        cancelClose();
        shownAnchor.current = anchor;
        setShown({ id: ++nextId.current, contributor, rect: anchor.rect() });
      }, OPEN_DELAY);
    };

    // On every move, not only on entering an element: a name can be one part of a longer text.
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !(event.target instanceof Element)) return;
      const { target, clientX, clientY } = event;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => check(target, clientX, clientY));
    };

    const onLeavePage = (event: PointerEvent) => {
      if (event.relatedTarget) return;
      cancelOpen();
      scheduleClose();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest(CARD)) return;
      hide();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') hide();
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerout', onLeavePage);
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    // The card is placed where the anchor was; once the page moves, it is in the wrong place.
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
    return () => {
      hide();
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerout', onLeavePage);
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', hide, true);
      window.removeEventListener('resize', hide);
    };
  }, [pathname]);

  if (!shown) return null;

  const { id, contributor: c, rect } = shown;
  // Stands in for the hovered element, so the card is placed against it.
  const anchor = (
    <span
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        pointerEvents: 'none',
      }}
    />
  );
  const profileUrl = profileUrlOf(c);
  // Opening and closing is handled above; the card's own hover handling would fight it.
  const control = { open: true, onOpenChange: () => {} };

  const card =
    c.kind === 'user' ? (
      <ProfileHoverCard
        key={id}
        {...control}
        user={{
          name: c.name,
          avatarUrl: c.avatarUrl,
          initials: c.initials ?? initialsOf(c.name),
          location: c.location,
          bio: c.about,
          tags: c.tags,
          profileUrl: profileUrl,
        }}
      >
        {anchor}
      </ProfileHoverCard>
    ) : c.kind === 'org' ? (
      <OrgHoverCard
        key={id}
        {...control}
        org={{
          name: c.name,
          avatarUrl: c.avatarUrl,
          initials: c.initials ?? initialsOf(c.name),
          location: c.location,
          description: c.about,
          tags: c.tags,
          profileUrl: profileUrl,
        }}
      >
        {anchor}
      </OrgHoverCard>
    ) : (
      <VCHoverCard
        key={id}
        {...control}
        vc={{
          name: c.name,
          avatarUrl: c.avatarUrl,
          initials: c.initials ?? initialsOf(c.name),
          location: c.location,
          description: c.about,
          tags: c.tags,
          profileUrl: profileUrl,
        }}
      >
        {anchor}
      </VCHoverCard>
    );

  // On the page body, so `position: fixed` is measured against the window.
  return createPortal(card, document.body);
}
