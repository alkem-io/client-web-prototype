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
import { Separator } from "@/app/components/ui/separator";
import { MarkdownEditor } from "@/app/components/ui/markdown-editor";
import {
  X, ImageIcon, ChevronLeft, ChevronDown, ChevronRight, Sparkles, Palette, Users, Globe, Lock,
  UserPlus, BookOpen, Search, FileText, Lightbulb, Rocket, GraduationCap,
  Calendar, UsersRound, Target, Layers, FlaskConical, Puzzle, Presentation,
  Link2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/app/components/ui/utils";

/* ═══════════════════════════════════════════════════════════════════════════════
   Template Data
   ═══════════════════════════════════════════════════════════════════════════════ */

interface SpaceTemplate {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: string;
  recommended?: boolean;
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
  description: string;
  icon: LucideIcon;
  order: number;
}

const CATEGORIES: TemplateCategory[] = [
  { id: "getting-started", label: "Getting Started", description: "Simple templates to begin with", icon: Sparkles, order: 0 },
  { id: "community", label: "Community & Collaboration", description: "Bring people together around shared interests", icon: UsersRound, order: 1 },
  { id: "innovation", label: "Innovation & Research", description: "Explore ideas and develop solutions", icon: Lightbulb, order: 2 },
  { id: "projects", label: "Projects & Programs", description: "Organize work and track progress", icon: Layers, order: 3 },
  { id: "learning", label: "Learning & Education", description: "Structured learning experiences", icon: GraduationCap, order: 4 },
  { id: "events", label: "Events & Campaigns", description: "Time-bound activities and gatherings", icon: Calendar, order: 5 },
];

const SPACE_TEMPLATES: SpaceTemplate[] = [
  {
    id: "blank",
    name: "Blank Space",
    description: "Start from scratch with a clean slate. Configure everything yourself.",
    icon: FileText,
    category: "getting-started",
    recommended: true,
    defaults: {},
  },
  {
    id: "community-of-practice",
    name: "Community of Practice",
    description: "A space for practitioners to share knowledge, discuss challenges, and grow together.",
    icon: UsersRound,
    category: "community",
    recommended: true,
    defaults: {
      tagline: "A community for practitioners to learn and grow together",
      description: "This space brings together practitioners who share a common domain of interest. Members share experiences, develop shared resources, and support each other's professional growth.",
      tags: ["Community", "Knowledge Sharing", "Best Practices"],
    },
  },
  {
    id: "working-group",
    name: "Working Group",
    description: "Coordinate a focused team working toward a specific deliverable or outcome.",
    icon: Target,
    category: "community",
    defaults: {
      tagline: "Focused collaboration toward shared outcomes",
      description: "A structured space for team members to coordinate efforts, track progress, and deliver results together.",
      tags: ["Collaboration", "Coordination", "Deliverables"],
    },
  },
  {
    id: "stakeholder-network",
    name: "Stakeholder Network",
    description: "Connect diverse stakeholders around a shared challenge or opportunity.",
    icon: Users,
    category: "community",
    defaults: {
      tagline: "Connecting stakeholders around shared challenges",
      description: "Bring together organizations, individuals, and communities to align on shared challenges and co-create solutions.",
      tags: ["Stakeholders", "Network", "Multi-actor"],
    },
  },
  {
    id: "peer-learning",
    name: "Peer Learning Circle",
    description: "Small-group learning through structured peer exchange and reflection.",
    icon: UsersRound,
    category: "community",
    defaults: {
      tagline: "Learning together through structured peer exchange",
      description: "A small-group format where peers take turns sharing insights, asking questions, and reflecting on each other's experiences.",
      tags: ["Peer Learning", "Reflection", "Small Group"],
    },
  },
  {
    id: "innovation-challenge",
    name: "Innovation Challenge",
    description: "Run a structured challenge to source and develop innovative solutions.",
    icon: Rocket,
    category: "innovation",
    recommended: true,
    defaults: {
      tagline: "Sourcing innovative solutions through open challenge",
      description: "Define a challenge, invite participants to submit ideas, collaborate on promising solutions, and select winners.",
      tags: ["Innovation", "Challenge", "Ideas", "Solutions"],
    },
  },
  {
    id: "research-hub",
    name: "Research Hub",
    description: "Collaborate on research topics, share findings, and build shared knowledge.",
    icon: FlaskConical,
    category: "innovation",
    defaults: {
      tagline: "Collaborative research and shared discovery",
      description: "A dedicated space for researchers to collaborate, share papers, discuss findings, and build collective understanding.",
      tags: ["Research", "Knowledge", "Academic", "Discovery"],
    },
  },
  {
    id: "idea-incubator",
    name: "Idea Incubator",
    description: "Nurture early-stage ideas from concept to viable proposal.",
    icon: Lightbulb,
    category: "innovation",
    defaults: {
      tagline: "From spark to viable proposal",
      description: "Submit early-stage ideas, get feedback from the community, refine concepts, and develop them into actionable proposals.",
      tags: ["Ideas", "Incubation", "Early Stage", "Feedback"],
    },
  },
  {
    id: "design-sprint",
    name: "Design Sprint",
    description: "Time-boxed collaborative design process to solve problems quickly.",
    icon: Puzzle,
    category: "innovation",
    defaults: {
      tagline: "Solve big problems in a structured sprint",
      description: "Follow a structured design sprint methodology to understand, ideate, prototype, and test solutions within a fixed timeframe.",
      tags: ["Design Sprint", "Prototyping", "Time-boxed"],
    },
  },
  {
    id: "project-space",
    name: "Project Space",
    description: "Manage a project with clear goals, milestones, and team coordination.",
    icon: Layers,
    category: "projects",
    recommended: true,
    defaults: {
      tagline: "Structured project collaboration and delivery",
      description: "Organize your project with clear goals, assign tasks, track milestones, and keep your team aligned.",
      tags: ["Project", "Management", "Milestones", "Delivery"],
    },
  },
  {
    id: "program-coordination",
    name: "Program Coordination",
    description: "Oversee multiple related projects or workstreams under one umbrella.",
    icon: Presentation,
    category: "projects",
    defaults: {
      tagline: "Coordinating multiple workstreams toward program goals",
      description: "A high-level space to coordinate related projects, track cross-cutting themes, and maintain strategic alignment.",
      tags: ["Program", "Coordination", "Strategy", "Oversight"],
    },
  },
  {
    id: "course-space",
    name: "Course Space",
    description: "Deliver structured learning with modules, discussions, and assignments.",
    icon: GraduationCap,
    category: "learning",
    defaults: {
      tagline: "Structured learning with interactive modules",
      description: "Organize course content into modules, facilitate discussions, provide assignments, and track learner progress.",
      tags: ["Course", "Learning", "Education", "Modules"],
    },
  },
  {
    id: "workshop-series",
    name: "Workshop Series",
    description: "Run a series of interactive workshops with shared materials and follow-ups.",
    icon: Sparkles,
    category: "learning",
    defaults: {
      tagline: "Interactive workshop series with shared learning",
      description: "Plan and deliver a series of workshops. Share materials beforehand, collaborate during sessions, and capture outcomes.",
      tags: ["Workshops", "Interactive", "Series", "Hands-on"],
    },
  },
  {
    id: "knowledge-base",
    name: "Knowledge Base",
    description: "Build a living repository of curated knowledge and reference materials.",
    icon: BookOpen,
    category: "learning",
    defaults: {
      tagline: "Curated knowledge for your community",
      description: "Create a structured repository of guides, how-tos, reference materials, and best practices that evolves over time.",
      tags: ["Knowledge Base", "Documentation", "Reference", "Guides"],
    },
  },
  {
    id: "event-space",
    name: "Event Space",
    description: "Organize and run events with agendas, speakers, and attendee engagement.",
    icon: Calendar,
    category: "events",
    defaults: {
      tagline: "Bringing people together around shared events",
      description: "Plan events with agendas, manage speakers, engage attendees before and after, and capture outcomes.",
      tags: ["Events", "Conference", "Meetup", "Networking"],
    },
  },
  {
    id: "hackathon",
    name: "Hackathon",
    description: "Organize a time-boxed creative sprint with teams, challenges, and judging.",
    icon: Rocket,
    category: "events",
    defaults: {
      tagline: "Build something amazing in limited time",
      description: "Set up challenges, form teams, provide resources, and run a judging process to select winners.",
      tags: ["Hackathon", "Sprint", "Teams", "Competition"],
    },
  },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   Main Dialog Component
   ═══════════════════════════════════════════════════════════════════════════════ */

interface CreateSpaceDialogV3Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSpaceDialogV3({
  open,
  onOpenChange,
}: CreateSpaceDialogV3Props) {
  const navigate = useNavigate();
  // -1 = template gallery, 0-3 = wizard steps
  const [currentView, setCurrentView] = useState<number>(-1);
  const [selectedTemplate, setSelectedTemplate] = useState<SpaceTemplate>(SPACE_TEMPLATES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  // Step 1: Identity
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");

  // Branding & other config moved to post-creation welcome dialog
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  // Purpose & Context (post-creation)
  const [why, setWhy] = useState("");
  const [who, setWho] = useState("");

  // Access & Members (post-creation)
  const [visibility, setVisibility] = useState("public");
  const [membershipMode, setMembershipMode] = useState("open");
  const [invitees, setInvitees] = useState<string[]>([]);
  const [currentInvitee, setCurrentInvitee] = useState("");

  const isValid = name.trim().length > 0;

  const generateUrl = (spaceName: string) => {
    return spaceName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-generate URL from name if user hasn't manually edited it
    if (!url || url === generateUrl(name)) {
      setUrl(generateUrl(value));
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after close animation
    setTimeout(() => {
      setCurrentView(-1);
      setSelectedTemplate(SPACE_TEMPLATES[0]);
      setSearchQuery("");
      setName("");
      setUrl("");
      setTagline("");
      setDescription("");
      setTags([]);
      setCurrentTag("");
      setAvatar(null);
      setBanner(null);
      setWhy("");
      setWho("");
      setVisibility("public");
      setMembershipMode("open");
      setInvitees([]);
      setCurrentInvitee("");
    }, 200);
  };

  const handleSelectTemplate = (template: SpaceTemplate) => {
    setSelectedTemplate(template);
  };

  const handleContinueFromGallery = () => {
    // Apply template defaults
    if (selectedTemplate.defaults.tagline) setTagline(selectedTemplate.defaults.tagline);
    if (selectedTemplate.defaults.description) setDescription(selectedTemplate.defaults.description);
    if (selectedTemplate.defaults.tags) setTags(selectedTemplate.defaults.tags);
    setDirection("forward");
    setCurrentView(0);
  };

  const handleCreate = () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const slug = url || generateUrl(name);
      handleClose();
      toast.success(`Space "${name}" created successfully`);
      navigate(`/space/${slug}?welcome=true`);
    }, 1500);
  };

  const goBack = () => {
    setDirection("back");
    setCurrentView(-1);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleInviteeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentInvitee.trim()) {
      e.preventDefault();
      if (!invitees.includes(currentInvitee.trim())) setInvitees([...invitees, currentInvitee.trim()]);
      setCurrentInvitee("");
    }
  };

  // Filter templates by search
  const filteredTemplates = SPACE_TEMPLATES.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  });

  const recommendedTemplates = filteredTemplates.filter((t) => t.recommended);

  const groupedTemplates = CATEGORIES.map((cat) => ({
    ...cat,
    templates: filteredTemplates.filter((t) => t.category === cat.id && !t.recommended),
  })).filter((group) => group.templates.length > 0);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden [&>*]:min-w-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 pr-12 border-b">
          <DialogTitle className="text-section-title">Create new Space</DialogTitle>
          <DialogDescription className="text-body text-muted-foreground">
            {currentView === -1
              ? "Choose a template to get started, or begin with a blank space."
              : "Give your space a name to get started."}
          </DialogDescription>
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
              <TemplateGallery
                recommendedTemplates={recommendedTemplates}
                categoryGroups={groupedTemplates}
                selectedTemplate={selectedTemplate}
                onSelect={handleSelectTemplate}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}

            {currentView >= 0 && (
              <>
                <div className="px-6 py-5 flex flex-col gap-5">
                  {currentView === 0 && (
                    <WizardStepIdentity
                      name={name} setName={handleNameChange}
                      url={url} setUrl={setUrl}
                      tagline={tagline} setTagline={setTagline}
                      description={description} setDescription={setDescription}
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
                  Templates
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={handleClose}>Cancel</Button>
              {currentView === -1 && (
                <Button onClick={handleContinueFromGallery}>
                  Continue →
                </Button>
              )}
              {currentView === 0 && (
                <Button onClick={handleCreate} disabled={!isValid || isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    "Create Space"
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
   Template Gallery — Recommended + Collapsible Categories
   ═══════════════════════════════════════════════════════════════════════════════ */

function TemplateGallery({
  recommendedTemplates,
  categoryGroups,
  selectedTemplate,
  onSelect,
  searchQuery,
  onSearchChange,
}: {
  recommendedTemplates: SpaceTemplate[];
  categoryGroups: { id: string; label: string; description: string; icon: LucideIcon; templates: SpaceTemplate[] }[];
  selectedTemplate: SpaceTemplate;
  onSelect: (t: SpaceTemplate) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="px-6 py-5 flex flex-col gap-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {/* Recommended section */}
      {!isSearching && recommendedTemplates.length > 0 && (
        <div>
          <h3 className="text-label uppercase text-muted-foreground tracking-wide mb-3">
            Recommended
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recommendedTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate.id === template.id}
                onSelect={() => onSelect(template)}
                isProminent={template.id === "blank"}
              />
            ))}
          </div>
        </div>
      )}

      {/* Category sections — collapsible */}
      {!isSearching && categoryGroups.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-label uppercase text-muted-foreground tracking-wide mb-1">
            Browse by category
          </h3>
          {categoryGroups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.id} className="border rounded-xl overflow-hidden bg-card">
                <button
                  onClick={() => toggleCategory(group.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-accent/50 transition-colors"
                >
                  <div className="p-2 bg-muted rounded-lg">
                    <GroupIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <span className="text-body-emphasis">{group.label}</span>
                    <p className="text-caption text-muted-foreground">{group.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-caption font-normal">{group.templates.length}</Badge>
                    {expandedCategories.has(group.id) ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
                {expandedCategories.has(group.id) && (
                  <div className="px-4 pb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 border-t bg-muted/10">
                    <div className="col-span-full pt-3" />
                    {group.templates.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        isSelected={selectedTemplate.id === template.id}
                        onSelect={() => onSelect(template)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Search results — flat grid */}
      {isSearching && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...recommendedTemplates, ...categoryGroups.flatMap((g) => g.templates)].map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate.id === template.id}
              onSelect={() => onSelect(template)}
            />
          ))}
        </div>
      )}

      {isSearching && recommendedTemplates.length === 0 && categoryGroups.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-body">No templates match your search.</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Template Card
   ═══════════════════════════════════════════════════════════════════════════════ */

function TemplateCard({
  template,
  isSelected,
  onSelect,
  isProminent,
}: {
  template: SpaceTemplate;
  isSelected: boolean;
  onSelect: () => void;
  isProminent?: boolean;
}) {
  const Icon = template.icon;
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex flex-col items-start gap-2 p-4 rounded-lg border-2 text-left transition-all duration-200 cursor-pointer",
        isSelected
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : isProminent
          ? "border-primary/30 bg-primary/[0.02] hover:border-primary/60 hover:bg-primary/5"
          : "border-border bg-background hover:border-primary/50 hover:bg-accent/50"
      )}
    >
      <div className={cn(
        "w-9 h-9 rounded-md flex items-center justify-center",
        isSelected ? "bg-primary/10 text-primary" : isProminent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
      )}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className={cn("text-body-emphasis leading-tight", isProminent && !isSelected && "text-primary")}>{template.name}</span>
        <span className="text-caption text-muted-foreground line-clamp-2">{template.description}</span>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Wizard Step 1: Identity
   ═══════════════════════════════════════════════════════════════════════════════ */

function WizardStepIdentity({
  name, setName,
  url, setUrl,
  tagline, setTagline,
  description, setDescription,
}: {
  name: string; setName: (v: string) => void;
  url: string; setUrl: (v: string) => void;
  tagline: string; setTagline: (v: string) => void;
  description: string; setDescription: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Hero section */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">What should we call your space?</h3>
          <p className="text-caption text-muted-foreground mt-1">You can change all of this later in settings.</p>
        </div>
      </div>

      {/* Name — hero field */}
      <div className="flex flex-col gap-1.5">
        <Input
          placeholder="e.g. Climate Action Hub"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          className="h-12 text-lg border-2 focus:border-primary"
        />
        {name.trim() && (
          <p className="text-caption text-emerald-600 flex items-center gap-1 animate-in fade-in slide-in-from-left-1 duration-200">
            ✓ Great name!
          </p>
        )}
      </div>

      {/* URL */}
      <div className="flex items-center gap-2 text-caption text-muted-foreground">
        <Link2 className="w-3.5 h-3.5 shrink-0" />
        <span className="shrink-0">alkemio.io/</span>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
          placeholder="your-space-url"
          className="h-8 text-caption flex-1 max-w-[240px]"
        />
      </div>

      {/* Tagline — card section */}
      <div className="rounded-xl border bg-muted/30 p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-background border rounded-lg">
            <FileText className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-body-emphasis">Tagline</p>
        </div>
        <Input
          placeholder="A short one-line summary (optional)"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className="bg-background"
        />
      </div>

      {/* Description — card section */}
      <div className="rounded-xl border bg-muted/30 p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-background border rounded-lg">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-body-emphasis">Description</p>
        </div>
        <MarkdownEditor
          value={description}
          onChange={setDescription}
          placeholder="What is this space about? (optional)"
          minHeight="100px"
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Wizard Step 2: Branding & Discovery
   ═══════════════════════════════════════════════════════════════════════════════ */

function WizardStepBranding({
  tags, setTags,
  currentTag, setCurrentTag,
  handleTagKeyDown,
  avatar, setAvatar,
  banner, setBanner,
}: {
  tags: string[]; setTags: (v: string[]) => void;
  currentTag: string; setCurrentTag: (v: string) => void;
  handleTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  avatar: string | null; setAvatar: (v: string | null) => void;
  banner: string | null; setBanner: (v: string | null) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero section */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center shrink-0">
          <Palette className="w-6 h-6 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Make it visually yours</h3>
          <p className="text-caption text-muted-foreground mt-1">
            You can change all of this later in settings.
          </p>
        </div>
      </div>

      {/* Visual Identity — large, visual cards */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
        {/* Avatar */}
        <div className="flex flex-col gap-2">
          <div
            className={cn(
              "relative rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-3 min-h-[180px] cursor-pointer transition-all duration-200 group",
              avatar
                ? "border-primary/30 bg-primary/5"
                : "border-muted-foreground/20 hover:border-primary/40 hover:bg-accent/50"
            )}
            onClick={() => setAvatar(avatar ? null : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop")}
          >
            {avatar ? (
              <>
                <img src={avatar} alt="Avatar" className="w-20 h-20 rounded-xl object-cover ring-2 ring-primary/20" />
                <p className="text-caption text-primary font-medium">Click to change</p>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-body-emphasis">Space Avatar</p>
                  <p className="text-caption">Square image, shown as your space icon</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center">Recommended: 200 × 200px</p>
        </div>

        {/* Banner */}
        <div className="flex flex-col gap-2">
          <div
            className={cn(
              "relative rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-3 min-h-[180px] cursor-pointer transition-all duration-200 group",
              banner
                ? "border-primary/30 bg-primary/5"
                : "border-muted-foreground/20 hover:border-primary/40 hover:bg-accent/50"
            )}
            onClick={() => setBanner(banner ? null : "https://images.unsplash.com/photo-1548728560-b6adb671a69f?w=400&h=200&fit=crop")}
          >
            {banner ? (
              <>
                <img src={banner} alt="Banner" className="max-h-20 rounded-lg object-cover ring-1 ring-primary/20" />
                <p className="text-caption text-primary font-medium">Click to change</p>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-body-emphasis">Card Banner</p>
                  <p className="text-caption">Wide image shown on space cards</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center">Recommended: 1920 × 400px</p>
        </div>
      </div>

      {/* Tags — visual card section */}
      <div className="rounded-xl border bg-muted/30 p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-background border flex items-center justify-center">
            <Search className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-body-emphasis">Help people find you</p>
            <p className="text-caption text-muted-foreground">Add tags so your space appears in relevant searches</p>
          </div>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1 py-1.5 px-3">
                {tag}
                <button onClick={() => setTags(tags.filter((t) => t !== tag))} className="hover:text-destructive ml-1">
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
          placeholder="Type a tag and press Enter (e.g. Innovation, Sustainability)"
          className="bg-background"
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Wizard Step 3: Purpose
   ═══════════════════════════════════════════════════════════════════════════════ */

function WizardStepPurpose({
  why, setWhy,
  who, setWho,
}: {
  why: string; setWhy: (v: string) => void;
  who: string; setWho: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero section */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center shrink-0">
          <Target className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">What's the purpose of this space?</h3>
          <p className="text-body text-muted-foreground mt-1">
            Help people understand why this space exists and whether it's right for them.
          </p>
        </div>
      </div>

      {/* Why — visual card */}
      <div className="rounded-xl border bg-muted/30 p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-background border flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-body-emphasis">Why does this space exist?</p>
            <p className="text-caption text-muted-foreground">The motivation and mission behind this space</p>
          </div>
        </div>
        <MarkdownEditor
          value={why}
          onChange={setWhy}
          placeholder="e.g. We believe collaboration is key to solving climate challenges..."
          minHeight="100px"
        />
      </div>

      {/* Who — visual card */}
      <div className="rounded-xl border bg-muted/30 p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-background border flex items-center justify-center">
            <UsersRound className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="text-body-emphasis">Who is this for?</p>
            <p className="text-caption text-muted-foreground">Describe the ideal members or participants</p>
          </div>
        </div>
        <MarkdownEditor
          value={who}
          onChange={setWho}
          placeholder="e.g. Engineers, designers, and researchers passionate about sustainability..."
          minHeight="100px"
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Wizard Step 4: Access & Members
   ═══════════════════════════════════════════════════════════════════════════════ */

function WizardStepAccess({
  visibility, setVisibility,
  membershipMode, setMembershipMode,
  invitees, setInvitees,
  currentInvitee, setCurrentInvitee,
  handleInviteeKeyDown,
}: {
  visibility: string; setVisibility: (v: string) => void;
  membershipMode: string; setMembershipMode: (v: string) => void;
  invitees: string[]; setInvitees: (v: string[]) => void;
  currentInvitee: string; setCurrentInvitee: (v: string) => void;
  handleInviteeKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero section */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
          <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Who can see and join?</h3>
          <p className="text-body text-muted-foreground mt-1">
            Control who can discover your space and how they become members. You can always change this later.
          </p>
        </div>
      </div>

      {/* Visibility — large visual cards */}
      <div>
        <p className="text-body-emphasis mb-3">Visibility</p>
        <RadioGroup value={visibility} onValueChange={setVisibility} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label
            className={cn(
              "flex flex-col items-center gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center",
              visibility === "public"
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-muted hover:border-muted-foreground/30 hover:bg-accent/50"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              visibility === "public" ? "bg-primary/10" : "bg-muted"
            )}>
              <Globe className={cn("w-6 h-6", visibility === "public" ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div>
              <p className="text-body-emphasis">Public</p>
              <p className="text-caption text-muted-foreground">Anyone can discover and view this space</p>
            </div>
            <RadioGroupItem value="public" className="sr-only" />
          </label>
          <label
            className={cn(
              "flex flex-col items-center gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center",
              visibility === "private"
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-muted hover:border-muted-foreground/30 hover:bg-accent/50"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              visibility === "private" ? "bg-primary/10" : "bg-muted"
            )}>
              <Lock className={cn("w-6 h-6", visibility === "private" ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div>
              <p className="text-body-emphasis">Private</p>
              <p className="text-caption text-muted-foreground">Only members can see this space</p>
            </div>
            <RadioGroupItem value="private" className="sr-only" />
          </label>
        </RadioGroup>
      </div>

      {/* Membership Mode — friendly list */}
      <div className="rounded-xl border bg-muted/30 p-5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-background border flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-body-emphasis">How can people join?</p>
            <p className="text-caption text-muted-foreground">Choose how new members get access</p>
          </div>
        </div>
        <RadioGroup value={membershipMode} onValueChange={setMembershipMode} className="flex flex-col gap-2">
          <label
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border bg-background cursor-pointer transition-all duration-200",
              membershipMode === "open"
                ? "border-primary bg-primary/5"
                : "hover:border-muted-foreground/30"
            )}
          >
            <RadioGroupItem value="open" />
            <div>
              <span className="text-body-emphasis">Open</span>
              <span className="text-caption text-muted-foreground ml-2">— anyone can join instantly</span>
            </div>
          </label>
          <label
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border bg-background cursor-pointer transition-all duration-200",
              membershipMode === "application"
                ? "border-primary bg-primary/5"
                : "hover:border-muted-foreground/30"
            )}
          >
            <RadioGroupItem value="application" />
            <div>
              <span className="text-body-emphasis">By application</span>
              <span className="text-caption text-muted-foreground ml-2">— you approve each request</span>
            </div>
          </label>
          <label
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border bg-background cursor-pointer transition-all duration-200",
              membershipMode === "invite"
                ? "border-primary bg-primary/5"
                : "hover:border-muted-foreground/30"
            )}
          >
            <RadioGroupItem value="invite" />
            <div>
              <span className="text-body-emphasis">Invite only</span>
              <span className="text-caption text-muted-foreground ml-2">— people need a personal invitation</span>
            </div>
          </label>
        </RadioGroup>
      </div>

      {/* Invite Members — friendly section */}
      <div className="rounded-xl border bg-muted/30 p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-background border flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <p className="text-body-emphasis">Invite people now</p>
            <p className="text-caption text-muted-foreground">Add email addresses to send invitations right away (optional)</p>
          </div>
        </div>
        {invitees.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {invitees.map((invitee) => (
              <Badge key={invitee} variant="secondary" className="flex items-center gap-1 py-1.5 px-3">
                {invitee}
                <button onClick={() => setInvitees(invitees.filter((i) => i !== invitee))} className="hover:text-destructive ml-1">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <Input
          value={currentInvitee}
          onChange={(e) => setCurrentInvitee(e.target.value)}
          onKeyDown={handleInviteeKeyDown}
          placeholder="email@example.com (press Enter to add)"
          className="bg-background"
        />
      </div>
    </div>
  );
}
