import type {
  ChatListItem,
  ChatMessage,
  ChatThreadHeader,
  GroupMember,
} from '@/crd/components/chat/types';
import type { Conversation, Message, UserInfo } from '@/app/components/messaging/messagingData';

/**
 * Messaging fixtures → the data types CRD's chat components export.
 *
 * Vocabulary: the prototype calls this area **messaging**; client-web calls it
 * **chat**, and its unified list mixes direct messages, groups and the pinned
 * Guidance AI conversation in one place.
 *
 * Shape differences resolved here:
 *  - `avatar` → `avatarUrl`, `unread` → `unreadCount`, `timeLabel` →
 *    `lastMessageTimestamp`
 *  - CRD needs `timestampMs` as a real sort key; the fixtures carry an ISO
 *    string, so it is parsed rather than relying on array order
 *  - reactions: `reacted` → `hasReacted`
 *  - `initials` is dropped — CRD derives its own from the display name
 *
 * Not mapped: `muted`, `isEdited`, `replyTo` and attachments. CRD's chat has no
 * field for any of them — see PHASE-2.md §12.
 */

const toMember = (user: UserInfo): GroupMember => ({
  id: user.id,
  name: user.name,
  avatarUrl: user.avatar,
});

export function toChatListItem(conversation: Conversation): ChatListItem {
  const isGroup = conversation.type !== 'dm';
  return {
    id: conversation.id,
    displayName: conversation.name,
    avatarUrl: conversation.avatar || undefined,
    isGroup,
    isGuidance: false,
    memberAvatars: isGroup
      ? conversation.members?.map(m => ({ id: m.id, name: m.name, avatarUrl: m.avatar }))
      : undefined,
    lastMessagePreview: conversation.lastMessageSender
      ? `${conversation.lastMessageSender}: ${conversation.lastMessage}`
      : conversation.lastMessage,
    lastMessageTimestamp: conversation.timeLabel,
    unreadCount: conversation.unread,
  };
}

export function toChatThreadHeader(conversation: Conversation): ChatThreadHeader {
  const isGroup = conversation.type !== 'dm';
  return {
    id: conversation.id,
    displayName: conversation.name,
    avatarUrl: conversation.avatar || undefined,
    isGroup,
    isGuidance: false,
    memberCount: conversation.memberCount ?? conversation.members?.length,
    members: conversation.members?.map(toMember),
    canManage: isGroup,
  };
}

export function toChatMessage(message: Message): ChatMessage {
  return {
    id: message.id,
    author: {
      id: message.senderId,
      name: message.senderName,
      avatarUrl: message.senderAvatar || undefined,
    },
    content: message.content,
    timestamp: message.timeLabel,
    timestampMs: Date.parse(message.timestamp) || 0,
    reactions: (message.reactions ?? []).map(r => ({
      emoji: r.emoji,
      count: r.count,
      hasReacted: r.reacted,
    })),
    isOwn: message.isOwn,
  };
}
