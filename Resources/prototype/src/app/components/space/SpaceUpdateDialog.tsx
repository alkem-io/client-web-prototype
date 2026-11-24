/**
 * SpaceUpdateDialog — a single update from a lead, opened on top of the space.
 *
 * This is the "Option B" answer to client-web#10321 (reaching a lead's update):
 * clicking the notification opens *only* the update it is about, with Newer /
 * Older to step through the rest and "See all updates" to open the full list.
 * Production already owns the full-list dialog (CommunityUpdatesDialog) and the
 * sidebar box (UpdatesSection); this single-update view is the new piece.
 *
 * Built from production primitives (Dialog, UpdateAuthorLine, MarkdownContent)
 * and kept props-in / callbacks-out, so it can graduate to CRD once the design
 * settles. An exploration for now — it lives in src/app.
 */
import type { Locale } from "date-fns";
import { ChevronLeft, ChevronRight, Link2, List } from "lucide-react";
import { MarkdownContent } from "@/crd/components/common/MarkdownContent";
import {
  type CommunityUpdate,
  UpdateAuthorLine,
} from "@/crd/components/space/CommunityUpdatesDialog";
import { Button } from "@/crd/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/crd/primitives/dialog";

type SpaceUpdateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** All updates, newest first — so Newer/Older can step through them. */
  updates: CommunityUpdate[];
  /** The update currently shown. */
  currentId: string | null;
  /** Step to another update (Newer / Older). */
  onNavigate: (id: string) => void;
  /** Open the full list of updates. */
  onSeeAll: () => void;
  /** Copy a link straight to this update. */
  onCopyLink?: (id: string) => void;
  /** Shown under the title, so you know which space the update is from. */
  spaceName: string;
  locale?: Locale;
};

export function SpaceUpdateDialog({
  open,
  onOpenChange,
  updates,
  currentId,
  onNavigate,
  onSeeAll,
  onCopyLink,
  spaceName,
  locale,
}: SpaceUpdateDialogProps) {
  const index = updates.findIndex(u => u.id === currentId);
  const update = index >= 0 ? updates[index] : undefined;

  const hasNewer = index > 0;
  const hasOlder = index >= 0 && index < updates.length - 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-xl max-h-[85vh] flex flex-col overflow-hidden gap-0 p-0">
        <DialogHeader className="shrink-0 px-6 pt-6 pb-4 border-b border-border text-left">
          <DialogTitle>Update</DialogTitle>
          <DialogDescription>{spaceName}</DialogDescription>
        </DialogHeader>

        {update ? (
          <>
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
              <div className="flex items-start justify-between gap-3">
                <UpdateAuthorLine author={update.author} date={update.date} locale={locale} />
                {onCopyLink && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-muted-foreground"
                    onClick={() => onCopyLink(update.id)}
                  >
                    <Link2 className="w-3.5 h-3.5 mr-1.5" />
                    Copy link
                  </Button>
                )}
              </div>
              <MarkdownContent content={update.body} className="mt-3" />
            </div>

            <div className="shrink-0 flex flex-wrap items-center gap-2 px-6 py-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                disabled={!hasNewer}
                onClick={() => hasNewer && onNavigate(updates[index - 1].id)}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Newer
              </Button>
              <span className="text-caption text-muted-foreground tabular-nums">
                {index + 1} of {updates.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!hasOlder}
                onClick={() => hasOlder && onNavigate(updates[index + 1].id)}
              >
                Older
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <span className="flex-1" />
              <Button size="sm" onClick={onSeeAll}>
                <List className="w-4 h-4 mr-1.5" />
                See all updates
              </Button>
            </div>
          </>
        ) : (
          <div className="px-6 py-10 text-body text-muted-foreground">
            This update could not be found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
