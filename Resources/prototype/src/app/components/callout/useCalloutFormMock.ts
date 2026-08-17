/**
 * useCalloutFormMock — mock state for the `form` contribution type.
 *
 * Mirrors `useMediaGalleryMockUpload`, the prototype's only other stateful
 * contribution flow: it takes the feed's `posts` / `setPosts` pair, guards on
 * the presence of a question set, and rebuilds immutably so React sees the
 * change. Without this the form would demo like the `poll` stub — visible but
 * inert.
 */
import { useCallback, useState } from 'react';
import type { PostCardData } from '@/app/components/space/PostCard';
import {
  type CalloutFormAnswer,
  type CalloutFormData,
  type CalloutFormResponse,
  ownResponses,
  visibleResponses,
} from './calloutFormTypes';

export const MOCK_FORM_USER = { id: 'current-user', name: 'You' };

/** Which callout+mode the respond dialog is currently open for. */
export type FormDialogTarget = {
  postId: string;
  mode: 'respond' | 'view';
  /** Set in `view` mode — the response being read back. */
  responseId?: string;
};

interface UseCalloutFormMockParams {
  posts: PostCardData[];
  setPosts: (posts: PostCardData[]) => void;
  currentUser?: { id: string; name: string; avatarUrl?: string };
  /** Drives US3 response visibility. Flip to false to review the member's view. */
  isAdmin?: boolean;
}

export function useCalloutFormMock({
  posts,
  setPosts,
  currentUser = MOCK_FORM_USER,
  isAdmin = true,
}: UseCalloutFormMockParams) {
  const [dialogTarget, setDialogTarget] = useState<FormDialogTarget | null>(null);
  const [responsesDialogPostId, setResponsesDialogPostId] = useState<string | null>(null);
  const [settingsDialogPostId, setSettingsDialogPostId] = useState<string | null>(null);

  const formOf = useCallback(
    (postId: string): CalloutFormData | undefined => {
      const post = posts.find(p => p.id === postId);
      return post?.contributionForm;
    },
    [posts]
  );

  const submitResponse = useCallback(
    (postId: string, answers: CalloutFormAnswer[]) => {
      const response: CalloutFormResponse = {
        id: `form-response-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        author: currentUser,
        submittedAt: new Date().toISOString(),
        answers,
      };

      setPosts(
        posts.map(post => {
          if (post.id !== postId || !post.contributionForm) return post;
          return {
            ...post,
            contributionForm: {
              ...post.contributionForm,
              responses: [...post.contributionForm.responses, response],
            },
          };
        })
      );

      return response;
    },
    [posts, setPosts, currentUser]
  );

  /**
   * Applies a settings change from FormSettingsDialog. Only the two form-level
   * settings are patchable — questions and responses are never touched here, so
   * a settings edit can't silently drop collected data.
   */
  const updateFormSettings = useCallback(
    (
      postId: string,
      settings: Pick<CalloutFormData, 'responseVisibility' | 'allowMultipleResponses'>
    ) => {
      setPosts(
        posts.map(post => {
          if (post.id !== postId || !post.contributionForm) return post;
          return {
            ...post,
            contributionForm: {
              ...post.contributionForm,
              responseVisibility: settings.responseVisibility,
              allowMultipleResponses: settings.allowMultipleResponses,
            },
          };
        })
      );
    },
    [posts, setPosts]
  );

  /** Responses this viewer may see, with the US3 visibility rule applied. */
  const visibleResponsesFor = useCallback(
    (form: CalloutFormData) => visibleResponses(form, currentUser.id, isAdmin),
    [currentUser.id, isAdmin]
  );

  const ownResponsesFor = useCallback(
    (form: CalloutFormData) => ownResponses(form, currentUser.id),
    [currentUser.id]
  );

  const openRespond = useCallback((postId: string) => {
    setDialogTarget({ postId, mode: 'respond' });
  }, []);

  /** Opens the viewer's most recent response read-only. */
  const openOwnResponse = useCallback(
    (postId: string) => {
      const form = formOf(postId);
      if (!form) return;
      const own = ownResponses(form, currentUser.id);
      const latest = own[own.length - 1];
      if (!latest) return;
      setDialogTarget({ postId, mode: 'view', responseId: latest.id });
    },
    [formOf, currentUser.id]
  );

  const openResponse = useCallback((postId: string, responseId: string) => {
    setDialogTarget({ postId, mode: 'view', responseId });
  }, []);

  const closeDialog = useCallback(() => setDialogTarget(null), []);

  return {
    currentUser,
    isAdmin,
    formOf,
    submitResponse,
    updateFormSettings,
    visibleResponsesFor,
    ownResponsesFor,
    // Respond / view-single dialog
    dialogTarget,
    openRespond,
    openOwnResponse,
    openResponse,
    closeDialog,
    // All-responses table dialog
    responsesDialogPostId,
    openResponsesDialog: setResponsesDialogPostId,
    closeResponsesDialog: useCallback(() => setResponsesDialogPostId(null), []),
    // Form settings dialog
    settingsDialogPostId,
    openSettingsDialog: setSettingsDialogPostId,
    closeSettingsDialog: useCallback(() => setSettingsDialogPostId(null), []),
  };
}
