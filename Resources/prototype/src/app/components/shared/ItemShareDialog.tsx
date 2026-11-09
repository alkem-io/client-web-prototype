import type { ReactNode } from 'react';
import { ShareQrCode } from '@/ahead/ShareQrCode';
import { ShareDialog } from '@/crd/components/common/ShareDialog';

type ItemShareDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string | undefined;
  /** The name of what is being shared (space, subspace, post). */
  itemTitle: string;
  /** Dialog heading; production's default ("Share") when omitted. */
  dialogTitle?: ReactNode;
};

/**
 * Production's `ShareDialog` for anything the prototype shares from a button
 * of its own: the space and subspace header icons and the post menu. One
 * place, so whatever goes below the link reaches every one of them.
 */
export function ItemShareDialog({ open, onOpenChange, url, itemTitle, dialogTitle }: ItemShareDialogProps) {
  return (
    <ShareDialog open={open} onOpenChange={onOpenChange} url={url} title={dialogTitle}>
      {/* Ahead of production (alkemio#2222): the QR code in the space the dialog leaves below the link. */}
      {url && <ShareQrCode url={url} title={itemTitle} />}
    </ShareDialog>
  );
}
