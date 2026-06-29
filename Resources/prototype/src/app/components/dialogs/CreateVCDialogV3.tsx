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
  X, ImageIcon, ChevronLeft, Search, Brain, Fingerprint, Zap,
  BookOpen, MessageCircle, Users, Lightbulb, PenTool, BarChart3,
  Shield, Compass, FileText, Bot,
  type LucideIcon,
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
   Template Data
   ═══════════════════════════════════════════════════════════════════════════════ */

interface VCTemplate {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: string;
  defaults: {
    name?: string;
    tagline?: string;
    description?: string;
    tags?: string[];
  };
}

interface TemplateCategory {
  id: string;
  label: string;
  order: number;
}

const CATEGORIES: TemplateCategory[] = [
  { id: "getting-started", label: "Getting Started", order: 0 },
  { id: "knowledge", label: "Knowledge & Research", order: 1 },
  { id: "community", label: "Community & Engagement", order: 2 },
  { id: "creative", label: "Creative & Strategy", order: 3 },
];

const VC_TEMPLATES: VCTemplate[] = [
  {
    id: "blank",
    name: "Blank Virtual Contributor",
    description: "Start from scratch. Choose your own knowledge source and configure capabilities.",
    icon: Bot,
    category: "getting-started",
    defaults: {},
  },
  {
    id: "research-assistant",
    name: "Research Assistant",
    description: "Helps find, summarize, and synthesize research papers, articles, and data sources.",
    icon: BookOpen,
    category: "knowledge",
    defaults: {
      tagline: "Your AI research companion",
      description: "I help teams find relevant research, summarize papers, and synthesize findings across multiple sources. Ask me about any topic and I'll point you to the right resources.",
      tags: ["Research", "Knowledge", "Papers", "Analysis"],
    },
  },
  {
    id: "knowledge-curator",
    name: "Knowledge Curator",
    description: "Organizes and maintains a structured knowledge base from community contributions.",
    icon: FileText,
    category: "knowledge",
    defaults: {
      tagline: "Keeping knowledge organized and accessible",
      description: "I help maintain and organize the community's collective knowledge. I can categorize contributions, identify gaps, and suggest related content.",
      tags: ["Knowledge Base", "Organization", "Curation"],
    },
  },
  {
    id: "literature-reviewer",
    name: "Literature Reviewer",
    description: "Conducts systematic reviews of published literature on specific topics.",
    icon: BarChart3,
    category: "knowledge",
    defaults: {
      tagline: "Systematic literature review support",
      description: "I assist with systematic literature reviews by identifying relevant papers, extracting key findings, and identifying themes across publications.",
      tags: ["Literature Review", "Systematic", "Academic"],
    },
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    description: "Interprets data, creates summaries, and answers questions about community metrics.",
    icon: BarChart3,
    category: "knowledge",
    defaults: {
      tagline: "Making sense of your data",
      description: "I analyze community data, engagement metrics, and content patterns to provide insights that help you understand what's working and where to focus.",
      tags: ["Data", "Analytics", "Metrics", "Insights"],
    },
  },
  {
    id: "community-moderator",
    name: "Community Moderator",
    description: "Helps maintain healthy discussions by guiding conversations and answering common questions.",
    icon: Shield,
    category: "community",
    defaults: {
      tagline: "Keeping discussions productive and welcoming",
      description: "I help maintain a healthy community by answering common questions, guiding new members, and ensuring discussions stay productive and respectful.",
      tags: ["Moderation", "Community", "Guidelines", "Support"],
    },
  },
  {
    id: "onboarding-guide",
    name: "Onboarding Guide",
    description: "Welcomes new members and helps them navigate the space and find relevant content.",
    icon: Compass,
    category: "community",
    defaults: {
      tagline: "Your friendly guide to getting started",
      description: "I welcome new members, help them understand how this space works, point them to relevant content, and connect them with the right people.",
      tags: ["Onboarding", "Welcome", "Guide", "New Members"],
    },
  },
  {
    id: "discussion-facilitator",
    name: "Discussion Facilitator",
    description: "Stimulates and guides discussions with prompts, summaries, and follow-up questions.",
    icon: MessageCircle,
    category: "community",
    defaults: {
      tagline: "Sparking meaningful conversations",
      description: "I help facilitate discussions by posing thought-provoking questions, summarizing ongoing threads, and connecting related conversations.",
      tags: ["Facilitation", "Discussion", "Engagement", "Dialogue"],
    },
  },
  {
    id: "feedback-collector",
    name: "Feedback Collector",
    description: "Gathers, categorizes, and synthesizes feedback from community members.",
    icon: Users,
    category: "community",
    defaults: {
      tagline: "Collecting and organizing community feedback",
      description: "I help gather structured feedback from community members, categorize responses, identify common themes, and present actionable summaries.",
      tags: ["Feedback", "Survey", "Synthesis", "Voice of Community"],
    },
  },
  {
    id: "brainstorm-partner",
    name: "Brainstorm Partner",
    description: "Generates ideas, challenges assumptions, and helps explore creative possibilities.",
    icon: Lightbulb,
    category: "creative",
    defaults: {
      tagline: "Your creative thinking companion",
      description: "I help teams brainstorm by generating diverse ideas, challenging assumptions, asking 'what if' questions, and connecting unexpected concepts.",
      tags: ["Brainstorm", "Creativity", "Ideas", "Innovation"],
    },
  },
  {
    id: "strategy-advisor",
    name: "Strategy Advisor",
    description: "Provides strategic perspective, frameworks, and analysis for decision-making.",
    icon: Compass,
    category: "creative",
    defaults: {
      tagline: "Strategic thinking support",
      description: "I help teams think strategically by applying frameworks, analyzing trade-offs, considering multiple perspectives, and structuring complex decisions.",
      tags: ["Strategy", "Frameworks", "Decision Making", "Analysis"],
    },
  },
  {
    id: "content-creator",
    name: "Content Creator",
    description: "Helps draft, edit, and improve written content like posts, summaries, and reports.",
    icon: PenTool,
    category: "creative",
    defaults: {
      tagline: "Helping you write better, faster",
      description: "I assist with drafting posts, editing content, improving clarity, and maintaining consistent tone across community communications.",
      tags: ["Writing", "Content", "Editing", "Communication"],
    },
  },
];

const HOSTED_SPACES = [
  { id: "space-1", name: "Climate Action Hub" },
  { id: "space-2", name: "Innovation Workshop" },
  { id: "space-3", name: "Product Development" },
  { id: "space-4", name: "Research Network" },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   Main Dialog Component
   ═══════════════════════════════════════════════════════════════════════════════ */

interface CreateVCDialogV3Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateVCDialogV3({
  open,
  onOpenChange,
}: CreateVCDialogV3Props) {
  const navigate = useNavigate();
  // -1 = template gallery, 0-2 = wizard steps
  const [currentView, setCurrentView] = useState<number>(-1);
  const [selectedTemplate, setSelectedTemplate] = useState<VCTemplate>(VC_TEMPLATES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  // Step 1: Knowledge Source
  const [sourceType, setSourceType] = useState<string>("");
  const [selectedSpace, setSelectedSpace] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");

  // Step 2: Identity
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");

  // Step 3: Capabilities & Test
  const [capAnswer, setCapAnswer] = useState(true);
  const [capPosts, setCapPosts] = useState(true);
  const [capSummarize, setCapSummarize] = useState(true);
  const [testQuestion, setTestQuestion] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  const steps = [
    { label: "Knowledge Source", icon: Brain, description: "Choose how your VC learns" },
    { label: "Identity", icon: Fingerprint, description: "Give it a personality" },
    { label: "Capabilities", icon: Zap, description: "Configure and test" },
  ];

  const isValid = name.trim().length > 0 && sourceType !== "";

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setCurrentView(-1);
      setSelectedTemplate(VC_TEMPLATES[0]);
      setSearchQuery("");
      setSourceType("");
      setSelectedSpace("");
      setApiEndpoint("");
      setApiKey("");
      setName("");
      setTagline("");
      setDescription("");
      setAvatar(null);
      setTags([]);
      setCurrentTag("");
      setCapAnswer(true);
      setCapPosts(true);
      setCapSummarize(true);
      setTestQuestion("");
      setTestResponse("");
    }, 200);
  };

  const handleSelectTemplate = (template: VCTemplate) => {
    setSelectedTemplate(template);
  };

  const handleContinueFromGallery = () => {
    // Apply template defaults
    if (selectedTemplate.defaults.tagline) setTagline(selectedTemplate.defaults.tagline);
    if (selectedTemplate.defaults.description) setDescription(selectedTemplate.defaults.description);
    if (selectedTemplate.defaults.tags) setTags(selectedTemplate.defaults.tags);
    if (selectedTemplate.defaults.name) setName(selectedTemplate.defaults.name);
    setDirection("forward");
    setCurrentView(0);
  };

  const handleCreate = () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      handleClose();
      toast.success(`Virtual Contributor "${name}" created successfully`);
      navigate(`/vc/${slug}`);
    }, 1500);
  };

  const goForward = () => {
    if (currentView < steps.length - 1) {
      setDirection("forward");
      setCurrentView(currentView + 1);
    }
  };

  const goBack = () => {
    setDirection("back");
    if (currentView === 0) {
      setCurrentView(-1);
    } else {
      setCurrentView(currentView - 1);
    }
  };

  const goToStep = (step: number) => {
    setDirection(step > currentView ? "forward" : "back");
    setCurrentView(step);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleTestVC = () => {
    if (!testQuestion.trim()) return;
    setIsTesting(true);
    setTimeout(() => {
      setTestResponse(
        "Based on the knowledge I have access to, I can help with questions about collaboration methodologies, innovation frameworks, and best practices for community engagement."
      );
      setIsTesting(false);
    }, 1500);
  };

  // Filter templates
  const filteredTemplates = VC_TEMPLATES.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  });

  const groupedTemplates = CATEGORIES.map((cat) => ({
    ...cat,
    templates: filteredTemplates.filter((t) => t.category === cat.id),
  })).filter((group) => group.templates.length > 0);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden [&>*]:min-w-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 pr-12 border-b">
          <DialogTitle className="text-section-title">Create Virtual Contributor</DialogTitle>
          <DialogDescription className="text-body text-muted-foreground">
            {currentView === -1
              ? "Choose an archetype to get started, or build from scratch."
              : "Configure your new AI assistant step by step."}
          </DialogDescription>
          {currentView >= 0 && (
            <div className="flex items-center gap-1 mt-3">
              {steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => goToStep(i)}
                  className={cn(
                    "flex-1 h-1.5 rounded-full transition-all duration-300",
                    i === currentView
                      ? "bg-primary"
                      : i < currentView
                      ? "bg-primary/40"
                      : "bg-muted"
                  )}
                  aria-label={`Go to step ${i + 1}: ${step.label}`}
                />
              ))}
            </div>
          )}
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div
            className={cn(
              "transition-all duration-300 ease-in-out",
              direction === "forward" ? "animate-in slide-in-from-right-4 fade-in" : "animate-in slide-in-from-left-4 fade-in"
            )}
            key={currentView}
          >
            {currentView === -1 && (
              <VCTemplateGallery
                templates={groupedTemplates}
                selectedTemplate={selectedTemplate}
                onSelect={handleSelectTemplate}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}

            {currentView >= 0 && (
              <>
                {/* Step title bar */}
                <div className="px-6 py-3 bg-muted/30 border-b flex items-center gap-3">
                  {(() => {
                    const StepIcon = steps[currentView].icon;
                    return <StepIcon className="w-4 h-4 text-primary" />;
                  })()}
                  <div>
                    <p className="text-body-emphasis">{steps[currentView].label}</p>
                    <p className="text-caption text-muted-foreground">{steps[currentView].description}</p>
                  </div>
                  {selectedTemplate.id !== "blank" && (
                    <Badge variant="outline" className="ml-auto text-[10px] h-5 gap-1">
                      <selectedTemplate.icon className="w-3 h-3" />
                      {selectedTemplate.name}
                    </Badge>
                  )}
                </div>

                <div className="px-6 py-5 flex flex-col gap-5">
                  {currentView === 0 && (
                    <WizardStepKnowledgeSource
                      sourceType={sourceType} setSourceType={setSourceType}
                      selectedSpace={selectedSpace} setSelectedSpace={setSelectedSpace}
                      apiEndpoint={apiEndpoint} setApiEndpoint={setApiEndpoint}
                      apiKey={apiKey} setApiKey={setApiKey}
                    />
                  )}
                  {currentView === 1 && (
                    <WizardStepIdentity
                      name={name} setName={setName}
                      tagline={tagline} setTagline={setTagline}
                      description={description} setDescription={setDescription}
                      avatar={avatar} setAvatar={setAvatar}
                      tags={tags} setTags={setTags}
                      currentTag={currentTag} setCurrentTag={setCurrentTag}
                      handleTagKeyDown={handleTagKeyDown}
                    />
                  )}
                  {currentView === 2 && (
                    <WizardStepCapabilities
                      capAnswer={capAnswer} setCapAnswer={setCapAnswer}
                      capPosts={capPosts} setCapPosts={setCapPosts}
                      capSummarize={capSummarize} setCapSummarize={setCapSummarize}
                      testQuestion={testQuestion} setTestQuestion={setTestQuestion}
                      testResponse={testResponse}
                      isTesting={isTesting}
                      handleTestVC={handleTestVC}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t bg-muted/20">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              {currentView >= 0 && (
                <Button variant="ghost" size="sm" className="gap-1 px-2" onClick={goBack}>
                  <ChevronLeft className="w-4 h-4" />
                  {currentView === 0 ? "Templates" : "Back"}
                </Button>
              )}
              {currentView >= 0 && (
                <div className="flex items-center gap-2">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToStep(i)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        i === currentView
                          ? "bg-primary scale-125"
                          : i < currentView
                          ? "bg-primary/50"
                          : "bg-muted-foreground/25"
                      )}
                      aria-label={`Step ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={handleClose}>Cancel</Button>
              {currentView === -1 && (
                <Button onClick={handleContinueFromGallery}>
                  Continue →
                </Button>
              )}
              {currentView >= 0 && currentView < steps.length - 1 && (
                <Button onClick={goForward}>
                  Next →
                </Button>
              )}
              {currentView === steps.length - 1 && (
                <Button onClick={handleCreate} disabled={!isValid || isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    "Create VC"
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
   Template Gallery
   ═══════════════════════════════════════════════════════════════════════════════ */

function VCTemplateGallery({
  templates,
  selectedTemplate,
  onSelect,
  searchQuery,
  onSearchChange,
}: {
  templates: { id: string; label: string; templates: VCTemplate[] }[];
  selectedTemplate: VCTemplate;
  onSelect: (t: VCTemplate) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}) {
  return (
    <div className="px-6 py-5 flex flex-col gap-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search archetypes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {/* Template grid by category */}
      <div className="flex flex-col gap-6">
        {templates.map((group) => (
          <div key={group.id}>
            <h3 className="text-label uppercase text-muted-foreground tracking-wide mb-3">
              {group.label}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {group.templates.map((template) => (
                <VCTemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate.id === template.id}
                  onSelect={() => onSelect(template)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-body">No archetypes match your search.</p>
          <p className="text-caption mt-1">Try a different term or clear the search.</p>
        </div>
      )}
    </div>
  );
}

function VCTemplateCard({
  template,
  isSelected,
  onSelect,
}: {
  template: VCTemplate;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = template.icon;
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex flex-col items-start gap-2 p-4 rounded-lg border-2 text-left transition-all duration-200 cursor-pointer",
        isSelected
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : "border-border bg-background hover:border-primary/50 hover:bg-accent/50"
      )}
    >
      <div className={cn(
        "w-9 h-9 rounded-full flex items-center justify-center",
        isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
      )}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-body-emphasis leading-tight">{template.name}</span>
        <span className="text-caption text-muted-foreground line-clamp-2">{template.description}</span>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Wizard Step 1: Knowledge Source
   ═══════════════════════════════════════════════════════════════════════════════ */

function WizardStepKnowledgeSource({
  sourceType, setSourceType,
  selectedSpace, setSelectedSpace,
  apiEndpoint, setApiEndpoint,
  apiKey, setApiKey,
}: {
  sourceType: string; setSourceType: (v: string) => void;
  selectedSpace: string; setSelectedSpace: (v: string) => void;
  apiEndpoint: string; setApiEndpoint: (v: string) => void;
  apiKey: string; setApiKey: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-4 h-4 text-primary" />
          <Label className="text-body-emphasis">How will your VC learn?</Label>
        </div>
        <p className="text-caption text-muted-foreground">
          Choose the knowledge source that powers your Virtual Contributor
        </p>
      </section>

      <RadioGroup value={sourceType} onValueChange={setSourceType} className="flex flex-col gap-3">
        <label
          className={cn(
            "flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200",
            sourceType === "knowledge" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/30"
          )}
        >
          <RadioGroupItem value="knowledge" className="mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-body-emphasis">Written Knowledge</span>
            <span className="text-caption text-muted-foreground">
              Write knowledge posts and upload documents. Best for curated, specific expertise.
            </span>
          </div>
        </label>

        <label
          className={cn(
            "flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200",
            sourceType === "space" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/30"
          )}
        >
          <RadioGroupItem value="space" className="mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-body-emphasis">Space Knowledge</span>
            <span className="text-caption text-muted-foreground">
              Learn from an existing space's content. Best for contextual community assistance.
            </span>
          </div>
        </label>

        <label
          className={cn(
            "flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200",
            sourceType === "external" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/30"
          )}
        >
          <RadioGroupItem value="external" className="mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-body-emphasis">External AI Provider</span>
            <span className="text-caption text-muted-foreground">
              Connect your own AI model via API. Best for custom or enterprise setups.
            </span>
          </div>
        </label>
      </RadioGroup>

      {sourceType === "knowledge" && (
        <div className="pl-8 border-l-2 border-primary/20">
          <p className="text-caption text-muted-foreground">
            You'll be able to add knowledge posts and documents after creation.
          </p>
        </div>
      )}

      {sourceType === "space" && (
        <div className="flex flex-col gap-3 pl-8 border-l-2 border-primary/20">
          <Label className="text-body-emphasis">Select a space</Label>
          <Select value={selectedSpace} onValueChange={setSelectedSpace}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a hosted space..." />
            </SelectTrigger>
            <SelectContent>
              {HOSTED_SPACES.map((space) => (
                <SelectItem key={space.id} value={space.id}>
                  {space.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {sourceType === "external" && (
        <div className="flex flex-col gap-3 pl-8 border-l-2 border-primary/20">
          <div className="flex flex-col gap-1.5">
            <Label className="text-body-emphasis">API Endpoint</Label>
            <Input
              placeholder="https://api.example.com/v1/chat"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-body-emphasis">API Key</Label>
            <Input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Wizard Step 2: Identity
   ═══════════════════════════════════════════════════════════════════════════════ */

function WizardStepIdentity({
  name, setName,
  tagline, setTagline,
  description, setDescription,
  avatar, setAvatar,
  tags, setTags,
  currentTag, setCurrentTag,
  handleTagKeyDown,
}: {
  name: string; setName: (v: string) => void;
  tagline: string; setTagline: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  avatar: string | null; setAvatar: (v: string | null) => void;
  tags: string[]; setTags: (v: string[]) => void;
  currentTag: string; setCurrentTag: (v: string) => void;
  handleTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Name */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Fingerprint className="w-4 h-4 text-primary" />
          <Label className="text-body-emphasis">
            Name <span className="text-destructive">*</span>
          </Label>
        </div>
        <Input
          placeholder="e.g. Research Assistant"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          className="h-11 text-base"
        />
        <p className="text-caption text-muted-foreground">Give your VC a memorable name</p>
      </section>

      <Separator />

      {/* Tagline */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <Label className="text-body-emphasis">Tagline</Label>
        </div>
        <Input
          placeholder="Helps teams find relevant research papers"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
        />
        <p className="text-caption text-muted-foreground">A short description shown on VC cards</p>
      </section>

      <Separator />

      {/* Description */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          <Label className="text-body-emphasis">Description</Label>
        </div>
        <MarkdownEditor
          value={description}
          onChange={setDescription}
          placeholder="Describe what this VC can help with..."
          minHeight="100px"
        />
      </section>

      <Separator />

      {/* Avatar & Tags */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
            <Label className="text-body-emphasis">Avatar</Label>
          </div>
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 min-h-[120px] cursor-pointer transition-all duration-200",
              avatar
                ? "border-primary/30 bg-primary/5"
                : "border-muted-foreground/20 hover:border-primary/40 hover:bg-primary/5"
            )}
            onClick={() => setAvatar(avatar ? null : "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=200&fit=crop")}
          >
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span className="text-caption">Upload avatar</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
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
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Wizard Step 3: Capabilities & Test
   ═══════════════════════════════════════════════════════════════════════════════ */

function WizardStepCapabilities({
  capAnswer, setCapAnswer,
  capPosts, setCapPosts,
  capSummarize, setCapSummarize,
  testQuestion, setTestQuestion,
  testResponse,
  isTesting,
  handleTestVC,
}: {
  capAnswer: boolean; setCapAnswer: (v: boolean) => void;
  capPosts: boolean; setCapPosts: (v: boolean) => void;
  capSummarize: boolean; setCapSummarize: (v: boolean) => void;
  testQuestion: string; setTestQuestion: (v: string) => void;
  testResponse: string;
  isTesting: boolean;
  handleTestVC: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Capabilities */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <Label className="text-body-emphasis">Capabilities</Label>
        </div>
        <p className="text-caption text-muted-foreground">
          Control what your Virtual Contributor can do
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="v3-cap-answer"
              checked={capAnswer}
              onCheckedChange={(checked) => setCapAnswer(checked === true)}
            />
            <Label htmlFor="v3-cap-answer" className="text-body cursor-pointer">
              Answer questions from community members
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="v3-cap-posts"
              checked={capPosts}
              onCheckedChange={(checked) => setCapPosts(checked === true)}
            />
            <Label htmlFor="v3-cap-posts" className="text-body cursor-pointer">
              Create posts and contributions
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="v3-cap-summarize"
              checked={capSummarize}
              onCheckedChange={(checked) => setCapSummarize(checked === true)}
            />
            <Label htmlFor="v3-cap-summarize" className="text-body cursor-pointer">
              Summarize discussions and content
            </Label>
          </div>
        </div>
      </section>

      <Separator />

      {/* Test */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-muted-foreground" />
          <Label className="text-body-emphasis">Test Your VC</Label>
        </div>
        <p className="text-caption text-muted-foreground">
          Ask a sample question to see how your VC responds
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question..."
            value={testQuestion}
            onChange={(e) => setTestQuestion(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleTestVC();
              }
            }}
          />
          <Button variant="outline" onClick={handleTestVC} disabled={!testQuestion.trim() || isTesting}>
            {isTesting ? "Testing..." : "Ask"}
          </Button>
        </div>
        {testResponse && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-caption text-muted-foreground mb-1">Response preview:</p>
            <p className="text-body">{testResponse}</p>
          </div>
        )}
      </section>
    </div>
  );
}


