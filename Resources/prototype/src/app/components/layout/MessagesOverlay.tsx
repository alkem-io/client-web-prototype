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
 * The thread itself is `TimeGroupedChatThreadView` from `src/ahead/` rather
 * than CRD's `ChatThreadView`: it groups messages by time and shows a time only
 * at the start of a day and after a pause (client-web#10377). It still renders
 * CRD's own bubbles and composer.
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
import type { ChatMessage } from '@/crd/components/chat/types';
import { CONVERSATIONS, MESSAGES } from '@/app/components/messaging/messagingData';
import { toChatListItem, toChatMessage, toChatThreadHeader } from '@/app/mappers/chat';
import { useScreenSize } from '@/crd/hooks/useMediaQuery';
import { useMessages } from '@/app/contexts/MessagesContext';
import { TimeGroupedChatThreadView } from '@/ahead/TimeGroupedChatThreadView';

const CURRENT_USER = { id: 'me', name: 'You' };

/**
 * The fixtures are written as if "today" were 12 February 2026. Move them by
 * whole days so that day lands on the real today, keeping each message's time
 * of day — otherwise every separator would read "Thursday 12 February".
 */
const FIXTURE_TODAY = new Date(2026, 1, 12);
const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);
const FIXTURE_DAY_SHIFT = startOfToday.getTime() - FIXTURE_TODAY.getTime();

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
    const base = (MESSAGES[selectedId] ?? [])
      .map(toChatMessage)
      .map(m => ({ ...m, timestampMs: m.timestampMs + FIXTURE_DAY_SHIFT }));
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
          <TimeGroupedChatThreadView
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
