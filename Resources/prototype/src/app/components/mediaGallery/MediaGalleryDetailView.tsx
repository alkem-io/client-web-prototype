import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/app/components/ui/button';
import { IconButton } from '@/app/components/ui/icon-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/app/components/ui/dialog';
import { MediaGalleryFeedThumbnail } from './MediaGalleryFeedGrid';

type MediaGalleryDetailViewProps = {
  thumbnails: MediaGalleryFeedThumbnail[];
  initialIndex?: number;
  onDeleteThumbnail?: (thumbnail: MediaGalleryFeedThumbnail) => void;
  className?: string;
};

export function MediaGalleryDetailView({
  thumbnails,
  initialIndex = 0,
  onDeleteThumbnail,
  className,
}: MediaGalleryDetailViewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [pendingDelete, setPendingDelete] = useState<MediaGalleryFeedThumbnail | null>(null);

  const currentThumbnail = thumbnails[currentIndex];

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? thumbnails.length - 1 : prev - 1));
  }, [thumbnails.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === thumbnails.length - 1 ? 0 : prev + 1));
  }, [thumbnails.length]);

  const handleDeleteConfirm = () => {
    if (pendingDelete) {
      onDeleteThumbnail?.(pendingDelete);
      setPendingDelete(null);
      // Move to previous image if we deleted the current one
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  if (!currentThumbnail || thumbnails.length === 0) return null;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main image with navigation */}
      <div className="relative bg-muted/50 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
        <img
          src={currentThumbnail.url}
          alt={currentThumbnail.alternativeText ?? ''}
          className="w-full h-full object-contain"
        />

        {/* Left arrow */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        {/* Right arrow */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        {/* Delete button (top-right) */}
        {onDeleteThumbnail && currentThumbnail.canDelete && (
          <IconButton
            variant="ghost"
            tooltipLabel="Delete image"
            className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/50 text-white hover:bg-destructive hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              setPendingDelete(currentThumbnail);
            }}
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </IconButton>
        )}

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1.5 rounded-full text-caption font-medium">
          {currentIndex + 1} / {thumbnails.length}
        </div>
      </div>

      {/* Thumbnail carousel */}
      {thumbnails.length > 1 && (
        <div className="space-y-2">
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2">
              {thumbnails.map((thumb, index) => (
                <button
                  key={thumb.id}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'relative shrink-0 rounded-md overflow-hidden border-2 transition-all',
                    'w-16 h-16 cursor-pointer hover:opacity-80',
                    currentIndex === index ? 'border-primary' : 'border-border/50'
                  )}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={thumb.url}
                    alt={thumb.alternativeText ?? ''}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
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
    </div>
  );
}
