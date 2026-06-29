import { useState } from "react";
import {
  Globe,
  Lock,
  UserPlus,
  Mail,
  AlertTriangle,
  Trash2,
  Video,
  Edit3,
  Share2,
  Calendar,
  Shield,
  Layout,
  Bookmark,
  FileText,
  Eye,
  Users as UsersIcon,
  Zap
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Switch } from "@/app/components/ui/switch";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { cn } from "@/lib/utils";
import { SaveBar } from "@/app/components/shared/SaveBar";
import { UnsavedChangesGuard } from "@/app/components/shared/UnsavedChangesGuard";
import { SettingsSection } from "@/app/components/shared/SettingsSection";

// ─── Types ───────────────────────────────────────────────────────────────────

type SpacePrivacy = 'public' | 'private';
type MembershipPolicy = 'open' | 'application' | 'invitation';

type AllowedActionKey =
  | 'subspaceAdminInvitations'
  | 'memberCreatePosts'
  | 'videoCalls'
  | 'guestContributions'
  | 'memberCreateSubspaces'
  | 'inheritMembershipRights'
  | 'subspaceEvents'
  | 'alkemioSupportAccess';

// ─── Level-aware visibility ──────────────────────────────────────────────────

const ACTIONS_VISIBLE_AT_L0 = new Set<AllowedActionKey>([
  'subspaceAdminInvitations', 'memberCreatePosts', 'videoCalls',
  'guestContributions', 'memberCreateSubspaces', 'subspaceEvents', 'alkemioSupportAccess',
]);

const ACTIONS_VISIBLE_AT_L1 = new Set<AllowedActionKey>([
  'subspaceAdminInvitations', 'memberCreatePosts', 'videoCalls',
  'guestContributions', 'memberCreateSubspaces', 'inheritMembershipRights',
]);

const ACTIONS_VISIBLE_AT_L2 = new Set<AllowedActionKey>([
  'memberCreatePosts', 'videoCalls', 'guestContributions', 'inheritMembershipRights',
]);

function isActionVisibleAtLevel(level: 'L0' | 'L1' | 'L2', key: AllowedActionKey): boolean {
  if (level === 'L1') return ACTIONS_VISIBLE_AT_L1.has(key);
  if (level === 'L2') return ACTIONS_VISIBLE_AT_L2.has(key);
  return ACTIONS_VISIBLE_AT_L0.has(key);
}

// ─── Action metadata ─────────────────────────────────────────────────────────

const ACTION_META: Record<AllowedActionKey, { label: string; description: string; icon: React.ElementType }> = {
  subspaceAdminInvitations: {
    label: 'Space Invitations',
    description: 'Allow admins of Subspaces to invite platform users.',
    icon: UserPlus,
  },
  memberCreatePosts: {
    label: 'Create Posts',
    description: 'Allow members to create posts in the community.',
    icon: Edit3,
  },
  videoCalls: {
    label: 'Video Calls',
    description: 'Show video call button for conferences.',
    icon: Video,
  },
  guestContributions: {
    label: 'Guest Contributions',
    description: 'Allow whiteboards to be shared with non-members.',
    icon: Share2,
  },
  memberCreateSubspaces: {
    label: 'Create Subspaces',
    description: 'Allow members to create Subspaces.',
    icon: Layout,
  },
  inheritMembershipRights: {
    label: 'Inherit Membership',
    description: 'Parent Space members gain access automatically.',
    icon: UsersIcon,
  },
  subspaceEvents: {
    label: 'Subspace Events',
    description: 'Allow events from Subspaces to be visible.',
    icon: Calendar,
  },
  alkemioSupportAccess: {
    label: 'Alkemio Support',
    description: 'Allow Alkemio Support team to act as admin.',
    icon: Shield,
  },
};

// ─── Initial State ───────────────────────────────────────────────────────────

interface SettingsState {
  privacy: SpacePrivacy;
  membershipPolicy: MembershipPolicy;
  hostOrganizationTrusted: boolean;
  allowedActions: Record<AllowedActionKey, boolean>;
}

const INITIAL_STATE: SettingsState = {
  privacy: "public",
  membershipPolicy: "application",
  hostOrganizationTrusted: true,
  allowedActions: {
    subspaceAdminInvitations: true,
    memberCreatePosts: true,
    videoCalls: true,
    guestContributions: true,
    memberCreateSubspaces: false,
    inheritMembershipRights: false,
    subspaceEvents: true,
    alkemioSupportAccess: true,
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export function SpaceSettingsSettings({ level = 'L0' }: { level?: 'L0' | 'L1' | 'L2' }) {
  const [formState, setFormState] = useState<SettingsState>(INITIAL_STATE);
  const [savedState, setSavedState] = useState<SettingsState>(INITIAL_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const isSubspace = level !== 'L0';
  const providerDisplayName = "Alkemio Foundation";

  // Dirty check
  const isDirty =
    formState.privacy !== savedState.privacy ||
    formState.membershipPolicy !== savedState.membershipPolicy ||
    formState.hostOrganizationTrusted !== savedState.hostOrganizationTrusted ||
    JSON.stringify(formState.allowedActions) !== JSON.stringify(savedState.allowedActions);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setSavedState({ ...formState });
      setIsSaving(false);
    }, 800);
  };

  const handleDiscard = () => {
    setFormState({ ...savedState });
  };

  const visibleActionKeys = (Object.keys(formState.allowedActions) as AllowedActionKey[])
    .filter(key => isActionVisibleAtLevel(level, key));

  return (
    <>
      <UnsavedChangesGuard isDirty={isDirty} onSave={handleSave} />

      <div className="space-y-5 pb-20">
        {/* ── Visibility ── */}
        <SettingsSection
          title="Visibility"
          icon={<Eye className="w-4 h-4" />}
          iconColor="blue"
        >
          <RadioGroup
            value={formState.privacy}
            onValueChange={v => setFormState(s => ({ ...s, privacy: v as SpacePrivacy }))}
            className="space-y-3"
          >
            <label
              htmlFor="visibility-public"
              className="flex items-start space-x-3 p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors"
            >
              <RadioGroupItem value="public" id="visibility-public" className="mt-0.5" />
              <div className="space-y-1">
                <span className="text-body-emphasis flex items-center gap-2">
                  <Globe className="size-4 text-primary" />
                  Public
                </span>
                <p className="text-body text-muted-foreground">
                  Visible to everyone. Users can only contribute as members.
                </p>
              </div>
            </label>
            <label
              htmlFor="visibility-private"
              className="flex items-start space-x-3 p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors"
            >
              <RadioGroupItem value="private" id="visibility-private" className="mt-0.5" />
              <div className="space-y-1">
                <span className="text-body-emphasis flex items-center gap-2">
                  <Lock className="size-4 text-muted-foreground" />
                  Private
                </span>
                <p className="text-body text-muted-foreground">
                  Content is only visible to members.
                </p>
              </div>
            </label>
          </RadioGroup>
        </SettingsSection>

        {/* ── Membership ── */}
        <SettingsSection
          title="Membership"
          icon={<UserPlus className="w-4 h-4" />}
          iconColor="green"
        >
          <div className="space-y-4">
            <RadioGroup
              value={formState.membershipPolicy}
              onValueChange={v => setFormState(s => ({ ...s, membershipPolicy: v as MembershipPolicy }))}
              className="space-y-3"
            >
              <label
                htmlFor="membership-open"
                className="flex items-start space-x-3 p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors"
              >
                <RadioGroupItem value="open" id="membership-open" className="mt-0.5" />
                <div className="space-y-1">
                  <span className="text-body-emphasis flex items-center gap-2">
                    <UserPlus className="size-4 text-success" />
                    No Application Required
                  </span>
                  <p className="text-body text-muted-foreground">
                    Anyone can join directly without review.
                  </p>
                </div>
              </label>
              <label
                htmlFor="membership-application"
                className="flex items-start space-x-3 p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors"
              >
                <RadioGroupItem value="application" id="membership-application" className="mt-0.5" />
                <div className="space-y-1">
                  <span className="text-body-emphasis flex items-center gap-2">
                    <FileText className="size-4 text-info" />
                    Application Required
                  </span>
                  <p className="text-body text-muted-foreground">
                    Users fill in an application form. You accept or reject.
                  </p>
                </div>
              </label>
              <label
                htmlFor="membership-invitation"
                className="flex items-start space-x-3 p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors"
              >
                <RadioGroupItem value="invitation" id="membership-invitation" className="mt-0.5" />
                <div className="space-y-1">
                  <span className="text-body-emphasis flex items-center gap-2">
                    <Mail className="size-4 text-primary" />
                    Invitation Only
                  </span>
                  <p className="text-body text-muted-foreground">
                    Only invited users can become members.
                  </p>
                </div>
              </label>
            </RadioGroup>

            {/* Trust host organization toggle */}
            {providerDisplayName && (
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/20">
                <div className="space-y-0.5">
                  <Label htmlFor="host-org-trust" className="text-body-emphasis">
                    Trusted Applicants
                  </Label>
                  <p className="text-caption text-muted-foreground">
                    Members of {providerDisplayName} can join without application.
                  </p>
                </div>
                <Switch
                  id="host-org-trust"
                  checked={formState.hostOrganizationTrusted}
                  onCheckedChange={v => setFormState(s => ({ ...s, hostOrganizationTrusted: v }))}
                />
              </div>
            )}
          </div>
        </SettingsSection>

        {/* ── Allowed Actions ── */}
        <SettingsSection
          title="Allowed Actions"
          icon={<Zap className="w-4 h-4" />}
          iconColor="amber"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {visibleActionKeys.map(key => {
              const meta = ACTION_META[key];
              if (!meta) return null;
              const ActionIcon = meta.icon;
              return (
                <div
                  key={key}
                  className="flex items-start justify-between gap-3 p-3 rounded-lg border bg-muted/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-muted-foreground">
                      <ActionIcon className="size-4" />
                    </div>
                    <div className="space-y-0.5">
                      <Label htmlFor={`action-${key}`} className="text-body-emphasis cursor-pointer">
                        {meta.label}
                      </Label>
                      <p className="text-caption text-muted-foreground leading-snug">
                        {meta.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={`action-${key}`}
                    checked={formState.allowedActions[key]}
                    onCheckedChange={checked =>
                      setFormState(s => ({
                        ...s,
                        allowedActions: { ...s.allowedActions, [key]: checked }
                      }))
                    }
                  />
                </div>
              );
            })}
          </div>
        </SettingsSection>

        {/* Save as Template — subspaces only */}
        {isSubspace && (
          <SettingsSection
            title="Save as Template"
            icon={<Bookmark className="w-4 h-4" />}
            iconColor="purple"
            collapsible={false}
          >
            <Button variant="outline" size="sm">Save as Template</Button>
          </SettingsSection>
        )}

        {/* Danger Zone — subspaces only */}
        {isSubspace && (
          <SettingsSection
            title="Danger Zone"
            icon={<AlertTriangle className="w-4 h-4" />}
            iconColor="rose"
            defaultOpen={false}
            className="border-destructive/40"
          >
            <div className="space-y-3">
              <p className="text-body text-muted-foreground">
                Permanently delete this subspace and all its content. This action cannot be undone.
              </p>
              <Dialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="w-4 h-4" /> Delete Subspace
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="w-5 h-5" />
                      Delete Subspace?
                    </DialogTitle>
                    <DialogDescription>
                      This will permanently delete the subspace and all associated data.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setDeleteConfirmationOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={() => setDeleteConfirmationOpen(false)}>
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </SettingsSection>
        )}
      </div>

      <SaveBar
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </>
  );
}
