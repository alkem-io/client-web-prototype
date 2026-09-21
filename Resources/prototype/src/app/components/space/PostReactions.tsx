import { ChevronLeft, Plus, Search, Smile } from 'lucide-react';
import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { cn } from '@/lib/utils';
import { EMOJI_GROUPS, searchEmoji } from '@/app/components/space/emoji-catalog';
import {
  DEFAULT_REACTION_OPTIONS,
  type PostReaction,
  type ReactionUser,
  seedDemoReactions,
  toggleReaction,
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
  // The full catalogue replaces the quick row inside the same popover rather
  // than opening a second layer on top of it.
  const [browsing, setBrowsing] = useState(false);
  const [query, setQuery] = useState('');
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
    // Searching the catalogue means leaving the popover with the pointer is
    // normal; only the quick row is cheap enough to close on its own.
    if (browsing) return;
    cancelClose();
    closeTimer.current = setTimeout(() => setPickerOpen(false), 220);
  };

  const closePicker = () => {
    cancelClose();
    setPickerOpen(false);
    setBrowsing(false);
    setQuery('');
  };

  const choose = (emoji: string) => {
    onToggle?.(emoji);
    closePicker();
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-x-2.5 gap-y-1.5', className)}>
      {canReact && (
        <Popover
          open={pickerOpen}
          onOpenChange={next => {
            if (!next) {
              closePicker();
              return;
            }
            setPickerOpen(true);
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
            className={cn('p-1.5', browsing ? 'w-[286px] rounded-xl' : 'w-auto rounded-full')}
            onMouseEnter={cancelClose}
            onMouseLeave={closeSoon}
            onOpenAutoFocus={event => {
              if (openedByHover.current) event.preventDefault();
            }}
            onClick={event => event.stopPropagation()}
            // Radix portals the content, but React events still bubble up the
            // component tree — without this, typing a space into the search box
            // activates the card the reaction bar sits in.
            onKeyDown={event => event.stopPropagation()}
          >
            {browsing ? (
              <EmojiCatalogPicker
                mine={mine}
                query={query}
                onQueryChange={setQuery}
                onBack={() => {
                  setBrowsing(false);
                  setQuery('');
                }}
                onPick={choose}
              />
            ) : (
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
                <span className="mx-0.5 h-5 w-px shrink-0 bg-border" aria-hidden="true" />
                {/* The curated set is what the space recommends; anything else
                    is still allowed, just one step further in. */}
                <button
                  type="button"
                  aria-label="Choose another emoji"
                  className="flex size-[34px] items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setBrowsing(true)}
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              </div>
            )}
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
          onKeyDown={event => event.stopPropagation()}
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

type EmojiCatalogPickerProps = {
  mine: string | null;
  query: string;
  onQueryChange: (query: string) => void;
  onBack: () => void;
  onPick: (emoji: string) => void;
};

/** The "any emoji" half of the picker — search plus the grouped catalogue. */
function EmojiCatalogPicker({ mine, query, onQueryChange, onBack, onPick }: EmojiCatalogPickerProps) {
  const searching = query.trim().length > 0;
  const results = searching ? searchEmoji(query) : [];

  const cell = (emoji: string) => (
    <button
      key={emoji}
      type="button"
      aria-label={`React with ${emoji}`}
      aria-pressed={mine === emoji}
      className={cn(
        'flex size-[32px] items-center justify-center rounded-md text-[19px] leading-none transition-transform hover:scale-110 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        mine === emoji && 'bg-primary/12',
      )}
      onClick={() => onPick(emoji)}
    >
      {emoji}
    </button>
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 pb-1.5">
        <button
          type="button"
          aria-label="Back to the suggested emoji"
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={onBack}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            autoFocus={true}
            value={query}
            onChange={event => onQueryChange(event.target.value)}
            placeholder="Search emoji"
            aria-label="Search emoji"
            className="h-7 rounded-md pl-7 text-caption"
          />
        </div>
      </div>

      <div className="max-h-[15rem] overflow-y-auto">
        {searching ? (
          results.length > 0 ? (
            <div className="grid grid-cols-8 gap-0.5 pb-0.5">{results.map(cell)}</div>
          ) : (
            <p className="px-1 py-6 text-center text-caption text-muted-foreground">
              No emoji match “{query.trim()}”
            </p>
          )
        ) : (
          EMOJI_GROUPS.map(group => (
            <div key={group.name} className="pb-1">
              <p className="sticky top-0 bg-popover px-1 py-1 text-badge font-semibold uppercase tracking-wide text-muted-foreground">
                {group.name}
              </p>
              <div className="grid grid-cols-8 gap-0.5">
                {group.emoji.map(([emoji]) => cell(emoji))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

type ReactionBarProps = {
  /**
   * Stable identity of the thing being reacted to. Drives the demo seed, so the
   * same contribution keeps the same reactions between renders.
   */
  id: string;
  options?: readonly string[];
  canReact?: boolean;
  className?: string;
  onChange?: (reactions: PostReaction[]) => void;
};

/**
 * `PostReactions` with its own state, for surfaces that don't own reaction data.
 *
 * Every contribution to a callout — post, whiteboard, memo, link, file, task,
 * form response — is reactable on the same terms as the post it answers, and
 * none of those cards carry a reaction store of their own. Callers that *do*
 * own the data (the feed, the detail dialogs) keep using `PostReactions`.
 */
export function ReactionBar({ id, options, canReact = true, className, onChange }: ReactionBarProps) {
  const [reactions, setReactions] = useState<PostReaction[]>(() => seedDemoReactions(id, options));

  return (
    <PostReactions
      reactions={reactions}
      options={options}
      canReact={canReact}
      className={className}
      onToggle={emoji => {
        setReactions(current => {
          const next = toggleReaction(current, emoji);
          onChange?.(next);
          return next;
        });
      }}
    />
  );
}
