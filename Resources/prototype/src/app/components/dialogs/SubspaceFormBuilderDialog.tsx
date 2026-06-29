import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Lightbulb, CheckCircle2, Plus,
} from "lucide-react";
import { cn } from "@/app/components/ui/utils";
import { SettingsSection } from "@/app/components/shared/SettingsSection";
import type { ApplicationFormConfig, FormField } from "./SubspaceApplicationDialog";

interface SubspaceFormBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceId: string;
  spaceName: string;
  onSave?: (config: ApplicationFormConfig) => void;
}

export function SubspaceFormBuilderDialog({
  open,
  onOpenChange,
  spaceId,
  spaceName,
  onSave,
}: SubspaceFormBuilderDialogProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      const config: ApplicationFormConfig = {
        id: `form-${spaceId}`,
        spaceId,
        isActive: true,
        questions: DEFAULT_QUESTIONS,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onSave?.(config);
      toast.success("Form configured! Members can now apply to create subspaces.");
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="pb-6 border-b">
          <DialogTitle className="text-section-title">Set up your application form</DialogTitle>
          <DialogDescription className="text-body text-muted-foreground mt-2">
            Members will fill this out when they want to create a new subspace. You can customize it to match your process.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6 max-w-2xl">
            {/* Info box */}
            <div className="rounded-lg border bg-blue-50 dark:bg-blue-500/10 p-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-body-emphasis text-blue-900 dark:text-blue-200">
                  Form is already configured
                </p>
                <p className="text-caption text-blue-800/70 dark:text-blue-300/70 mt-1">
                  We've set up a great default form for your space based on industry best practices. You can activate it now or customize it later.
                </p>
              </div>
            </div>

            {/* Preview of form structure */}
            <SettingsSection
              title="Form Overview"
              description="Here's what members will see"
              icon={<CheckCircle2 className="w-4 h-4" />}
              iconColor="green"
              defaultOpen={true}
              collapsible={false}
            >
              <div className="space-y-4">
                {FORM_STRUCTURE.map((section, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-lg border bg-muted/30">
                    <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0", section.iconColor)}>
                      <section.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-emphasis">{section.title}</p>
                      <p className="text-caption text-muted-foreground mt-1">{section.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {section.questions.map((q, i) => (
                          <Badge key={i} variant="outline" className="text-caption">
                            {q}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SettingsSection>

            {/* Why this form is good */}
            <SettingsSection
              title="What this collects"
              description="Why we ask these questions"
              icon={<Lightbulb className="w-4 h-4" />}
              iconColor="amber"
              defaultOpen={false}
              collapsible={true}
            >
              <ul className="space-y-3 text-body">
                <li className="flex gap-3">
                  <span className="text-primary font-semibold flex-shrink-0">✓</span>
                  <span><strong>Basic info</strong> so you know what the subspace is about</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold flex-shrink-0">✓</span>
                  <span><strong>Contact details</strong> so you can reach the subspace leaders</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold flex-shrink-0">✓</span>
                  <span><strong>Collaborators</strong> to understand partnership across your organization</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold flex-shrink-0">✓</span>
                  <span><strong>Context & goals</strong> to make sure this is a good fit for your community</span>
                </li>
              </ul>
            </SettingsSection>

            {/* Customization info */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-caption text-muted-foreground">
                <strong>Pro tip:</strong> This default form works well for most spaces. Once you activate it, members can start applying right away. You can always adjust the questions later based on what you learn.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t bg-muted/20">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Activating..." : "Activate form"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Default form structure and questions
const DEFAULT_QUESTIONS: FormField[] = [
  {
    id: "title",
    type: "short-text",
    label: "Initiative Title",
    description: "The name of your initiative",
    required: true,
    order: 0,
    constraints: { maxLength: 80 },
  },
  {
    id: "initiating-municipality",
    type: "short-text",
    label: "Initiating Municipality",
    required: true,
    order: 1,
    constraints: { maxLength: 80 },
  },
  {
    id: "first-contact",
    type: "auto-fill-profile",
    label: "First Contact Person",
    required: true,
    order: 2,
    constraints: { fields: ["name", "email", "organization"] },
  },
  {
    id: "second-contact",
    type: "user-picker",
    label: "Second Contact Person",
    required: false,
    order: 3,
    constraints: { allowManualEntry: true },
  },
  {
    id: "supporting-municipalities",
    type: "multi-select-list",
    label: "Supporting Municipalities",
    required: true,
    order: 4,
    constraints: { minSelections: 2, maxSelections: 10 },
  },
  {
    id: "who",
    type: "long-text",
    label: "WHO? Goal and Target Audience",
    required: true,
    order: 5,
    constraints: { maxWords: 250 },
  },
  {
    id: "what-for",
    type: "long-text",
    label: "WHAT FOR? Strategic Contribution",
    required: true,
    order: 6,
    constraints: { maxWords: 250 },
  },
  {
    id: "why",
    type: "long-text",
    label: "WHY? Urgency and Value",
    required: true,
    order: 7,
    constraints: { maxWords: 250 },
  },
  {
    id: "how",
    type: "long-text",
    label: "HOW? Development and Scaling",
    required: true,
    order: 8,
    constraints: { maxWords: 250 },
  },
];

// Form structure for preview
interface FormStructureItem {
  title: string;
  description: string;
  icon: any;
  iconColor: string;
  questions: string[];
}

const FORM_STRUCTURE: FormStructureItem[] = [
  {
    title: "Let's start with the basics",
    description: "Tell us the name and where it's happening",
    icon: () => null,
    iconColor: "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
    questions: ["Initiative title", "Municipality"],
  },
  {
    title: "Who's leading this?",
    description: "Help us know who to contact",
    icon: () => null,
    iconColor: "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
    questions: ["Your contact info", "Secondary contact"],
  },
  {
    title: "Who else is in?",
    description: "Which other municipalities are involved?",
    icon: () => null,
    iconColor: "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
    questions: ["Partner municipalities"],
  },
  {
    title: "What's the vision?",
    description: "Help us understand your initiative",
    icon: () => null,
    iconColor: "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
    questions: ["Goals", "Strategic value", "Urgency", "Implementation plan"],
  },
];
