import { getInitials } from '@/crd/lib/getInitials';

export type SubspaceProfile = {
  title: string;
  description: string;
  initials: string;
  avatarImage?: string;
};

const avatar = (photo: string) =>
  `https://images.unsplash.com/photo-${photo}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200`;

const SUBSPACES: Record<string, Omit<SubspaceProfile, 'initials'>> = {
  'renewable-energy-transition': {
    title: 'Renewable Energy Transition',
    description: 'Developing strategies for municipal energy transition to 100% renewables by 2030.',
    avatarImage: avatar('1509391366360-2e959784a276'),
  },
  'urban-mobility-lab': {
    title: 'Urban Mobility Lab',
    description: 'Reimagining city transportation networks for better accessibility and reduced carbon footprint.',
    avatarImage: avatar('1556741533-6e6a62bd8b49'),
  },
  'green-infrastructure': {
    title: 'Green Infrastructure',
    description: 'Planning and implementation of urban green spaces, vertical gardens, and sustainable drainage.',
    avatarImage: avatar('1518531933037-91b2f5f229cc'),
  },
};

/** The demo subspace at this address; any other address gets a name from its slug. */
export function getSubspaceProfile(slug: string): SubspaceProfile {
  const known = SUBSPACES[slug];
  const title = known?.title ?? slug.replace(/-/g, ' ').replace(/\b\w/g, character => character.toUpperCase());
  return {
    title,
    description: known?.description ?? 'A focused collaboration area.',
    avatarImage: known?.avatarImage,
    initials: getInitials(title),
  };
}
