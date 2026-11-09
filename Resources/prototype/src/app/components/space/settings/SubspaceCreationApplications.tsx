import { FileText, MessageSquare } from "lucide-react";
import { useState } from "react";
import type { ApplicationFormConfig, FormField, SubspaceApplication } from "@/app/components/dialogs/SubspaceApplicationDialog";
import { SubspaceFormBuilderDialog } from "@/app/components/dialogs/SubspaceFormBuilderDialog";
import { SubspaceApplicationsPanel } from "@/app/components/space/SubspaceApplicationsPanel";
import { SettingsSection } from "@/crd/components/common/SettingsSection";
import { Button } from "@/crd/primitives/button";
import { useDemoState } from "./demoState";

const DEFAULT_FORM_QUESTIONS: FormField[] = [
 {
 id: "title",
 type: "short-text",
 label: "Initiative Title",
 description: "The name of your initiative",
 required: true,
 order: 0,
 constraints: { maxLength: 80 }
 },
 {
 id: "initiating-municipality",
 type: "short-text",
 label: "Initiating Municipality",
 required: true,
 order: 1,
 constraints: { maxLength: 80 }
 },
 {
 id: "first-lead",
 type: "auto-fill-profile",
 label: "First Lead",
 description: "Your contact details",
 required: true,
 order: 2,
 constraints: { fields: ["name", "email", "organization"] }
 },
 {
 id: "second-lead",
 type: "user-picker",
 label: "Second Lead (optional)",
 description: "Search for an existing member or invite someone new",
 required: false,
 order: 3,
 constraints: { allowManualEntry: true, allowEmailInvite: true }
 },
 {
 id: "supporting-municipalities",
 type: "multi-select-list",
 label: "Supporting Municipalities",
 description: "Select at least 2 other municipalities (search to find them)",
 required: true,
 order: 4,
 constraints: {
 minSelections: 2,
 maxSelections: 20,
 items: [
 { id: "amsterdam", label: "Amsterdam" },
 { id: "rotterdam", label: "Rotterdam" },
 { id: "den-haag", label: "Den Haag" },
 { id: "utrecht", label: "Utrecht" },
 { id: "eindhoven", label: "Eindhoven" },
 ]
 }
 },
 {
 id: "who",
 type: "long-text",
 label: "WHO? Goal and Target Audience",
 description: "Describe the goal and target audience (max 250 words)",
 required: true,
 order: 5,
 constraints: { maxWords: 250 }
 },
 {
 id: "what-for",
 type: "long-text",
 label: "WHAT FOR? Strategic Contribution",
 required: true,
 order: 6,
 constraints: { maxWords: 250 }
 },
 {
 id: "why",
 type: "long-text",
 label: "WHY? Urgency and Value",
 required: true,
 order: 7,
 constraints: { maxWords: 250 }
 },
 {
 id: "how",
 type: "long-text",
 label: "HOW? Development and Scaling",
 required: true,
 order: 8,
 constraints: { maxWords: 250 }
 },
];

const DEMO_APPLICATIONS: SubspaceApplication[] = [
 {
 id: "app-1",
 formConfigId: "form-space",
 applicantId: "user-1",
 applicantName: "Alice Chen",
 applicantEmail: "alice@example.com",
 spaceId: "space-1",
 answers: {
 title: "Solar Panel Research Initiative",
 "initiating-municipality": "Amsterdam",
 "first-lead": { name: "Alice Chen", email: "alice@example.com", organization: "City of Amsterdam" },
 "second-lead": "Bob Johnson",
 "supporting-municipalities": ["rotterdam", "utrecht"],
 "who": "Exploring next-generation photovoltaic technologies and materials for sustainable energy.",
 "what-for": "Contributing to regional renewable energy goals and knowledge sharing across municipalities.",
 "why": "The urgency of accelerating solar adoption to meet climate targets.",
 "how": "Phased implementation with pilot projects and scaling to 10+ municipalities."
 },
 status: "submitted",
 submittedAt: "2026-06-28T10:30:00Z"
 },
];

/**
 * Ahead of production: members propose a new subspace by filling in a form an
 * admin designed, and admins review those proposals. Production has no equivalent,
 * so these two sections stay ours and sit beneath its Subspaces screen.
 */
export function SubspaceCreationApplications({
  scope = "space",
  spaceName = "Green Energy Space",
}: {
  scope?: string;
  spaceName?: string;
}) {
  const [formBuilderOpen, setFormBuilderOpen] = useState(false);
  const [formConfig, setFormConfig] = useDemoState<ApplicationFormConfig | null>(`${scope}:subspaceForm`, null);
  const [applications, setApplications] = useDemoState(`${scope}:subspaceApplications`, DEMO_APPLICATIONS);

  const review = (id: string, status: "approved" | "rejected", reviewMessage: string) =>
    setApplications(previous =>
      previous.map(application =>
        application.id === id
          ? { ...application, status, reviewMessage, reviewedAt: new Date().toISOString() }
          : application
      )
    );

  return (
    <div className="mt-6 flex flex-col gap-5">
      <SettingsSection
        title="Application Form"
        description="For creating subspaces"
        icon={<FileText className="size-4" />}
        iconColor="purple"
      >
        <div className="space-y-3">
          <p className="text-caption text-muted-foreground">
            Members will fill this out when they want to create a subspace in this space.
          </p>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setFormBuilderOpen(true)}>
            <FileText aria-hidden="true" className="size-4" /> Edit Application Form
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Subspace Applications"
        description="Review proposals to create subspaces"
        icon={<MessageSquare className="size-4" />}
        iconColor="orange"
      >
        <SubspaceApplicationsPanel
          applications={applications}
          formConfig={
            formConfig ?? {
              id: "form-space",
              spaceId: "space-1",
              isActive: true,
              questions: DEFAULT_FORM_QUESTIONS,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          }
          spaceName={spaceName}
          onApprove={(id, message) => review(id, "approved", message)}
          onReject={(id, message) => review(id, "rejected", message)}
        />
      </SettingsSection>

      <SubspaceFormBuilderDialog
        open={formBuilderOpen}
        onOpenChange={setFormBuilderOpen}
        spaceId="space-1"
        spaceName={spaceName}
        initialConfig={formConfig}
        onSave={setFormConfig}
      />
    </div>
  );
}
