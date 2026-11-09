import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/crd/components/dialogs/ConfirmationDialog';
import {
  type AccountHost,
  type AccountPlan,
  type AccountVisibility,
  SpaceSettingsAccountView,
} from '@/crd/components/space/settings/SpaceSettingsAccountView';

export type SpaceAccountData = {
  url: string;
  plan: AccountPlan | null;
  visibility: AccountVisibility | null;
  host: AccountHost | null;
};

export const DEMO_ACCOUNT: SpaceAccountData = {
  url: 'https://alkem.io/green-energy',
  plan: {
    name: 'Plus Plan',
    features: ['Up to 50 active members', 'Advanced whiteboard tools', '5GB Storage per space'],
    daysLeft: null,
  },
  visibility: 'active',
  host: {
    displayName: 'Alkemio Innovation',
    avatarUrl:
      'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    type: 'organization',
  },
};

/** Account tab: production's view. Deleting confirms, then returns to the spaces overview. */
export function SpaceAccountTab({ data = DEMO_ACCOUNT }: { data?: SpaceAccountData }) {
  const { t } = useTranslation('crd-spaceSettings');
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <SpaceSettingsAccountView
        url={data.url}
        plan={data.plan}
        visibility={data.visibility}
        host={data.host}
        contactSupportHref="mailto:support@alkem.io"
        changeLicenseHref="#"
        canDeleteSpace={true}
        onDeleteSpace={() => setConfirmOpen(true)}
        onCopyUrl={async () => {
          try {
            await navigator.clipboard.writeText(data.url);
            return true;
          } catch {
            return false;
          }
        }}
      />
      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="destructive"
        title={t('account.dangerZone.deleteDialog.title')}
        description={t('account.dangerZone.deleteDialog.description')}
        confirmLabel={t('account.dangerZone.deleteDialog.confirm')}
        cancelLabel={t('dirtyGuard.cancel')}
        onConfirm={() => {
          setConfirmOpen(false);
          toast.success('Space deleted (demo: nothing was removed).');
          navigate('/spaces');
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
