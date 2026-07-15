import { cn } from '@/lib/utils';

type CroppedMarkdownProps = {
  content: string;
  maxHeight?: string;
  className?: string;
};

/**
 * Renders markdown content as plain text with overflow hidden, cropped to the given maxHeight.
 * Used in contribution memo card previews.
 */
export function CroppedMarkdown({ content, maxHeight = '180px', className }: CroppedMarkdownProps) {
  return (
    <div
      className={cn('overflow-hidden text-sm text-foreground whitespace-pre-wrap break-words', className)}
      style={{ maxHeight }}
    >
      {content}
    </div>
  );
}
