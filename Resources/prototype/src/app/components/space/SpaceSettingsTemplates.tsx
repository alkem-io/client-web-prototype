import { useState } from "react";
import { 
 Search, 
 Plus, 
 MoreHorizontal, 
 ChevronDown, 
 ChevronRight, 
 Copy, 
 Trash2, 
 Eye, 
 Pencil,
 LayoutTemplate,
 FileText,
 Users,
 PenTool,
 BookText,
 Tags
} from "lucide-react";
import { CreateClassificationTemplateDialog } from "@/app/components/classifications/CreateClassificationTemplateDialog";
import { AVAILABLE_CLASSIFICATION_TEMPLATES } from "@/app/components/classifications/ClassificationPickerDialog";
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle
} from "@/crd/primitives/dialog";
import { Button } from "@/crd/primitives/button";
import { IconButton } from "@/crd/primitives/icon-button";
import { Input } from "@/crd/primitives/input";
import { Badge } from "@/crd/primitives/badge";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
 DropdownMenuSeparator
} from "@/crd/primitives/dropdown-menu";
import {
 Collapsible,
 CollapsibleContent,
 CollapsibleTrigger
} from "@/crd/primitives/collapsible";
import { cn } from "@/crd/lib/utils";

// --- Types ---

type TemplateCategory = 'Space' | 'Collaboration' | 'Whiteboard' | 'Post' | 'Classification' | 'CommunityGuidelines';

interface Template {
 id: string;
 name: string;
 description: string;
 image: string;
 category: TemplateCategory;
 isCustom: boolean;
 tags: string[];
}

interface TemplateSection {
 id: TemplateCategory;
 title: string;
 description: string;
 icon: React.ElementType;
}

// --- Mock Data ---

const SECTIONS: TemplateSection[] = [
 { 
 id: 'Space', 
 title: 'Space Templates', 
 description: 'Structure your space with predefined layouts and tools.',
 icon: LayoutTemplate
 },
 { 
 id: 'Collaboration', 
 title: 'Collaboration Tool Templates', 
 description: 'Tools for workshops, brainstorming, and group activities.',
 icon: Users
 },
 { 
 id: 'Whiteboard', 
 title: 'Whiteboard Templates', 
 description: 'Canvas layouts for visual collaboration.',
 icon: PenTool
 },
 { 
 id: 'Post', 
 title: 'Post Templates', 
 description: 'Standardized documents for projects and decisions.',
 icon: FileText
 },
 { 
 id: 'Classification', 
 title: 'Classification Templates', 
 description: 'Structured vocabularies for tagging and reporting (e.g. SDGs, Sector).',
 icon: Tags
 },
 { 
 id: 'CommunityGuidelines', 
 title: 'Community Guidelines Templates', 
 description: 'Rules and expectations for your community.',
 icon: BookText
 }
];

const MOCK_TEMPLATES: Template[] = [
 // Space Templates
 {
 id: 't1',
 name: "Creative Thinking Space",
 description: "A complete setup for design thinking workshops including whiteboards and breakout rooms.",
 image: "https://images.unsplash.com/photo-1768796370577-c6e8b708b980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHRoaW5raW5nJTIwd29ya3Nob3AlMjBicmFpbnN0b3JtaW5nfGVufDF8fHx8MTc2OTQ0MzIwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
 category: "Space",
 isCustom: false,
 tags: ["Workshop", "Design"]
 },
 {
 id: 't2',
 name: "Agile Project Space",
 description: "Pre-configured for scrum teams with kanban boards and daily standup tools.",
 image: "https://images.unsplash.com/photo-1731924532579-d23ed102496c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwd2hpdGVib2FyZCUyMGNvbGxhYm9yYXRpb24lMjB1aXxlbnwxfHx8fDE3Njk0NDMyMDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
 category: "Space",
 isCustom: false,
 tags: ["Agile", "Management"]
 },
 
 // Collaboration Templates
 {
 id: 't3',
 name: "Brainstorming Session",
 description: "Structured flow for generating and voting on ideas.",
 image: "https://images.unsplash.com/photo-1768796370577-c6e8b708b980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHRoaW5raW5nJTIwd29ya3Nob3AlMjBicmFpbnN0b3JtaW5nfGVufDF8fHx8MTc2OTQ0MzIwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
 category: "Collaboration",
 isCustom: false,
 tags: ["Ideation"]
 },
 
 // Whiteboard Templates
 {
 id: 't4',
 name: "Customer Journey Map",
 description: "Visual template for mapping user experiences.",
 image: "https://images.unsplash.com/photo-1690192168579-0f79e522a270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwam91cm5leSUyMG1hcCUyMHN0aWNreSUyMG5vdGVzJTIwd2hpdGVib2FyZHxlbnwxfHx8fDE3Njk0NDM1OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
 category: "Whiteboard",
 isCustom: false,
 tags: ["UX", "Mapping"]
 },
 {
 id: 't5',
 name: "Retrospective Board",
 description: "Start/Stop/Continue layout for team retrospectives.",
 image: "https://images.unsplash.com/photo-1717994818193-266ff93e3396?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ2lsZSUyMHJldHJvc3BlY3RpdmUlMjB3aGl0ZWJvYXJkJTIwdGVtcGxhdGV8ZW58MXx8fHwxNzY5NDQzNTg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
 category: "Whiteboard",
 isCustom: true,
 tags: ["Agile", "Team"]
 },

 // Brief Templates
 {
 id: 't6',
 name: "Product Requirements Doc",
 description: "Standard PRD template with sections for features, metrics, and timeline.",
 image: "https://images.unsplash.com/photo-1641395437808-10c477b8f199?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGRvY3VtZW50JTIwcHJvamVjdCUyMGJyaWVmfGVufDF8fHx8MTc2OTQ0MzIwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
 category: "Post",
 isCustom: false,
 tags: ["Product", "Doc"]
 },

 // Classification Templates
 {
 id: 't8',
 name: "UN Sustainable Development Goals",
 description: "The 17 UN SDGs for classifying space impact areas.",
 image: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
 category: "Classification",
 isCustom: false,
 tags: ["SDG", "Impact"]
 },
 {
 id: 't9c',
 name: "Sector",
 description: "Industry sector classification for cross-portfolio reporting.",
 image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
 category: "Classification",
 isCustom: false,
 tags: ["Sector", "Reporting"]
 },

 // Guidelines Templates
 {
 id: 't7',
 name: "Open Source Code of Conduct",
 description: "Standard Contributor Covenant tailored for open innovation spaces.",
 image: "https://images.unsplash.com/photo-1758275557296-0340762a4ab3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBndWlkZWxpbmVzJTIwaGFuZHNoYWtlJTIwZGl2ZXJzZSUyMGdyb3VwfGVufDF8fHx8MTc2OTQ0MzIwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
 category: "CommunityGuidelines",
 isCustom: false,
 tags: ["Community", "Legal"]
 }
];

// --- Components ---

function ClassificationTemplateCard({ template, onAction }: {
 template: Template,
 onAction: (action: string, id: string) => void
}) {
 // Mock values for display
 const MOCK_VALUES: Record<string, string[]> = {
 "UN Sustainable Development Goals": ["SDG 1 – No Poverty", "SDG 2 – Zero Hunger", "SDG 3 – Good Health", "SDG 7 – Clean Energy", "SDG 13 – Climate Action"],
 "Sector": ["Energy", "Healthcare", "Education", "Agriculture", "Finance", "Technology"]
 };
 const values = MOCK_VALUES[template.name] || ["Value 1", "Value 2", "Value 3"];

 return (
 <div className={cn(
 "group relative flex flex-col border rounded-lg overflow-hidden bg-card hover:shadow-md transition-all duration-300"
 )}>
 {/* Classification Preview */}
 <div className="p-4 bg-muted/30 border-b border-border">
 <div className="flex items-center gap-2 mb-3">
 <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/15 flex items-center justify-center shrink-0">
 <Tags className="w-4 h-4 text-purple-600 dark:text-purple-400" />
 </div>
 <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
 Multi-select
 </Badge>
 </div>
 <div className="flex flex-wrap gap-1">
 {values.slice(0, 4).map((val, i) => (
 <span key={i} className="inline-block bg-background border border-border px-2 py-0.5 rounded text-[10px] text-muted-foreground truncate max-w-[120px]">
 {val}
 </span>
 ))}
 {values.length > 4 && (
 <span className="inline-block bg-background border border-border px-2 py-0.5 rounded text-[10px] text-muted-foreground">
 +{values.length - 4}
 </span>
 )}
 </div>
 </div>

 {/* Content */}
 <div className="flex-1 p-4 flex flex-col gap-3">
 <div>
 <h4 className="font-semibold leading-none mb-1.5">{template.name}</h4>
 <p className="text-body text-muted-foreground line-clamp-2">
 {template.description}
 </p>
 </div>
 
 <div className="mt-auto flex items-center justify-end pt-2">
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <IconButton variant="ghost" tooltipLabel="More options">
 <MoreHorizontal className="w-4 h-4" />
 </IconButton>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end">
 <DropdownMenuItem onClick={() => onAction('preview', template.id)}>
 <Eye className="w-4 h-4 mr-2" />
 Preview
 </DropdownMenuItem>
 <DropdownMenuItem onClick={() => onAction('duplicate', template.id)}>
 <Copy className="w-4 h-4 mr-2" />
 Duplicate
 </DropdownMenuItem>
 <DropdownMenuSeparator />
 <DropdownMenuItem onClick={() => onAction('edit', template.id)}>
 <Pencil className="w-4 h-4 mr-2" />
 Edit
 </DropdownMenuItem>
 <DropdownMenuItem 
 className="text-destructive focus:text-destructive"
 onClick={() => onAction('delete', template.id)}
 >
 <Trash2 className="w-4 h-4 mr-2" />
 Delete
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 </div>
 </div>
 </div>
 );
}

function TemplateCard({ template, onAction }: { 
 template: Template, 
 onAction: (action: string, id: string) => void 
}) {
 if (template.category === "Classification") {
 return <ClassificationTemplateCard template={template} onAction={onAction} />;
 }

 return (
 <div className={cn(
 "group relative flex flex-col border rounded-lg overflow-hidden bg-card hover:shadow-md transition-all duration-300"
 )}>
 {/* Thumbnail */}
 <div className="relative aspect-video bg-muted overflow-hidden">
 <img 
 src={template.image} 
 alt={template.name} 
 className="w-full h-full object-cover transition-transform group-hover:scale-105"
 />

 </div>

 {/* Content */}
 <div className="flex-1 p-4 flex flex-col gap-3">
 <div>
 <h4 className="font-semibold leading-none mb-1.5">{template.name}</h4>
 <p className="text-body text-muted-foreground line-clamp-2">
 {template.description}
 </p>
 </div>
 
 <div className="mt-auto flex items-center justify-end pt-2">
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <IconButton variant="ghost" tooltipLabel="More options" >
 <MoreHorizontal className="w-4 h-4" />
 </IconButton>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end">
 <DropdownMenuItem onClick={() => onAction('preview', template.id)}>
 <Eye className="w-4 h-4 mr-2" />
 Preview
 </DropdownMenuItem>
 <DropdownMenuItem onClick={() => onAction('duplicate', template.id)}>
 <Copy className="w-4 h-4 mr-2" />
 Duplicate
 </DropdownMenuItem>
 <DropdownMenuSeparator />
 <DropdownMenuItem onClick={() => onAction('edit', template.id)}>
 <Pencil className="w-4 h-4 mr-2" />
 Edit
 </DropdownMenuItem>
 <DropdownMenuItem 
 className="text-destructive focus:text-destructive"
 onClick={() => onAction('delete', template.id)}
 >
 <Trash2 className="w-4 h-4 mr-2" />
 Delete
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 </div>
 </div>
 </div>
 );
}

function SelectFromLibraryContent({ onSelect }: { onSelect: (template: typeof AVAILABLE_CLASSIFICATION_TEMPLATES[0]) => void }) {
 const [search, setSearch] = useState("");
 const platformTemplates = AVAILABLE_CLASSIFICATION_TEMPLATES.filter(t => t.source === "platform");
 const personalTemplates = AVAILABLE_CLASSIFICATION_TEMPLATES.filter(t => t.source === "personal");
 const allTemplates = [...platformTemplates, ...personalTemplates];
 const filtered = allTemplates.filter(t =>
 t.name.toLowerCase().includes(search.toLowerCase()) ||
 t.description.toLowerCase().includes(search.toLowerCase())
 );
 const filteredPlatform = filtered.filter(t => t.source === "platform");
 const filteredPersonal = filtered.filter(t => t.source === "personal");

 const renderTemplate = (template: typeof AVAILABLE_CLASSIFICATION_TEMPLATES[0]) => (
 <button
 key={template.id}
 onClick={() => onSelect(template)}
 className="w-full flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-colors text-left group"
 >
 <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-500/15 flex items-center justify-center shrink-0">
 <Tags className="w-4 h-4 text-purple-600 dark:text-purple-400" />
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2">
 <span className="font-medium text-body truncate">{template.name}</span>
 <Badge variant="secondary" className="text-[10px] h-4 px-1.5 shrink-0">
 {template.cardinality === "multi" ? "Multi" : "Single"}
 </Badge>
 </div>
 <p className="text-caption text-muted-foreground truncate">{template.description}</p>
 {template.packName && (
 <p className="text-[10px] text-muted-foreground/70 mt-0.5">from {template.packName}</p>
 )}
 </div>
 <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
 </button>
 );

 return (
 <div className="space-y-4">
 <p className="text-caption text-muted-foreground">
 Choose a classification template to add to your space.
 </p>
 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
 <input
 className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-body shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
 placeholder="Search templates…"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 />
 </div>
 <div className="max-h-[380px] overflow-y-auto space-y-4 pr-1">
 {/* Platform Library */}
 {filteredPlatform.length > 0 && (
 <div>
 <div className="flex items-center gap-2 mb-2 px-1">
 <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Platform Library</span>
 <span className="text-[10px] text-muted-foreground/60">({filteredPlatform.length})</span>
 </div>
 <div className="space-y-1">
 {filteredPlatform.map(renderTemplate)}
 </div>
 </div>
 )}

 {/* Your Template Packs */}
 {filteredPersonal.length > 0 && (
 <div>
 <div className="flex items-center gap-2 mb-2 px-1">
 <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Your Template Packs</span>
 <span className="text-[10px] text-muted-foreground/60">({filteredPersonal.length})</span>
 </div>
 <div className="space-y-1">
 {filteredPersonal.map(renderTemplate)}
 </div>
 </div>
 )}

 {filtered.length === 0 && (
 <div className="text-center py-8 text-muted-foreground">
 <Tags className="w-8 h-8 mx-auto mb-2 opacity-40" />
 <p className="text-body">No matching templates found</p>
 </div>
 )}
 </div>
 </div>
 );
}

export function SpaceSettingsTemplates() {
 const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
 const [searchQuery, setSearchQuery] = useState('');
 const [openSections, setOpenSections] = useState<Record<string, boolean>>({
 Space: true,
 Collaboration: true,
 Whiteboard: true,
 Post: true,
 Classification: true,
 CommunityGuidelines: true
 });
 const [createClassificationOpen, setCreateClassificationOpen] = useState(false);
 const [selectFromLibraryOpen, setSelectFromLibraryOpen] = useState(false);

 const toggleSection = (id: string) => {
 setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
 };

 const handleAction = (action: string, id: string) => {
 console.log(`Action: ${action} on template ${id}`);
 if (action === 'delete') {
 setTemplates(prev => prev.filter(t => t.id !== id));
 }
 if (action === 'create_new' && id === 'Classification') {
 setCreateClassificationOpen(true);
 }
 if (action === 'select_library' && id === 'Classification') {
 setSelectFromLibraryOpen(true);
 }
 };

 // Filter Logic
 const filteredTemplates = templates.filter(t => {
 const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
 t.description.toLowerCase().includes(searchQuery.toLowerCase());
 return matchesSearch;
 });

 const getTemplatesByCategory = (category: TemplateCategory) => {
 return filteredTemplates.filter(t => t.category === category);
 };

 return (
 <div className="space-y-6 animate-in fade-in duration-500">
 {/* 1. Search */}
 <div className="flex flex-col sm:flex-row gap-4">
 <div className="relative flex-1">
 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
 <Input 
 placeholder="Search templates..." 
 className="pl-9"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 />
 </div>
 </div>

 {/* 3. Template Sections */}
 <div className="space-y-6">
 {SECTIONS.map((section) => {
 const sectionTemplates = getTemplatesByCategory(section.id);
 const isEmpty = sectionTemplates.length === 0;
 
 return (
 <Collapsible 
 key={section.id}
 open={openSections[section.id]}
 onOpenChange={() => toggleSection(section.id)}
 className="bg-card border rounded-lg overflow-hidden"
 >
 <div className="p-4 flex items-center justify-between bg-muted/20">
 <CollapsibleTrigger asChild>
 <div className="flex items-center gap-3 cursor-pointer select-none group">
 <div className="p-2 bg-background border rounded-md group-hover:bg-accent transition-colors">
 <section.icon className="w-5 h-5 text-muted-foreground" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h3 className="text-subheader font-semibold">{section.title}</h3>
 <Badge variant="secondary" className="text-caption h-5 px-1.5 min-w-[1.5rem] flex justify-center">
 {sectionTemplates.length}
 </Badge>
 </div>
 <p className="text-body text-muted-foreground hidden sm:block">
 {section.description}
 </p>
 </div>
 {openSections[section.id] ? (
 <ChevronDown className="w-4 h-4 text-muted-foreground ml-2" />
 ) : (
 <ChevronRight className="w-4 h-4 text-muted-foreground ml-2" />
 )}
 </div>
 </CollapsibleTrigger>
 
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button size="sm" variant="outline" className="gap-2 hidden sm:flex">
 <Plus className="w-4 h-4" />
 Add New
 <ChevronDown className="w-3 h-3 opacity-50" />
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end" className="w-56">
 <DropdownMenuItem onClick={() => handleAction('create_new', section.id)}>
 <Plus className="w-4 h-4 mr-2" />
 Create a new template
 </DropdownMenuItem>
 <DropdownMenuItem onClick={() => handleAction('select_library', section.id)}>
 <LayoutTemplate className="w-4 h-4 mr-2" />
 Select a template from the platform library
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>

 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <IconButton tooltipLabel="Add" variant="ghost" className="sm:hidden">
 <Plus className="w-4 h-4" />
 </IconButton>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end" className="w-56">
 <DropdownMenuItem onClick={() => handleAction('create_new', section.id)}>
 <Plus className="w-4 h-4 mr-2" />
 Create a new template
 </DropdownMenuItem>
 <DropdownMenuItem onClick={() => handleAction('select_library', section.id)}>
 <LayoutTemplate className="w-4 h-4 mr-2" />
 Select a template from the platform library
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 </div>

 <CollapsibleContent>
 <div className="p-4 border-t">
 {isEmpty ? (
 <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
 <section.icon className="w-10 h-10 mb-3 opacity-20" />
 <p className="font-medium">No templates found</p>
 <p className="text-body">Try searching for a different term or create a new template.</p>
 <Button variant="link" size="sm" className="mt-2">
 Browse General Library
 </Button>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
 {sectionTemplates.map(template => (
 <TemplateCard 
 key={template.id} 
 template={template} 
 onAction={handleAction}
 />
 ))}
 </div>
 )}
 </div>
 </CollapsibleContent>
 </Collapsible>
 );
 })}

 {filteredTemplates.length === 0 && (
 <div className="text-center py-12">
 <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
 <Search className="w-8 h-8 text-muted-foreground/50" />
 </div>
 <h3 className="text-subsection-title">No results found</h3>
 <p className="text-muted-foreground">
 No templates match your current search query.
 </p>
 <Button 
 variant="outline" 
 className="mt-4"
 onClick={() => setSearchQuery('')}
 >
 Clear search
 </Button>
 </div>
 )}
 </div>

 <CreateClassificationTemplateDialog
 open={createClassificationOpen}
 onOpenChange={setCreateClassificationOpen}
 onCreated={(template) => {
 setTemplates(prev => [...prev, {
 id: `t-new-${Date.now()}`,
 name: template.name,
 description: template.description,
 image: "",
 category: "Classification",
 isCustom: true,
 tags: [template.cardinality === "multi" ? "Multi-select" : "Single-select"]
 }]);
 }}
 />

 {/* Select from Platform Library dialog */}
 <Dialog open={selectFromLibraryOpen} onOpenChange={setSelectFromLibraryOpen}>
 <DialogContent className="sm:max-w-[520px]">
 <DialogHeader>
 <DialogTitle>Select from Platform Library</DialogTitle>
 </DialogHeader>
 <SelectFromLibraryContent
 onSelect={(template) => {
 setTemplates(prev => [...prev, {
 id: `t-lib-${Date.now()}`,
 name: template.name,
 description: template.description,
 image: "",
 category: "Classification" as TemplateCategory,
 isCustom: false,
 tags: [template.cardinality === "multi" ? "Multi-select" : "Single-select"]
 }]);
 setSelectFromLibraryOpen(false);
 }}
 />
 </DialogContent>
 </Dialog>
 </div>
 );
}
