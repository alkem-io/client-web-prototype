import { useState } from "react";
import { SubspaceApplicationDialog } from "@/app/components/dialogs/SubspaceApplicationDialog";
import type { ApplicationFormConfig } from "@/app/components/dialogs/SubspaceApplicationDialog";

const FORM_CONFIG: ApplicationFormConfig = {
  id: "form-1",
  spaceId: "alkemio-space",
  isActive: true,
  questions: [
    {
      id: "title",
      type: "short-text",
      label: "Subspace Title",
      description: "What would you like to call your subspace?",
      required: true,
      order: 1,
      constraints: { maxLength: 100 },
    },
    {
      id: "initiating-municipality",
      type: "short-text",
      label: "Initiating Municipality",
      description: "Which municipality is initiating this subspace?",
      required: true,
      order: 2,
      constraints: { maxLength: 100 },
    },
    {
      id: "first-lead",
      type: "auto-fill-profile",
      label: "First Lead",
      description: "Who is the primary lead?",
      required: true,
      order: 3,
      constraints: { fields: ["name", "email", "organization"] },
    },
    {
      id: "second-lead",
      type: "user-picker",
      label: "Second Lead",
      description: "Who is the co-lead?",
      required: false,
      order: 4,
      constraints: { maxSelections: 1 },
    },
    {
      id: "supporting-municipalities",
      type: "multi-select-list",
      label: "Supporting Municipalities",
      description: "Which other municipalities are involved? (Search by name)",
      required: false,
      order: 5,
      constraints: {
        allowManualEntry: false,
        items: [
          { id: "amsterdam", label: "Amsterdam" },
          { id: "rotterdam", label: "Rotterdam" },
          { id: "den-haag", label: "Den Haag" },
          { id: "utrecht", label: "Utrecht" },
          { id: "eindhoven", label: "Eindhoven" },
          { id: "groningen", label: "Groningen" },
          { id: "almere", label: "Almere" },
          { id: "arnhem", label: "Arnhem" },
          { id: "zwolle", label: "Zwolle" },
          { id: "apeldoorn", label: "Apeldoorn" },
          { id: "breda", label: "Breda" },
          { id: "nijmegen", label: "Nijmegen" },
          { id: "maastricht", label: "Maastricht" },
          { id: "dordrecht", label: "Dordrecht" },
          { id: "haarlem", label: "Haarlem" },
        ],
      },
    },
    {
      id: "vision",
      type: "long-text",
      label: "What's the vision? (Who, What, Why, How)",
      description: "Please describe: (1) Who will benefit from this initiative? (2) What are you trying to achieve? (3) Why is this important? (4) How will you do it?",
      required: true,
      order: 6,
      constraints: { maxLength: 2000, maxWords: 400 },
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function SubspaceApplicationPage() {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SubspaceApplicationDialog
        open={open}
        onOpenChange={setOpen}
        formConfig={FORM_CONFIG}
        spaceName="Alkemio Space"
        currentUser={{
          id: "user-1",
          name: "Current User",
          email: "user@example.com",
          organization: "Organization",
        }}
      />
    </div>
  );
}
