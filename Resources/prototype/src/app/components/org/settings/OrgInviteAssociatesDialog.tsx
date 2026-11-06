import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type InvitationResult,
  InviteMembersDialog,
  type InviteRole,
} from "@/crd/components/community/InviteMembersDialog";
import type { ContributorSelectorInvitee } from "@/crd/forms/ContributorSelector";
import { demoDelay } from "@/app/components/shared/useDemoState";
import { DEMO_INVITE_CANDIDATES } from "./demoOrg";

const isEmail = (text: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);

type OrgInviteAssociatesDialogProps = {
  open: boolean;
  onClose: () => void;
  organizationName: string;
  existingNames: string[];
  onSent: (invitees: ContributorSelectorInvitee[], extraRoles: InviteRole[], welcomeMessage: string) => void;
};

/** Production's invite dialog in its organisation mode, searching a local list of people. */
export function OrgInviteAssociatesDialog({
  open,
  onClose,
  organizationName,
  existingNames,
  onSent,
}: OrgInviteAssociatesDialogProps) {
  const { t } = useTranslation("crd-community");
  const [selected, setSelected] = useState<ContributorSelectorInvitee[]>([]);
  const [query, setQuery] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [extraRoles, setExtraRoles] = useState<InviteRole[]>(["Associate"]);
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<InvitationResult[] | undefined>();

  useEffect(() => {
    if (open) setWelcomeMessage(t("inviteMembers.dialog.associates.defaultWelcomeMessage", { organizationName }));
  }, [open, organizationName, t]);

  const selectedIds = new Set(selected.flatMap((invitee) => (invitee.kind === "user" ? [invitee.userId] : [])));
  const term = query.trim().toLowerCase();
  const searchResults = term
    ? DEMO_INVITE_CANDIDATES.filter(
        (person) =>
          person.displayName.toLowerCase().includes(term) &&
          !selectedIds.has(person.userId) &&
          !existingNames.includes(person.displayName)
      )
    : [];

  const reset = () => {
    setSelected([]);
    setQuery("");
    setResults(undefined);
  };

  return (
    <InviteMembersDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          reset();
          setExtraRoles(["Associate"]);
          onClose();
        }
      }}
      kind="user"
      target="organization"
      spaceName={organizationName}
      selectedContributors={selected}
      searchResults={searchResults}
      searchQuery={query}
      onSearchChange={setQuery}
      onSelectUser={(userId) => {
        const person = DEMO_INVITE_CANDIDATES.find((candidate) => candidate.userId === userId);
        if (person) setSelected((previous) => [...previous, { kind: "user", ...person }]);
        setQuery("");
      }}
      onAddEmails={(raw) => {
        const emails = raw.split(/[\s,;]+/).filter(Boolean);
        setSelected((previous) => [
          ...previous,
          ...emails.map((email) => ({
            kind: "email" as const,
            email,
            validationError: isEmail(email) ? undefined : ("invalid" as const),
          })),
        ]);
        setQuery("");
      }}
      onRemoveContributor={(index) => setSelected((previous) => previous.filter((_, other) => other !== index))}
      allowEmailInvites={true}
      welcomeMessage={welcomeMessage}
      onWelcomeMessageChange={setWelcomeMessage}
      extraRoles={extraRoles}
      onExtraRolesChange={setExtraRoles}
      sending={sending}
      results={results}
      onBack={reset}
      onSend={() => {
        const valid = selected.filter((invitee) => !(invitee.kind === "email" && invitee.validationError));
        if (valid.length === 0) return;
        setSending(true);
        demoDelay(() => {
          setResults(valid.map((invitee) => ({ invitee, outcome: "sent" })));
          onSent(valid, extraRoles, welcomeMessage);
          setSending(false);
        });
      }}
      labels={{
        title: t("inviteMembers.dialog.associates.title", { organizationName }),
        searchHint: t("inviteMembers.dialog.searchHint"),
        searchPlaceholder: t("inviteMembers.dialog.searchPlaceholder"),
        searchAriaLabel: t("inviteMembers.dialog.searchAriaLabel"),
        noResultsLabel: t("inviteMembers.dialog.associates.noResultsLabel"),
        loadingLabel: t("inviteMembers.dialog.associates.loadingLabel"),
        loadMoreLabel: t("inviteMembers.dialog.loadMoreLabel"),
        removeAriaLabel: (label) => t("inviteMembers.dialog.removeAriaLabel", { label }),
        validationErrorLabel: (kind) =>
          kind === "invalid" ? t("inviteMembers.errors.invalidEmail") : t("inviteMembers.errors.duplicateEmail"),
        welcomeMessageLabel: t("inviteMembers.dialog.welcomeMessageLabel"),
        welcomeMessagePlaceholder: t("inviteMembers.dialog.welcomeMessagePlaceholder"),
        inviteToRoleLabel: t("inviteMembers.dialog.inviteToRoleLabel"),
        rolePopoverHelper: t("inviteMembers.dialog.associates.rolePopoverHelper"),
        rolePopoverAriaLabel: t("inviteMembers.dialog.rolePopoverAriaLabel"),
        roleLabels: {
          Associate: t("inviteMembers.roles.Associate"),
          Admin: t("inviteMembers.roles.Admin"),
          Owner: t("inviteMembers.roles.Owner"),
        },
        sendButtonLabel: t("inviteMembers.dialog.sendButtonLabel"),
        sendingButtonLabel: t("inviteMembers.dialog.sendingButtonLabel"),
        backButtonLabel: t("inviteMembers.dialog.backButtonLabel"),
        closeButtonLabel: t("inviteMembers.dialog.closeButtonLabel"),
        closeAriaLabel: t("inviteMembers.dialog.closeAriaLabel"),
        resultsSummary: (count) => t("inviteMembers.dialog.resultsSummary", { count, spaceName: organizationName }),
        resultOutcomeLabels: {
          sent: t("inviteMembers.results.sent"),
          alreadyInvited: t("inviteMembers.results.alreadyInvited"),
          alreadyMember: t("inviteMembers.results.alreadyAssociate"),
          alreadyHasApplication: t("inviteMembers.results.alreadyHasApplication"),
          parentNotAuthorized: t("inviteMembers.results.parentNotAuthorized"),
          notAcceptingInvitations: t("inviteMembers.results.notAcceptingInvitations"),
          leadLimitReached: t("inviteMembers.results.leadLimitReached"),
          extraRoleLimitReached: t("inviteMembers.results.extraRoleLimitReached"),
          error: t("inviteMembers.results.error"),
        },
      }}
    />
  );
}
