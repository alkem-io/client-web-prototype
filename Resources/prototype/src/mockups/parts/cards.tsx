/**
 * cards — the spill-card contents that recur across compositions.
 *
 * Built from the platform's own ui primitives (Card, Avatar, Badge, Separator)
 * so type, radius and colour come from the design system rather than from here.
 * Two of these render features that exist but have no renderer in the repo yet
 * — the poll tally and the innovation-flow list. Both are marked in
 * COMPONENT-MAP.md as mockup-local so nobody mistakes them for shipped UI.
 */
import { BarChart3, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Separator } from '@/app/components/ui/separator';
import { CardLabel } from '../frame/SpillCard';
import { AvatarStack } from '../core/density';
import type { Person } from '../core/types';

export function PersonAvatar({ person, size = 26 }: { person: Person; size?: number }) {
  return (
    <Avatar style={{ width: size, height: size }}>
      <AvatarFallback
        className="font-semibold text-white"
        style={{ background: person.accent, fontSize: Math.max(9, Math.round(size * 0.4)) }}
      >
        {person.initials}
      </AvatarFallback>
    </Avatar>
  );
}

/**
 * MOCKUP-LOCAL. A Poll is a real body attachment (question, options, single or
 * multiple choice) but the repo ships no renderer for it, so this draws only
 * what PollConfig actually holds — no close time, no live ticker.
 */
export function PollCard({
  question,
  options,
  totalVotes,
  voters,
}: {
  question: string;
  options: { label: string; share: number }[];
  totalVotes: number;
  voters: Person[];
}) {
  return (
    <>
      <CardLabel>
        <span className="inline-flex items-center gap-1.5">
          <BarChart3 className="size-3.5" aria-hidden /> Poll
        </span>
      </CardLabel>
      <p className="mt-2 text-[16px] font-semibold leading-snug tracking-[-0.005em]">{question}</p>
      {options.map((o, i) => (
        <div key={o.label} className="mt-2.5">
          <div className="flex items-baseline justify-between text-[12px]">
            <span>{o.label}</span>
            <b className="font-semibold tabular-nums">{o.share}%</b>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full"
              style={{ width: `${o.share}%`, background: i === 0 ? 'var(--primary)' : '#94A3B8' }}
            />
          </div>
        </div>
      ))}
      <Separator className="mt-3" />
      <div className="mt-2.5 flex items-center gap-2.5">
        <AvatarStack people={voters} size={21} />
        <span className="text-[11px] tabular-nums text-muted-foreground">
          {totalVotes} votes
        </span>
      </div>
    </>
  );
}

export function CommentThreadCard({
  onPost,
  comments,
  composer = 'Write a comment…',
}: {
  onPost: string;
  comments: { person: Person; at: string; text: string; mention?: Person }[];
  composer?: string | null;
}) {
  return (
    <>
      <CardLabel>
        <span className="inline-flex items-center gap-1.5">
          <MessageSquare className="size-3.5" aria-hidden /> Comments on
        </span>
      </CardLabel>
      <p className="mt-1.5 text-[13px] font-semibold leading-snug">{onPost}</p>
      {comments.map((c, i) => (
        <div key={i} className="mt-3.5 flex gap-2.5">
          <PersonAvatar person={c.person} />
          <div className="flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[12px] font-semibold leading-tight">{c.person.name}</span>
              <span className="text-[11px] text-muted-foreground">{c.at}</span>
            </div>
            <p className="mt-0.5 text-[12.5px] leading-relaxed">
              {c.mention ? <Mention person={c.mention} /> : null}
              {c.mention ? ' ' : null}
              {c.text}
            </p>
          </div>
        </div>
      ))}
      {composer ? (
        <div className="mt-3.5 flex h-8 items-center rounded-md border border-border bg-muted px-3 text-[12px] text-muted-foreground">
          {composer}
        </div>
      ) : null}
    </>
  );
}

export function Mention({ person }: { person: Person }) {
  return (
    <span className="rounded-sm bg-primary/10 px-1 font-semibold text-primary">
      @{person.name.split(' ')[0]}
    </span>
  );
}

/**
 * MOCKUP-LOCAL. Innovation-flow phases are real (label, description,
 * linkedToNext) and render as tabs in the app; this is the same data as a
 * standing list, which the app has no component for. No dates: phases do not
 * carry them.
 */
export function PhaseFlowCard({
  phases,
  currentId,
}: {
  phases: { id: string; label: string; description: string }[];
  currentId: string;
}) {
  return (
    <>
      <CardLabel>Innovation flow</CardLabel>
      {phases.map((p, i) => {
        const current = p.id === currentId;
        const past = phases.findIndex(x => x.id === currentId) > i;
        return (
          <div key={p.id} className="relative mt-3 flex gap-3">
            {i < phases.length - 1 ? (
              <span className="absolute left-[4px] top-4 block h-6 w-px bg-border" />
            ) : null}
            <span
              className="mt-1 block size-[9px] shrink-0 rounded-full border-[1.5px]"
              style={{
                background: current ? 'var(--primary)' : 'var(--card)',
                borderColor: current ? 'var(--primary)' : '#CBD5E1',
              }}
            />
            <div>
              <div
                className="text-[12.5px] font-semibold leading-tight"
                style={{ color: current || past ? 'var(--foreground)' : '#94A3B8' }}
              >
                {p.label}
                {current ? (
                  <span className="ml-1.5 rounded-full bg-primary px-1.5 py-px align-[1px] text-[11px] font-semibold text-primary-foreground">
                    Now
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                {p.description}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
}
