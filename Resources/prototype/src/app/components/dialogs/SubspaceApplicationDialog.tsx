import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import {
  ChevronRight, CheckCircle2, Building2,
  Users, MessageSquare, Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/app/components/ui/utils";

export interface FormFieldConstraints {
  maxLength?: number;
  maxWords?: number;
  minSelections?: number;
  maxSelections?: number;
  fields?: Array<"name" | "email" | "organization">;
  items?: Array<{ id: string; label: string }>;
  allowManualEntry?: boolean;
  allowEmailInvite?: boolean;
}

export type FormFieldType = "short-text" | "long-text" | "user-picker" | "multi-select-list" | "auto-fill-profile";

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  description?: string;
  required: boolean;
  order: number;
  constraints: FormFieldConstraints;
}

export interface ApplicationFormConfig {
  id: string;
  spaceId: string;
  isActive: boolean;
  questions: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface SubspaceApplication {
  id: string;
  formConfigId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  spaceId: string;
  answers: Record<string, any>;
  status: "draft" | "submitted" | "under-review" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewMessage?: string;
  createdSubspaceId?: string;
}

interface SubspaceApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formConfig: ApplicationFormConfig;
  spaceName: string;
  currentUser: {
    id: string;
    name: string;
    email: string;
    organization?: string;
  };
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

interface StepConfig {
  id: number;
  title: string;
  icon: LucideIcon;
  iconColor: string;
  fieldIds: string[];
}

function deriveStepsFromConfig(formConfig: ApplicationFormConfig): StepConfig[] {
  const questions = formConfig.questions.sort((a, b) => a.order - b.order);
  const stepIcons: LucideIcon[] = [Building2, Users, Users, Zap, MessageSquare];
  const steps: StepConfig[] = [];
  let questionIndex = 0;

  // Group questions into steps:
  // - Group up to 2 short-text/user-picker fields per step
  // - One long-text/multi-select-list per step
  while (questionIndex < questions.length) {
    const currentQ = questions[questionIndex];
    const step: StepConfig = {
      id: steps.length,
      title: currentQ.label || "Question",
      icon: stepIcons[steps.length % stepIcons.length],
      iconColor: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
      fieldIds: [currentQ.id],
    };

    // Try to add one more field if possible (short-text or user-picker only)
    if (
      questionIndex + 1 < questions.length &&
      (currentQ.type === "short-text" || currentQ.type === "user-picker") &&
      (questions[questionIndex + 1].type === "short-text" || questions[questionIndex + 1].type === "user-picker")
    ) {
      step.fieldIds.push(questions[questionIndex + 1].id);
      questionIndex += 2;
    } else {
      questionIndex += 1;
    }

    steps.push(step);
  }

  // Add final Review & Submit step
  steps.push({
    id: steps.length,
    title: "You're all set!",
    icon: CheckCircle2,
    iconColor: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    fieldIds: [],
  });

  return steps;
}

const VNG_STEPS: StepConfig[] = [
  {
    id: 0,
    title: "Let's start with the basics",
    icon: Building2,
    iconColor: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    fieldIds: ["title", "initiating-municipality"],
  },
  {
    id: 1,
    title: "Who are the leads?",
    icon: Users,
    iconColor: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    fieldIds: ["first-lead", "second-lead"],
  },
  {
    id: 2,
    title: "Who else is in?",
    icon: Users,
    iconColor: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    fieldIds: ["supporting-municipalities"],
  },
  {
    id: 3,
    title: "What's the vision?",
    icon: Zap,
    iconColor: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    fieldIds: ["who", "what-for", "why", "how"],
  },
  {
    id: 4,
    title: "You're all set!",
    icon: CheckCircle2,
    iconColor: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    fieldIds: [],
  },
];

export function SubspaceApplicationDialog({
  open,
  onOpenChange,
  formConfig,
  spaceName,
  currentUser,
}: SubspaceApplicationDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill profile data on mount
  useEffect(() => {
    const firstLeadField = formConfig.questions.find((q) => q.id === "first-lead");
    if (firstLeadField && firstLeadField.type === "auto-fill-profile" && !answers["first-lead"]) {
      setAnswers((prev) => ({
        ...prev,
        "first-lead": {
          name: currentUser.name,
          email: currentUser.email,
          organization: currentUser.organization || "",
        },
      }));
    }
  }, [formConfig, currentUser, answers]);

  const steps = deriveStepsFromConfig(formConfig);
  const currentStepConfig = steps[currentStep];
  const isReviewStep = currentStep === steps.length - 1;

  const getFieldsForStep = (): FormField[] => {
    if (isReviewStep) return [];
    return formConfig.questions.filter((q) => currentStepConfig.fieldIds.includes(q.id));
  };

  const fieldsInStep = getFieldsForStep();

  const canProceed = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fieldsInStep.forEach((field) => {
      const value = answers[field.id];

      // Check multi-select separately since arrays are truthy
      if (field.type === "multi-select-list") {
        const selected = Array.isArray(value) ? value : [];
        const minSelections = field.constraints.minSelections || 1;
        if (selected.length < minSelections) {
          newErrors[field.id] = `Select at least ${minSelections}`;
          isValid = false;
        }
      } else if (field.required) {
        // Check other required fields
        if (!value || (typeof value === "string" && !value.trim())) {
          newErrors[field.id] = "This is required";
          isValid = false;
        }
      }

      // Check long-text word limits
      if (field.type === "long-text" && value) {
        const words = countWords(value);
        const maxWords = field.constraints.maxWords || 250;
        if (words > maxWords) {
          newErrors[field.id] = `Too long (${words}/${maxWords} words)`;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      handleClose();
      toast.success("Application submitted! The space team will review it soon.");
    }, 1500);
  };

  const handleAnswerChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  if (!formConfig.questions || formConfig.questions.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with step indicator */}
        <DialogHeader className="pb-6 border-b">
          <div className="space-y-4">
            <div>
              <DialogTitle className="text-section-title">Create a subspace proposal</DialogTitle>
              <DialogDescription className="text-body text-muted-foreground mt-1">
                Step {currentStep + 1} of {steps.length}
              </DialogDescription>
            </div>

            {/* Step progress dots */}
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-2 flex-1 rounded-full transition-all",
                    i <= currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isReviewStep ? (
            <ReviewStep answers={answers} formConfig={formConfig} />
          ) : (
            <div className="space-y-6">
              {/* Step header with icon */}
              <div className="flex gap-4">
                <div className={cn("flex items-center justify-center w-16 h-16 rounded-xl shrink-0", currentStepConfig.iconColor)}>
                  <currentStepConfig.icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-subsection-title font-semibold">{currentStepConfig.title}</h2>
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-5">
                {fieldsInStep.map((field) => (
                  <FormFieldRenderer
                    key={field.id}
                    field={field}
                    value={answers[field.id]}
                    onChange={(value) => handleAnswerChange(field.id, value)}
                    error={errors[field.id]}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-muted/20 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            ← Back
          </Button>

          <div className="text-caption text-muted-foreground">
            {currentStep + 1} of {steps.length}
          </div>

          {!isReviewStep ? (
            <Button onClick={handleNext}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit proposal"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Form Field Renderer
   ═══════════════════════════════════════════════════════════════════════════════ */

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  currentUser?: { id: string; name: string; email: string; organization?: string };
}

function FormFieldRenderer({
  field,
  value,
  onChange,
  error,
  currentUser,
}: FormFieldRendererProps) {
  const [searchMode, setSearchMode] = useState<"search" | "invite">("search");
  const [searchQuery, setSearchQuery] = useState("");

  const wordCount = field.type === "long-text" && value ? countWords(value) : 0;
  const maxWords = field.constraints.maxWords || 250;
  const isOverLimit = wordCount > maxWords;

  if (field.type === "auto-fill-profile") {
    return (
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarFallback>{currentUser?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-body-emphasis">{value?.name || currentUser?.name}</p>
            <p className="text-caption text-muted-foreground">{value?.email || currentUser?.email}</p>
          </div>
        </div>
        {(value?.organization || currentUser?.organization) && (
          <p className="text-caption text-muted-foreground pl-15">
            {value?.organization || currentUser?.organization}
          </p>
        )}
      </div>
    );
  }

  if (field.type === "short-text") {
    return (
      <div className="space-y-3">
        <Label className="text-body-emphasis">{field.label}</Label>
        {field.description && <p className="text-caption text-muted-foreground">{field.description}</p>}
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.label}
          className="bg-background h-12 text-base"
        />
        {error && <p className="text-caption text-red-600">{error}</p>}
      </div>
    );
  }

  if (field.type === "long-text") {
    return (
      <div className="space-y-3">
        <Label className="text-body-emphasis">{field.label}</Label>
        {field.description && <p className="text-caption text-muted-foreground">{field.description}</p>}
        <Textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.label}
          className="bg-background min-h-32 text-base"
        />
        <div className="flex items-center justify-between">
          <div>
            {error && <p className="text-caption text-red-600">{error}</p>}
          </div>
          <span className={cn("text-caption", isOverLimit ? "text-red-600 font-medium" : "text-muted-foreground")}>
            {wordCount}/{maxWords}
          </span>
        </div>
      </div>
    );
  }

  if (field.type === "user-picker") {
    const communityMembers = [
      { id: "user-2", name: "Bob Johnson", email: "bob@example.com" },
      { id: "user-3", name: "Carol Lee", email: "carol@example.com" },
      { id: "user-4", name: "David Kim", email: "david@example.com" },
      { id: "user-5", name: "Elena Martinez", email: "elena@example.com" },
      { id: "user-6", name: "Frank Wilson", email: "frank@example.com" },
      { id: "user-7", name: "Grace Hopper", email: "grace@example.com" },
    ];

    const filteredMembers = communityMembers.filter((m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isEmail = value && typeof value === "string" && value.includes("@");

    return (
      <div className="space-y-4">
        <div>
          <Label className="text-body-emphasis">{field.label}</Label>
          {field.description && <p className="text-caption text-muted-foreground mt-1">{field.description}</p>}
        </div>

        {/* Option cards */}
        <div className="space-y-3">
          {/* Find Member Card */}
          <button
            onClick={() => {
              setSearchMode("search");
              setSearchQuery("");
            }}
            className={cn(
              "w-full p-4 rounded-lg border transition-all text-left",
              searchMode === "search"
                ? "border-primary/40 bg-background"
                : "border-border bg-card hover:border-primary/30 hover:bg-muted/30"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex-shrink-0 mt-0.5">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-body-emphasis">Find an existing member</p>
                <p className="text-caption text-muted-foreground mt-1">Search our community members</p>
              </div>
              {searchMode === "search" && (
                <div className="text-primary/60 text-lg">✓</div>
              )}
            </div>

            {/* Search input - only show when selected */}
            {searchMode === "search" && (
              <div className="mt-3 pt-3 border-t">
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-background h-10"
                  autoFocus
                />

                {/* Results */}
                <div className="space-y-2 mt-3 max-h-40 overflow-y-auto">
                  {searchQuery && filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <button
                        key={member.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onChange(member.id === value ? null : member.id);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                          value === member.id
                            ? "border-primary/50 bg-primary/5"
                            : "border-border/50 bg-background hover:border-primary/30"
                        )}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-body-emphasis text-sm">{member.name}</p>
                          <p className="text-caption text-muted-foreground">{member.email}</p>
                        </div>
                        {value === member.id && <span className="text-primary text-lg">✓</span>}
                      </button>
                    ))
                  ) : searchQuery ? (
                    <p className="text-caption text-muted-foreground py-2 text-center">No members found</p>
                  ) : (
                    <p className="text-caption text-muted-foreground py-2 text-center">Start typing to search...</p>
                  )}
                </div>
              </div>
            )}
          </button>

          {/* Invite by Email Card */}
          <button
            onClick={() => {
              setSearchMode("invite");
              setSearchQuery("");
            }}
            className={cn(
              "w-full p-4 rounded-lg border transition-all text-left",
              searchMode === "invite"
                ? "border-primary/40 bg-background"
                : "border-border bg-card hover:border-primary/30 hover:bg-muted/30"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 flex-shrink-0 mt-0.5">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-body-emphasis">Invite someone new</p>
                <p className="text-caption text-muted-foreground mt-1">They'll join Alkemio and this initiative</p>
              </div>
              {searchMode === "invite" && (
                <div className="text-primary/60 text-lg">✓</div>
              )}
            </div>

            {/* Email input - only show when selected */}
            {searchMode === "invite" && (
              <div className="mt-3 pt-3 border-t space-y-3">
                <Input
                  type="email"
                  placeholder="their@email.com"
                  value={isEmail ? value : ""}
                  onChange={(e) => onChange(e.target.value || null)}
                  className="bg-background h-10"
                  autoFocus
                />

                {isEmail && value && (
                  <div className="p-3 rounded-lg border bg-emerald-50 dark:bg-emerald-500/10 flex items-center gap-3">
                    <Avatar className="w-8 h-8 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                      <AvatarFallback>{value.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-caption text-muted-foreground">Invite</p>
                      <p className="text-body-emphasis text-sm truncate">{value}</p>
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 text-lg">✓</span>
                  </div>
                )}
              </div>
            )}
          </button>
        </div>

        {error && <p className="text-caption text-red-600">{error}</p>}
      </div>
    );
  }

  if (field.type === "multi-select-list") {
    const [multiSelectSearch, setMultiSelectSearch] = useState("");

    const items = field.constraints.items || [];
    const selectedValues = Array.isArray(value) ? value : [];

    // Filter items based on search
    const filteredItems = items.filter((item) =>
      item.label.toLowerCase().includes(multiSelectSearch.toLowerCase())
    );

    return (
      <div className="space-y-3">
        <Label className="text-body-emphasis">{field.label}</Label>
        {field.description && <p className="text-caption text-muted-foreground">{field.description}</p>}

        {/* Search input for many items */}
        {items.length > 10 && (
          <Input
            type="text"
            placeholder="Search..."
            value={multiSelectSearch}
            onChange={(e) => setMultiSelectSearch(e.target.value)}
            className="bg-background h-10"
          />
        )}

        {/* Selected items display */}
        {selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2 rounded-lg border bg-muted/30">
            {selectedValues.map((val: string) => (
              <Badge key={val} variant="secondary" className="gap-1">
                {items.find((i) => i.id === val)?.label || val}
                <button
                  onClick={() =>
                    onChange(selectedValues.filter((v: string) => v !== val))
                  }
                  className="ml-1 hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Selection list */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (selectedValues.includes(item.id)) {
                    onChange(selectedValues.filter((v: string) => v !== item.id));
                  } else {
                    onChange([...selectedValues, item.id]);
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                  selectedValues.includes(item.id)
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:border-primary/50"
                )}
              >
                <Checkbox checked={selectedValues.includes(item.id)} onChange={() => {}} className="pointer-events-none" />
                <span className="text-body">{item.label}</span>
              </button>
            ))
          ) : (
            <p className="text-caption text-muted-foreground py-2">No matches found</p>
          )}
        </div>

        {error && <p className="text-caption text-red-600">{error}</p>}
      </div>
    );
  }

  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Review Step
   ═══════════════════════════════════════════════════════════════════════════════ */

interface ReviewStepProps {
  answers: Record<string, any>;
  formConfig: ApplicationFormConfig;
}

function ReviewStep({ answers, formConfig }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-emerald-50 dark:bg-emerald-500/10 p-4 flex gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-body-emphasis text-emerald-900 dark:text-emerald-200">
            Almost ready to submit!
          </p>
          <p className="text-caption text-emerald-800/70 dark:text-emerald-300/70 mt-1">
            Please review everything looks correct before submitting.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {formConfig.questions.map((question) => {
          const answer = answers[question.id];
          if (!answer && question.type !== "auto-fill-profile") return null;

          return (
            <div key={question.id} className="rounded-lg border bg-card p-4 space-y-2">
              <p className="text-caption font-medium text-muted-foreground uppercase tracking-wide">{question.label}</p>
              {question.type === "auto-fill-profile" ? (
                <div className="space-y-1">
                  <p className="text-body-emphasis">{answer?.name}</p>
                  <p className="text-caption text-muted-foreground">{answer?.email}</p>
                </div>
              ) : question.type === "multi-select-list" ? (
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(answer) &&
                    answer.map((val: string) => (
                      <Badge key={val} variant="secondary">
                        {val}
                      </Badge>
                    ))}
                </div>
              ) : (
                <p className="text-body whitespace-pre-wrap">{answer || "—"}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
