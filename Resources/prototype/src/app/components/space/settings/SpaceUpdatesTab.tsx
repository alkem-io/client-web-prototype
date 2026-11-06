import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmationDialog } from '@/crd/components/dialogs/ConfirmationDialog';
import {
  SpaceSettingsUpdatesView,
  type UpdateAuthor,
  type UpdateMessage,
} from '@/crd/components/space/settings/SpaceSettingsUpdatesView';
import { demoDelay, demoMarkdownUpload, useDemoState } from './demoState';

const ELENA: UpdateAuthor = {
  id: 'u1',
  displayName: 'Elena Martinez',
  avatarUrl:
    'https://images.unsplash.com/photo-1623853589874-864b1dd4d922?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256',
  profileUrl: '/user/elena-martinez',
  roleLabel: 'Host',
};

const SARAH: UpdateAuthor = {
  id: 'u2',
  displayName: 'Sarah Chen',
  avatarUrl:
    'https://images.unsplash.com/photo-1757347398206-7425300ef990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256',
  profileUrl: '/user/sarah-chen',
  roleLabel: 'Admin',
};

export const DEMO_UPDATES: UpdateMessage[] = [
  {
    id: 'u-1',
    author: ELENA,
    timestamp: new Date('2024-02-18').getTime(),
    body: "**2024 Roadmap & Community Goals**\n\nWe've finalized the 2024 roadmap for this space. Our three strategic pillars this year are:\n\n- **Decarbonization:** Accelerating the transition to net-zero energy systems\n- **Community Building:** Growing from 150 to 500 active contributors\n- **Knowledge Sharing:** Publishing quarterly insight reports\n\nStay tuned for detailed challenge briefs rolling out over the next two weeks.",
  },
  {
    id: 'u-2',
    author: SARAH,
    timestamp: new Date('2024-02-10').getTime(),
    body: "**New Subspaces Now Open**\n\nWe've launched three new subspaces based on community feedback:\n\n1. Urban Mobility Lab — focused on sustainable city transport\n2. Green Infrastructure — planning urban green spaces\n3. Circular Economy — reducing waste through systemic design\n\nEach subspace has dedicated leads and an innovation flow already set up. Jump in!",
  },
  {
    id: 'u-3',
    author: ELENA,
    timestamp: new Date('2024-01-15').getTime(),
    body: '**Welcome to the Green Energy Space!**\n\nWelcome to all new members! This space is our shared home for exploring sustainable energy solutions. Check out the knowledge base for background reading, and introduce yourself in the community feed.',
  },
];

const CURRENT_USER: UpdateAuthor = {
  id: 'me',
  displayName: 'You',
  avatarUrl: null,
  profileUrl: null,
  roleLabel: 'Admin',
};

/** Updates tab: production's composer and list. Publishing adds to the top; deletes confirm first. */
export function SpaceUpdatesTab({
  scope = 'space',
  initial = DEMO_UPDATES,
}: {
  scope?: string;
  initial?: UpdateMessage[];
}) {
  const { t, i18n } = useTranslation('crd-spaceSettings');
  const [messages, setMessages] = useDemoState(`${scope}:updates`, initial);
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);

  const submit = async () => {
    if (!draft.trim()) return;
    setSubmitting(true);
    await demoDelay();
    setMessages(previous => [
      { id: `u-${Date.now()}`, author: CURRENT_USER, timestamp: Date.now(), body: draft },
      ...previous,
    ]);
    setDraft('');
    setSubmitting(false);
  };

  return (
    <>
      <SpaceSettingsUpdatesView
        messages={messages}
        draft={draft}
        loading={false}
        submitting={submitting}
        removing={false}
        canEdit={true}
        canRemove={true}
        locale={i18n.language}
        onDraftChange={setDraft}
        onSubmit={() => void submit()}
        onRequestRemove={setPendingRemove}
        {...demoMarkdownUpload}
      />
      <ConfirmationDialog
        open={pendingRemove !== null}
        onOpenChange={open => {
          if (!open) setPendingRemove(null);
        }}
        variant="destructive"
        title={t('updates.deleteDialog.title')}
        description={t('updates.deleteDialog.description')}
        confirmLabel={t('updates.deleteDialog.confirm')}
        cancelLabel={t('dirtyGuard.cancel')}
        onConfirm={() => {
          setMessages(previous => previous.filter(message => message.id !== pendingRemove));
          setPendingRemove(null);
        }}
        onCancel={() => setPendingRemove(null)}
      />
    </>
  );
}
