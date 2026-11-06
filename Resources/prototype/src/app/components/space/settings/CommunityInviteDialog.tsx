import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InviteMembersDialog, type InvitationResult, type InviteRole } from '@/crd/components/community/InviteMembersDialog';
import type { ContributorSelectorInvitee } from '@/crd/forms/ContributorSelector';
import { demoDelay } from './demoState';
import { INVITABLE_ORGS, INVITABLE_PEOPLE } from './communityDemoData';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SentInvitation = { invitee: ContributorSelectorInvitee; roles: InviteRole[]; message: string };

type CommunityInviteDialogProps = {
  kind: 'user' | 'organization';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceName: string;
  onSent: (invitations: SentInvitation[]) => void;
};

/** Production's invite dialog, searching the demo people and organisations. */
export function CommunityInviteDialog({ kind, open, onOpenChange, spaceName, onSent }: CommunityInviteDialogProps) {
  const { t } = useTranslation('crd-community');
  const isOrganization = kind === 'organization';
  const defaultMessage = isOrganization
    ? t('inviteMembers.dialog.organization.defaultWelcomeMessage', { spaceName })
    : t('inviteMembers.dialog.defaultWelcomeMessage', { spaceName });

  const [selected, setSelected] = useState<ContributorSelectorInvitee[]>([]);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState(defaultMessage);
  const [roles, setRoles] = useState<InviteRole[]>(['Member']);
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<InvitationResult[] | undefined>();

  const reset = () => {
    setSelected([]);
    setQuery('');
    setMessage(defaultMessage);
    setRoles(['Member']);
    setResults(undefined);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: start clean each time it opens
  useEffect(() => {
    if (open) reset();
  }, [open, kind]);

  const pool = isOrganization ? INVITABLE_ORGS : INVITABLE_PEOPLE;
  const isSelected = (id: string) =>
    selected.some(entry => (entry.kind === 'user' && entry.userId === id) || (entry.kind === 'organization' && entry.id === id));
  const searchResults = query.trim()
    ? pool.filter(row => row.displayName.toLowerCase().includes(query.trim().toLowerCase()) && !isSelected(row.userId))
    : [];

  const send = async () => {
    setSending(true);
    await demoDelay();
    onSent(selected.map(invitee => ({ invitee, roles, message })));
    setResults(selected.map(invitee => ({ invitee, outcome: 'sent' })));
    setSending(false);
  };

  return (
    <InviteMembersDialog
      open={open}
      onOpenChange={onOpenChange}
      kind={kind}
      spaceName={spaceName}
      selectedContributors={selected}
      searchResults={searchResults}
      searchQuery={query}
      onSearchChange={setQuery}
      onSelectUser={id => {
        const row = pool.find(entry => entry.userId === id);
        if (!row) return;
        setSelected(previous => [
          ...previous,
          isOrganization
            ? { kind: 'organization', id, displayName: row.displayName }
            : { kind: 'user', userId: id, displayName: row.displayName },
        ]);
        setQuery('');
      }}
      onAddEmails={
        isOrganization
          ? undefined
          : raw => {
              const emails = raw.split(/[\s,;]+/).filter(Boolean);
              setSelected(previous => [
                ...previous,
                ...emails.map((email): ContributorSelectorInvitee => {
                  const duplicate = previous.some(entry => entry.kind === 'email' && entry.email === email);
                  return {
                    kind: 'email',
                    email,
                    validationError: !EMAIL.test(email) ? 'invalid' : duplicate ? 'duplicate' : undefined,
                  };
                }),
              ]);
              setQuery('');
            }
      }
      onRemoveContributor={index => setSelected(previous => previous.filter((_, i) => i !== index))}
      allowEmailInvites={!isOrganization}
      welcomeMessage={message}
      onWelcomeMessageChange={setMessage}
      extraRoles={roles}
      onExtraRolesChange={setRoles}
      sending={sending}
      results={results}
      onSend={() => void send()}
      onBack={reset}
      labels={{
        title: isOrganization
          ? t('inviteMembers.dialog.organization.title', { spaceName })
          : t('inviteMembers.dialog.title', { spaceName }),
        searchHint: isOrganization ? t('inviteMembers.dialog.organization.searchHint') : t('inviteMembers.dialog.searchHint'),
        searchPlaceholder: isOrganization
          ? t('inviteMembers.dialog.organization.searchPlaceholder')
          : t('inviteMembers.dialog.searchPlaceholder'),
        searchAriaLabel: isOrganization
          ? t('inviteMembers.dialog.organization.searchAriaLabel')
          : t('inviteMembers.dialog.searchAriaLabel'),
        noResultsLabel: isOrganization
          ? t('inviteMembers.dialog.organization.noResultsLabel')
          : t('inviteMembers.dialog.noResultsLabel'),
        loadingLabel: isOrganization
          ? t('inviteMembers.dialog.organization.loadingLabel')
          : t('inviteMembers.dialog.loadingLabel'),
        loadMoreLabel: t('inviteMembers.dialog.loadMoreLabel'),
        removeAriaLabel: label => t('inviteMembers.dialog.removeAriaLabel', { label }),
        validationErrorLabel: errorKind =>
          errorKind === 'invalid' ? t('inviteMembers.errors.invalidEmail') : t('inviteMembers.errors.duplicateEmail'),
        welcomeMessageLabel: t('inviteMembers.dialog.welcomeMessageLabel'),
        welcomeMessagePlaceholder: t('inviteMembers.dialog.welcomeMessagePlaceholder'),
        emailVisibilityNote: isOrganization ? undefined : t('inviteMembers.dialog.emailVisibilityNote'),
        inviteToRoleLabel: t('inviteMembers.dialog.inviteToRoleLabel'),
        rolePopoverHelper: t('inviteMembers.dialog.rolePopoverHelper'),
        rolePopoverAriaLabel: t('inviteMembers.dialog.rolePopoverAriaLabel'),
        roleLabels: {
          Member: t('inviteMembers.roles.Member'),
          Lead: t('inviteMembers.roles.Lead'),
          Admin: t('inviteMembers.roles.Admin'),
        },
        sendButtonLabel: t('inviteMembers.dialog.sendButtonLabel'),
        sendingButtonLabel: t('inviteMembers.dialog.sendingButtonLabel'),
        backButtonLabel: t('inviteMembers.dialog.backButtonLabel'),
        closeButtonLabel: t('inviteMembers.dialog.closeButtonLabel'),
        closeAriaLabel: t('inviteMembers.dialog.closeAriaLabel'),
        resultsSummary: count => t('inviteMembers.dialog.resultsSummary', { count, spaceName }),
        resultOutcomeLabels: {
          sent: t('inviteMembers.results.sent'),
          alreadyInvited: t('inviteMembers.results.alreadyInvited'),
          alreadyMember: t('inviteMembers.results.alreadyMember'),
          alreadyHasApplication: t('inviteMembers.results.alreadyHasApplication'),
          parentNotAuthorized: t('inviteMembers.results.parentNotAuthorized'),
          notAcceptingInvitations: t('inviteMembers.results.notAcceptingInvitations'),
          leadLimitReached: t('inviteMembers.results.leadLimitReached'),
          extraRoleLimitReached: t('inviteMembers.results.extraRoleLimitReached'),
          error: t('inviteMembers.results.error'),
        },
      }}
    />
  );
}
