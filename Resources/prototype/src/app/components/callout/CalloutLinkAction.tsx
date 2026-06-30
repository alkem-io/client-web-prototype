import { ExternalLink } from 'lucide-react';
import type { MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/app/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/components/ui/tooltip';

type CalloutLinkActionProps = {
  url: string;
  displayName: string;
  isExternal: boolean;
  isValid: boolean;
  className?: string;
};

export function CalloutLinkAction({ url, displayName, isExternal, isValid, className }: CalloutLinkActionProps) {
  // Stop the click bubbling to any clickable ancestor (e.g. the surrounding
  // PostCard opens the detail dialog on click — we don't want that when the
  // user's intent is to follow the link).
  const stopBubble = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  if (!isValid) {
    return (
      <Button
        variant="outline"
        disabled={true}
        className={cn('w-full border-destructive text-destructive', className)}
        aria-label="Invalid URL"
      >
        Invalid URL
      </Button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild={true}>
        <Button variant="default" className={cn('w-full', className)} asChild={true}>
          <a
            href={url}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            aria-label={isExternal ? `${displayName} (opens in new window)` : displayName}
            onClick={stopBubble}
          >
            <span className="truncate">{displayName}</span>
            {isExternal && <ExternalLink className="size-4" aria-hidden="true" />}
          </a>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-primary-foreground">
        {isExternal && <div className="text-caption mb-0.5">Opens in a new window</div>}
        <div className="text-caption break-all">{url}</div>
      </TooltipContent>
    </Tooltip>
  );
}
