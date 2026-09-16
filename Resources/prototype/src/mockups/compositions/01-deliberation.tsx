/**
 * 01 · Deliberation to decision
 *
 * A composition is data. The layout engine places the cards, the validator
 * checks them, and switching `overflow` between 'spill', 'contained' and
 * 'none' re-cuts the same image for a different channel without touching a
 * single card.
 */
import { PostCard } from '@/app/components/space/PostCard';
import { defineComposition, register } from '../core/defineComposition';
import { people } from '../fixtures/people';
import { comments, mobilityFlow, polls, posts, spaces } from '../fixtures/content';
import { SubspaceScreen, PhaseBlock, LeadsBlock } from '../parts/screens';
import { CommentThreadCard, PhaseFlowCard, PollCard } from '../parts/cards';

export default register(
  defineComposition({
    id: '01-deliberation',
    claim: 'A proposal becomes a decision, in the open.',
    story:
      'As a member of a civic space, I want to see the evidence, the vote and the outcome in one place, so I can tell that the decision came out of the discussion.',

    devices: [
      {
        id: 'laptop',
        kind: 'laptop',
        screenKind: 'subspace',
        screen: (
          <SubspaceScreen
            name={spaces.mobility.name}
            tagline={spaces.mobility.tagline}
            crumbs={[spaces.zuidplein.name, spaces.mobility.name]}
            faces={[people.sanne, people.tomasz]}
            tabs={mobilityFlow.map(p => ({
              id: p.id,
              label: p.label,
              linkedToNext: p.linkedToNext,
            }))}
            activeTab="deliberation"
            rail={
              <>
                <PhaseBlock
                  position={2}
                  total={4}
                  name="Deliberation"
                  description="Weigh the evidence and shape a proposal the council can act on."
                />
                <LeadsBlock leads={[people.sanne, people.tomasz]} />
              </>
            }
            posts={[posts.proposal, posts.counts]}
          />
        ),
      },
    ],

    cards: [
      {
        id: 'poll',
        at: 'top-left',
        width: 336,
        node: <PollCard {...polls.kerkstraat} />,
      },
      {
        id: 'thread',
        at: 'top-right',
        width: 348,
        node: (
          <CommentThreadCard onPost={posts.counts.title} comments={comments.kerkstraat} />
        ),
      },
      {
        id: 'flow',
        at: 'bottom-left',
        width: 320,
        node: <PhaseFlowCard phases={mobilityFlow} currentId="deliberation" />,
      },
      {
        id: 'outcome',
        at: 'bottom-right',
        width: 380,
        bare: true,
        node: <PostCard post={posts.decision} />,
      },
    ],

    crops: ['default', 'wide', 'print'],

    uses: [
      '@/app/components/space/PostCard',
      '@/app/components/space/PostReactions',
      '@/app/components/space/ChannelTabs',
      '@/app/components/ui/avatar',
      '@/app/components/ui/separator',
      '@/app/components/common/CollapsibleTagList',
    ],

    notes:
      'The poll tally and the standing phase list are mockup-local: both features exist, neither has a renderer in the repo. Recorded in COMPONENT-MAP.md.',
  }),
);
