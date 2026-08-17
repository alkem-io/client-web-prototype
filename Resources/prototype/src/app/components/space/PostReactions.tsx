import { Plus, Smile } from 'lucide-react';
import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  DEFAULT_REACTION_OPTIONS,
  type PostReaction,
  type ReactionUser,
  VIEWER,
} from '@/app/components/space/post-reactions-data';

/** Position in the space's set; anything no longer offered sorts to the end. */
function indexIn(options: readonly string[], emoji: string) {
  const i = options.indexOf(emoji);
  return i === -1 ? options.length : i;
}

type PostReactionsProps = {
  reactions: PostReaction[];
  /**
   * The emoji on offer, in display order. One platform-wide set for v1; the
   * prop stays so per-space sets drop in later without touching this component.
   */
  options?: readonly string[];
  /** Fires with the chosen emoji, or `null` when the viewer removes their reaction. */
  onToggle?: (emoji: string) => void;
  /** Whether the viewer may react at all — read-only spaces pass `false`. */
  canReact?: boolean;
  viewer?: ReactionUser;
  className?: string;
};

function ReactorAvatar({ user, className }: { user: ReactionUser; className?: string }) {
  const isViewer = user.id === VIEWER.id;
  return (
    <Avatar className={cn('size-[26px]', className)}>
      {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
      <AvatarFallback
        className={cn(
          'text-[9px] font-semibold',
          isViewer && 'bg-primary/12 text-primary',
        )}
      >
        {user.initials}
      </AvatarFallback>
    </Avatar>
  );
}

export function PostReactions({
  reactions,
  options = DEFAULT_REACTION_OPTIONS,
  onToggle,
  canReact = true,
  viewer = VIEWER,
  className,
}: PostReactionsProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  // Hover-opening must not steal focus; a click-open should.
  const openedByHover = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mine = reactions.find(r => r.user.id === viewer.id)?.emoji ?? null;
  const total = reactions.length;

  // The viewer reads first in the dialog — seeing yourself at the top is the
  // confirmation that your tap landed.
  const ordered = [...reactions].sort((a, b) => {
    if (a.user.id === viewer.id) return -1;
    if (b.user.id === viewer.id) return 1;
    return 0;
  });

  // Which emoji were given, never how many of each. Ordered by the space's own
  // picker order rather than by frequency — sorting by count would rank them,
  // which is the comparative signal this whole concept avoids.
  const given = [...new Set(reactions.map(r => r.emoji))].sort(
    (a, b) => indexIn(options, a) - indexIn(options, b),
  );

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const openOnHover = () => {
    if (!canReact) return;
    cancelClose();
    openedByHover.current = true;
    setPickerOpen(true);
  };
  const closeSoon = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setPickerOpen(false), 220);
  };

  const choose = (emoji: string) => {
    onToggle?.(emoji);
    cancelClose();
    setPickerOpen(false);
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-x-2.5 gap-y-1.5', className)}>
      {canReact && (
        <Popover
          open={pickerOpen}
          onOpenChange={next => {
            if (!next) cancelClose();
            setPickerOpen(next);
          }}
        >
          <PopoverTrigger asChild={true}>
            {/* Not IconButton: that forces the 36px `size="icon"` box, and this
                control has to read as a peer of the 26px faces beside it. The
                popover is its own affordance, so no tooltip is layered on.

                `before` is the hover ground, `after` is an invisible hit
                expander — the drawn control is 20px, which is under the 24px
                target minimum, so the tappable box has to be bigger than what
                you see. */}
            <button
              type="button"
              aria-label="Add a reaction"
              className="relative flex size-[20px] shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors before:absolute before:-inset-[3px] before:rounded-full before:bg-accent before:opacity-0 before:transition-opacity hover:text-foreground hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:text-foreground data-[state=open]:before:opacity-100 after:absolute after:-inset-[6px] after:content-['']"
              onMouseEnter={openOnHover}
              onMouseLeave={closeSoon}
              onClick={event => {
                event.stopPropagation();
                openedByHover.current = false;
                setPickerOpen(open => !open);
              }}
            >
              {/* Plain Smile, not SmilePlus — that icon carries its own plus and
                  would collide with the badge below. */}
              <Smile className="relative size-[20px] [&>*]:stroke-[1.75]" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 -right-0.5 flex size-[10px] items-center justify-center rounded-full bg-card"
              >
                <Plus className="size-[7px] stroke-[3.5]" />
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            side="top"
            sideOffset={8}
            className="w-auto rounded-full p-1.5"
            onMouseEnter={cancelClose}
            onMouseLeave={closeSoon}
            onOpenAutoFocus={event => {
              if (openedByHover.current) event.preventDefault();
            }}
            onClick={event => event.stopPropagation()}
          >
            <div className="flex items-center gap-0.5">
              {options.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  aria-label={`React with ${emoji}`}
                  aria-pressed={mine === emoji}
                  className={cn(
                    'flex size-[34px] items-center justify-center rounded-full text-[19px] leading-none transition-transform hover:scale-115 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    mine === emoji && 'bg-primary/12',
                  )}
                  onClick={() => choose(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {total > 0 ? (
        // One object, not three. Faces beside an emoji row read as two separate
        // tallies and left people unsure what they were looking at, so the
        // emoji and the total now share a single pill that opens the full list.
        // The emoji stay exposed to assistive tech — with no name written for
        // one, the glyph is the whole signal — and the trailing hidden text
        // completes the accessible name.
        <button
          type="button"
          className="flex h-[26px] items-center gap-1.5 rounded-full border bg-muted/40 px-2.5 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={event => {
            event.stopPropagation();
            setListOpen(true);
          }}
        >
          <span className="flex items-center gap-[3px] text-[13px] leading-none">
            {given.map(emoji => (
              <span key={emoji}>{emoji}</span>
            ))}
          </span>
          <span className="text-caption font-semibold tabular-nums text-muted-foreground">
            {total}
          </span>
          <span className="sr-only">
            {total === 1 ? 'reaction — see who reacted' : 'reactions — see who reacted'}
          </span>
        </button>
      ) : (
        canReact && <span className="text-caption text-muted-foreground">React</span>
      )}

      <Dialog open={listOpen} onOpenChange={setListOpen}>
        <DialogContent
          className="max-w-sm gap-0 p-0"
          onClick={event => event.stopPropagation()}
        >
          <DialogHeader className="border-b px-4 py-3">
            <DialogTitle className="text-card-title">
              {total === 1 ? '1 reaction' : `${total} reactions`}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Everyone who reacted to this post
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[22rem] overflow-y-auto px-4 py-1">
            {ordered.map(reaction => (
              <div
                key={reaction.user.id}
                className="flex items-center gap-3 border-b py-3 last:border-b-0"
              >
                <span className="relative shrink-0">
                  <ReactorAvatar user={reaction.user} className="size-8" />
                  {/* With no name behind the emoji, it carries the meaning on its
                      own — so it stays exposed to assistive tech, not hidden. */}
                  <span className="absolute -bottom-1 -right-1 flex size-[17px] items-center justify-center rounded-full border bg-card text-[9px] leading-none">
                    {reaction.emoji}
                  </span>
                </span>
                <span className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
                  <span className="text-card-title">{reaction.user.name}</span>
                  <span className="text-caption text-muted-foreground">reacted · {reaction.at}</span>
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
