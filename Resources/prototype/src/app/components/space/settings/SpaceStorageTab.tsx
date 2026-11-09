import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmationDialog } from '@/crd/components/dialogs/ConfirmationDialog';
import { type DocumentNode, SpaceSettingsStorageView } from '@/crd/components/space/settings/SpaceSettingsStorageView';
import { useDemoState } from './demoState';

const file = (id: string, name: string, sizeFormatted: string, uploaderName: string, uploadedAt: string): DocumentNode => ({
  id,
  kind: 'file',
  name,
  sizeFormatted,
  uploaderName,
  uploaderHref: '#',
  uploadedAt,
  openHref: '#',
  canDelete: true,
});

export const DEMO_DOCUMENTS: DocumentNode[] = [
  {
    id: 'f1',
    kind: 'folder',
    name: 'Home',
    children: [
      file('d1', 'welcome-banner.png', '245 KB', 'Elena Martinez', '15 Jan 2024'),
      file('d2', 'project-kickoff.pdf', '1.2 MB', 'Sarah Chen', '20 Jan 2024'),
    ],
  },
  {
    id: 'f2',
    kind: 'folder',
    name: 'Community',
    children: [file('d3', 'member-handbook.pdf', '890 KB', 'Elena Martinez', '1 Feb 2024')],
  },
  {
    id: 'f3',
    kind: 'folder',
    name: 'Knowledge',
    children: [file('d4', 'research-findings.docx', '456 KB', 'Marcus Johnson', '10 Feb 2024')],
  },
];

const removeNode = (nodes: DocumentNode[], id: string): DocumentNode[] =>
  nodes
    .filter(node => node.id !== id)
    .map(node => (node.kind === 'folder' ? { ...node, children: removeNode(node.children, id) } : node));

/** Storage tab: production's document table. Folders open and close; deletes confirm, then remove. */
export function SpaceStorageTab({
  scope = 'space',
  initial = DEMO_DOCUMENTS,
}: {
  scope?: string;
  initial?: DocumentNode[];
}) {
  const { t } = useTranslation('crd-spaceSettings');
  const [tree, setTree] = useDemoState(`${scope}:storage`, initial);
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set(['f1', 'f3']));
  const [pending, setPending] = useState<{ id: string; name: string } | null>(null);

  return (
    <>
      <SpaceSettingsStorageView
        tree={tree}
        expandedFolderIds={expanded}
        onToggleFolder={id =>
          setExpanded(previous => {
            const next = new Set(previous);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
          })
        }
        onDelete={(id, name) => setPending({ id, name })}
      />
      <ConfirmationDialog
        open={pending !== null}
        onOpenChange={open => {
          if (!open) setPending(null);
        }}
        variant="destructive"
        title={t('storage.deleteDialog.title')}
        description={t('storage.deleteDialog.description', { name: pending?.name ?? '' })}
        confirmLabel={t('storage.deleteDialog.confirm')}
        cancelLabel={t('dirtyGuard.cancel')}
        onConfirm={() => {
          if (pending) setTree(previous => removeNode(previous, pending.id));
          setPending(null);
        }}
        onCancel={() => setPending(null)}
      />
    </>
  );
}
