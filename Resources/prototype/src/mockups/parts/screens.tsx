/**
 * screens — what goes inside a device.
 *
 * These compose the platform's real components (PostCard, CalloutTabs, the ui
 * primitives) into a page-shaped surface. The page chrome around them — top
 * bar, banner, identity block — is mockup-local: those are laid out by
 * SpaceShell in the app, which needs router and filter context a static export
 * cannot give it. COMPONENT-MAP.md records that split.
 */
import type { ReactNode } from 'react';
import { CalloutTabs, type CalloutTab } from '@/app/components/space/ChannelTabs';
import { PostCard, type PostCardData } from '@/app/components/space/PostCard';
import { MediaPlaceholder } from '../core/density';
import { PersonAvatar } from './cards';
import type { Person } from '../core/types';

export function TopBar({ crumbs, faces }: { crumbs: string[]; faces: Person[] }) {
  return (
    <div className="absolute inset-x-0 top-0 flex h-11 items-center border-b border-border bg-card px-4">
      <span className="grid size-[22px] place-items-center rounded-[5px] bg-primary text-[12px] font-bold text-primary-foreground">
        A
      </span>
      <div className="ml-9 flex items-center gap-1.5 text-[12px] font-medium">
        {crumbs.map((c, i) => (
          <span key={c} className="flex items-center gap-1.5">
            {i > 0 ? <span className="text-border">/</span> : null}
            <span className={i === crumbs.length - 1 ? '' : 'text-muted-foreground'}>{c}</span>
          </span>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="h-[22px] w-[150px] rounded-full border border-border bg-muted" />
        {faces.map(p => (
          <PersonAvatar key={p.id} person={p} size={24} />
        ))}
      </div>
    </div>
  );
}

export function RailBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-card p-3.5">
      <div className="text-[11px] font-semibold uppercase leading-tight tracking-[0.05em] text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

export function PhaseBlock({
  position,
  total,
  name,
  description,
}: {
  position: number;
  total: number;
  name: string;
  description: string;
}) {
  return (
    <RailBlock label={`Phase ${position} of ${total}`}>
      <div className="mt-1.5 text-[18px] font-semibold leading-snug">{name}</div>
      <div className="mt-2.5 flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className="h-1 flex-1 rounded-full"
            style={{ background: i < position ? 'var(--primary)' : 'var(--border)' }}
          />
        ))}
      </div>
      <p className="mt-2.5 text-[11px] leading-snug text-muted-foreground">{description}</p>
    </RailBlock>
  );
}

export function LeadsBlock({ leads }: { leads: Person[] }) {
  return (
    <RailBlock label="Leads">
      {leads.map(p => (
        <div key={p.id} className="mt-2.5 flex items-center gap-2.5">
          <PersonAvatar person={p} size={26} />
          <div>
            <div className="text-[12px] font-semibold leading-tight">{p.name}</div>
            <div className="text-[11px] leading-tight text-muted-foreground">{p.role}</div>
          </div>
        </div>
      ))}
    </RailBlock>
  );
}

/**
 * A subspace page: banner, identity, innovation-flow phases as tabs, a rail,
 * and a feed of real PostCards.
 */
export function SubspaceScreen({
  name,
  tagline,
  crumbs,
  faces,
  tabs,
  activeTab,
  rail,
  posts,
}: {
  name: string;
  tagline: string;
  crumbs: string[];
  faces: Person[];
  tabs: CalloutTab[];
  activeTab: string;
  rail: ReactNode;
  posts: PostCardData[];
}) {
  return (
    <div className="relative size-full">
      <TopBar crumbs={crumbs} faces={faces} />
      <MediaPlaceholder className="absolute inset-x-0" style={{ top: 44, height: 96 }} />

      <div className="absolute inset-x-0" style={{ top: 150 }}>
        <div className="px-8">
          <h1 className="text-[24px] font-bold leading-tight tracking-[-0.015em]">{name}</h1>
          <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{tagline}</p>
        </div>

        <div className="mt-6 border-b border-border px-8">
          <CalloutTabs tabs={tabs} activeTab={activeTab} onTabChange={() => {}} />
        </div>

        <div className="flex gap-6 px-8 pt-4">
          <aside className="w-[208px] shrink-0 space-y-3">{rail}</aside>
          <div className="min-w-0 flex-1 space-y-3.5">
            {posts.map(p => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
