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
import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Plus, Trash2, ChevronUp, ChevronDown,
} from "lucide-react";
import type { ApplicationFormConfig, FormField, FormFieldType } from "./SubspaceApplicationDialog";

interface SubspaceFormBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceId: string;
  spaceName: string;
  initialConfig?: ApplicationFormConfig | null;
  onSave?: (config: ApplicationFormConfig) => void;
}

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  questions: FormField[];
}

const FIELD_TYPES: { id: FormFieldType; label: string; description: string }[] = [
  { id: "short-text", label: "Short Answer", description: "One line of text (e.g., a name or title)" },
  { id: "long-text", label: "Long Answer", description: "Multi-line text for detailed responses" },
  { id: "auto-fill-profile", label: "Auto-filled Info", description: "Pre-fills from their profile automatically" },
  { id: "user-picker", label: "Person Selector", description: "Let them pick or invite team members" },
  { id: "multi-select-list", label: "Multiple Choice", description: "They pick from a list you provide" },
];

const TEMPLATES: FormTemplate[] = [
  {
    id: "vng-groei",
    name: "VNG Groei Program",
    description: "Innovation proposals for municipalities. Includes title, leads, municipalities, and detailed vision sections (WHO/WHAT/WHY/HOW).",
    questions: [
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
        id: "first-lead",
        type: "auto-fill-profile",
        label: "First Lead",
        description: "Your contact details",
        required: true,
        order: 2,
        constraints: { fields: ["name", "email", "organization"] },
      },
      {
        id: "second-lead",
        type: "user-picker",
        label: "Second Lead (optional)",
        description: "Search for an existing member or invite someone new",
        required: false,
        order: 3,
        constraints: { allowManualEntry: true, allowEmailInvite: true },
      },
      {
        id: "supporting-municipalities",
        type: "multi-select-list",
        label: "Supporting Municipalities",
        description: "Select at least 2 other municipalities",
        required: true,
        order: 4,
        constraints: {
          minSelections: 2,
          maxSelections: 20,
          items: [
            { id: "amsterdam", label: "Amsterdam" },
            { id: "rotterdam", label: "Rotterdam" },
            { id: "den-haag", label: "Den Haag" },
          ],
        },
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
    ],
  },
  {
    id: "research-project",
    name: "Research Project",
    description: "For research collaborations. Covers project title, team leads, research focus, and methodology.",
    questions: [
      {
        id: "project-title",
        type: "short-text",
        label: "Project Title",
        required: true,
        order: 0,
        constraints: { maxLength: 100 },
      },
      {
        id: "principal-investigator",
        type: "auto-fill-profile",
        label: "Principal Investigator",
        required: true,
        order: 1,
        constraints: { fields: ["name", "email", "organization"] },
      },
      {
        id: "co-investigators",
        type: "user-picker",
        label: "Co-Investigators",
        description: "Add team members",
        required: false,
        order: 2,
        constraints: { allowManualEntry: true, allowEmailInvite: true },
      },
      {
        id: "research-focus",
        type: "long-text",
        label: "Research Focus & Objectives",
        required: true,
        order: 3,
        constraints: { maxWords: 300 },
      },
      {
        id: "methodology",
        type: "long-text",
        label: "Proposed Methodology",
        required: true,
        order: 4,
        constraints: { maxWords: 300 },
      },
    ],
  },
  {
    id: "event-planning",
    name: "Event Planning",
    description: "For organizing events, workshops, or conferences. Covers basics and logistics.",
    questions: [
      {
        id: "event-name",
        type: "short-text",
        label: "Event Name",
        required: true,
        order: 0,
        constraints: { maxLength: 120 },
      },
      {
        id: "event-organizer",
        type: "auto-fill-profile",
        label: "Primary Organizer",
        required: true,
        order: 1,
        constraints: { fields: ["name", "email", "organization"] },
      },
      {
        id: "event-description",
        type: "long-text",
        label: "Event Description & Goals",
        required: true,
        order: 2,
        constraints: { maxWords: 250 },
      },
      {
        id: "expected-audience",
        type: "short-text",
        label: "Expected Audience Size",
        required: true,
        order: 3,
        constraints: { maxLength: 80 },
      },
    ],
  },
];

type PickerStep = "start" | "templates" | "editor";

export function SubspaceFormBuilderDialog({
  open,
  onOpenChange,
  spaceId,
  spaceName,
  initialConfig,
  onSave,
}: SubspaceFormBuilderDialogProps) {
  const [step, setStep] = useState<PickerStep>(!initialConfig ? "start" : "editor");
  const [questions, setQuestions] = useState<FormField[]>(initialConfig?.questions || []);
  const [isSaving, setIsSaving] = useState(false);

  const handleUseTemplate = (template: FormTemplate) => {
    setQuestions(template.questions.map((q, idx) => ({ ...q, order: idx })));
    setStep("editor");
  };

  const handleStartBlank = () => {
    setQuestions([]);
    setStep("editor");
  };

  const handleAddQuestion = (fieldType: FormFieldType) => {
    const newQuestion: FormField = {
      id: `q-${Date.now()}`,
      type: fieldType,
      label: "",
      required: true,
      order: questions.length,
      constraints: getDefaultConstraints(fieldType),
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, order: i })));
  };

  const handleReorderQuestion = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === questions.length - 1)) {
      return;
    }
    const newQuestions = [...questions];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[swapIndex]] = [newQuestions[swapIndex], newQuestions[index]];
    setQuestions(newQuestions.map((q, i) => ({ ...q, order: i })));
  };

  const handleUpdateQuestion = (index: number, updates: Partial<FormField>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    setQuestions(newQuestions);
  };

  const handleSave = () => {
    if (questions.length === 0) {
      toast.error("Add at least one question to your form");
      return;
    }
    if (questions.some((q) => !q.label.trim())) {
      toast.error("All questions must have a label");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      const config: ApplicationFormConfig = {
        id: initialConfig?.id || `form-${spaceId}`,
        spaceId,
        isActive: true,
        questions,
        createdAt: initialConfig?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onSave?.(config);
      toast.success("Form saved! Members can now apply to create subspaces.");
      onOpenChange(false);
    }, 500);
  };

  if (step === "start") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Application Form</DialogTitle>
            <DialogDescription>How would you like to get started?</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-6">
            <button
              onClick={() => setStep("templates")}
              className="w-full border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors text-left"
            >
              <p className="font-semibold mb-1">Use a template</p>
              <p className="text-sm text-muted-foreground">Start with a pre-built form designed for common use cases</p>
            </button>

            <button
              onClick={handleStartBlank}
              className="w-full border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors text-left"
            >
              <p className="font-semibold mb-1">Start from scratch</p>
              <p className="text-sm text-muted-foreground">Create a completely custom form with your own questions</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === "templates") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose a template</DialogTitle>
            <DialogDescription>Select a template that matches your needs, then customize it</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 py-6 max-h-[60vh] overflow-y-auto">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleUseTemplate(template)}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors text-left"
              >
                <h3 className="font-semibold mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                <p className="text-xs text-muted-foreground">{template.questions.length} questions</p>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setStep("start")}
              className="w-full"
            >
              Back
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle>Edit Application Form</DialogTitle>
          <DialogDescription>
            Customise the questions members answer when applying to create a subspace in {spaceName}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6 max-w-3xl">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-body-emphasis">Your questions</p>
                <p className="text-caption text-muted-foreground mt-1">Members will answer these when applying</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add a question
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {FIELD_TYPES.map((type) => (
                    <DropdownMenuItem
                      key={type.id}
                      onClick={() => handleAddQuestion(type.id)}
                      className="cursor-pointer flex flex-col items-start py-2"
                    >
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {questions.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed p-12 text-center">
                <p className="text-muted-foreground mb-2">No questions yet</p>
                <p className="text-caption text-muted-foreground">Click "Add a question" above to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg bg-card p-3 space-y-2 hover:border-primary/30 transition-colors">
                    {/* Question and actions - single row */}
                    <div className="flex gap-2 items-center">
                      <span className="text-base font-bold text-muted-foreground min-w-7">{index + 1}.</span>
                      <Input
                        value={question.label}
                        onChange={(e) => handleUpdateQuestion(index, { label: e.target.value })}
                        placeholder="Write your question..."
                        className="flex-1 text-base font-medium border-0 bg-transparent placeholder:text-muted-foreground/40 p-0 h-auto"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleReorderQuestion(index, "up")}
                        disabled={index === 0}
                        title="Move up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleReorderQuestion(index, "down")}
                        disabled={index === questions.length - 1}
                        title="Move down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteQuestion(index)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Settings - horizontal row */}
                    <div className="flex flex-wrap gap-3 items-center pl-9 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Type:</span>
                        <select
                          value={question.type}
                          onChange={(e) =>
                            handleUpdateQuestion(index, {
                              type: e.target.value as FormFieldType,
                              constraints: getDefaultConstraints(e.target.value as FormFieldType),
                            })
                          }
                          className="px-2 py-1 text-sm border border-input rounded-md bg-background hover:bg-accent font-medium"
                        >
                          {FIELD_TYPES.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <label className="flex items-center gap-1.5">
                        <Checkbox
                          checked={question.required}
                          onCheckedChange={(checked) =>
                            handleUpdateQuestion(index, { required: checked === true })
                          }
                        />
                        <span className="font-medium">Required</span>
                      </label>

                      {question.type === "short-text" && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Max:</span>
                          <Input
                            type="number"
                            value={question.constraints.maxLength || 255}
                            onChange={(e) =>
                              handleUpdateQuestion(index, {
                                constraints: { ...question.constraints, maxLength: parseInt(e.target.value) || 255 },
                              })
                            }
                            className="w-12 h-7 text-sm"
                          />
                          <span className="text-muted-foreground">chars</span>
                        </div>
                      )}

                      {question.type === "long-text" && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Max:</span>
                          <Input
                            type="number"
                            value={question.constraints.maxWords || 500}
                            onChange={(e) =>
                              handleUpdateQuestion(index, {
                                constraints: { ...question.constraints, maxWords: parseInt(e.target.value) || 500 },
                              })
                            }
                            className="w-12 h-7 text-sm"
                          />
                          <span className="text-muted-foreground">words</span>
                        </div>
                      )}

                      {question.type === "multi-select-list" && (
                        <>
                          <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">Min:</span>
                            <Input
                              type="number"
                              value={question.constraints.minSelections || 1}
                              onChange={(e) =>
                                handleUpdateQuestion(index, {
                                  constraints: { ...question.constraints, minSelections: parseInt(e.target.value) || 1 },
                                })
                              }
                              className="w-10 h-7 text-sm"
                            />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">Max:</span>
                            <Input
                              type="number"
                              value={question.constraints.maxSelections || 10}
                              onChange={(e) =>
                                handleUpdateQuestion(index, {
                                  constraints: { ...question.constraints, maxSelections: parseInt(e.target.value) || 10 },
                                })
                              }
                              className="w-10 h-7 text-sm"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-3 border-t bg-blue-50 dark:bg-blue-500/10">
          <p className="text-caption text-blue-900 dark:text-blue-200">
            <strong>💡 Pro tip:</strong> Members will see these questions one at a time, grouped smartly by question type.
          </p>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save form"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getDefaultConstraints(fieldType: FormFieldType) {
  switch (fieldType) {
    case "short-text":
      return { maxLength: 255 };
    case "long-text":
      return { maxWords: 500 };
    case "multi-select-list":
      return { minSelections: 1, maxSelections: 10, items: [] };
    case "user-picker":
      return { allowManualEntry: true, allowEmailInvite: true };
    case "auto-fill-profile":
      return { fields: ["name", "email", "organization"] };
    default:
      return {};
  }
}
