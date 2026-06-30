import {
  BarChart3,
  ChevronDown,
  FileText,
  ImagePlus,
  Images,
  type LucideIcon,
  Maximize2,
  Megaphone,
  MessageSquare,
  Presentation,
  StickyNote,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
import {
  ReferencesAndTagsStrip,
  type ReferencesAndTagsStripReference,
} from '@/app/components/callout/ReferencesAndTagsStrip';
import { ExpandableMarkdown } from '@/app/components/common/ExpandableMarkdown';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/app/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/app/components/ui/collapsible';

export type PostType = 'text' | 'whiteboard' | 'memo' | 'mediaGallery' | 'document' | 'callToAction' | 'poll';

export const POST_TYPE_DESCRIPTORS: Record<PostType, { icon: LucideIcon; label: string }> = {
  text: { icon: FileText, label: 'Post' },
  whiteboard: { icon: Presentation, label: 'Whiteboard' },
  memo: { icon: StickyNote, label: 'Memo' },
  document: { icon: FileText, label: 'Document' },
  mediaGallery: { icon: Images, label: 'Media Gallery' },
  callToAction: { icon: Megaphone, label: 'Call to Action' },
  poll: { icon: BarChart3, label: 'Poll' },
};

export type PostCardData = {
  id: string;
  type: PostType;
  author?: {
    name: string;
    avatarUrl?: string;
    profileUrl?: string;
    role?: string;
  };
  title: string;
  snippet?: string;
  timestamp?: string;
  isDraft?: boolean;
  framingImageUrl?: string;
  framingMemoMarkdown?: string;
  commentCount?: number;
  commentsEnabled?: boolean;
  descriptionExpanded?: boolean;
  references?: ReferencesAndTagsStripReference[];
  tags?: string[];
};

type PostCardProps = {
  post: PostCardData;
  href?: string;
  onClick?: () => void;
  onOpenFraming?: () => void;
  settingsSlot?: ReactNode;
  onExpandClick?: () => void;
  contributionsPreview?: ReactNode;
  children?: ReactNode;
  commentsSlot?: ReactNode;
  commentInputSlot?: ReactNode | null;
  onCommentsExpandedChange?: (expanded: boolean) => void;
  className?: string;
};

export function ProductionPostCard({
  post,
  href,
  onClick,
  onOpenFraming,
  settingsSlot,
  onExpandClick,
  contributionsPreview,
  children,
  commentsSlot,
  commentInputSlot,
  onCommentsExpandedChange,
  className,
}: PostCardProps) {
  const TypeIcon = POST_TYPE_DESCRIPTORS[post.type].icon;
  const hasCollapsibleComments = commentsSlot !== undefined;
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const handleCommentsOpenChange = (open: boolean) => {
    setIsCommentsOpen(open);
    onCommentsExpandedChange?.(open);
  };

  const commentLabel = post.commentCount
    ? `${post.commentCount} Comment${post.commentCount !== 1 ? 's' : ''}`
    : 'No comments';

  return (
    <Card
      className={cn(
        'group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border-border/60',
        post.isDraft && 'border-l-4 border-l-amber-400',
        className
      )}
    >
      <CardHeader className="relative isolate flex flex-row items-start justify-between pb-0 pt-5 px-6 space-y-0">
        {(href || onClick) && (
          <a
            href={href ?? '#'}
            tabIndex={-1}
            onClick={
              onClick
                ? e => {
                    e.preventDefault();
                    onClick();
                  }
                : undefined
            }
            className="absolute inset-0 z-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          >
            <span className="sr-only">Open {post.title}</span>
          </a>
        )}
        <div className="flex gap-3">
          {post.author &&
            (post.author.profileUrl ? (
              <a
                href={post.author.profileUrl}
                onClick={e => e.stopPropagation()}
                aria-label={post.author.name}
                className="relative z-10 block shrink-0 self-start rounded-full -m-0.5 p-0.5 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar className="w-10 h-10 border border-border">
                  {post.author.avatarUrl && <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />}
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </a>
            ) : (
              <Avatar className="w-10 h-10 border border-border">
                {post.author.avatarUrl && <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />}
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          <div>
            <div className="flex items-center gap-2">
              {post.author &&
                (post.author.profileUrl ? (
                  <a
                    href={post.author.profileUrl}
                    onClick={e => e.stopPropagation()}
                    className="relative z-10 rounded-sm text-card-title text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {post.author.name}
                  </a>
                ) : (
                  <span className="text-card-title text-foreground">{post.author.name}</span>
                ))}
              {post.timestamp && <span className="text-caption text-muted-foreground">• {post.timestamp}</span>}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {post.author?.role && (
                <Badge variant="secondary" className="text-badge h-5 px-1.5 font-normal">
                  {post.author.role}
                </Badge>
              )}
              {post.isDraft && (
                <Badge className="text-badge h-5 px-1.5 font-semibold bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-100">
                  Draft
                </Badge>
              )}
              <span className="text-caption text-muted-foreground flex items-center gap-1">
                <TypeIcon className="w-4 h-4" aria-hidden="true" />
                {POST_TYPE_DESCRIPTORS[post.type].label}
              </span>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-1">
          {onExpandClick && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={e => {
                e.stopPropagation();
                onExpandClick();
              }}
              aria-label="Expand"
            >
              <Maximize2 className="w-4 h-4" aria-hidden="true" />
            </Button>
          )}
          {settingsSlot}
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-0">
        <h3 className="text-subsection-title mb-2 text-foreground group-hover:text-primary transition-colors">
          <a
            href={href ?? '#'}
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            onClick={
              onClick
                ? e => {
                    e.preventDefault();
                    onClick();
                  }
                : undefined
            }
          >
            {post.title}
          </a>
        </h3>
        {post.snippet && (
          <ExpandableMarkdown content={post.snippet} maxLines={3} defaultExpanded={post.descriptionExpanded} />
        )}

        <ReferencesAndTagsStrip references={post.references} tags={post.tags} />

        {post.type === 'whiteboard' && (
          <button
            type="button"
            onClick={event => {
              event.stopPropagation();
              (onOpenFraming ?? onClick)?.();
            }}
            className="relative block w-full cursor-pointer overflow-hidden rounded-lg border border-border bg-muted/30 aspect-video text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-3"
          >
            {post.framingImageUrl ? (
              <img
                src={post.framingImageUrl}
                alt="Whiteboard"
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Presentation className="w-12 h-12 text-muted-foreground/50" aria-hidden="true" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <span className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground shadow-sm h-9 px-4 text-control">
                Open Whiteboard
              </span>
            </div>
          </button>
        )}

        {post.type === 'memo' && (
          <button
            type="button"
            onClick={event => {
              event.stopPropagation();
              (onOpenFraming ?? onClick)?.();
            }}
            className="relative block w-full cursor-pointer overflow-hidden rounded-lg border border-border bg-muted/30 h-32 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-3"
          >
            {post.framingMemoMarkdown ? (
              <div className="p-3 h-full text-body text-muted-foreground line-clamp-3">{post.framingMemoMarkdown}</div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <StickyNote className="w-12 h-12 text-muted-foreground/50" aria-hidden="true" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <span className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground shadow-sm h-9 px-4 text-control">
                Open Memo
              </span>
            </div>
          </button>
        )}

        {contributionsPreview}
      </CardContent>

      {children && <div className="px-6 pb-4">{children}</div>}

      {(post.commentsEnabled !== false || (post.commentCount ?? 0) > 0) &&
        (hasCollapsibleComments ? (
          <CardFooter className="!p-0 flex-col items-stretch gap-0 border-t bg-muted/5">
            <Collapsible open={isCommentsOpen} onOpenChange={handleCommentsOpenChange}>
              <CollapsibleTrigger asChild={true}>
                <button
                  type="button"
                  className="group/comments flex w-full items-center gap-2 px-6 py-3 text-caption text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={isCommentsOpen ? 'Collapse comments' : 'Expand comments'}
                >
                  <ChevronDown
                    className="size-4 transition-transform duration-200 group-data-[state=open]/comments:rotate-180"
                    aria-hidden="true"
                  />
                  <MessageSquare className="size-4" aria-hidden="true" />
                  <span>{commentLabel}</span>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pt-4 pb-4">
                <div className="flex flex-col gap-3">
                  {commentInputSlot}
                  <div className="max-h-[400px] overflow-y-auto pr-2">{commentsSlot}</div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardFooter>
        ) : (
          <CardFooter className="!py-3 flex items-center gap-4 border-t bg-muted/5 px-6">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
              onClick={event => {
                event.stopPropagation();
              }}
            >
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
              <span className="text-caption">{commentLabel}</span>
            </Button>
          </CardFooter>
        ))}
    </Card>
  );
}
