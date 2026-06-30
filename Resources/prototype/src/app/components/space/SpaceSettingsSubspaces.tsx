import { useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  LayoutTemplate,
  Users,
  Pin,
  PinOff,
  Save,
  Trash2,
  Check,
  LayoutGrid,
  List as ListIcon,
  ArrowDownAZ,
  FileText,
  MessageSquare
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { IconButton } from "@/app/components/ui/icon-button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/app/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Separator } from "@/app/components/ui/separator";
import { cn } from "@/lib/utils";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { SettingsSection } from "@/app/components/shared/SettingsSection";
import { SubspaceFormBuilderDialog } from "@/app/components/dialogs/SubspaceFormBuilderDialog";
import { SubspaceApplicationsPanel } from "@/app/components/space/SubspaceApplicationsPanel";
import type { ApplicationFormConfig, SubspaceApplication, FormField } from "@/app/components/dialogs/SubspaceApplicationDialog";

// --- Mock Data ---

interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
}

const TEMPLATES: Template[] = [
  {
    id: 'standard',
    name: 'Standard Project',
    description: 'A balanced setup for general project management with tasks, docs, and chat.',
    image: 'https://images.unsplash.com/photo-1761370981247-1dfd749ec96b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9qZWN0JTIwZm9jdXMlMjBjb2xsYWJvcmF0aW9ufGVufDF8fHx8MTc2OTQ0MTk1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    features: ['Task Board', 'Wiki', 'Discussion']
  },
  {
    id: 'sprint',
    name: 'Sprint Planning',
    description: 'Optimized for agile teams with backlog management and retro tools.',
    image: 'https://images.unsplash.com/photo-1647887071649-5dbb0887dce6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwc3ByaW50JTIwcGxhbm5pbmclMjB3aGl0ZWJvYXJkfGVufDF8fHx8MTc2OTQ0MTk1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    features: ['Kanban', 'Backlog', 'Retrospective']
  },
  {
    id: 'brainstorm',
    name: 'Brainstorming Space',
    description: 'Free-form canvas and whiteboard focus for creative sessions.',
    image: 'https://images.unsplash.com/photo-1595411425732-e69c1abe2763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRlc2lnbiUyMHBhdHRlcm4lMjBnZW9tZXRyaWN8ZW58MXx8fHwxNzY5NDQxOTUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    features: ['Whiteboard', 'Mind Map', 'Chat']
  }
];

interface Subspace {
  id: string;
  name: string;
  description: string;
  image: string;
  memberCount: number;
  status: 'Active' | 'Archived';
  lastActive: string;
  templateId: string;
}

const MOCK_SUBSPACES: Subspace[] = [
  {
    id: '1',
    name: 'Q4 Marketing Campaign',
    description: 'Planning and execution for the end-of-year marketing push.',
    image: 'https://images.unsplash.com/photo-1748346918817-0b1b6b2f9bab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2UlMjB0ZWFtfGVufDF8fHx8MTc2OTQwOTA3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    memberCount: 12,
    status: 'Active',
    lastActive: '2 hours ago',
    templateId: 'standard'
  },
  {
    id: '2',
    name: 'Product Roadmap 2024',
    description: 'Strategic planning for upcoming product features and releases.',
    image: 'https://images.unsplash.com/photo-1760629863094-5b1e8d1aae74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwaW5ub3ZhdGlvbiUyMGZ1dHVyZXxlbnwxfHx8fDE3Njk0Mzg1MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    memberCount: 8,
    status: 'Active',
    lastActive: '1 day ago',
    templateId: 'sprint'
  },
  {
    id: '3',
    name: 'Design System Review',
    description: 'Weekly syncs to update and maintain the design system components.',
    image: 'https://images.unsplash.com/photo-1595411425732-e69c1abe2763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRlc2lnbiUyMHBhdHRlcm4lMjBnZW9tZXRyaWN8ZW58MXx8fHwxNzY5NDQxOTUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    memberCount: 5,
    status: 'Active',
    lastActive: '3 days ago',
    templateId: 'brainstorm'
  },
  {
    id: '4',
    name: 'Legacy Migration',
    description: 'Moving old infrastructure to the new cloud provider.',
    image: 'https://images.unsplash.com/photo-1761370981247-1dfd749ec96b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9qZWN0JTIwZm9jdXMlMjBjb2xsYWJvcmF0aW9ufGVufDF8fHx8MTc2OTQ0MTk1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    memberCount: 4,
    status: 'Archived',
    lastActive: '2 months ago',
    templateId: 'standard'
  }
];

// Default form questions for subspace creation
const DEFAULT_FORM_QUESTIONS: FormField[] = [
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
      ],
    },
  },
  {
    id: "who",
    type: "long-text",
    label: "WHO? Goal and Target Audience",
    description: "Describe the goal and target audience (max 250 words)",
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

export function SpaceSettingsSubspaces() {
  const [defaultTemplateId, setDefaultTemplateId] = useState<string>('standard');
  const [subspaces, setSubspaces] = useState<Subspace[]>(MOCK_SUBSPACES);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modals
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Create Form
  const [newSubspaceTitle, setNewSubspaceTitle] = useState('');
  const [newSubspaceDesc, setNewSubspaceDesc] = useState('');
  const [newSubspaceTemplate, setNewSubspaceTemplate] = useState(defaultTemplateId);

  // Application Form
  const [formBuilderOpen, setFormBuilderOpen] = useState(false);
  const [currentFormConfig, setCurrentFormConfig] = useState<ApplicationFormConfig | null>(null);
  const [applications, setApplications] = useState<SubspaceApplication[]>([
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
        "how": "Phased implementation with pilot projects and scaling to 10+ municipalities.",
      },
      status: "submitted",
      submittedAt: "2026-06-28T10:30:00Z",
    },
  ]);

  const currentDefaultTemplate = TEMPLATES.find(t => t.id === defaultTemplateId) || TEMPLATES[0];

  const filteredSubspaces = subspaces.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleCreateSubspace = () => {
    const newSubspace: Subspace = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSubspaceTitle,
      description: newSubspaceDesc,
      image: 'https://images.unsplash.com/photo-1761370981247-1dfd749ec96b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9qZWN0JTIwZm9jdXMlMjBjb2xsYWJvcmF0aW9ufGVufDF8fHx8MTc2OTQ0MTk1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      memberCount: 1,
      status: 'Active',
      lastActive: 'Just now',
      templateId: newSubspaceTemplate
    };
    
    setSubspaces([newSubspace, ...subspaces]);
    setIsCreateModalOpen(false);
    setNewSubspaceTitle('');
    setNewSubspaceDesc('');
    setNewSubspaceTemplate(defaultTemplateId);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this subspace?')) {
      setSubspaces(subspaces.filter(s => s.id !== id));
    }
  };

  const handleArchive = (id: string) => {
    setSubspaces(subspaces.map(s => s.id === id ? { ...s, status: 'Archived' } : s));
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      
      {/* Default Template */}
      <SettingsSection
        title="Default Subspace Template"
        icon={<LayoutTemplate className="w-4 h-4" />}
        iconColor="purple"
        collapsible={false}
      >
        <Button size="sm" onClick={() => setIsTemplateModalOpen(true)}>
          Change Default Template
        </Button>
      </SettingsSection>

      {/* Subspaces List */}
      <SettingsSection
        title="Subspaces"
        icon={<Users className="w-4 h-4" />}
        iconColor="blue"
      >
      <div className="space-y-4">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-subsection-title flex items-center gap-2">
               Subspaces
               <Badge variant="secondary" className="rounded-full">
                  {filteredSubspaces.length}
               </Badge>
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
               <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search subspaces..." 
                    className="pl-9 h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} 
                  />
               </div>

               <div className="border rounded-md flex items-center h-9 p-0.5 bg-muted/20">
                  <IconButton
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    tooltipLabel="Grid view"
                    className="h-8 w-8 rounded-sm"
                    onClick={() => setViewMode('grid')}
                  >
                     <LayoutGrid className="w-4 h-4" />
                  </IconButton>
                  <IconButton
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    tooltipLabel="List view"
                    className="h-8 w-8 rounded-sm"
                    onClick={() => setViewMode('list')}
                  >
                     <ListIcon className="w-4 h-4" />
                  </IconButton>
               </div>

               <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                  <DialogTrigger asChild>
                     <Button size="sm" className="h-9 gap-2">
                        <Plus className="w-4 h-4" />
                        Create Subspace
                     </Button>
                  </DialogTrigger>
                  <DialogContent>
                     <DialogHeader>
                        <DialogTitle>Create New Subspace</DialogTitle>
                        <DialogDescription>
                           Set up a new workspace within this space.
                        </DialogDescription>
                     </DialogHeader>
                     <div className="space-y-4 py-4">
                        <div className="space-y-2">
                           <label className="text-body-emphasis">Subspace Name</label>
                           <Input 
                              placeholder="e.g. Q1 Marketing Campaign" 
                              value={newSubspaceTitle}
                              onChange={(e) => setNewSubspaceTitle(e.target.value)}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-body-emphasis">Description</label>
                           <Input 
                              placeholder="What is this space for?" 
                              value={newSubspaceDesc}
                              onChange={(e) => setNewSubspaceDesc(e.target.value)}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-body-emphasis">Template</label>
                           <div className="grid grid-cols-3 gap-2">
                              {TEMPLATES.map(t => (
                                <div 
                                  key={t.id}
                                  onClick={() => setNewSubspaceTemplate(t.id)}
                                  className={cn(
                                     "cursor-pointer border rounded p-2 text-center text-caption hover:bg-muted transition-colors",
                                     newSubspaceTemplate === t.id ? "bg-primary/5 border-primary ring-1 ring-primary" : "border-border"
                                  )}
                                >
                                   <div className="font-medium">{t.name}</div>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                     <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateSubspace} disabled={!newSubspaceTitle}>Create Subspace</Button>
                     </DialogFooter>
                  </DialogContent>
               </Dialog>
            </div>
         </div>

         {/* Grid View */}
         {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubspaces.map(subspace => (
                <div 
                  key={subspace.id} 
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col"
                >
                   <div className="h-32 bg-muted relative overflow-hidden">
                      <ImageWithFallback 
                         src={subspace.image} 
                         alt={subspace.name}
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-2 right-2">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <IconButton variant="secondary" tooltipLabel="More options" className="h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm border border-black/5 hover:bg-background">
                                  <MoreVertical className="w-3.5 h-3.5" />
                               </IconButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                               <DropdownMenuItem>
                                  <Pin className="w-4 h-4 mr-2" /> Pin
                               </DropdownMenuItem>
                               <DropdownMenuItem>
                                  <Save className="w-4 h-4 mr-2" /> Save as Template
                               </DropdownMenuItem>
                               <DropdownMenuSeparator />
                               <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(subspace.id)}>
                                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                               </DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                      </div>
                      {subspace.status === 'Archived' && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center">
                           <Badge variant="secondary">Archived</Badge>
                        </div>
                      )}
                   </div>
                   
                   <div className="p-4 flex flex-col flex-1">
                      <div className="flex-1">
                         <h4 className="text-subsection-title line-clamp-1 group-hover:text-primary transition-colors cursor-pointer">
                            {subspace.name}
                         </h4>
                         <p className="text-body text-muted-foreground mt-1 line-clamp-2 min-h-[40px]">
                            {subspace.description}
                         </p>
                      </div>
                   </div>
                </div>
              ))}
              
              {/* Empty State */}
              {filteredSubspaces.length === 0 && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/10">
                   <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Search className="w-6 h-6 opacity-50" />
                   </div>
                   <h3 className="text-subsection-title font-medium text-foreground">No subspaces found</h3>
                   <p className="text-body mt-1 mb-4">
                      Try adjusting your search.
                   </p>
                   <Button variant="outline" onClick={() => setSearchQuery('')}>
                      Clear Search
                   </Button>
                </div>
              )}
            </div>
         )}

         {/* List View */}
         {viewMode === 'list' && (
            <div className="border border-border rounded-xl overflow-hidden bg-card">
               {filteredSubspaces.map((subspace, i) => (
                  <div 
                    key={subspace.id}
                    className={cn(
                       "flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors",
                       i !== filteredSubspaces.length - 1 && "border-b border-border"
                    )}
                  >
                     <div className="w-16 h-12 rounded bg-muted overflow-hidden shrink-0">
                        <ImageWithFallback 
                           src={subspace.image} 
                           alt={subspace.name} 
                           className="w-full h-full object-cover"
                        />
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                           <h4 className="text-body-emphasis text-foreground truncate hover:underline cursor-pointer">{subspace.name}</h4>
                           {subspace.status === 'Archived' && (
                              <Badge variant="secondary" className="text-badge py-0 h-5">Archived</Badge>
                           )}
                        </div>
                        <p className="text-caption text-muted-foreground truncate max-w-md">
                           {subspace.description}
                        </p>
                     </div>
                     <div className="shrink-0">
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <IconButton variant="ghost" tooltipLabel="More options" className="h-8 w-8">
                                 <MoreVertical className="w-4 h-4" />
                              </IconButton>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                 <Pin className="w-4 h-4 mr-2" /> Pin
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                 <Save className="w-4 h-4 mr-2" /> Save as Template
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(subspace.id)}>
                                 <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
                  </div>
               ))}
               {filteredSubspaces.length === 0 && (
                   <div className="p-8 text-center text-muted-foreground text-body">
                      No subspaces found matching criteria.
                   </div>
               )}
            </div>
         )}
      </div>
      </SettingsSection>

      {/* Application Form for creating subspaces */}
      <Separator className="my-8" />

      <SettingsSection
        title="Application Form"
        description="For creating subspaces"
        icon={<FileText className="w-4 h-4" />}
        iconColor="purple"
        defaultOpen={true}
        collapsible={true}
      >
        <div className="space-y-3">
          <div className="text-caption text-muted-foreground">
            Members will fill this out when they want to create a subspace in this space.
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setFormBuilderOpen(true)}>
            <FileText className="w-4 h-4" /> Edit Application Form
          </Button>
        </div>
      </SettingsSection>

      {/* Applications for reviewing subspace creation proposals */}
      <Separator className="my-8" />

      <SettingsSection
        title="Subspace Applications"
        description="Review proposals to create subspaces"
        icon={<MessageSquare className="w-4 h-4" />}
        iconColor="orange"
        defaultOpen={true}
        collapsible={true}
      >
        <SubspaceApplicationsPanel
          applications={applications}
          formConfig={currentFormConfig || {
            id: "form-space",
            spaceId: "space-1",
            isActive: true,
            questions: DEFAULT_FORM_QUESTIONS,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }}
          spaceName="Innovation Lab"
          onApprove={(appId, message) => {
            console.log("Approve application", appId, message);
          }}
          onReject={(appId, message) => {
            console.log("Reject application", appId, message);
          }}
        />
      </SettingsSection>

      {/* Form Builder Dialog */}
      <SubspaceFormBuilderDialog
        open={formBuilderOpen}
        onOpenChange={setFormBuilderOpen}
        spaceId="space-1"
        spaceName="Innovation Lab"
        initialConfig={currentFormConfig}
        onSave={(config) => {
          setCurrentFormConfig(config);
          console.log("Form saved", config);
        }}
      />
    </div>
  );
}
