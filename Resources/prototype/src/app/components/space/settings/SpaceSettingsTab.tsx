import { TabSaveBar } from './TabSaveBar';
import { useDemoForm } from './demoState';
import {
  type AllowedActionKey,
  type AllowedActionToggle,
  type MembershipPolicy,
  type SpacePrivacy,
  SpaceSettingsSettingsView,
  type UserInfoVisibility,
} from '@/crd/components/space/settings/SpaceSettingsSettingsView';

export type SettingsValues = {
  privacy: SpacePrivacy;
  userInfoVisibility: UserInfoVisibility;
  membershipPolicy: MembershipPolicy;
  hostOrganizationTrusted: boolean;
  allowedActions: AllowedActionToggle[];
};

const toggle = (key: AllowedActionKey, enabled: boolean): AllowedActionToggle => ({ key, enabled });

export const DEMO_SETTINGS: SettingsValues = {
  privacy: 'public',
  userInfoVisibility: 'followSpace',
  membershipPolicy: 'application',
  hostOrganizationTrusted: true,
  allowedActions: [
    toggle('subspaceAdminInvitations', true),
    toggle('memberCreatePosts', true),
    toggle('videoCalls', true),
    toggle('guestContributions', true),
    toggle('memberCreateSubspaces', false),
    toggle('inheritMembershipRights', false),
    toggle('subspaceEvents', true),
    toggle('alkemioSupportAccess', true),
  ],
};

type SpaceSettingsTabProps = {
  level?: 'L0' | 'L1' | 'L2';
  /** Separates this tab's demo data from another space's or subspace's. */
  scope?: string;
  initial?: SettingsValues;
  hostIsOrganization?: boolean;
  providerDisplayName?: string;
  /** Subspaces only: production shows these at the bottom of the tab. */
  onSaveAsTemplate?: () => void;
  onDeleteSpace?: () => void;
};

/** Settings tab: production's view, with its toggles saved through the unsaved-changes bar. */
export function SpaceSettingsTab({
  level = 'L0',
  scope = 'space',
  initial = DEMO_SETTINGS,
  hostIsOrganization = true,
  providerDisplayName = 'Alkemio Innovation',
  onSaveAsTemplate,
  onDeleteSpace,
}: SpaceSettingsTabProps) {
  const form = useDemoForm<SettingsValues>(`${scope}:settings`, initial);

  return (
    <>
      <SpaceSettingsSettingsView
        level={level}
        privacy={form.value.privacy}
        userInfoVisibility={form.value.userInfoVisibility}
        onUserInfoVisibilityChange={userInfoVisibility => form.patch({ userInfoVisibility })}
        membershipPolicy={form.value.membershipPolicy}
        allowedActions={form.value.allowedActions}
        hostOrganizationTrusted={form.value.hostOrganizationTrusted}
        hostIsOrganization={hostIsOrganization}
        providerDisplayName={providerDisplayName}
        disabled={form.saving}
        onPrivacyChange={privacy => form.patch({ privacy })}
        onMembershipPolicyChange={membershipPolicy => form.patch({ membershipPolicy })}
        onToggleAllowedAction={(key, enabled) =>
          form.set(previous => ({
            ...previous,
            allowedActions: previous.allowedActions.map(action =>
              action.key === key ? { ...action, enabled } : action
            ),
          }))
        }
        onHostOrgTrustChange={hostOrganizationTrusted => form.patch({ hostOrganizationTrusted })}
        onSaveAsTemplate={onSaveAsTemplate}
        onDeleteSpace={onDeleteSpace}
      />
      <TabSaveBar count={form.count} saving={form.saving} save={form.save} discard={form.discard} />
    </>
  );
}
