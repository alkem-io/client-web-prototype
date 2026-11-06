import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/crd/components/dialogs/ConfirmationDialog';
import { AddCommunityMemberDialog } from '@/crd/components/space/settings/AddCommunityMemberDialog';
import { ApplicationFormEditor, type ApplicationQuestion } from '@/crd/components/space/settings/ApplicationFormEditor';
import { ApplicationFormPreview } from '@/crd/components/space/settings/ApplicationFormPreview';
import {
  CommunityGuidelinesEditor,
  type CommunityGuidelinesEditorValue,
} from '@/crd/components/space/settings/CommunityGuidelinesEditor';
import { CommunityGuidelinesPreview } from '@/crd/components/space/settings/CommunityGuidelinesPreview';
import { MemberSettingsDialog } from '@/crd/components/space/settings/MemberSettingsDialog';
import { MembershipDetailDialog } from '@/crd/components/space/settings/MembershipDetailDialog';
import type { MemberSettingsSubject } from '@/crd/components/space/settings/memberSettingsTypes';
import type { PendingMembership } from '@/crd/components/space/settings/PendingMembershipsTable';
import { SettingsEditorDialog } from '@/crd/components/space/settings/SettingsEditorDialog';
import {
  type CommunityMember,
  type CommunityOrg,
  type CommunityVC,
  type PendingOrganizationInvitation,
  SpaceSettingsCommunityView,
} from '@/crd/components/space/settings/SpaceSettingsCommunityView';
import { Button } from '@/crd/primitives/button';
import { CommunityInviteDialog, type SentInvitation } from './CommunityInviteDialog';
import {
  ADDABLE_VCS,
  DEMO_APPLICATION_ANSWERS,
  DEMO_APPLICATION_FORM,
  DEMO_GUIDELINES,
  DEMO_MEMBERS,
  DEMO_ORG_INVITATIONS,
  DEMO_ORGS,
  DEMO_PENDING,
  DEMO_VCS,
} from './communityDemoData';
import { demoDelay, demoMarkdownUpload, useDemoState } from './demoState';
import { DemoTemplatePicker } from './DemoTemplatePicker';
import { TemplateEditorDialog } from './TemplateEditorDialog';
import { useDemoTemplates } from './templatesDemo';

type RemovalKind =
  | 'user'
  | 'organization'
  | 'virtualContributor'
  | 'invitation'
  | 'platformInvitation'
  | 'applicationReject'
  | 'applicationDelete'
  | 'resolvedDelete';

type PendingRemoval = { kind: RemovalKind; id: string; name: string; orgInvitation?: boolean };

type CommunityData = {
  members: CommunityMember[];
  pending: PendingMembership[];
  organizations: CommunityOrg[];
  orgInvitations: PendingOrganizationInvitation[];
  virtualContributors: CommunityVC[];
};

const DEMO_COMMUNITY: CommunityData = {
  members: DEMO_MEMBERS,
  pending: DEMO_PENDING,
  organizations: DEMO_ORGS,
  orgInvitations: DEMO_ORG_INVITATIONS,
  virtualContributors: DEMO_VCS,
};

const downloadCsv = (name: string, rows: string[][]) => {
  const csv = rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  link.download = name;
  link.click();
  URL.revokeObjectURL(link.href);
};

const roleLabelFor = (isAdmin: boolean, isLead: boolean, previous: string) =>
  previous === 'Host' ? 'Host' : isAdmin ? 'Admin' : isLead ? 'Lead' : 'Member';

type SpaceCommunityTabProps = {
  level?: 'L0' | 'L1' | 'L2';
  scope?: string;
  spaceName?: string;
  initial?: CommunityData;
};

/**
 * Community tab: production's view, with production's editors in its application
 * form and guidelines slots. Approving, inviting, resending, revoking, removing
 * and changing roles all act on the demo lists; removals confirm first.
 */
export function SpaceCommunityTab({
  level = 'L0',
  scope = 'space',
  spaceName = 'Green Energy Space',
  initial = DEMO_COMMUNITY,
}: SpaceCommunityTabProps) {
  const { t } = useTranslation('crd-spaceSettings');
  const context = level === 'L0' ? undefined : 'subspace';
  const [data, setData] = useDemoState<CommunityData>(`${scope}:community`, initial);
  const patch = (changes: (previous: CommunityData) => Partial<CommunityData>) =>
    setData(previous => ({ ...previous, ...changes(previous) }));

  const [removal, setRemoval] = useState<PendingRemoval | null>(null);
  const [inviteKind, setInviteKind] = useState<'user' | 'organization' | null>(null);
  const [subject, setSubject] = useState<MemberSettingsSubject | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [resending, setResending] = useState<ReadonlySet<string>>(new Set());
  const [addVcOpen, setAddVcOpen] = useState(false);
  const [addVcSearch, setAddVcSearch] = useState('');
  const [addedVcIds, setAddedVcIds] = useState<ReadonlySet<string>>(new Set());

  const updatePending = (id: string, changes: Partial<PendingMembership>) =>
    patch(previous => ({ pending: previous.pending.map(row => (row.id === id ? { ...row, ...changes } : row)) }));

  const findPending = (id: string) => data.pending.find(row => row.id === id);

  const approve = (id: string) => {
    const row = findPending(id);
    if (!row) return;
    updatePending(id, { state: 'approved', canApprove: false, canReject: false, canDelete: true });
    patch(previous => ({
      members: [
        ...previous.members,
        {
          id: `member-${id}`,
          displayName: row.displayName,
          email: row.email,
          url: row.url,
          roleLabel: 'Member',
          isLead: false,
          isAdmin: false,
          joinedDate: new Date().toISOString(),
        },
      ],
    }));
  };

  const requestDelete = (id: string) => {
    const row = findPending(id);
    if (!row) return;
    const open = row.state === 'new' || row.state === 'invited';
    const kind: RemovalKind = !open
      ? 'resolvedDelete'
      : row.type === 'application'
        ? 'applicationDelete'
        : row.type === 'platformInvitation'
          ? 'platformInvitation'
          : 'invitation';
    setRemoval({ kind, id, name: row.displayName });
  };

  const resend = async (id: string) => {
    setResending(previous => new Set(previous).add(id));
    await demoDelay(800);
    setResending(previous => {
      const next = new Set(previous);
      next.delete(id);
      return next;
    });
    toast.success('Invitation sent again.');
  };

  const confirmRemoval = () => {
    if (!removal) return;
    const { kind, id, orgInvitation } = removal;
    if (kind === 'user') patch(previous => ({ members: previous.members.filter(row => row.id !== id) }));
    if (kind === 'organization') patch(previous => ({ organizations: previous.organizations.filter(row => row.id !== id) }));
    if (kind === 'virtualContributor') {
      patch(previous => ({ virtualContributors: previous.virtualContributors.filter(row => row.id !== id) }));
      setAddedVcIds(previous => new Set([...previous].filter(vcId => vcId !== id)));
    }
    if (kind === 'applicationReject') updatePending(id, { state: 'rejected', canApprove: false, canReject: false });
    if (orgInvitation) patch(previous => ({ orgInvitations: previous.orgInvitations.filter(row => row.id !== id) }));
    else if (kind === 'invitation' || kind === 'platformInvitation' || kind === 'applicationDelete' || kind === 'resolvedDelete') {
      patch(previous => ({ pending: previous.pending.filter(row => row.id !== id) }));
    }
    setRemoval(null);
  };

  const onInvitesSent = (invitations: SentInvitation[]) => {
    const stamp = Date.now();
    const createdDate = new Date().toISOString();
    patch(previous => ({
      pending: [
        ...invitations.flatMap(({ invitee }, index): PendingMembership[] => {
          if (invitee.kind !== 'user' && invitee.kind !== 'email') return [];
          const name = invitee.kind === 'user' ? invitee.displayName : invitee.email;
          return [
            {
              id: `invite-${stamp}-${index}`,
              type: invitee.kind === 'user' ? 'invitation' : 'platformInvitation',
              state: 'invited',
              contributorType: 'user',
              displayName: name,
              email: invitee.kind === 'email' ? invitee.email : undefined,
              createdDate,
              canApprove: false,
              canReject: false,
              canDelete: true,
              canResend: invitee.kind === 'email',
            },
          ];
        }),
        ...previous.pending,
      ],
      orgInvitations: [
        ...invitations.flatMap(({ invitee, roles }, index): PendingOrganizationInvitation[] =>
          invitee.kind === 'organization'
            ? [
                {
                  id: `org-invite-${stamp}-${index}`,
                  organizationDisplayName: invitee.displayName,
                  role: roles.includes('Lead') ? 'memberLead' : 'member',
                  createdDate,
                  canRevoke: true,
                },
              ]
            : []
        ),
        ...previous.orgInvitations,
      ],
    }));
  };

  const removalDescription = (() => {
    if (!removal) return '';
    const name = removal.name;
    switch (removal.kind) {
      case 'applicationReject':
        return t('community.confirmRemove.applicationReject.description', { name, context });
      default:
        return t(`community.confirmRemove.${removal.kind}.description`, { name });
    }
  })();

  const viewing = viewingId ? findPending(viewingId) : undefined;

  return (
    <>
      <SpaceSettingsCommunityView
        level={level}
        members={data.members}
        pendingMemberships={data.pending}
        organizations={data.organizations}
        virtualContributors={data.virtualContributors}
        pendingOrganizationInvitations={data.orgInvitations}
        applicationFormSlot={<ApplicationFormSlot scope={scope} />}
        communityGuidelinesSlot={<GuidelinesSlot scope={scope} subspace={level !== 'L0'} />}
        permissions={{ canInvite: true, canInviteOrganizations: true, canAddVirtualContributors: true }}
        onUserRemove={id =>
          setRemoval({ kind: 'user', id, name: data.members.find(row => row.id === id)?.displayName ?? '' })
        }
        onMemberChangeRole={member =>
          setSubject({
            type: 'user',
            id: member.id,
            displayName: member.displayName,
            avatarUrl: member.avatarUrl,
            isLead: member.isLead,
            isAdmin: member.isAdmin,
          })
        }
        onInviteOrganizations={() => setInviteKind('organization')}
        onOrgRemove={id =>
          setRemoval({ kind: 'organization', id, name: data.organizations.find(row => row.id === id)?.displayName ?? '' })
        }
        onOrgChangeRole={org =>
          setSubject({ type: 'organization', id: org.id, displayName: org.displayName, avatarUrl: org.avatarUrl, isLead: org.isLead })
        }
        onOrgInvitationRevoke={id =>
          setRemoval({
            kind: 'invitation',
            id,
            orgInvitation: true,
            name: data.orgInvitations.find(row => row.id === id)?.organizationDisplayName ?? '',
          })
        }
        onVCAdd={() => setAddVcOpen(true)}
        onVCRemove={id =>
          setRemoval({
            kind: 'virtualContributor',
            id,
            name: data.virtualContributors.find(row => row.id === id)?.displayName ?? '',
          })
        }
        onPendingView={setViewingId}
        onPendingApprove={approve}
        onPendingReject={id =>
          setRemoval({ kind: 'applicationReject', id, name: findPending(id)?.displayName ?? '' })
        }
        onPendingDelete={requestDelete}
        onPendingResend={id => void resend(id)}
        resendingIds={resending}
        onInviteUsers={() => setInviteKind('user')}
        onExportMembers={() =>
          downloadCsv('members.csv', [
            ['Name', 'Email', 'Role', 'Joined'],
            ...data.members.map(row => [row.displayName, row.email ?? '', row.roleLabel, row.joinedDate]),
          ])
        }
        onExportApplications={() =>
          downloadCsv('applications.csv', [
            ['Name', 'Email', 'Type', 'Status', 'Date'],
            ...data.pending.map(row => [row.displayName, row.email ?? '', row.type, row.state, row.createdDate]),
          ])
        }
        onExportOrganizations={() =>
          downloadCsv('organisations.csv', [
            ['Name', 'Lead'],
            ...data.organizations.map(row => [row.displayName, row.isLead ? 'Yes' : 'No']),
          ])
        }
      />

      <CommunityInviteDialog
        kind={inviteKind ?? 'user'}
        open={inviteKind !== null}
        onOpenChange={open => {
          if (!open) setInviteKind(null);
        }}
        spaceName={spaceName}
        onSent={onInvitesSent}
      />

      {subject && (
        <MemberSettingsDialog
          open={true}
          onOpenChange={open => {
            if (!open) setSubject(null);
          }}
          subject={subject}
          leadGate={{ canAddLead: true, canRemoveLead: true }}
          onLeadChange={async (id, isLead) => {
            await demoDelay(300);
            patch(previous => ({
              members: previous.members.map(row =>
                row.id === id ? { ...row, isLead, roleLabel: roleLabelFor(row.isAdmin, isLead, row.roleLabel) } : row
              ),
              organizations: previous.organizations.map(row => (row.id === id ? { ...row, isLead } : row)),
            }));
          }}
          onAdminChange={
            subject.type === 'user'
              ? async (id, isAdmin) => {
                  await demoDelay(300);
                  patch(previous => ({
                    members: previous.members.map(row =>
                      row.id === id ? { ...row, isAdmin, roleLabel: roleLabelFor(isAdmin, row.isLead, row.roleLabel) } : row
                    ),
                  }));
                }
              : undefined
          }
          onRemoveMember={id => {
            setRemoval({ kind: subject.type === 'user' ? 'user' : 'organization', id, name: subject.displayName });
            setSubject(null);
          }}
        />
      )}

      {viewing && (
        <MembershipDetailDialog
          open={true}
          onOpenChange={open => {
            if (!open) setViewingId(null);
          }}
          kind={viewing.type === 'application' ? 'application' : 'invitation'}
          loading={false}
          displayName={viewing.type === 'platformInvitation' ? undefined : viewing.displayName}
          email={viewing.email}
          avatarUrl={viewing.avatarUrl}
          createdDate={viewing.createdDate}
          questions={DEMO_APPLICATION_ANSWERS[viewing.id] ?? []}
          welcomeMessage={`Hi, I would like to invite you to ${spaceName}. Have a look at the Space or click the button below to accept or decline the invitation.`}
        />
      )}

      <AddCommunityMemberDialog
        open={addVcOpen}
        onOpenChange={setAddVcOpen}
        title={t('community.virtualContributors.title')}
        searchPlaceholder={t('community.organizations.search')}
        candidates={ADDABLE_VCS.filter(vc => vc.displayName.toLowerCase().includes(addVcSearch.toLowerCase()))}
        loading={false}
        search={addVcSearch}
        addedIds={addedVcIds}
        addingId={null}
        onSearchChange={setAddVcSearch}
        onAdd={id => {
          const vc = ADDABLE_VCS.find(row => row.id === id);
          if (!vc) return;
          patch(previous => ({
            virtualContributors: [...previous.virtualContributors, { id, displayName: vc.displayName }],
          }));
          setAddedVcIds(previous => new Set(previous).add(id));
        }}
      />

      <ConfirmationDialog
        open={removal !== null}
        onOpenChange={open => {
          if (!open) setRemoval(null);
        }}
        variant="destructive"
        title={removal ? t(`community.confirmRemove.${removal.kind}.title`) : ''}
        description={removalDescription}
        confirmLabel={t('community.confirmRemove.confirm')}
        cancelLabel={t('dirtyGuard.cancel')}
        onConfirm={confirmRemoval}
        onCancel={() => setRemoval(null)}
      />
    </>
  );
}

const moveQuestion = (questions: ApplicationQuestion[], index: number, by: number) => {
  const next = [...questions];
  const [moved] = next.splice(index, 1);
  next.splice(index + by, 0, moved);
  return next.map((question, sortOrder) => ({ ...question, sortOrder }));
};

/** Application form slot: production's preview, with its editor in a dialog. */
function ApplicationFormSlot({ scope }: { scope: string }) {
  const { t } = useTranslation('crd-spaceSettings');
  const [saved, setSaved] = useDemoState(`${scope}:applicationForm`, DEMO_APPLICATION_FORM);
  const [draft, setDraft] = useState(saved);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const setQuestions = (questions: ApplicationQuestion[]) => setDraft(previous => ({ ...previous, questions }));

  const save = async () => {
    setSaving(true);
    await demoDelay();
    setSaved(draft);
    setSaving(false);
  };

  return (
    <>
      <ApplicationFormPreview questions={saved.questions} onEdit={() => setEditing(true)} />
      <SettingsEditorDialog
        open={editing}
        title={t('community.applicationForm.title')}
        isDirty={isDirty}
        canSave={isDirty && draft.questions.every(question => question.question.trim().length > 0)}
        saving={saving}
        onSave={save}
        onDiscard={() => setDraft(saved)}
        onClose={() => setEditing(false)}
      >
        <ApplicationFormEditor
          description={draft.description}
          questions={draft.questions}
          canSave={isDirty}
          onDescriptionChange={description => setDraft(previous => ({ ...previous, description }))}
          onQuestionChange={(index, question) =>
            setQuestions(draft.questions.map((row, i) => (i === index ? { ...row, question } : row)))
          }
          onQuestionRequiredChange={(index, required) =>
            setQuestions(draft.questions.map((row, i) => (i === index ? { ...row, required } : row)))
          }
          onQuestionAdd={() =>
            setQuestions([...draft.questions, { question: '', required: false, sortOrder: draft.questions.length }])
          }
          onQuestionDelete={index => setQuestions(draft.questions.filter((_, i) => i !== index))}
          onQuestionMoveUp={index => setQuestions(moveQuestion(draft.questions, index, -1))}
          onQuestionMoveDown={index => setQuestions(moveQuestion(draft.questions, index, 1))}
          onSave={() => void save()}
          hideSaveButton={true}
          {...demoMarkdownUpload}
        />
      </SettingsEditorDialog>
    </>
  );
}

/** Guidelines slot: production's preview, editor and template actions. */
function GuidelinesSlot({ scope, subspace }: { scope: string; subspace: boolean }) {
  const { t } = useTranslation('crd-spaceSettings');
  const [saved, setSaved] = useDemoState<CommunityGuidelinesEditorValue>(`${scope}:guidelines`, DEMO_GUIDELINES);
  const [draft, setDraft] = useState(saved);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [savingAsTemplate, setSavingAsTemplate] = useState<number | null>(null);
  const [, setTemplates] = useDemoTemplates(scope);
  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const save = async () => {
    setSaving(true);
    await demoDelay();
    setSaved(draft);
    setSaving(false);
  };

  return (
    <>
      <CommunityGuidelinesPreview value={saved} onEdit={() => setEditing(true)} />
      <SettingsEditorDialog
        open={editing}
        title={t('community.guidelines.title')}
        isDirty={isDirty}
        canSave={isDirty && draft.title.trim().length > 0}
        saving={saving}
        onSave={save}
        onDiscard={() => setDraft(saved)}
        onClose={() => setEditing(false)}
        headerActions={
          <>
            <Button type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)} disabled={saving}>
              {t('community.guidelines.applyTemplate')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSavingAsTemplate(Date.now())}
              disabled={saving}
            >
              {t('community.guidelines.saveAsTemplate')}
            </Button>
          </>
        }
      >
        <CommunityGuidelinesEditor
          value={draft}
          loading={false}
          submitting={saving}
          canSave={isDirty}
          onChange={changes => setDraft(previous => ({ ...previous, ...changes }))}
          onSave={() => void save()}
          onReferenceFileUpload={async file => URL.createObjectURL(file)}
          hideActions={true}
          subspace={subspace}
          {...demoMarkdownUpload}
        />
      </SettingsEditorDialog>

      <DemoTemplatePicker
        scope={scope}
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        allowedTypes={['communityGuidelines']}
        onSelect={template => {
          if (template?.content.type === 'communityGuidelines') {
            setDraft({
              title: template.content.title,
              body: template.content.guidelinesMarkdown,
              references: template.content.references,
            });
          }
        }}
      />

      {savingAsTemplate !== null && (
        <TemplateEditorDialog
          key={savingAsTemplate}
          intent="create"
          type="communityGuidelines"
          template={{
            card: { id: '', type: 'communityGuidelines', name: '', description: '', tags: [], color: '' },
            content: {
              type: 'communityGuidelines',
              title: draft.title,
              guidelinesMarkdown: draft.body,
              references: draft.references,
            },
          }}
          onCancel={() => setSavingAsTemplate(null)}
          onSubmit={template => {
            setTemplates(previous => [...previous, template]);
            setSavingAsTemplate(null);
            toast.success('Saved to this space’s templates.');
          }}
        />
      )}
    </>
  );
}
