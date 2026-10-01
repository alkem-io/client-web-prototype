import { useState } from "react";
import { Search, Check, ChevronRight, Library, Tags, Globe2, Leaf, ArrowRight } from "lucide-react";
import { Button } from "@/crd/primitives/button";
import { Input } from "@/crd/primitives/input";
import { Badge } from "@/crd/primitives/badge";
import { cn } from "@/crd/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/crd/primitives/dialog";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ClassificationTemplate {
  id: string;
  name: string;
  description: string;
  cardinality: "single" | "multi";
  values: string[];
  source: "platform" | "space" | "personal";
  packName?: string;
}

export interface AppliedClassification {
  id: string;
  templateId: string;
  templateName: string;
  selectedValues: string[];
  cardinality: "single" | "multi";
  allValues: string[];
}

// ─── Mock Templates Available ────────────────────────────────────────────────

export const AVAILABLE_CLASSIFICATION_TEMPLATES: ClassificationTemplate[] = [
  // Space Library (templates already in this space's template library)
  {
    id: "ct-sdg",
    name: "UN Sustainable Development Goals",
    description: "The 17 UN SDGs provide a shared blueprint for peace and prosperity.",
    cardinality: "multi",
    values: [
      "SDG 1 – No Poverty",
      "SDG 2 – Zero Hunger",
      "SDG 3 – Good Health and Well-Being",
      "SDG 4 – Quality Education",
      "SDG 5 – Gender Equality",
      "SDG 6 – Clean Water and Sanitation",
      "SDG 7 – Affordable and Clean Energy",
      "SDG 8 – Decent Work and Economic Growth",
      "SDG 9 – Industry, Innovation and Infrastructure",
      "SDG 10 – Reduced Inequalities",
      "SDG 11 – Sustainable Cities and Communities",
      "SDG 12 – Responsible Consumption and Production",
      "SDG 13 – Climate Action",
      "SDG 14 – Life Below Water",
      "SDG 15 – Life on Land",
      "SDG 16 – Peace, Justice and Strong Institutions",
      "SDG 17 – Partnerships for the Goals",
    ],
    source: "space",
    packName: "VNG Innovation Hub"
  },
  {
    id: "ct-sector",
    name: "Sector",
    description: "Classify spaces by industry sector for cross-portfolio reporting.",
    cardinality: "multi",
    values: ["Energy", "Healthcare", "Education", "Agriculture", "Finance", "Technology", "Transportation", "Government", "Environment", "Social Services"],
    source: "space",
    packName: "VNG Innovation Hub"
  },
  // Platform Library
  {
    id: "ct-language",
    name: "Language",
    description: "Primary language(s) used in this space.",
    cardinality: "multi",
    values: ["Dutch", "English", "French", "German", "Spanish", "Portuguese", "Arabic", "Mandarin"],
    source: "platform",
    packName: "Alkemio Defaults"
  },
  {
    id: "ct-phase",
    name: "Project Phase",
    description: "What phase is this initiative in?",
    cardinality: "single",
    values: ["Discovery", "Design", "Pilot", "Scale", "Maintenance", "Completed"],
    source: "platform",
    packName: "Alkemio Defaults"
  },
  {
    id: "ct-impact",
    name: "Impact Level",
    description: "Expected level of societal impact.",
    cardinality: "single",
    values: ["Local", "Regional", "National", "International"],
    source: "platform",
    packName: "Alkemio Defaults"
  },
  {
    id: "ct-region",
    name: "Geographic Region",
    description: "Geographic coverage of this space's activities.",
    cardinality: "multi",
    values: ["Europe", "North America", "South America", "Asia", "Africa", "Oceania", "Middle East"],
    source: "platform",
    packName: "Alkemio Defaults"
  },
  {
    id: "ct-audience",
    name: "Target Audience",
    description: "Who is the primary audience for this space?",
    cardinality: "multi",
    values: ["Citizens", "Government", "NGOs", "Business", "Academia", "Youth", "Elderly"],
    source: "platform",
    packName: "Community Builder Pack"
  },
  {
    id: "ct-maturity",
    name: "Maturity Level",
    description: "How mature is this initiative?",
    cardinality: "single",
    values: ["Idea", "Proof of Concept", "Pilot", "Growth", "Mature", "Sunset"],
    source: "platform",
    packName: "Innovation Hub Pack"
  },
  {
    id: "ct-funding",
    name: "Funding Stage",
    description: "Current funding stage of the initiative.",
    cardinality: "single",
    values: ["Pre-seed", "Seed", "Series A", "Series B", "Growth", "Self-sustaining"],
    source: "platform",
    packName: "Startup Pack"
  },
  // Your Template Packs (personal/org template packs)
  {
    id: "ct-priority",
    name: "Priority Level",
    description: "Strategic priority classification for portfolio management.",
    cardinality: "single",
    values: ["Critical", "High", "Medium", "Low", "Backlog"],
    source: "personal",
    packName: "My Organization Pack"
  },
  {
    id: "ct-department",
    name: "Department",
    description: "Which department owns this space?",
    cardinality: "single",
    values: ["Engineering", "Product", "Design", "Marketing", "Sales", "Operations", "HR", "Finance"],
    source: "personal",
    packName: "My Organization Pack"
  },
  {
    id: "ct-compliance",
    name: "Compliance Framework",
    description: "Applicable compliance or regulatory frameworks.",
    cardinality: "multi",
    values: ["GDPR", "SOC 2", "ISO 27001", "HIPAA", "PCI-DSS"],
    source: "personal",
    packName: "My Organization Pack"
  },
];

// ─── Step 1: Pick a Template ─────────────────────────────────────────────────

const INITIAL_SHOW_COUNT = 3;

function TemplatePickerStep({
  onSelect,
  onGoToTemplates,
  excludeIds,
  availableTemplates
}: {
  onSelect: (template: ClassificationTemplate) => void;
  onGoToTemplates: () => void;
  excludeIds: string[];
  availableTemplates: ClassificationTemplate[];
}) {
  const [search, setSearch] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const filtered = availableTemplates.filter(
    (t) =>
      !excludeIds.includes(t.id) &&
      (t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()))
  );

  const spaceTemplates = filtered.filter((t) => t.source === "space");
  const platformTemplates = filtered.filter((t) => t.source === "platform");
  const personalTemplates = filtered.filter((t) => t.source === "personal");

  const toggleExpand = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const renderSection = (
    templates: ClassificationTemplate[],
    sectionKey: string,
    icon: React.ReactNode,
    label: string,
    description: string
  ) => {
    if (templates.length === 0) return null;
    const isExpanded = expandedSections[sectionKey] || search.length > 0;
    const visibleTemplates = isExpanded ? templates : templates.slice(0, INITIAL_SHOW_COUNT);
    const hasMore = templates.length > INITIAL_SHOW_COUNT && !isExpanded && search.length === 0;

    return (
      <div>
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-caption font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
          <span className="text-[10px] text-muted-foreground/60">({templates.length})</span>
        </div>
        <p className="text-[11px] text-muted-foreground/70 mb-2 ml-5">{description}</p>
        <div className="space-y-1">
          {visibleTemplates.map((template) => (
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
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                    from {template.packName}
                  </p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          ))}
        </div>
        {hasMore && (
          <button
            onClick={() => toggleExpand(sectionKey)}
            className="ml-5 mt-1 text-caption text-primary hover:underline"
          >
            Show {templates.length - INITIAL_SHOW_COUNT} more…
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-caption text-muted-foreground">
        Choose a classification template to apply to this space.
      </p>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search classification templates…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="max-h-[400px] overflow-y-auto space-y-5 pr-1">
        {renderSection(
          spaceTemplates,
          "space",
          <Library className="w-3.5 h-3.5 text-emerald-600" />,
          "Space Library",
          "Templates already added to this space"
        )}

        {renderSection(
          platformTemplates,
          "platform",
          <Globe2 className="w-3.5 h-3.5 text-blue-600" />,
          "Platform Library",
          "Available to all spaces on this platform"
        )}

        {renderSection(
          personalTemplates,
          "personal",
          <Library className="w-3.5 h-3.5 text-purple-600" />,
          "Your Template Packs",
          "From template packs you manage"
        )}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Tags className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-body">No matching templates found</p>
            <p className="text-caption mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 2: Select Values ───────────────────────────────────────────────────

function ValueSelectorStep({
  template,
  selectedValues,
  onToggle,
  onBack
}: {
  template: ClassificationTemplate;
  selectedValues: string[];
  onToggle: (value: string) => void;
  onBack: () => void;
}) {
  const [search, setSearch] = useState("");

  const filteredValues = template.values.filter((v) =>
    v.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Template Header */}
      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Tags className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-body">{template.name}</p>
          <p className="text-caption text-muted-foreground">
            {template.cardinality === "multi"
              ? "Select one or more values"
              : "Select one value"}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-caption">
          Change
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Filter values…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Values Grid */}
      <div className="max-h-[320px] overflow-y-auto space-y-1 pr-1">
        {filteredValues.map((value) => {
          const isSelected = selectedValues.includes(value);
          return (
            <button
              key={value}
              onClick={() => {
                if (template.cardinality === "single" && !isSelected) {
                  // For single-select, replace existing selection
                  onToggle(value);
                } else {
                  onToggle(value);
                }
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                isSelected
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-muted/50 border border-transparent"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                  isSelected
                    ? "bg-primary border-primary text-white"
                    : "border-muted-foreground/30"
                )}
              >
                {isSelected && <Check className="w-3 h-3" />}
              </div>
              <span className={cn("text-body", isSelected && "font-medium")}>{value}</span>
            </button>
          );
        })}
      </div>

      {/* Selection count */}
      {selectedValues.length > 0 && (
        <div className="pt-2 border-t text-caption text-muted-foreground">
          {selectedValues.length} value{selectedValues.length !== 1 ? "s" : ""} selected
        </div>
      )}
    </div>
  );
}

// ─── Main Dialog ─────────────────────────────────────────────────────────────

interface ClassificationPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (classification: AppliedClassification) => void;
  onGoToTemplates: () => void;
  existingClassificationIds: string[];
  /** Templates available from the space's template library */
  availableTemplates?: ClassificationTemplate[];
}

export function ClassificationPickerDialog({
  open,
  onOpenChange,
  onAdd,
  onGoToTemplates,
  existingClassificationIds,
  availableTemplates = AVAILABLE_CLASSIFICATION_TEMPLATES
}: ClassificationPickerDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<ClassificationTemplate | null>(null);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleSelectTemplate = (template: ClassificationTemplate) => {
    setSelectedTemplate(template);
    setSelectedValues([]);
    setStep(2);
  };

  const handleToggleValue = (value: string) => {
    if (!selectedTemplate) return;

    if (selectedTemplate.cardinality === "single") {
      setSelectedValues([value]);
    } else {
      setSelectedValues((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    }
  };

  const handleConfirm = () => {
    if (!selectedTemplate || selectedValues.length === 0) return;

    onAdd({
      id: `cls-${Date.now()}`,
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      selectedValues,
      cardinality: selectedTemplate.cardinality,
      allValues: selectedTemplate.values
    });

    // Reset and close
    setStep(1);
    setSelectedTemplate(null);
    setSelectedValues([]);
    onOpenChange(false);
  };

  const handleClose = () => {
    setStep(1);
    setSelectedTemplate(null);
    setSelectedValues([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Add Classification" : "Select Values"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <TemplatePickerStep
            onSelect={handleSelectTemplate}
            onGoToTemplates={() => {
              handleClose();
              onGoToTemplates();
            }}
            excludeIds={existingClassificationIds}
            availableTemplates={availableTemplates}
          />
        ) : (
          selectedTemplate && (
            <ValueSelectorStep
              template={selectedTemplate}
              selectedValues={selectedValues}
              onToggle={handleToggleValue}
              onBack={() => {
                setStep(1);
                setSelectedTemplate(null);
                setSelectedValues([]);
              }}
            />
          )
        )}

        {step === 2 && (
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={selectedValues.length === 0}>
              Add Classification
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
