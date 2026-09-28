/**
 * Pending space invitations — production's
 * `@/crd/components/dashboard/PendingInvitationCard` +
 * `InvitationDetailDialog`.
 *
 * These are invitations the viewer has RECEIVED (accept / decline), which is a
 * different thing from `community/InviteMembersDialog` (sending them). CRD
 * models the received side as a card list that opens a detail dialog, rather
 * than accept/decline buttons inline on each row — so you see the space's
 * tagline, tags and the sender's welcome message before deciding.
 *
 * The prototype's version was a flat list with two icon buttons per row and no
 * way to see what you were joining.
 */
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/crd/primitives/dialog';
import { Button } from '@/crd/primitives/button';
import {
  PendingInvitationCard,
  type PendingInvitationCardData,
} from '@/crd/components/dashboard/PendingInvitationCard';
import {
  InvitationDetailDialog,
  type InvitationDetailData,
} from '@/crd/components/dashboard/InvitationDetailDialog';

interface InvitationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Invitation = PendingInvitationCardData & {
  detail: InvitationDetailData;
};

const INITIAL_INVITATIONS: Invitation[] = [
  {
    id: 'inv-1',
    spaceName: 'Sustainability Goals 2024',
    spaceAvatarUrl:
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=200&q=60',
    senderName: 'Sarah Chen',
    welcomeMessageExcerpt:
      'We would love your input on the 2024 targets — your work on municipal energy is exactly what this group needs.',
    timeElapsed: '2 hours ago',
    color: '#2563eb',
    detail: {
      spaceName: 'Sustainability Goals 2024',
      spaceAvatarUrl:
        'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=200&q=60',
      spaceTagline: 'Setting and tracking shared sustainability targets',
      spaceTags: ['Sustainability', 'Targets', 'Reporting'],
      spaceHref: '/space/sustainability-goals-2024',
      senderName: 'Sarah Chen',
      timeElapsed: '2 hours ago',
      color: '#2563eb',
    },
  },
  {
    id: 'inv-2',
    spaceName: 'Urban Mobility Lab',
    spaceAvatarUrl:
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=200&q=60',
    senderName: 'Marc Johnson',
    welcomeMessageExcerpt:
      'Joining as a viewer to start — shout if you want edit rights once you have had a look around.',
    timeElapsed: '1 day ago',
    color: '#7c3aed',
    detail: {
      spaceName: 'Urban Mobility Lab',
      spaceAvatarUrl:
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=200&q=60',
      spaceTagline: 'Reimagining city transportation networks',
      spaceTags: ['Transport', 'Accessibility', 'Pilots'],
      spaceHref: '/space/urban-mobility-lab',
      senderName: 'Marc Johnson',
      timeElapsed: '1 day ago',
      color: '#7c3aed',
    },
  },
];

export function InvitationsDialog({ open, onOpenChange }: InvitationsDialogProps) {
  const [invitations, setInvitations] = useState(INITIAL_INVITATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = invitations.find(invitation => invitation.id === selectedId);

  const resolve = (id: string) => {
    setInvitations(current => current.filter(invitation => invitation.id !== id));
    setSelectedId(null);
  };

  return (
    <>
      <Dialog open={open && !selected} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Space Invitations</DialogTitle>
            <DialogDescription>
              {invitations.length > 0
                ? `You have ${invitations.length} pending invitation${invitations.length === 1 ? '' : 's'} to join spaces.`
                : 'You have no pending invitations.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-2">
            {invitations.length > 0 ? (
              invitations.map(invitation => (
                <PendingInvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  onClick={() => setSelectedId(invitation.id)}
                />
              ))
            ) : (
              <p className="py-8 text-center text-body text-muted-foreground">
                No pending invitations.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail view — the space's tagline, tags and the sender's message, so
          you can see what you are joining before accepting. */}
      <InvitationDetailDialog
        open={Boolean(selected)}
        invitation={selected?.detail}
        title="Invitation"
        acceptLabel="Accept"
        rejectLabel="Decline"
        onBack={() => setSelectedId(null)}
        onClose={() => {
          setSelectedId(null);
          onOpenChange(false);
        }}
        onAccept={() => selected && resolve(selected.id)}
        onReject={() => selected && resolve(selected.id)}
        accepting={false}
        rejecting={false}
        updating={false}
      />
    </>
  );
}
