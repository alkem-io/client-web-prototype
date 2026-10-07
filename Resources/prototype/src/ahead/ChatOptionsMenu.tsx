/**
 * ChatOptionsMenu — the "more" (⋮) menu in a group chat's header
 * (client-web#10378, option D).
 *
 * WHAT PRODUCTION WOULD GAIN
 * Today a chat's header has a gear that leaves the chat for your notification
 * settings page, and a people icon that is really the group's settings. After
 * this change, inside a chat:
 *
 *   · The gear is gone. It stays in the chat list's header only, where it
 *     means your chat settings in general — in production's
 *     `UnifiedChatPanelConnector`, pass `onGoToSettings` to `ChatPanel` in the
 *     list view only.
 *   · Group chats get this menu in place of the people icon: "Group settings"
 *     (production's `GroupSettingsDialog`, unchanged) and "Leave group" (with
 *     the confirmation that dialog already uses). It is the one place a chat's
 *     own options go, so mute and pin can join it later without another icon.
 *   · Tapping the group's picture or name opens "Group settings" too.
 *   · One-to-one chats get no menu: there is nothing to put in it yet. The
 *     Guidance chat keeps its own info and clear buttons.
 *
 * WHY IT IS HERE AND NOT IN CRD
 * The menu goes into `ChatPanel`'s existing `headerActions` slot, so that part
 * needs nothing new. Tapping the picture or name does: `ChatPanel` draws them
 * as plain text, so the ask is an `onTitleClick` that turns the avatar and
 * title into one button. Until then a stand-in in the prototype's
 * `MessagesOverlay` listens for the tap (not part of the ask).
 */
import { EllipsisVertical, LogOut, Settings2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/crd/primitives/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/crd/primitives/tooltip';

type ChatOptionsMenuProps = {
  /** The trigger's tooltip and spoken name, e.g. "Chat options". */
  label: string;
  settingsLabel: string;
  onOpenSettings: () => void;
  leaveLabel: string;
  onLeave: () => void;
};

export function ChatOptionsMenu({ label, settingsLabel, onOpenSettings, leaveLabel, onLeave }: ChatOptionsMenuProps) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={label}
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
            >
              <EllipsisVertical aria-hidden="true" className="size-5" />
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="z-[60] min-w-44">
        <DropdownMenuItem onSelect={onOpenSettings}>
          <Settings2 aria-hidden="true" />
          {settingsLabel}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={onLeave}>
          <LogOut aria-hidden="true" />
          {leaveLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
