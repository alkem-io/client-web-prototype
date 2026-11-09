import { type Dispatch, type ReactNode, type SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { CalloutContextMenu } from '@/crd/components/callout/CalloutContextMenu';
import { CalloutVisibilityChangeDialog } from '@/crd/components/callout/CalloutVisibilityChangeDialog';
import { ConfirmationDialog } from '@/crd/components/dialogs/ConfirmationDialog';
import type { PostCardData } from '@/crd/components/space/PostCard';
import { ItemShareDialog } from '@/app/components/shared/ItemShareDialog';
import { TemplateEditorDialog } from './settings/TemplateEditorDialog';
import { buildContent, useDemoTemplates } from './settings/templatesDemo';

type MenuPost = Pick<PostCardData, 'id' | 'title' | 'isDraft' | 'snippet'>;

/** Production's callout address: `<space>/collaboration/<callout name>`. No such page exists in the prototype. */
function postShareUrl(title: string): string {
  const slug = title
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const base = window.location.pathname.replace(/\/$/, '');
  return `${base}/collaboration/${slug}`;
}

/**
 * Production's post menu (`CalloutContextMenu`) on every post in a feed, with
 * production's dialogs behind it, run on demo state:
 *
 * - Publish / Unpublish confirm, then flip the post's draft marker.
 * - Share opens production's `ShareDialog` with the post's address.
 * - Save as Template opens production's template form as a post template.
 * - Move to Top / Up / Down / Bottom reorder the feed.
 * - Delete confirms, then removes the post.
 * - Edit only says it is not in the prototype: our post form cannot open
 *   with an existing post in it yet.
 *
 * Moves use the feed's full order, so with a search or tag filter active a
 * post can move past posts that are hidden.
 */
export function usePostMenu<T extends MenuPost>(
  posts: T[],
  setPosts: Dispatch<SetStateAction<T[]>>
): { menuFor: (post: T) => ReactNode; dialogs: ReactNode } {
  const { t } = useTranslation('crd-space');
  const [, setTemplates] = useDemoTemplates();
  const [sharing, setSharing] = useState<T | null>(null);
  const [changingVisibility, setChangingVisibility] = useState<T | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [savingAsTemplate, setSavingAsTemplate] = useState<T | null>(null);

  const move = (id: string, to: (index: number, last: number) => number) =>
    setPosts(previous => {
      const from = previous.findIndex(post => post.id === id);
      if (from < 0) return previous;
      const target = Math.max(0, Math.min(previous.length - 1, to(from, previous.length - 1)));
      if (target === from) return previous;
      const next = [...previous];
      const [moved] = next.splice(from, 1);
      next.splice(target, 0, moved);
      return next;
    });

  const menuFor = (post: T) => {
    const index = posts.findIndex(p => p.id === post.id);
    const isFirst = index === 0;
    const isLast = index === posts.length - 1;
    return (
      <CalloutContextMenu
        isDraft={Boolean(post.isDraft)}
        editable={true}
        movable={posts.length > 1}
        canSaveAsTemplate={true}
        onEdit={() => toast('Editing a post is not in the prototype yet.')}
        onPublish={() => setChangingVisibility(post)}
        onUnpublish={() => setChangingVisibility(post)}
        onShare={() => setSharing(post)}
        onSaveAsTemplate={() => setSavingAsTemplate(post)}
        onMoveTop={isFirst ? undefined : () => move(post.id, () => 0)}
        onMoveUp={isFirst ? undefined : () => move(post.id, from => from - 1)}
        onMoveDown={isLast ? undefined : () => move(post.id, from => from + 1)}
        onMoveBottom={isLast ? undefined : () => move(post.id, (_, last) => last)}
        onDelete={() => setDeleting(post)}
      />
    );
  };

  const dialogs = (
    <>
      <ItemShareDialog
        open={sharing !== null}
        onOpenChange={open => !open && setSharing(null)}
        url={sharing ? postShareUrl(sharing.title) : undefined}
        itemTitle={sharing?.title ?? ''}
        dialogTitle={t('contextMenu.share')}
      />

      <CalloutVisibilityChangeDialog
        open={changingVisibility !== null}
        onOpenChange={open => !open && setChangingVisibility(null)}
        action={changingVisibility?.isDraft ? 'publish' : 'unpublish'}
        onConfirm={() => {
          const id = changingVisibility?.id;
          setPosts(previous => previous.map(post => (post.id === id ? { ...post, isDraft: !post.isDraft } : post)));
          setChangingVisibility(null);
        }}
      />

      <ConfirmationDialog
        open={deleting !== null}
        onOpenChange={open => !open && setDeleting(null)}
        variant="destructive"
        title={t('deleteCallout.title')}
        description={t('deleteCallout.description', { title: deleting?.title ?? '' })}
        confirmLabel={t('deleteCallout.confirm')}
        onConfirm={() => {
          const id = deleting?.id;
          setPosts(previous => previous.filter(post => post.id !== id));
          setDeleting(null);
        }}
        onCancel={() => setDeleting(null)}
      />

      {savingAsTemplate && (
        <TemplateEditorDialog
          key={savingAsTemplate.id}
          intent="create"
          type="callout"
          template={{
            card: {
              id: '',
              type: 'callout',
              name: savingAsTemplate.title,
              description: savingAsTemplate.snippet ?? '',
              tags: [],
              color: '',
            },
            content: buildContent('callout', savingAsTemplate.title, savingAsTemplate.snippet ?? ''),
          }}
          onCancel={() => setSavingAsTemplate(null)}
          onSubmit={template => {
            setTemplates(previous => [...previous, template]);
            setSavingAsTemplate(null);
            toast.success('Saved to the space’s templates.');
          }}
        />
      )}
    </>
  );

  return { menuFor, dialogs };
}
