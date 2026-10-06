/**
 * TimeGroupedChatThreadView — a chat thread that shows fewer times
 * (client-web#10377, option C).
 *
 * WHAT PRODUCTION WOULD GAIN
 * Production's `ChatThreadView` puts a "3 days ago" line under every message,
 * so a few short messages in a row take twice the room they need. This shows
 * time only where it tells you something:
 *
 *   · Messages are grouped: same sender, each within 5 minutes of the one
 *     before, nobody else in between, same day. Avatar and name show on the
 *     first message of a group (group chats only, as production does today).
 *   · Each day opens with a separator carrying the time the conversation
 *     started: "Today 10:30", "Yesterday 16:05", "Tuesday 10 February 15:20".
 *   · After an hour without messages, a small time marks where it picked up.
 *   · No time under individual messages. Hover or focus a message on desktop
 *     for its exact time; tap it on a touch screen and the time opens under it.
 *   · Every message still starts with its time for screen readers.
 *
 * Times are clock times in the reader's own format (10:30 or 10:30 AM), and
 * "Today"/"Yesterday" and the dates come from the browser's own translations,
 * so no new copy is needed.
 *
 * WHY IT IS HERE AND NOT IN CRD
 * Production's thread hard-wires the per-message time and groups by sender
 * only. The upstream ask:
 *   1. `computeMessageRunFlags` also breaks a run on a gap over 5 minutes or a
 *      new day (`timestampMs` is already on every `ChatMessage`).
 *   2. `ChatMessageBubble` gets a way to leave out its timestamp line.
 *   3. `ChatThreadView` renders the day separators, the after-a-pause times and
 *      the exact-time tooltip / tap.
 * This file renders production's own `ChatMessageBubble` (passing an empty
 * timestamp) and `CommentInput`, so what remains is exactly that list. When it
 * lands, delete this file and point `MessagesOverlay` back at `ChatThreadView`.
 *
 * Corners tighten where bubbles in a group meet, so a group reads as one
 * block: production's bubble has one fixed shape, so the corners are set from
 * out here by reaching into it (`GROUP_CORNERS`). That is a stand-in. The
 * upstream ask is a `groupPosition` prop on `ChatMessageBubble`
 * ('single' | 'first' | 'middle' | 'last').
 *
 * Not built here, though the design has it: reactions overlapping the bubble's
 * bottom edge. That lives inside `ChatMessageBubble`. See the review page linked from
 * `src/mockups/artifacts/chat-message-grouping.html`.
 */
import { Loader2 } from 'lucide-react';
import { type PointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatMessageBubble } from '@/crd/components/chat/ChatMessageBubble';
import type { ChatMessage, ChatThreadHeader } from '@/crd/components/chat/types';
import { CommentInput } from '@/crd/components/comment/CommentInput';
import type { CommentAuthor, ComposerAttachment } from '@/crd/components/comment/types';
import { cn } from '@/crd/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/crd/primitives/tooltip';

const GROUP_GAP_MS = 5 * 60 * 1000;
const PAUSE_MS = 60 * 60 * 1000;

type TimeGroupedChatThreadViewProps = {
  conversation?: ChatThreadHeader;
  messages: ChatMessage[];
  messagesLoading: boolean;
  currentUser?: CommentAuthor;
  isSending?: boolean;
  canReact?: boolean;
  isAwaitingGuidanceResponse?: boolean;
  draft?: string;
  onDraftChange?: (value: string) => void;
  onSendMessage?: (content: string) => void;
  onAddReaction?: (messageId: string, emoji: string) => void;
  onRemoveReaction?: (messageId: string, emoji: string) => void;
  attachmentsEnabled?: boolean;
  attachments?: ComposerAttachment[];
  onAttachFiles?: (files: File[]) => void;
  onRemoveAttachment?: (id: string) => void;
  attachmentError?: string;
  acceptMimeTypes?: string;
};

type Row = {
  message: ChatMessage;
  /** Day separator above this message, with the time the day's conversation started. */
  dayStart: boolean;
  /** Same day, but more than an hour since the previous message. */
  afterPause: boolean;
  /** First message of a group: more space above, avatar and name in group chats. */
  firstOfGroup: boolean;
  lastOfGroup: boolean;
};

type GroupPosition = 'single' | 'first' | 'middle' | 'last';

/**
 * Production's bubble is `rounded-2xl` with one small "tail" corner at the
 * bottom on the sender's side. Within a group, the corners on the sender's side
 * go small wherever the bubble touches another one; the last bubble gets its
 * round bottom corner back. `first` and `single` already match production.
 */
const GROUP_CORNERS: Record<'own' | 'other', Record<GroupPosition, string>> = {
  other: {
    single: '',
    first: '',
    middle: '[&_.rounded-2xl]:rounded-tl-sm',
    last: '[&_.rounded-2xl]:rounded-tl-sm [&_.rounded-2xl]:rounded-bl-2xl',
  },
  own: {
    single: '',
    first: '',
    middle: '[&_.rounded-2xl]:rounded-tr-sm',
    last: '[&_.rounded-2xl]:rounded-tr-sm [&_.rounded-2xl]:rounded-br-2xl',
  },
};

const groupPosition = (first: boolean, last: boolean): GroupPosition =>
  first && last ? 'single' : first ? 'first' : last ? 'last' : 'middle';

const startOfDay = (ms: number) => {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const senderKey = (m: ChatMessage) => (m.isOwn ? 'own' : m.author?.id);

function toRows(messages: ChatMessage[]): Row[] {
  const rows = messages.map((message, index) => {
    const previous = messages[index - 1];
    const dayStart = !previous || startOfDay(previous.timestampMs) !== startOfDay(message.timestampMs);
    const gap = previous ? message.timestampMs - previous.timestampMs : Number.POSITIVE_INFINITY;
    const sameSender = !!previous && !!message.author && senderKey(previous) === senderKey(message);
    return {
      message,
      dayStart,
      afterPause: !dayStart && gap >= PAUSE_MS,
      firstOfGroup: dayStart || !sameSender || gap > GROUP_GAP_MS,
      lastOfGroup: true,
    };
  });
  rows.forEach((row, index) => {
    row.lastOfGroup = index === rows.length - 1 || rows[index + 1].firstOfGroup;
  });
  return rows;
}

function useTimeFormat() {
  const { i18n } = useTranslation();
  return useMemo(() => {
    const locale = i18n.language || undefined;
    const time = new Intl.DateTimeFormat(locale, { timeStyle: 'short' });
    const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const thisYear = new Date().getFullYear();
    const capitalise = (s: string) => s.charAt(0).toLocaleUpperCase(locale) + s.slice(1);

    const day = (ms: number) => {
      const daysAgo = Math.round((startOfDay(Date.now()) - startOfDay(ms)) / 86_400_000);
      if (daysAgo === 0 || daysAgo === 1) return capitalise(relative.format(-daysAgo, 'day'));
      const sameYear = new Date(ms).getFullYear() === thisYear;
      return new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        ...(sameYear ? {} : { year: 'numeric' }),
      }).format(ms);
    };
    const clock = (ms: number) => time.format(ms);
    return { day, clock, exact: (ms: number) => `${day(ms)}, ${clock(ms)}` };
  }, [i18n.language]);
}

export function TimeGroupedChatThreadView({
  conversation,
  messages,
  messagesLoading,
  currentUser,
  isSending,
  canReact,
  isAwaitingGuidanceResponse,
  draft,
  onDraftChange,
  onSendMessage,
  onAddReaction,
  onRemoveReaction,
  attachmentsEnabled,
  attachments,
  onAttachFiles,
  onRemoveAttachment,
  attachmentError,
  acceptMimeTypes,
}: TimeGroupedChatThreadViewProps) {
  const { t } = useTranslation('crd-chat');
  const format = useTimeFormat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());

  const isGroup = conversation?.isGroup ?? false;
  const rows = useMemo(() => toRows(messages), [messages]);
  const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [lastMessageId]);

  // Touch has no hover: a tap on the message opens its time underneath, a
  // second tap closes it. Taps on the message's own buttons (reactions) pass.
  const onTap = (id: string) => (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch') return;
    if ((event.target as HTMLElement).closest('button, a')) return;
    setRevealed(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* `@container` + `80cqw`: works around UPSTREAM-BUGS.md §5. Production's
          bubble is capped at 85% of a box that shrinks to fit the text, so short
          messages wrap word by word. Capping it at 80% of the thread instead (leaving room for the avatar column)
          gives the bubble its full width. Drop this when §5 is fixed. */}
      <div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pt-1 pb-3 [&_.rounded-2xl]:max-w-[80cqw]">
        {messagesLoading && messages.length === 0 ? (
          <output className="m-auto text-caption text-muted-foreground" aria-label={t('thread.loading')}>
            {t('thread.loading')}
          </output>
        ) : (
          rows.map(({ message, dayStart, afterPause, firstOfGroup, lastOfGroup }) => {
            const ms = message.timestampMs;
            const hasTime = ms > 0;
            const isOpen = revealed.has(message.id);
            return (
              <div key={message.id} className="flex flex-col">
                {hasTime && dayStart && (
                  <div className="mt-3 mb-1 self-center rounded-full bg-muted px-2.5 py-0.5 text-caption text-muted-foreground">
                    {format.day(ms)} {format.clock(ms)}
                  </div>
                )}
                {hasTime && afterPause && (
                  <div className="mt-3 self-center text-caption text-muted-foreground">{format.clock(ms)}</div>
                )}
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild={true}>
                    {/* biome-ignore lint/a11y/noNoninteractiveTabindex: focus shows the exact time */}
                    <div
                      tabIndex={hasTime ? 0 : -1}
                      onPointerUp={hasTime ? onTap(message.id) : undefined}
                      className={cn(
                        'flex flex-col rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        firstOfGroup ? 'mt-3' : 'mt-0.5',
                        GROUP_CORNERS[message.isOwn ? 'own' : 'other'][groupPosition(firstOfGroup, lastOfGroup)]
                      )}
                    >
                      {hasTime && <span className="sr-only">{format.exact(ms)}</span>}
                      <ChatMessageBubble
                        message={{ ...message, timestamp: '' }}
                        showAuthor={isGroup && firstOfGroup}
                        showAvatar={isGroup && firstOfGroup}
                        avatarGutter={isGroup && !message.isOwn && !!message.author}
                        canReact={canReact}
                        onAddReaction={onAddReaction ? emoji => onAddReaction(message.id, emoji) : undefined}
                        onRemoveReaction={onRemoveReaction ? emoji => onRemoveReaction(message.id, emoji) : undefined}
                      />
                      {isOpen && (
                        <span
                          aria-hidden="true"
                          className={cn(
                            'px-1 pt-0.5 text-caption text-muted-foreground',
                            message.isOwn ? 'self-end' : 'self-start',
                            isGroup && !message.isOwn && 'pl-11'
                          )}
                        >
                          {format.exact(ms)}
                        </span>
                      )}
                    </div>
                  </TooltipTrigger>
                  {hasTime && (
                    <TooltipContent
                      side="top"
                      align={message.isOwn ? 'end' : 'start'}
                      // In group chats, line up with the bubble rather than the avatar.
                      alignOffset={isGroup && !message.isOwn ? 40 : 0}
                    >
                      {format.exact(ms)}
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            );
          })
        )}
        {isAwaitingGuidanceResponse && (
          <output
            className="mt-3 flex items-center gap-2 self-start rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-caption text-muted-foreground"
            aria-label={t('guidance.thinking')}
          >
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            {t('guidance.thinking')}
          </output>
        )}
        <div ref={bottomRef} />
      </div>
      {onSendMessage && (
        <div className="shrink-0 border-t border-border p-2">
          <CommentInput
            currentUser={currentUser}
            onSubmit={onSendMessage}
            disabled={isSending || isAwaitingGuidanceResponse}
            refocusAfterSubmit={true}
            value={draft}
            onValueChange={onDraftChange}
            attachmentsEnabled={attachmentsEnabled}
            attachments={attachments}
            onAttachFiles={onAttachFiles}
            onRemoveAttachment={onRemoveAttachment}
            attachmentError={attachmentError}
            acceptMimeTypes={acceptMimeTypes}
          />
        </div>
      )}
    </div>
  );
}
