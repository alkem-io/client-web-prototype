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
 * The header follows client-web#10378: the gear (notification settings) shows
 * in the list only; inside a group chat a "more" menu (`@/ahead/ChatOptionsMenu`)
 * holds group settings and leaving, and tapping the group's picture or name
 * opens group settings too. Group avatars fill the circle
 * (`@/ahead/FilledGroupAvatar`), in the header and — through a stand-in,
 * `ChatGroupAvatarSlots` — in the list.
 *
 * NOT converted, deliberately: the prototype's space channels
 * (`SpaceChannelView`, `SpaceChatTab`, `SpaceChannelComposer`). Production has
 * no channel concept — those are prototype-ahead. See PHASE-2.md §12.
 */
import { type MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ChatConversationList } from '@/crd/components/chat/ChatConversationList';
import { ConversationAvatar } from '@/crd/components/chat/ConversationAvatar';
import { GroupSettingsDialog } from '@/crd/components/chat/GroupSettingsDialog';
import { ConfirmationDialog } from '@/crd/components/dialogs/ConfirmationDialog';
import { FloatingChatLauncher } from '@/crd/components/chat/FloatingChatLauncher';
import { ChatPanel } from '@/crd/components/chat/ChatPanel';
import type { ChatMessage } from '@/crd/components/chat/types';
import { CONVERSATIONS, MESSAGES, USERS } from '@/app/components/messaging/messagingData';
import { toChatListItem, toChatMessage, toChatThreadHeader } from '@/app/mappers/chat';
import { useScreenSize } from '@/crd/hooks/useMediaQuery';
import { useMessages } from '@/app/contexts/MessagesContext';
import { TimeGroupedChatThreadView } from '@/ahead/TimeGroupedChatThreadView';
import { ChatOptionsMenu } from '@/ahead/ChatOptionsMenu';
import { FilledGroupAvatar } from '@/ahead/FilledGroupAvatar';
import { ChatGroupAvatarSlots } from '@/app/components/shared/ChatGroupAvatarSlots';

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

const NOTIFICATION_SETTINGS_URL = '/user/alex-rivera/settings/notifications';

/** Production's `ChatPanel` draws the header's avatar and title as plain elements. */
const HEADER_TITLE_SELECTOR = 'header > span.text-subsection-title, header > span[aria-hidden]';

export function MessagesOverlay() {
  const { isOpen, openMessages, closeMessages } = useMessages();
  const { t } = useTranslation('crd-chat');
  const { isSmallScreen } = useScreenSize();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState<Record<string, ChatMessage[]>>({});

  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const [groupSettingsOpen, setGroupSettingsOpen] = useState(false);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const [leftIds, setLeftIds] = useState<string[]>([]);
  const [renamed, setRenamed] = useState<Record<string, string>>({});
  const [memberIds, setMemberIds] = useState<Record<string, string[]>>({});
  const [memberSearch, setMemberSearch] = useState('');

  // The prototype's own edits to the fixtures: renamed groups, added or removed
  // people, groups you left.
  const chats = useMemo(
    () =>
      CONVERSATIONS.filter(c => !leftIds.includes(c.id)).map(c => ({
        ...c,
        name: renamed[c.id] ?? c.name,
        members: memberIds[c.id]
          ? memberIds[c.id].map(id => Object.values(USERS).find(u => u.id === id)!).filter(Boolean)
          : c.members,
      })),
    [leftIds, renamed, memberIds]
  );

  const conversations = useMemo(() => chats.map(toChatListItem), [chats]);
  const unreadCount = useMemo(
    () => conversations.reduce((total, c) => total + c.unreadCount, 0),
    [conversations]
  );
  const selected = chats.find(c => c.id === selectedId) ?? null;
  const selectedItem = conversations.find(c => c.id === selectedId);
  const isGroup = selectedItem?.isGroup ?? false;
  const groupMembers = (selected?.members ?? []).map(m => ({ id: m.id, name: m.name, avatarUrl: m.avatar }));

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

  const leaveGroup = () => {
    if (!selectedId) return;
    setLeftIds(prev => [...prev, selectedId]);
    setLeaveConfirmOpen(false);
    setGroupSettingsOpen(false);
    setSelectedId(null);
  };

  // Stand-in for an `onTitleClick` on `ChatPanel` (see `ChatOptionsMenu`):
  // tapping a group's picture or name opens its settings. The menu is the way
  // in from the keyboard; this is the shortcut for pointer and touch.
  const openSettingsFromTitle = (event: MouseEvent) => {
    if (!isGroup) return;
    if ((event.target as Element).closest(HEADER_TITLE_SELECTOR)) setGroupSettingsOpen(true);
  };
  useEffect(() => {
    const targets = panelRef.current?.querySelectorAll(HEADER_TITLE_SELECTOR) ?? [];
    for (const el of targets) {
      el.classList.toggle('cursor-pointer', isGroup);
      el.classList.toggle('hover:underline', isGroup && el.matches('.text-subsection-title'));
    }
  }, [isGroup, isOpen, selectedId]);

  const titleAvatar = selectedItem ? (
    selectedItem.isGroup && !selectedItem.avatarUrl ? (
      <FilledGroupAvatar members={selectedItem.memberAvatars ?? []} size="sm" />
    ) : (
      <ConversationAvatar
        size="sm"
        displayName={selectedItem.displayName}
        avatarUrl={selectedItem.avatarUrl}
        isGroup={selectedItem.isGroup}
        isGuidance={selectedItem.isGuidance}
        memberAvatars={selectedItem.memberAvatars}
      />
    )
  ) : undefined;

  const searchResults = useMemo(() => {
    const query = memberSearch.trim().toLowerCase();
    if (!query) return [];
    return Object.values(USERS)
      .filter(u => u.id !== 'me' && !groupMembers.some(m => m.id === u.id) && u.name.toLowerCase().includes(query))
      .map(u => ({ id: u.id, displayName: u.name, avatarUrl: u.avatar }));
  }, [memberSearch, groupMembers]);

  const setMembers = (ids: string[]) => {
    if (selectedId) setMemberIds(prev => ({ ...prev, [selectedId]: ids }));
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

      <div ref={panelRef} className="contents" onClick={openSettingsFromTitle}>
      <ChatPanel
        open={isOpen}
        title={selected ? selected.name : t('panel.title')}
        onClose={close}
        closeLabel={t('launcher.close')}
        // The back arrow only exists inside a thread — it returns to the list.
        onBack={selected ? () => setSelectedId(null) : undefined}
        backLabel={t('thread.back')}
        // The gear is about chat in general, so it shows in the list only.
        onGoToSettings={
          selected
            ? undefined
            : () => {
                close();
                navigate(NOTIFICATION_SETTINGS_URL);
              }
        }
        settingsLabel={t('panel.settings')}
        titleAvatar={titleAvatar}
        headerActions={
          isGroup ? (
            <ChatOptionsMenu
              label="Chat options"
              settingsLabel={t('group.settings')}
              onOpenSettings={() => setGroupSettingsOpen(true)}
              leaveLabel={t('group.leave')}
              onLeave={() => setLeaveConfirmOpen(true)}
            />
          ) : undefined
        }
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
          <ChatGroupAvatarSlots
            groups={conversations
              .filter(c => c.isGroup && !c.avatarUrl)
              .map(c => ({ name: c.displayName, members: c.memberAvatars ?? [] }))}
          >
            <ChatConversationList
              conversations={conversations}
              isLoading={false}
              onSelectConversation={setSelectedId}
              onNewMessage={() => {}}
            />
          </ChatGroupAvatarSlots>
        )}
      </ChatPanel>
      </div>

      {selected && isGroup && (
        <>
          <GroupSettingsDialog
            open={groupSettingsOpen}
            onOpenChange={open => {
              setGroupSettingsOpen(open);
              if (!open) setMemberSearch('');
            }}
            displayName={selected.name}
            members={[
              { id: 'me', name: USERS.me.name, avatarUrl: USERS.me.avatar, isCurrentUser: true },
              ...groupMembers,
            ]}
            avatarSlot={
              <span className="flex items-center gap-3 p-1">
                <FilledGroupAvatar members={groupMembers} size="lg" />
                <span className="text-control text-muted-foreground">{t('group.avatar.edit')}</span>
              </span>
            }
            searchQuery={memberSearch}
            onSearchChange={setMemberSearch}
            searchResults={searchResults}
            onAddMember={id => setMembers([...groupMembers.map(m => m.id), id])}
            onRemoveMember={id => setMembers(groupMembers.map(m => m.id).filter(m => m !== id))}
            onLeaveGroup={leaveGroup}
            onSave={name => {
              setRenamed(prev => ({ ...prev, [selected.id]: name.trim() || selected.name }));
              setGroupSettingsOpen(false);
            }}
          />
          <ConfirmationDialog
            open={leaveConfirmOpen}
            onOpenChange={setLeaveConfirmOpen}
            title={t('group.leaveConfirm.title')}
            description={t('group.leaveConfirm.description')}
            confirmLabel={t('group.leaveConfirm.confirm')}
            variant="destructive"
            onConfirm={leaveGroup}
          />
        </>
      )}
    </>
  );
}
