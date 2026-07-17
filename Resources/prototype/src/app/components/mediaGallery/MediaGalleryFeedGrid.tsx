import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { IconButton } from '@/app/components/ui/icon-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';

export type MediaGalleryFeedThumbnail = {
  id: string;
  url: string;
  alternativeText?: string;
  uploadedBy?: { id: string; name: string };
  canDelete?: boolean;
};

type MediaGalleryFeedGridProps = {
  thumbnails: MediaGalleryFeedThumbnail[];
  totalCount: number;
  onOpenAt?: (index?: number) => void;
  onDeleteThumbnail?: (thumbnail: MediaGalleryFeedThumbnail) => void;
  className?: string;
};

/**
 * Feed-level preview grid for media-gallery-framed callouts. Shapes/classes deliberately
 * mirror `ContributionsPreviewConnector`'s whiteboard-contribution grid so the two
 * look identical at a glance. When `totalCount > thumbnails.length`, the last cell
 * renders as a "+N more" overlay reading `+{totalCount - (thumbnails.length - 1)} more`.
 *
 * Supports per-image delete affordance: hover-reveal delete icon when `onDeleteThumbnail`
 * is passed and the thumbnail has `canDelete: true`.
 */
export function MediaGalleryFeedGrid({
  thumbnails,
  totalCount,
  onOpenAt,
  onDeleteThumbnail,
  className,
}: MediaGalleryFeedGridProps) {
  const [pendingDelete, setPendingDelete] = useState<MediaGalleryFeedThumbnail | null>(null);

  if (thumbnails.length === 0) return null;

  // Always show exactly 4 tiles: first 3 as images, 4th as "+N more" if there are more images
  const MAX_VISIBLE_TILES = 4;
  const MAX_INDIVIDUAL_IMAGES = 3;

  const visibleThumbnails = thumbnails.slice(0, MAX_INDIVIDUAL_IMAGES);
  const hasOverflow = totalCount > MAX_INDIVIDUAL_IMAGES;
  const overflowThumbnail = hasOverflow && thumbnails.length > MAX_INDIVIDUAL_IMAGES ? thumbnails[MAX_INDIVIDUAL_IMAGES] : undefined;
  const moreCount = hasOverflow ? totalCount - MAX_INDIVIDUAL_IMAGES : 0;

  const handleDeleteConfirm = () => {
    if (pendingDelete) {
      onDeleteThumbnail?.(pendingDelete);
      setPendingDelete(null);
    }
  };

  return (
    <>
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4', className)}>
        {visibleThumbnails.map((thumbnail, index) => (
          <div
            key={thumbnail.id}
            className="group/mg relative w-full rounded-lg overflow-hidden border border-border bg-muted/30 aspect-video"
          >
            <button
              type="button"
              className="absolute inset-0 w-full h-full cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-left flex items-center justify-center"
              onClick={() => onOpenAt?.(index)}
              aria-label="Open image"
            >
              <img
                src={thumbnail.url}
                alt={thumbnail.alternativeText ?? ''}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/mg:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/mg:opacity-100 transition-opacity duration-200 bg-primary/40">
                <span className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground shadow-lg h-8 px-3 text-caption font-semibold">
                  Open image
                </span>
              </div>
            </button>

            {onDeleteThumbnail && thumbnail.canDelete && (
              <IconButton
                variant="ghost"
                tooltipLabel="Delete image"
                className="absolute top-2 right-2 z-10 w-7 h-7 bg-black/50 text-white hover:bg-destructive hover:text-white opacity-0 group-hover/mg:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setPendingDelete(thumbnail);
                }}
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              </IconButton>
            )}
          </div>
        ))}

        {hasOverflow && overflowThumbnail && (
          <button
            key={overflowThumbnail.id}
            type="button"
            className="relative w-full rounded-lg overflow-hidden border border-border bg-muted/30 aspect-video cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => onOpenAt?.()}
            aria-label={`Show ${moreCount} more images`}
          >
            <img src={overflowThumbnail.url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-primary/60 backdrop-blur-[2px]">
              <span className="text-white font-bold text-subsection-title">
                +{moreCount} more
              </span>
            </div>
          </button>
        )}
      </div>

      <Dialog open={!!pendingDelete} onOpenChange={() => setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
