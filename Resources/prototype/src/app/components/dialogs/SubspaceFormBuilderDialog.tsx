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
import { Label } from "@/app/components/ui/label";
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
import { cn } from "@/app/components/ui/utils";
import type { ApplicationFormConfig, FormField, FormFieldType } from "./SubspaceApplicationDialog";

interface SubspaceFormBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceId: string;
  spaceName: string;
  initialConfig?: ApplicationFormConfig | null;
  onSave?: (config: ApplicationFormConfig) => void;
}

const FIELD_TYPES: { id: FormFieldType; label: string; description: string }[] = [
  { id: "short-text", label: "Short Text", description: "Single line response" },
  { id: "long-text", label: "Long Text", description: "Multi-line response with word limit" },
  { id: "auto-fill-profile", label: "Auto-fill Profile", description: "Pre-filled from user profile" },
  { id: "user-picker", label: "User Picker", description: "Search members or invite by email" },
  { id: "multi-select-list", label: "Multi-select List", description: "Choose from predefined options" },
];

const VNG_TEMPLATE: FormField[] = [
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
];

export function SubspaceFormBuilderDialog({
  open,
  onOpenChange,
  spaceId,
  spaceName,
  initialConfig,
  onSave,
}: SubspaceFormBuilderDialogProps) {
  const [showTemplatePicker, setShowTemplatePicker] = useState(!initialConfig);
  const [questions, setQuestions] = useState<FormField[]>(initialConfig?.questions || []);
  const [isSaving, setIsSaving] = useState(false);

  const handleUseTemplate = (template: FormField[]) => {
    setQuestions(template.map((q, idx) => ({ ...q, order: idx })));
    setShowTemplatePicker(false);
  };

  const handleStartBlank = () => {
    setQuestions([]);
    setShowTemplatePicker(false);
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

  if (showTemplatePicker) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Start with a template</DialogTitle>
            <DialogDescription>Choose how you'd like to set up your application form</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-6">
            <div className="border rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleUseTemplate(VNG_TEMPLATE)}>
              <h3 className="font-semibold mb-2">VNG Groei Program</h3>
              <p className="text-sm text-muted-foreground mb-4">9 pre-configured questions optimized for innovation proposals</p>
              <Button variant="outline" size="sm">Use template</Button>
            </div>

            <div className="border rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors" onClick={handleStartBlank}>
              <h3 className="font-semibold mb-2">Start from scratch</h3>
              <p className="text-sm text-muted-foreground mb-4">Create a custom form with your own questions</p>
              <Button variant="outline" size="sm">Start blank</Button>
            </div>
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
          <div className="space-y-4 max-w-3xl">
            <div className="flex justify-between items-center mb-6">
              <Label className="text-body-emphasis">Questions</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Question
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {FIELD_TYPES.map((type) => (
                    <DropdownMenuItem
                      key={type.id}
                      onClick={() => handleAddQuestion(type.id)}
                      className="cursor-pointer"
                    >
                      <div>
                        <div>{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {questions.length === 0 ? (
              <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                No questions yet. Click "Add Question" to get started.
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                {questions.map((question, index) => (
                  <div key={question.id} className={cn("p-4", index !== questions.length - 1 && "border-b")}>
                    <div className="flex gap-3 items-start">
                      <div className="text-sm font-semibold text-muted-foreground w-6 flex-shrink-0 pt-2">
                        {index + 1}
                      </div>

                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex gap-3 items-start">
                          <Input
                            value={question.label}
                            onChange={(e) => handleUpdateQuestion(index, { label: e.target.value })}
                            placeholder="Question label"
                            className="flex-1"
                          />
                          <select
                            value={question.type}
                            onChange={(e) =>
                              handleUpdateQuestion(index, {
                                type: e.target.value as FormFieldType,
                                constraints: getDefaultConstraints(e.target.value as FormFieldType),
                              })
                            }
                            className="h-10 px-3 py-2 text-sm border border-input rounded-md bg-background hover:bg-accent"
                          >
                            {FIELD_TYPES.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                          <label className="flex items-center gap-2 pt-2">
                            <Checkbox
                              checked={question.required}
                              onCheckedChange={(checked) =>
                                handleUpdateQuestion(index, { required: checked === true })
                              }
                            />
                            <span className="text-sm text-muted-foreground">Required</span>
                          </label>
                        </div>

                        {/* Constraint fields */}
                        {question.type === "short-text" && (
                          <div className="flex gap-3 text-sm pl-2">
                            <label className="flex items-center gap-2">
                              <span className="text-muted-foreground">Max length:</span>
                              <Input
                                type="number"
                                value={question.constraints.maxLength || 255}
                                onChange={(e) =>
                                  handleUpdateQuestion(index, {
                                    constraints: { ...question.constraints, maxLength: parseInt(e.target.value) || 255 },
                                  })
                                }
                                className="w-20 h-8"
                              />
                            </label>
                          </div>
                        )}

                        {question.type === "long-text" && (
                          <div className="flex gap-3 text-sm pl-2">
                            <label className="flex items-center gap-2">
                              <span className="text-muted-foreground">Max words:</span>
                              <Input
                                type="number"
                                value={question.constraints.maxWords || 500}
                                onChange={(e) =>
                                  handleUpdateQuestion(index, {
                                    constraints: { ...question.constraints, maxWords: parseInt(e.target.value) || 500 },
                                  })
                                }
                                className="w-20 h-8"
                              />
                            </label>
                          </div>
                        )}

                        {question.type === "multi-select-list" && (
                          <div className="space-y-2 pl-2">
                            <div className="flex gap-3 text-sm">
                              <label className="flex items-center gap-2">
                                <span className="text-muted-foreground">Min:</span>
                                <Input
                                  type="number"
                                  value={question.constraints.minSelections || 1}
                                  onChange={(e) =>
                                    handleUpdateQuestion(index, {
                                      constraints: { ...question.constraints, minSelections: parseInt(e.target.value) || 1 },
                                    })
                                  }
                                  className="w-16 h-8"
                                />
                              </label>
                              <label className="flex items-center gap-2">
                                <span className="text-muted-foreground">Max:</span>
                                <Input
                                  type="number"
                                  value={question.constraints.maxSelections || 10}
                                  onChange={(e) =>
                                    handleUpdateQuestion(index, {
                                      constraints: { ...question.constraints, maxSelections: parseInt(e.target.value) || 10 },
                                    })
                                  }
                                  className="w-16 h-8"
                                />
                              </label>
                            </div>
                            <p className="text-xs text-muted-foreground pl-2">Note: Configure options in the form builder later</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-1 flex-shrink-0 pt-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleReorderQuestion(index, "up")}
                          disabled={index === 0}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleReorderQuestion(index, "down")}
                          disabled={index === questions.length - 1}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteQuestion(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/20">
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
