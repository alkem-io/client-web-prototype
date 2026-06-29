import { useState } from "react";
import { useNavigate } from "react-router";
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
import { Badge } from "@/app/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Separator } from "@/app/components/ui/separator";
import { MarkdownEditor } from "@/app/components/ui/markdown-editor";
import {
  X, ImageIcon, GripVertical, Package, Layers, Settings2, ChevronLeft,
  Search, Globe, Lock, Eye, FileText, Sparkles, Link2, User,
} from "lucide-react";
import { cn } from "@/app/components/ui/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

/* ═══════════════════════════════════════════════════════════════════════════════
   Types & Data
   ═══════════════════════════════════════════════════════════════════════════════ */

interface CreateTemplatePackDialogV3Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TemplateItem {
  id: string;
  name: string;
  type: string;
  description: string;
}

const AVAILABLE_TEMPLATES: TemplateItem[] = [
  { id: "t1", name: "Challenge Space", type: "Space", description: "Template for running innovation challenges" },
  { id: "t2", name: "Project Workspace", type: "Space", description: "Structured workspace for project teams" },
  { id: "t3", name: "Weekly Update", type: "Post", description: "Standard format for weekly progress updates" },
  { id: "t4", name: "Brainstorm Session", type: "Whiteboard", description: "Canvas layout for collaborative brainstorming" },
  { id: "t5", name: "Decision Log", type: "Post", description: "Template for recording decisions and rationale" },
  { id: "t6", name: "Feedback Collection", type: "Callout", description: "Gather structured feedback from participants" },
  { id: "t7", name: "Sprint Retrospective", type: "Whiteboard", description: "Retro board with columns for what went well/improve" },
  { id: "t8", name: "Community Space", type: "Space", description: "Open space for community engagement" },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   Main Dialog Component
   ═══════════════════════════════════════════════════════════════════════════════ */

export function CreateTemplatePackDialogV3({
  open,
  onOpenChange,
}: CreateTemplatePackDialogV3Props) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  // Step 1: Pack Identity
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  // Step 2: Add Templates
  const [selectedTemplates, setSelectedTemplates] = useState<TemplateItem[]>([]);
  const [templateSearch, setTemplateSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Step 3: Publish Settings
  const [visibility, setVisibility] = useState("listed");
  const [providerName, setProviderName] = useState("");
  const [references, setReferences] = useState<string[]>([]);
  const [currentRef, setCurrentRef] = useState("");

  const steps = [
    { label: "Pack Identity", icon: Package, description: "Name and describe your pack" },
    { label: "Add Templates", icon: Layers, description: "Choose what to include" },
    { label: "Publish Settings", icon: Settings2, description: "Configure visibility" },
  ];

  const isValid = name.trim().length > 0;

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setCurrentStep(0);
      setName("");
      setDescription("");
      setTags([]);
      setCurrentTag("");
      setCoverImage(null);
      setSelectedTemplates([]);
      setTemplateSearch("");
      setTypeFilter("all");
      setVisibility("listed");
      setProviderName("");
      setReferences([]);
      setCurrentRef("");
    }, 200);
  };

  const handleCreate = () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      handleClose();
      toast.success(`Template Pack "${name}" created successfully`);
      navigate(`/templates/packs/${slug}/settings`);
    }, 1500);
  };

  const goForward = () => {
    if (currentStep < steps.length - 1) {
      setDirection("forward");
      setCurrentStep(currentStep + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setDirection("back");
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setDirection(step > currentStep ? "forward" : "back");
    setCurrentStep(step);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRefKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentRef.trim()) {
      e.preventDefault();
      if (!references.includes(currentRef.trim())) setReferences([...references, currentRef.trim()]);
      setCurrentRef("");
    }
  };

  const addTemplate = (template: TemplateItem) => {
    if (!selectedTemplates.some((t) => t.id === template.id)) {
      setSelectedTemplates([...selectedTemplates, template]);
    }
  };

  const removeTemplate = (id: string) => {
    setSelectedTemplates(selectedTemplates.filter((t) => t.id !== id));
  };

  const moveTemplate = (index: number, dir: number) => {
    const newList = [...selectedTemplates];
    const target = index + dir;
    if (target < 0 || target >= newList.length) return;
    [newList[index], newList[target]] = [newList[target], newList[index]];
    setSelectedTemplates(newList);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden [&>*]:min-w-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 pr-12 border-b">
          <DialogTitle className="text-section-title">Create Template Pack</DialogTitle>
          <DialogDescription className="text-body text-muted-foreground">
            Bundle templates together for easy sharing and reuse.
          </DialogDescription>
          <div className="flex items-center gap-1 mt-3">
            {steps.map((step, i) => (
              <button
                key={i}
                onClick={() => goToStep(i)}
                className={cn(
                  "flex-1 h-1.5 rounded-full transition-all duration-300",
                  i === currentStep
                    ? "bg-primary"
                    : i < currentStep
                    ? "bg-primary/40"
                    : "bg-muted"
                )}
                aria-label={`Go to step ${i + 1}: ${step.label}`}
              />
            ))}
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div
            className={cn(
              "transition-all duration-300 ease-in-out",
              direction === "forward" ? "animate-in slide-in-from-right-4 fade-in" : "animate-in slide-in-from-left-4 fade-in"
            )}
            key={currentStep}
          >
            {/* Step title bar */}
            <div className="px-6 py-3 bg-muted/30 border-b flex items-center gap-3">
              {(() => {
                const StepIcon = steps[currentStep].icon;
                return <StepIcon className="w-4 h-4 text-primary" />;
              })()}
              <div>
                <p className="text-body-emphasis">{steps[currentStep].label}</p>
                <p className="text-caption text-muted-foreground">{steps[currentStep].description}</p>
              </div>
              <div className="ml-auto text-caption text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>

            <div className="px-6 py-5 flex flex-col gap-5">
              {currentStep === 0 && (
                <WizardStepPackIdentity
                  name={name} setName={setName}
                  description={description} setDescription={setDescription}
                  tags={tags} setTags={setTags}
                  currentTag={currentTag} setCurrentTag={setCurrentTag}
                  handleTagKeyDown={handleTagKeyDown}
                  coverImage={coverImage} setCoverImage={setCoverImage}
                />
              )}
              {currentStep === 1 && (
                <WizardStepAddTemplates
                  selectedTemplates={selectedTemplates}
                  addTemplate={addTemplate}
                  removeTemplate={removeTemplate}
                  moveTemplate={moveTemplate}
                  templateSearch={templateSearch}
                  setTemplateSearch={setTemplateSearch}
                  typeFilter={typeFilter}
                  setTypeFilter={setTypeFilter}
                />
              )}
              {currentStep === 2 && (
                <WizardStepPublishSettings
                  visibility={visibility} setVisibility={setVisibility}
                  providerName={providerName} setProviderName={setProviderName}
                  references={references} setReferences={setReferences}
                  currentRef={currentRef} setCurrentRef={setCurrentRef}
                  handleRefKeyDown={handleRefKeyDown}
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t bg-muted/20">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <Button variant="ghost" size="sm" className="gap-1 px-2" onClick={goBack}>
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
              )}
              <div className="flex items-center gap-2">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToStep(i)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      i === currentStep
                        ? "bg-primary scale-125"
                        : i < currentStep
                        ? "bg-primary/50"
                        : "bg-muted-foreground/25"
                    )}
                    aria-label={`Step ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={handleClose}>Cancel</Button>
              {currentStep < steps.length - 1 && (
                <Button onClick={goForward} disabled={currentStep === 0 && !isValid}>
                  Next →
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button onClick={handleCreate} disabled={!isValid || isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    "Create Pack"
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Wizard Step 1: Pack Identity
   ═══════════════════════════════════════════════════════════════════════════════ */

function WizardStepPackIdentity({
  name, setName,
  description, setDescription,
  tags, setTags,
  currentTag, setCurrentTag,
  handleTagKeyDown,
  coverImage, setCoverImage,
}: {
  name: string; setName: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  tags: string[]; setTags: (v: string[]) => void;
  currentTag: string; setCurrentTag: (v: string) => void;
  handleTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  coverImage: string | null; setCoverImage: (v: string | null) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Name */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" />
          <Label className="text-body-emphasis">
            Pack Name <span className="text-destructive">*</span>
          </Label>
        </div>
        <Input
          placeholder="e.g. Innovation Toolkit"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          className="h-11 text-base"
        />
        <p className="text-caption text-muted-foreground">A memorable name for your template collection</p>
      </section>

      <Separator />

      {/* Description */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <Label className="text-body-emphasis">Description</Label>
        </div>
        <MarkdownEditor
          value={description}
          onChange={setDescription}
          placeholder="Describe what templates are included and when to use this pack..."
          minHeight="100px"
        />
        <p className="text-caption text-muted-foreground">Helps users understand when to use this pack</p>
      </section>

      <Separator />

      {/* Tags & Cover */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <Label className="text-body-emphasis">Tags</Label>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1 py-1">
                  {tag}
                  <button onClick={() => setTags(tags.filter((t) => t !== tag))} className="hover:text-destructive ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <Input
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Type a tag and press Enter"
          />
        </section>

        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
            <Label className="text-body-emphasis">Cover Image</Label>
          </div>
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 min-h-[100px] cursor-pointer transition-all duration-200",
              coverImage
                ? "border-primary/30 bg-primary/5"
                : "border-muted-foreground/20 hover:border-primary/40 hover:bg-primary/5"
            )}
            onClick={() => setCoverImage(coverImage ? null : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop")}
          >
            {coverImage ? (
              <img src={coverImage} alt="Cover" className="max-h-16 rounded-lg object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span className="text-caption">Upload cover</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Wizard Step 2: Add Templates
   ═══════════════════════════════════════════════════════════════════════════════ */

function WizardStepAddTemplates({
  selectedTemplates,
  addTemplate,
  removeTemplate,
  moveTemplate,
  templateSearch,
  setTemplateSearch,
  typeFilter,
  setTypeFilter,
}: {
  selectedTemplates: TemplateItem[];
  addTemplate: (t: TemplateItem) => void;
  removeTemplate: (id: string) => void;
  moveTemplate: (index: number, dir: number) => void;
  templateSearch: string;
  setTemplateSearch: (v: string) => void;
  typeFilter: string;
  setTypeFilter: (v: string) => void;
}) {
  const filteredAvailable = AVAILABLE_TEMPLATES.filter((t) => {
    if (selectedTemplates.some((sel) => sel.id === t.id)) return false;
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (templateSearch.trim()) {
      const q = templateSearch.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Selected templates */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <Label className="text-body-emphasis">Included Templates</Label>
        </div>
        <p className="text-caption text-muted-foreground">
          {selectedTemplates.length === 0
            ? "Select templates from below to include in this pack"
            : `${selectedTemplates.length} template${selectedTemplates.length > 1 ? "s" : ""} selected`}
        </p>
        {selectedTemplates.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {selectedTemplates.map((template, i) => (
              <div key={template.id} className="flex items-center gap-2 p-3 border rounded-lg bg-background">
                <GripVertical className="w-4 h-4 text-muted-foreground shrink-0 cursor-grab" />
                <div className="flex-1 min-w-0">
                  <p className="text-body-emphasis truncate">{template.name}</p>
                  <p className="text-caption text-muted-foreground">{template.description}</p>
                </div>
                <Badge variant="outline" className="shrink-0 text-[10px]">{template.type}</Badge>
                <div className="flex flex-col gap-0.5">
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => moveTemplate(i, -1)} disabled={i === 0}>↑</Button>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => moveTemplate(i, 1)} disabled={i === selectedTemplates.length - 1}>↓</Button>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeTemplate(template.id)}>
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* Search & Filter */}
      <section className="flex flex-col gap-3">
        <Label className="text-caption text-muted-foreground uppercase tracking-wide">Available Templates</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={templateSearch}
              onChange={(e) => setTemplateSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="Space">Space</SelectItem>
              <SelectItem value="Post">Post</SelectItem>
              <SelectItem value="Whiteboard">Whiteboard</SelectItem>
              <SelectItem value="Callout">Callout</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Available list */}
        <div className="flex flex-col gap-1.5 max-h-[240px] overflow-y-auto">
          {filteredAvailable.map((template) => (
            <div
              key={template.id}
              className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-all duration-200"
              onClick={() => addTemplate(template)}
            >
              <Checkbox checked={false} />
              <div className="flex-1 min-w-0">
                <p className="text-body-emphasis truncate">{template.name}</p>
                <p className="text-caption text-muted-foreground truncate">{template.description}</p>
              </div>
              <Badge variant="outline" className="shrink-0 text-[10px]">{template.type}</Badge>
            </div>
          ))}
          {filteredAvailable.length === 0 && (
            <p className="text-caption text-muted-foreground text-center py-4">
              {templateSearch || typeFilter !== "all" ? "No templates match your filters" : "All templates are already selected"}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Wizard Step 3: Publish Settings
   ═══════════════════════════════════════════════════════════════════════════════ */

function WizardStepPublishSettings({
  visibility, setVisibility,
  providerName, setProviderName,
  references, setReferences,
  currentRef, setCurrentRef,
  handleRefKeyDown,
}: {
  visibility: string; setVisibility: (v: string) => void;
  providerName: string; setProviderName: (v: string) => void;
  references: string[]; setReferences: (v: string[]) => void;
  currentRef: string; setCurrentRef: (v: string) => void;
  handleRefKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Visibility */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          <Label className="text-body-emphasis">Visibility</Label>
        </div>
        <RadioGroup value={visibility} onValueChange={setVisibility} className="flex flex-col gap-2">
          <label
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
              visibility === "listed"
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-muted-foreground/30"
            )}
          >
            <RadioGroupItem value="listed" className="mt-0.5" />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-body-emphasis">Listed</span>
              </div>
              <span className="text-caption text-muted-foreground">Visible in template marketplace and search</span>
            </div>
          </label>
          <label
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
              visibility === "unlisted"
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-muted-foreground/30"
            )}
          >
            <RadioGroupItem value="unlisted" className="mt-0.5" />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-body-emphasis">Unlisted</span>
              </div>
              <span className="text-caption text-muted-foreground">Only accessible via direct link</span>
            </div>
          </label>
          <label
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
              visibility === "private"
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-muted-foreground/30"
            )}
          >
            <RadioGroupItem value="private" className="mt-0.5" />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span className="text-body-emphasis">Private</span>
              </div>
              <span className="text-caption text-muted-foreground">Only visible to you and your organization</span>
            </div>
          </label>
        </RadioGroup>
      </section>

      <Separator />

      {/* Provider Name */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <Label className="text-body-emphasis">Provider Name</Label>
        </div>
        <Input
          placeholder="e.g. Alkemio Foundation"
          value={providerName}
          onChange={(e) => setProviderName(e.target.value)}
        />
        <p className="text-caption text-muted-foreground">Credited as the creator/maintainer of this pack</p>
      </section>

      <Separator />

      {/* References */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-muted-foreground" />
          <Label className="text-body-emphasis">References</Label>
        </div>
        <p className="text-caption text-muted-foreground">
          Add links to documentation or related resources
        </p>
        {references.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {references.map((ref, i) => (
              <Badge key={i} variant="outline" className="flex items-center gap-1 w-fit max-w-full py-1">
                <span className="truncate">{ref}</span>
                <button onClick={() => setReferences(references.filter((_, idx) => idx !== i))} className="hover:text-destructive shrink-0 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <Input
          value={currentRef}
          onChange={(e) => setCurrentRef(e.target.value)}
          onKeyDown={handleRefKeyDown}
          placeholder="https://... (press Enter to add)"
        />
      </section>
    </div>
  );
}
