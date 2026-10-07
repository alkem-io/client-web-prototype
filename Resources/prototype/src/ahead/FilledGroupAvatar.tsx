/**
 * FilledGroupAvatar — a group chat's avatar that always fills the circle
 * (client-web#10378).
 *
 * WHAT PRODUCTION WOULD GAIN
 * Production's `GroupAvatar` is a fixed 2 × 2 grid, so two people fill only
 * the top half and three leave a quarter empty. This one divides the circle by
 * how many faces there are (the other people in the chat, not you):
 *
 *   · 1 — the whole circle
 *   · 2 — left half, right half
 *   · 3 — left half, then two quarters on the right
 *   · 4 — four quarters
 *   · 5 or more — three quarters with faces, the fourth shows "+N" for the rest
 *
 * Faces stay upright in every layout, and going from three to four people
 * changes one tile rather than the whole shape. The count tells you how big
 * the group is, which four faces alone do not.
 *
 * WHY IT IS HERE AND NOT IN CRD
 * The ask is to change `GroupAvatar` itself to this layout — same props, same
 * sizes. `ConversationAvatar` already draws both the chat list row and the
 * chat header through `GroupAvatar`, so that one change fixes both and they
 * cannot disagree. When it lands, delete this file and the stand-in that puts
 * it into the chat list (`app/components/shared/ChatGroupAvatarSlots`).
 */
import { initials } from '@/crd/components/chat/initials';
import { AVATAR_SIZE_CLASS, type AvatarSize } from '@/crd/components/chat/avatarSizes';
import type { ChatMemberAvatar } from '@/crd/components/chat/types';
import { cn } from '@/crd/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/crd/primitives/avatar';

type FilledGroupAvatarProps = {
  members: ChatMemberAvatar[];
  size?: AvatarSize;
  className?: string;
};

const HALF_LEFT = 'inset-y-0 left-0 w-1/2';
const HALF_RIGHT = 'inset-y-0 right-0 w-1/2';
const TOP_LEFT = 'left-0 top-0 size-1/2';
const TOP_RIGHT = 'right-0 top-0 size-1/2';
const BOTTOM_LEFT = 'bottom-0 left-0 size-1/2';
const BOTTOM_RIGHT = 'bottom-0 right-0 size-1/2';

/** Where each face goes, by how many faces there are. From five on, the last spot holds the count. */
const LAYOUT: Record<number, string[]> = {
  2: [HALF_LEFT, HALF_RIGHT],
  3: [HALF_LEFT, TOP_RIGHT, BOTTOM_RIGHT],
  4: [TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT],
};

export function FilledGroupAvatar({ members, size = 'md', className }: FilledGroupAvatarProps) {
  if (members.length <= 1) {
    const member = members[0];
    return (
      <Avatar aria-hidden="true" className={cn(AVATAR_SIZE_CLASS[size], 'shrink-0', className)}>
        {member?.avatarUrl && <AvatarImage src={member.avatarUrl} alt="" />}
        <AvatarFallback className="text-caption">{member ? initials(member.name) : '?'}</AvatarFallback>
      </Avatar>
    );
  }

  const withCount = members.length > 4;
  const shown = withCount ? members.slice(0, 3) : members;
  const spots = LAYOUT[withCount ? 4 : members.length];
  // Halves have room for the caption size; quarters drop to the badge size.
  const textClass = members.length === 2 ? 'text-caption' : 'text-badge';

  return (
    <div
      aria-hidden="true"
      className={cn('relative shrink-0 overflow-hidden rounded-full', AVATAR_SIZE_CLASS[size], className)}
    >
      {shown.map((member, index) => (
        <Avatar key={member.id} className={cn('absolute rounded-none', spots[index])}>
          {member.avatarUrl && <AvatarImage src={member.avatarUrl} alt="" className="object-cover" />}
          <AvatarFallback className={cn('rounded-none', index === 0 && members.length === 3 ? 'text-caption' : textClass)}>
            {initials(member.name)}
          </AvatarFallback>
        </Avatar>
      ))}
      {withCount && (
        <span
          className={cn(
            'absolute flex items-center justify-center bg-muted text-badge text-muted-foreground tabular-nums',
            BOTTOM_RIGHT
          )}
        >
          +{members.length - 3}
        </span>
      )}
    </div>
  );
}
