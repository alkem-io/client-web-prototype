/**
 * Chat panel — production's `@/crd/components/chat/*`.
 *
 * The prototype calls this area **messaging**; client-web calls it **chat**,
 * and models it as a slide-over panel rather than a full-screen overlay:
 * `ChatPanel` holds the frame, and its body is either the unified conversation
 * list or one thread. That is what this now renders.
 *
 * CRD owns the list (with its own search), the thread (message bubbles grouped
 * into runs, the composer, reactions), the group avatars and the empty/loading
 * states. What stays here is the mock data wiring and the draft/reaction state.
 *
 * The overlay's own small `CONTACTS` fixture is gone — it duplicated a subset
 * of `messagingData`, which the rest of the messaging surfaces already use, so
 * the panel now reads the same conversations they do.
 *
 * NOT converted, deliberately: the prototype's space channels
 * (`SpaceChannelView`, `SpaceChatTab`, `SpaceChannelComposer`). Production has
 * no channel concept — those are prototype-ahead. See PHASE-2.md §12.
 */
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatConversationList } from '@/crd/components/chat/ChatConversationList';
import { FloatingChatLauncher } from '@/crd/components/chat/FloatingChatLauncher';
import { ChatPanel } from '@/crd/components/chat/ChatPanel';
import { ChatThreadView } from '@/crd/components/chat/ChatThreadView';
import type { ChatMessage } from '@/crd/components/chat/types';
import { CONVERSATIONS, MESSAGES } from '@/app/components/messaging/messagingData';
import { toChatListItem, toChatMessage, toChatThreadHeader } from '@/app/mappers/chat';
import { useScreenSize } from '@/crd/hooks/useMediaQuery';
import { useMessages } from '@/app/contexts/MessagesContext';

const CURRENT_USER = { id: 'me', name: 'You' };

export function MessagesOverlay() {
  const { isOpen, openMessages, closeMessages } = useMessages();
  const { t } = useTranslation('crd-chat');
  const { isSmallScreen } = useScreenSize();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState<Record<string, ChatMessage[]>>({});

  const conversations = useMemo(() => CONVERSATIONS.map(toChatListItem), []);
  const unreadCount = useMemo(
    () => conversations.reduce((total, c) => total + c.unreadCount, 0),
    [conversations]
  );
  const selected = CONVERSATIONS.find(c => c.id === selectedId) ?? null;

  const messages = useMemo<ChatMessage[]>(() => {
    if (!selectedId) return [];
    const base = (MESSAGES[selectedId] ?? []).map(toChatMessage);
    return [...base, ...(sent[selectedId] ?? [])].sort((a, b) => a.timestampMs - b.timestampMs);
  }, [selectedId, sent]);

  const send = (content: string) => {
    if (!selectedId || !content.trim()) return;
    const now = Date.now();
    setSent(prev => ({
      ...prev,
      [selectedId]: [
        ...(prev[selectedId] ?? []),
        {
          id: `local-${now}`,
          author: CURRENT_USER,
          content,
          timestamp: 'Just now',
          timestampMs: now,
          reactions: [],
          isOwn: true,
        },
      ],
    }));
    setDraft('');
  };

  const close = () => {
    closeMessages();
    setSelectedId(null);
  };

  return (
    <>
      {/* Production's single floating entry point, bottom-right. It carries the
          unread badge and doubles as the close control while the panel is open. */}
      <FloatingChatLauncher
        isOpen={isOpen}
        unreadCount={unreadCount}
        // On a small screen the panel goes fullscreen, so the bubble would sit
        // on top of it — production hides it in exactly this case.
        hidden={isSmallScreen && isOpen}
        onClick={() => (isOpen ? close() : openMessages())}
        openLabel={t('launcher.open')}
        closeLabel={t('launcher.close')}
        unreadLabel={t('launcher.unreadLabel')}
      />

        <ChatPanel
        open={isOpen}
        title={selected ? selected.name : t('panel.title')}
        onClose={close}
        closeLabel={t('launcher.close')}
        // The back arrow only exists inside a thread — it returns to the list.
        onBack={selected ? () => setSelectedId(null) : undefined}
        backLabel={t('actions.cancel')}
        settingsLabel={t('panel.settings')}
      >
        {selected ? (
          <ChatThreadView
            conversation={toChatThreadHeader(selected)}
            messages={messages}
            messagesLoading={false}
            currentUser={CURRENT_USER}
            canReact={true}
            draft={draft}
            onDraftChange={setDraft}
            onSendMessage={send}
          />
        ) : (
          <ChatConversationList
            conversations={conversations}
            isLoading={false}
            onSelectConversation={setSelectedId}
            onNewMessage={() => {}}
          />
        )}
      </ChatPanel>
    </>
  );
}
