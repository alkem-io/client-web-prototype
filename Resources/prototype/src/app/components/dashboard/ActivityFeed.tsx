/**
 * Activity feed — production's `@/crd/components/dashboard/ActivityFeed`.
 *
 * This file keeps the prototype's mock activity and maps it onto CRD's exported
 * `ActivityItemData`; CRD renders the card, filters and show-more affordance.
 *
 * The fixtures use production's `ActivityEventType` values so they exercise the
 * real row anatomy — entity name on line one, the containing callout/post/space
 * on line two, the verb carried by the avatar's icon badge. See
 * `app/mappers/activityFeed.tsx` for why that matters.
 *
 * PHASE 1 NOTE: the prototype's `type` prop is CRD's `variant` — the values
 * ('spaces' | 'personal') already matched.
 */
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityFeed as CrdActivityFeed } from '@/crd/components/dashboard/ActivityFeed';
import {
  type MockActivity,
  ROLE_FILTER_OPTIONS,
  SPACE_FILTER_OPTIONS,
  toActivityItem,
} from '@/app/mappers/activityFeed';

/* Timestamps use production's `formatTimeElapsed(date, t, 'short')` shape —
   a number plus a unit letter, no "ago". */
const AVATARS = {
  sarah: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64',
  mike: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=64&h=64',
  anna: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64',
  david:
    'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMG1hbnxlbnwxfHx8fDE3Njk0Nzg0NTZ8MA&ixlib=rb-4.1.0&q=80&w=64&h=64',
  elena:
    'https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc2OTQ3ODMzMnww&ixlib=rb-4.1.0&q=80&w=64&h=64',
  james:
    'https://images.unsplash.com/photo-1603143704710-99d6011f107e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXZlbG9wZXIlMjBoZWFkc2hvdHxlbnwxfHx8fDE3Njk1MzI5NjB8MA&ixlib=rb-4.1.0&q=80&w=64&h=64',
  you: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=64&h=64',
} as const;

const mockActivities: Record<string, MockActivity[]> = {
  spaces: [
    {
      id: '1',
      kind: 'CALLOUT_PUBLISHED',
      actor: { name: 'Sarah Chen', avatar: AVATARS.sarah },
      subject: 'Q1 Innovation Challenge',
      context: 'Innovation Lab',
      href: '/space/innovation-lab',
      timestamp: '2h',
    },
    {
      id: '2',
      kind: 'CALLOUT_POST_COMMENT',
      actor: { name: 'Mike Ross', avatar: AVATARS.mike },
      subject: 'Looks good — can we align this with the Q2 roadmap before sign-off?',
      context: 'Design Review',
      timestamp: '4h',
    },
    {
      id: '3',
      kind: 'CALLOUT_LINK_CREATED',
      actor: { name: 'Anna Smith', avatar: AVATARS.anna },
      subject: 'Brand Guidelines 2026',
      context: 'Marketing Strategy',
      timestamp: '1d',
    },
    {
      id: '4',
      kind: 'CALLOUT_WHITEBOARD_CONTENT_MODIFIED',
      actor: { name: 'David Kim', avatar: AVATARS.david },
      subject: 'Product Roadmap',
      context: 'Planning',
      timestamp: '1d',
    },
    {
      id: '5',
      kind: 'MEMBER_JOINED',
      actor: { name: 'Elena Rodriguez', avatar: AVATARS.elena },
      subject: '',
      context: 'Community Hub',
      timestamp: '2d',
    },
    {
      id: '6',
      kind: 'CALLOUT_MEMO_CREATED',
      actor: { name: 'James Wilson', avatar: AVATARS.james },
      subject: 'Q3 Goals',
      context: 'Team Notes',
      timestamp: '3d',
    },
    {
      id: '7',
      kind: 'CALENDAR_EVENT_CREATED',
      actor: { name: 'Sarah Chen', avatar: AVATARS.sarah },
      subject: 'Sprint Review',
      context: 'Innovation Lab',
      href: '/space/innovation-lab',
      timestamp: '3d',
    },
  ],
  personal: [
    {
      id: '8',
      kind: 'SUBSPACE_CREATED',
      actor: { name: 'You', avatar: AVATARS.you },
      subject: 'Project Alpha',
      context: 'Innovation Lab',
      href: '/space/innovation-lab',
      timestamp: '1d',
    },
    {
      id: '9',
      kind: 'UPDATE_SENT',
      actor: { name: 'You', avatar: AVATARS.you },
      subject: "Welcome aboard! Here's what we're focusing on this sprint.",
      context: 'Team Sync',
      timestamp: '2d',
    },
    {
      id: '10',
      kind: 'MEMBER_JOINED',
      actor: { name: 'You', avatar: AVATARS.you },
      subject: '',
      context: 'Data Science Team',
      timestamp: '3d',
    },
    {
      id: '11',
      kind: 'CALLOUT_POST_COMMENT',
      actor: { name: 'You', avatar: AVATARS.you },
      subject: "Agreed — let's ship the simpler version first and iterate.",
      context: 'Design Review',
      timestamp: '4d',
    },
    {
      id: '12',
      kind: 'CALLOUT_POST_CREATED',
      actor: { name: 'You', avatar: AVATARS.you },
      subject: 'Analytics Q3 Summary',
      context: 'Analytics Dashboard',
      timestamp: '7d',
    },
    {
      id: '13',
      kind: 'CALLOUT_WHITEBOARD_CREATED',
      actor: { name: 'You', avatar: AVATARS.you },
      subject: 'Profile redesign sketches',
      context: 'Design System',
      timestamp: '7d',
    },
  ],
};

export function ActivityFeed({ title, type }: { title: string; type: 'spaces' | 'personal' }) {
  const { t } = useTranslation('crd-dashboard');
  const [spaceFilter, setSpaceFilter] = useState('all-spaces');
  const [roleFilter, setRoleFilter] = useState('all-roles');

  const items = useMemo(
    () =>
      (mockActivities[type] ?? []).map(a =>
        // The badge's accessible label is production's own string for the type.
        toActivityItem(a, t(`activity.iconLabel.${a.kind}`, { defaultValue: a.kind }))
      ),
    [type, t]
  );

  return (
    <CrdActivityFeed
      variant={type}
      title={title}
      items={items}
      spaceFilter={spaceFilter}
      spaceFilterOptions={SPACE_FILTER_OPTIONS}
      onSpaceFilterChange={setSpaceFilter}
      roleFilter={type === 'spaces' ? roleFilter : undefined}
      roleFilterOptions={type === 'spaces' ? ROLE_FILTER_OPTIONS : undefined}
      onRoleFilterChange={type === 'spaces' ? setRoleFilter : undefined}
      onShowMore={() => {}}
      maxItems={7}
    />
  );
}
