/**
 * content — the spaces, posts and polls the compositions draw on.
 *
 * Civic participation is the primary domain; climate and GovTech exist for the
 * cross-space and host flows, which need spaces a single user belongs to at
 * different levels. Names are plausible and specific by rule — never "Space
 * Name Here", never lorem.
 */
import type { PostCardData } from '@/app/components/space/PostCard';
import { people } from './people';

export const spaces = {
  zuidplein: {
    slug: 'zuidplein-2030',
    name: 'Zuidplein 2030',
    tagline: 'Rebuilding a district with the people who live in it.',
    memberCount: 318,
    domain: 'civic',
  },
  mobility: {
    slug: 'mobility-streets',
    name: 'Mobility & Streets',
    tagline: 'Redesigning street use in the Zuidplein district, with the people who live on it.',
    parent: 'Zuidplein 2030',
    memberCount: 96,
    domain: 'civic',
  },
} as const;

/** The innovation flow this subspace runs. Custom phases are a real feature. */
export const mobilityFlow = [
  { id: 'intake', label: 'Intake', description: 'Residents and officers submit street issues.', linkedToNext: true },
  { id: 'deliberation', label: 'Deliberation', description: 'Weigh the evidence and shape a proposal.', linkedToNext: true },
  { id: 'vote', label: 'Vote', description: 'Members vote on the proposal as written.', linkedToNext: true },
  { id: 'decision', label: 'Decision', description: 'The council records the outcome in the space.', linkedToNext: false },
];

export const posts = {
  proposal: {
    id: 'p-kerkstraat-proposal',
    type: 'text',
    title: 'Lower Kerkstraat to 30 km/h',
    snippet:
      'Kerkstraat carries through-traffic it was never designed for. This proposal drops the limit to 30 km/h between the market and the school, narrows the carriageway at two crossings, and moves the loading bay to Weverstraat.',
    author: { name: people.nadia.name, role: 'Lead' },
    timestamp: '3 days ago',
    commentCount: 31,
    tags: ['Proposal', 'Kerkstraat', 'Speed limit'],
  } satisfies PostCardData,

  counts: {
    id: 'p-kerkstraat-counts',
    type: 'document',
    framingDocumentType: 'spreadsheet',
    title: 'Kerkstraat traffic counts, Q2',
    snippet: 'Seven-day automatic counts at three points, with the school-run peak broken out.',
    author: { name: people.luca.name, role: 'Member' },
    timestamp: 'yesterday',
    commentCount: 12,
  } satisfies PostCardData,

  decision: {
    id: 'p-kerkstraat-decision',
    type: 'text',
    title: 'Kerkstraat becomes a 30 km/h street from January',
    snippet: 'Applies from 1 January. Signage and enforcement follow in Q1.',
    author: { name: people.sanne.name, role: 'Lead' },
    timestamp: 'today',
    commentCount: 18,
    tags: ['Decision', 'Kerkstraat'],
  } satisfies PostCardData,
} as const;

/** A Poll is a body attachment: question, options, single or multiple choice.
 *  There is no deadline field and no live tally ticker, so neither appears. */
export const polls = {
  kerkstraat: {
    question: 'Should Kerkstraat drop to 30 km/h?',
    options: [
      { label: 'In favour', share: 72 },
      { label: 'Against', share: 28 },
    ],
    multipleChoice: false,
    totalVotes: 412,
    voters: [people.nadia, people.luca, people.tomasz],
  },
};

export const comments = {
  kerkstraat: [
    {
      person: people.luca,
      at: '2h',
      text: 'The counts are in — 8,400 vehicles a day against a design capacity of 5,000.',
    },
    {
      person: people.sanne,
      at: '12m',
      mention: people.tomasz,
      text: 'put these on the proposal before the vote opens.',
    },
  ],
};
