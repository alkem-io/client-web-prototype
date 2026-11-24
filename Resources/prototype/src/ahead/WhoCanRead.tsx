import { ChevronDown, Globe, Lock, type LucideIcon, User, Users } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/crd/lib/utils';
import { Badge } from '@/crd/primitives/badge';
import { Button } from '@/crd/primitives/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/crd/primitives/collapsible';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/crd/primitives/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/crd/primitives/tooltip';

/**
 * WhoCanRead — members can tell who reads what they post (client-web#7730).
 *
 * WHAT PRODUCTION WOULD GAIN
 * Inside a space, nothing says whether what you write is open to the whole
 * internet or stays among members. Four places now answer it, in the same
 * words, for members and admins only:
 *  - `WhoCanReadBadge`: an icon next to the space or subspace name, on every
 *    tab. Hover, focus or tap gives one sentence and "What does this mean?",
 *    which opens About at the section below, unfolded.
 *  - `WhoCanReadWelcomeDialog`: shown once, the first time someone visits as a
 *    member, however they became one.
 *  - `WhoCanReadAboutSection`: "Who can see what" in About, folded by default.
 *  - `WhoCanReadListIcon`: the same three icons and sentence in the sidebar's
 *    list of subspaces. Non-members keep today's lock on private subspaces.
 *
 * THE RULE
 * A subspace's audience depends on every space above it, so the label says who
 * can actually read, not what the subspace's own setting is called:
 *  - Public: it is public and so is everything above it.
 *  - Members only: it is public, but a space above it is private.
 *  - Private: it is private itself.
 *
 * Copy uses only "Public", "Private", "Members only" and sentences about who
 * can read. "Visibility" is avoided: it already means something else here
 * (archived, demo and inactive spaces; draft and published posts).
 *
 * WHAT PRODUCTION NEEDS TO ADD
 *  - A slot beside the title in `SpaceHeader` and `SubspaceHeader`.
 *  - In `SubspacesSection`, an icon per row instead of `isPrivate`.
 *  - A slot in `SpaceAboutView`, after the space-info panel, and a way to open
 *    About with that section unfolded.
 *  - A server-side record that a member has seen the welcome dialog.
 *  - Translations: these strings live here until then.
 *
 * TO CONFIRM WITH DEVELOPMENT
 *  - Who exactly can see in without being a member (the footnote).
 *  - Whether profiles really are members-only: a space setting controls
 *    whether non-members see the member list.
 */

export type SpaceAccess = {
  name: string;
  isPrivate: boolean;
  /** The space or subspace directly above; absent on a space. */
  parent?: SpaceAccess;
};

type AudienceKind = 'public' | 'private' | 'membersOnly';

export type Audience = {
  kind: AudienceKind;
  label: string;
  /** The hover sentence. */
  sentence: string;
  /** The answer in the welcome dialog and About. */
  short: string;
  /** Who can see in without being a member; empty when anyone can. */
  footnote?: string;
};

const ICONS: Record<AudienceKind, LucideIcon> = { public: Globe, private: Lock, membersOnly: Users };
const LABELS: Record<AudienceKind, string> = { public: 'Public', private: 'Private', membersOnly: 'Members only' };

const nearestPrivateAbove = (access: SpaceAccess): SpaceAccess | undefined =>
  access.parent && (access.parent.isPrivate ? access.parent : nearestPrivateAbove(access.parent));

export function resolveAudience(access: SpaceAccess): Audience {
  const { name, isPrivate, parent } = access;
  const privateAbove = nearestPrivateAbove(access);
  const kind: AudienceKind = isPrivate ? 'private' : privateAbove ? 'membersOnly' : 'public';
  const label = LABELS[kind];

  if (kind === 'public') {
    return {
      kind,
      label,
      sentence: "Public. Anyone, including people who aren't signed in, can read what's posted here.",
      short: "Anyone, including people who aren't signed in",
    };
  }

  const footnote = parent
    ? `Admins of ${parent.name}, and the organisation that hosts it, can also see everything here.`
    : `The organisation that hosts ${name} can also see everything here.`;

  if (kind === 'membersOnly') {
    const short = `Members of ${name} and of ${privateAbove?.name}`;
    return { kind, label, sentence: `Members only. ${short} can read what's posted here.`, short, footnote };
  }

  const short = `Only members of ${name}`;
  // Only true when everything above is public, so nothing is claimed otherwise.
  const contrast = parent && !privateAbove ? `, even though ${parent.name} is public` : '';
  return { kind, label, sentence: `Private. ${short} can read what's posted here${contrast}.`, short, footnote };
}

/** The icon badge next to a space or subspace name. */
export function WhoCanReadBadge({
  audience,
  onWhatDoesThisMean,
}: {
  audience: Audience;
  onWhatDoesThisMean: () => void;
}) {
  const Icon = ICONS[audience.kind];
  const [open, setOpen] = useState(false);
  const badgeRef = useRef<HTMLButtonElement>(null);
  const linkRef = useRef<HTMLButtonElement>(null);
  // Set while the keyboard is on the link inside the tooltip, so that leaving
  // the badge for it does not close what it is in.
  const inTooltip = useRef(false);

  return (
    <Tooltip open={open} onOpenChange={next => (next || !inTooltip.current) && setOpen(next)}>
      <TooltipTrigger asChild={true}>
        <Badge
          asChild={true}
          variant="outline"
          className="relative rounded-full p-1 text-muted-foreground cursor-pointer overflow-visible hover:text-foreground focus-visible:outline-none focus-visible:ring-ring [&>svg]:size-3.5"
        >
          <button
            ref={badgeRef}
            type="button"
            aria-label={audience.label}
            // A tooltip normally closes on press; here a tap is how touch opens it.
            onPointerDown={e => e.preventDefault()}
            onClick={e => {
              e.preventDefault();
              setOpen(true);
            }}
            // Only a visible keyboard focus opens it, not focus handed back by a closing dialog.
            onFocus={e => !e.currentTarget.matches(':focus-visible') && e.preventDefault()}
            onKeyDown={e => {
              if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'ArrowDown') return;
              e.preventDefault();
              setOpen(true);
              requestAnimationFrame(() => {
                inTooltip.current = true;
                linkRef.current?.focus();
              });
            }}
          >
            <Icon aria-hidden="true" />
          </button>
        </Badge>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="start"
        alignOffset={-8}
        sideOffset={2}
        collisionPadding={16}
        aria-label={audience.sentence}
        className="max-w-80 px-3 py-2.5 text-pretty"
        onEscapeKeyDown={() => {
          inTooltip.current = false;
          badgeRef.current?.focus();
        }}
      >
        <p>{audience.sentence}</p>
        <button
          ref={linkRef}
          type="button"
          className="mt-1.5 rounded-sm text-caption font-semibold underline underline-offset-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
          onBlur={() => {
            inTooltip.current = false;
            setOpen(false);
          }}
          onClick={() => {
            inTooltip.current = false;
            setOpen(false);
            onWhatDoesThisMean();
          }}
        >
          What does this mean?
        </button>
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * The same icon on a row of the subspace list. The row itself is a link, so the
 * icon is not a second thing to tab to: the sentence also opens when the row
 * gets keyboard focus, and describes the row to screen readers.
 */
export function WhoCanReadListIcon({ audience }: { audience: Audience }) {
  const Icon = ICONS[audience.kind];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const sentenceId = useId();

  useEffect(() => {
    const link = ref.current?.closest('a');
    if (!link) return;
    const show = () => link.matches(':focus-visible') && setOpen(true);
    const hide = () => setOpen(false);
    link.addEventListener('focus', show);
    link.addEventListener('blur', hide);
    link.setAttribute('aria-describedby', sentenceId);
    return () => {
      link.removeEventListener('focus', show);
      link.removeEventListener('blur', hide);
      link.removeAttribute('aria-describedby');
    };
  }, [sentenceId]);

  return (
    <>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild={true}>
          <span ref={ref} className="inline-flex shrink-0 p-1 text-muted-foreground">
            <Icon className="size-3.5" aria-hidden="true" />
            <span className="sr-only">{audience.label}</span>
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="end"
          sideOffset={4}
          collisionPadding={16}
          className="max-w-64 px-3 py-2 text-pretty"
        >
          {audience.sentence}
        </TooltipContent>
      </Tooltip>
      <span id={sentenceId} hidden={true}>
        {audience.sentence}
      </span>
    </>
  );
}

/** Today's lock, for people who are not members. Same markup as `SubspacesSection`. */
export function PrivateLockIcon() {
  return (
    <span className="shrink-0 p-1 text-muted-foreground">
      <Lock className="size-3.5" aria-hidden="true" />
      <span className="sr-only">Private</span>
    </span>
  );
}

function Fact({ icon: Icon, question, answer }: { icon: LucideIcon; question: string; answer: string }) {
  return (
    <div className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 border-b border-border py-3">
      <dt className="contents text-caption text-muted-foreground">
        <span
          className="row-span-2 flex size-7 items-center justify-center rounded-full bg-muted text-foreground"
          aria-hidden="true"
        >
          <Icon className="size-3.5" />
        </span>
        <span>{question}</span>
      </dt>
      <dd className="text-body-emphasis text-foreground">{answer}</dd>
    </div>
  );
}

function Facts({
  audience,
  postsQuestion,
  profilesQuestion,
}: {
  audience: Audience;
  postsQuestion: string;
  profilesQuestion: string;
}) {
  return (
    <>
      <dl className="border-t border-border">
        <Fact icon={ICONS[audience.kind]} question={postsQuestion} answer={audience.short} />
        <Fact icon={User} question={profilesQuestion} answer="Other members of this space" />
      </dl>
      {audience.footnote && <p className="pt-2.5 text-caption text-muted-foreground">{audience.footnote}</p>}
    </>
  );
}

/** Shown once, the first time someone visits as a member. */
export function WhoCanReadWelcomeDialog({
  open,
  onOpenChange,
  spaceName,
  audience,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceName: string;
  audience: Audience;
}) {
  const Icon = ICONS[audience.kind];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl" closeLabel="Close">
        <DialogHeader className="border-b border-border px-5 py-4 pr-12">
          <DialogTitle className="text-subsection-title">Welcome to {spaceName}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
          <DialogDescription className="mb-3 text-body text-muted-foreground">
            You're now a member. Before you post, here's who will see it.
          </DialogDescription>
          <Facts
            audience={audience}
            postsQuestion="Who can read what you post"
            profilesQuestion="Who can see your profile"
          />
        </div>
        <DialogFooter className="flex-col items-start gap-3 border-t border-border bg-muted/35 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-1.5 text-caption text-muted-foreground">
            Find this again under
            <Badge variant="outline" className="rounded-full p-1 text-muted-foreground [&>svg]:size-3.5">
              <Icon aria-hidden="true" />
              <span className="sr-only">{audience.label}</span>
            </Badge>
            next to the name
          </p>
          <Button className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** "Who can see what" in About: folded, unless opened from the badge. */
export function WhoCanReadAboutSection({
  audience,
  open,
  onOpenChange,
}: {
  audience: Audience;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className="rounded-lg border border-border bg-card">
      <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
        <h3 className="text-card-title text-foreground">Who can see what</h3>
        <ChevronDown
          className={cn('size-4 text-muted-foreground transition-transform motion-reduce:transition-none', open && 'rotate-180')}
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-5 pb-5">
        <Facts
          audience={audience}
          postsQuestion="Who can read what's posted here"
          profilesQuestion="Who can see members' profiles"
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
