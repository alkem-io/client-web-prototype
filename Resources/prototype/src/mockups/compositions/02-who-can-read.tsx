/**
 * 02 · Who can read what I post
 *
 * client-web#7730, from product#1644. Three moments, one message: a badge on
 * the space header that is always there, a line in the post and response
 * dialogs at the moment of writing, and a one-time dialog on becoming a member.
 *
 * The case shown is the hard one: a public subspace inside a private space.
 * It is neither Public nor Private — only members of the space above can read
 * it — so it gets its own label, "Members only".
 */
import type { ReactNode } from 'react';
import { Globe, Lock, Users, X, type LucideIcon } from 'lucide-react';
import { Button } from '@/crd/primitives/button';
import { Separator } from '@/crd/primitives/separator';
import { cn } from '@/crd/lib/utils';
import { defineComposition, register } from '../core/defineComposition';
import { people } from '../fixtures/people';
import { mobilityFlow, posts, spaces } from '../fixtures/content';
import { SubspaceScreen, PhaseBlock, LeadsBlock } from '../parts/screens';
import { CardLabel } from '../frame/SpillCard';

const SUB = spaces.mobility.name;
const PARENT = spaces.zuidplein.name;

type Audience = 'public' | 'membersOnly' | 'private';

const AUDIENCE: Record<Audience, { icon: LucideIcon; label: string; sentence: string }> = {
  public: {
    icon: Globe,
    label: 'Public',
    sentence: "Anyone, including people who aren't signed in, can read what's posted here."
  },
  membersOnly: {
    icon: Users,
    label: 'Members only',
    sentence: `Members of ${SUB} and of ${PARENT} can read what's posted here.`
  },
  private: {
    icon: Lock,
    label: 'Private',
    sentence: `Only members of ${SUB} can read what's posted here.`
  }
};

/** MOCKUP-LOCAL. The header badge. Same pill shape as the badge on space cards. */
function AudienceBadge({ audience, size = 'md' }: { audience: Audience; size?: 'sm' | 'md' }) {
  const { icon: Icon, label } = AUDIENCE[audience];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-border font-medium',
        audience === 'private' ? 'border-transparent bg-primary text-primary-foreground' : 'bg-muted text-foreground',
        size === 'md' ? 'px-2.5 py-1 text-[12px]' : 'px-2 py-0.5 text-[11px]'
      )}
    >
      <Icon aria-hidden="true" className={size === 'md' ? 'size-3.5' : 'size-3'} />
      {label}
    </span>
  );
}

/** The badge with its hover explanation open, drawn on the laptop screen. */
function HeaderBadgeWithHover() {
  return (
    <span className="relative">
      <AudienceBadge audience="membersOnly" />
      <span className="absolute left-0 top-[calc(100%+8px)] z-10 w-[300px] rounded-md bg-foreground px-3 py-2.5 text-[12px] leading-snug text-background shadow-lg">
        {AUDIENCE.membersOnly.sentence}
        <span className="mt-1.5 block font-semibold underline underline-offset-2">What does this mean?</span>
      </span>
    </span>
  );
}

/** The line that sits above the buttons in a create dialog. */
function AudienceLine({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-muted px-3 py-2 text-[12px] leading-snug text-foreground">
      <Users aria-hidden="true" className="mt-px size-3.5 shrink-0 text-foreground" />
      <span>{children}</span>
    </div>
  );
}

/** MOCKUP-LOCAL. The bottom of a create dialog: what you typed, who will read it, the buttons. */
function DialogFoot({
  label,
  title,
  body,
  line,
  action
}: {
  label: string;
  title: string;
  body: string;
  line: ReactNode;
  action: string;
}) {
  return (
    <div>
      <CardLabel>{label}</CardLabel>
      <div className="mt-2.5 text-[15px] font-semibold leading-snug">{title}</div>
      <p className="mt-1 text-[12px] leading-snug text-muted-foreground">{body}</p>
      <Separator className="my-3" />
      <AudienceLine>{line}</AudienceLine>
      <div className="mt-3 flex justify-end gap-2">
        <Button variant="ghost" size="sm">Cancel</Button>
        <Button size="sm">{action}</Button>
      </div>
    </div>
  );
}

/** The three labels and their one sentence each — the whole vocabulary. */
function ThreeStates() {
  return (
    <div>
      <CardLabel>The three labels</CardLabel>
      <div className="mt-3 space-y-3">
        {(['public', 'membersOnly', 'private'] as Audience[]).map(a => (
          <div key={a}>
            <AudienceBadge audience={a} size="sm" />
            <p className="mt-1 text-[12px] leading-snug text-muted-foreground">{AUDIENCE[a].sentence}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WelcomeRow({ q, a }: { q: string; a: string }) {
  return (
    <div className="py-2.5">
      <div className="text-[12px] text-muted-foreground">{q}</div>
      <div className="mt-0.5 text-[13px] font-medium leading-snug">{a}</div>
    </div>
  );
}

/** MOCKUP-LOCAL. Shown once, the first time someone opens the space as a member. */
function WelcomeDialog() {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="text-[16px] font-semibold leading-snug">You're now a member of {SUB}</div>
        <X aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      </div>
      <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
        Before you post, here's who will see it.
      </p>
      <div className="mt-2 divide-y divide-border">
        <WelcomeRow q="Who can read what you post" a={`Members of ${SUB} and of ${PARENT}`} />
        <WelcomeRow q="Who can see your profile" a="Other members only" />
      </div>
      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
        Admins of {PARENT}, and the organisation that hosts it, can also see everything here.
      </p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          Find this again under <AudienceBadge audience="membersOnly" size="sm" />
        </span>
        <Button size="sm">Got it</Button>
      </div>
    </div>
  );
}

export default register(
  defineComposition({
    id: '02-who-can-read',
    claim: 'Before you post, you know who will read it.',
    story:
      'As a member (or prospective member) of a Space, I want to always be able to see who can read the content I add here, so that I know whether it is visible to anyone on the internet or stays behind closed doors.',

    // Wider than the house canvas, cards held clear of the laptop: this is a
    // design review, so the page under the cards has to stay readable.
    canvas: { width: 1900, height: 980 },
    overflow: 'contained',

    devices: [
      {
        id: 'laptop',
        kind: 'laptop',
        screenKind: 'subspace',
        screen: (
          <SubspaceScreen
            name={SUB}
            tagline={spaces.mobility.tagline}
            crumbs={[PARENT, SUB]}
            faces={[people.sanne, people.tomasz]}
            tabs={mobilityFlow.map(p => ({ id: p.id, label: p.label, linkedToNext: p.linkedToNext }))}
            activeTab="intake"
            titleAdornment={<HeaderBadgeWithHover />}
            rail={
              <>
                <PhaseBlock position={1} total={4} name="Intake" description={mobilityFlow[0].description} />
                <LeadsBlock leads={[people.sanne, people.tomasz]} />
              </>
            }
            posts={[posts.proposal]}
          />
        )
      }
    ],

    cards: [
      {
        id: 'states',
        at: 'top-left',
        width: 300,
        node: <ThreeStates />
      },
      {
        id: 'post',
        at: 'top-right',
        width: 340,
        node: (
          <DialogFoot
            label="Creating a post"
            title="Speed bumps on Kerkstraat?"
            body="Three near-misses outside the school this month. Should we ask the council…"
            line={<>Members of {SUB} and of {PARENT} will be able to read this post.</>}
            action="Post"
          />
        )
      },
      {
        id: 'respond',
        at: 'bottom-left',
        width: 320,
        node: (
          <DialogFoot
            label="Responding to a post"
            title="Photo: school entrance at 8:15"
            body="Taken this morning, cars parked on both sides."
            line={<>Your response is readable by members of {SUB} and of {PARENT}.</>}
            action="Add"
          />
        )
      },
      {
        id: 'welcome',
        at: 'bottom-right',
        width: 360,
        node: <WelcomeDialog />
      }
    ],

    crops: ['default', 'wide', 'print'],

    uses: [
      '@/app/components/space/PostCard',
      '@/app/components/space/ChannelTabs',
      '@/crd/primitives/button',
      '@/crd/primitives/separator'
    ],

    notes:
      'Badge, hover text, dialog line and welcome dialog are all mockup-local — none exist in production yet. The header badge reuses the pill shape of the Public/Private badge on space cards (SpaceCardIdentity). The About section is not drawn here; it would repeat the welcome dialog rows.'
  })
);
