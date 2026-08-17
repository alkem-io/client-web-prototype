import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/app/components/ui/button";
import { IconButton } from "@/app/components/ui/icon-button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { X, Plus, Type, MapPin, Image, FileText, Tag, Link2, Info, Check, Upload, Crop, Minus, Tags, MoreHorizontal, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { SaveBar } from "@/app/components/shared/SaveBar";
import { UnsavedChangesGuard } from "@/app/components/shared/UnsavedChangesGuard";
import { SettingsSection } from "@/app/components/shared/SettingsSection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Badge } from "@/app/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  ClassificationPickerDialog,
  AppliedClassification,
} from "@/app/components/classifications/ClassificationPickerDialog";

// Mock data for initial state
const INITIAL_DATA = {
  name: "Green Energy Space",
  tagline: "Accelerating the transition to sustainable energy systems worldwide.",
  country: "NL",
  city: "Amsterdam",
  what: "<p>This space is dedicated to exploring new technologies and sustainable solutions.</p>",
  why: "<p>We believe that collaboration is key to solving the world's biggest challenges.</p>",
  who: "<p>Engineers, Designers, and Product Managers who are passionate about the future.</p>",
  tags: ["Innovation", "Sustainability", "Tech"],
  references: [
    { title: "Company Vision 2030", url: "https://example.com/vision" },
    { title: "Design System Guidelines", url: "https://example.com/design" }
  ]
};

export function SpaceSettingsAbout() {
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [savedData, setSavedData] = useState(INITIAL_DATA);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Classifications state
  const [classifications, setClassifications] = useState<AppliedClassification[]>([
    {
      id: "cls-1",
      templateId: "ct-sdg",
      templateName: "UN Sustainable Development Goals",
      selectedValues: ["SDG 7 – Affordable and Clean Energy", "SDG 13 – Climate Action"],
      cardinality: "multi",
      allValues: [],
    },
  ]);
  const [savedClassifications, setSavedClassifications] = useState<AppliedClassification[]>([
    {
      id: "cls-1",
      templateId: "ct-sdg",
      templateName: "UN Sustainable Development Goals",
      selectedValues: ["SDG 7 – Affordable and Clean Energy", "SDG 13 – Climate Action"],
      cardinality: "multi",
      allValues: [],
    },
  ]);
  const [classificationPickerOpen, setClassificationPickerOpen] = useState(false);

  // Global dirty check
  const isDirty =
    formData.name !== savedData.name ||
    formData.tagline !== savedData.tagline ||
    formData.country !== savedData.country ||
    formData.city !== savedData.city ||
    formData.what !== savedData.what ||
    formData.why !== savedData.why ||
    formData.who !== savedData.who ||
    JSON.stringify(formData.tags) !== JSON.stringify(savedData.tags) ||
    JSON.stringify(formData.references) !== JSON.stringify(savedData.references) ||
    JSON.stringify(classifications) !== JSON.stringify(savedClassifications);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setSavedData({ ...formData });
      setSavedClassifications([...classifications]);
      setIsSaving(false);
    }, 800);
  };

  const handleDiscard = () => {
    setFormData({ ...savedData });
    setClassifications([...savedClassifications]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuillChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const addReference = () => {
    setFormData(prev => ({ ...prev, references: [...prev.references, { title: "", url: "" }] }));
  };

  const updateReference = (index: number, field: "title" | "url", value: string) => {
    const newRefs = [...formData.references];
    newRefs[index] = { ...newRefs[index], [field]: value };
    setFormData(prev => ({ ...prev, references: newRefs }));
  };

  const removeReference = (index: number) => {
    setFormData(prev => ({ ...prev, references: prev.references.filter((_, i) => i !== index) }));
  };

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'blockquote'],
      ['clean']
    ],
  };

  return (
    <>
      <UnsavedChangesGuard isDirty={isDirty} onSave={handleSave} />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 pb-20">
        {/* LEFT COLUMN - FORM */}
        <div className="space-y-5">
        {/* ── Identity ── */}
        <SettingsSection
          title="Identity"
          icon={<Type className="w-4 h-4" />}
          iconColor="blue"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Space Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Green Energy Space"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="A short one-line summary of your space"
              />
            </div>
          </div>
        </SettingsSection>

        {/* ── Branding ── */}
        <SettingsSection
          title="Visuals"
          icon={<Image className="w-4 h-4" />}
          iconColor="purple"
          defaultOpen={false}
        >
          <div className="flex gap-4 items-stretch">
            {/* Avatar — square, height drives width */}
            <button
              type="button"
              className="flex flex-col items-center justify-center gap-3 aspect-square h-40 shrink-0 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/20 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <Image className="w-10 h-10 text-muted-foreground/50" />
              <div className="text-center">
                <p className="text-body font-medium text-muted-foreground">Avatar</p>
                <p className="text-caption text-muted-foreground/70">200 × 200px</p>
              </div>
            </button>

            {/* Banner — fills remaining width, same height */}
            <BannerEditor />
          </div>
        </SettingsSection>

        {/* ── Location ── */}
        <SettingsSection
          title="Location"
          icon={<MapPin className="w-4 h-4" />}
          iconColor="green"
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
              />
            </div>
          </div>
        </SettingsSection>

        {/* ── Context (What / Why / Who) ── */}
        <SettingsSection
          title="Context"
          icon={<FileText className="w-4 h-4" />}
          iconColor="orange"
          defaultOpen={false}
        >
          <div className="space-y-6">
            {(["what", "why", "who"] as const).map((field) => {
              const labels: Record<string, { title: string; hint: string }> = {
                what: { title: "What", hint: "What is this space about?" },
                why: { title: "Why", hint: "Why does this space exist?" },
                who: { title: "Who", hint: "Who should join?" },
              };
              const { title, hint } = labels[field];
              return (
                <div key={field} className="space-y-2">
                  <Label>{title}</Label>
                  <div className="prose-editor">
                    <ReactQuill
                      theme="snow"
                      value={formData[field] as string}
                      onChange={(val) => handleQuillChange(field, val)}
                      modules={quillModules}
                      placeholder={hint}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SettingsSection>

        {/* ── Tags ── */}
        <SettingsSection
          title="Tags"
          icon={<Tag className="w-4 h-4" />}
          iconColor="amber"
          defaultOpen={false}
        >
          <div className="space-y-2">
            <div className={cn(
              "flex flex-wrap gap-2 p-3 bg-background border border-input rounded-md",
              "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 min-h-[48px]"
            )}>
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full text-caption font-medium"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                className="flex-1 bg-transparent border-none outline-none text-body min-w-[120px]"
                placeholder="Type a tag and press Enter…"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
            </div>
          </div>
        </SettingsSection>

        {/* ── Classifications ── */}
        <SettingsSection
          title="Classifications"
          icon={<Tags className="w-4 h-4" />}
          iconColor="purple"
          defaultOpen={true}
        >
          <div className="space-y-4">
            <p className="text-caption text-muted-foreground">
              Classify your space with structured vocabularies (e.g. SDGs, Sector) for discoverability and reporting.
            </p>

            {/* Applied Classifications */}
            {classifications.length > 0 && (
              <div className="space-y-3">
                {classifications.map((cls) => (
                  <div
                    key={cls.id}
                    className="border border-border rounded-lg p-4 bg-background"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-purple-100 dark:bg-purple-500/15 flex items-center justify-center shrink-0">
                          <Tags className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h4 className="text-body font-medium leading-tight">{cls.templateName}</h4>
                          <p className="text-[11px] text-muted-foreground">
                            {cls.cardinality === "multi" ? "Multi-select" : "Single-select"} · {cls.selectedValues.length} selected
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <IconButton variant="ghost" tooltipLabel="Options" className="h-7 w-7">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </IconButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {/* edit values */}}>
                            <Pencil className="w-4 h-4 mr-2" /> Edit Values
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setClassifications((prev) => prev.filter((c) => c.id !== cls.id))}
                          >
                            <X className="w-4 h-4 mr-2" /> Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cls.selectedValues.map((val) => (
                        <Badge
                          key={val}
                          variant="secondary"
                          className="text-caption font-normal gap-1 pl-2 pr-1.5 py-0.5"
                        >
                          {val}
                          <button
                            onClick={() => {
                              setClassifications((prev) =>
                                prev.map((c) =>
                                  c.id === cls.id
                                    ? { ...c, selectedValues: c.selectedValues.filter((v) => v !== val) }
                                    : c
                                )
                              );
                            }}
                            className="text-muted-foreground hover:text-foreground ml-0.5"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setClassificationPickerOpen(true)}
              className="gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Classification
            </Button>
          </div>
        </SettingsSection>

        {/* ── References ── */}
        <SettingsSection
          title="References & Links"
          icon={<Link2 className="w-4 h-4" />}
          iconColor="rose"
          defaultOpen={false}
        >
          <div className="space-y-3">
            {formData.references.map((ref, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="grid gap-2 flex-1 sm:grid-cols-2">
                  <Input
                    placeholder="Link Title"
                    value={ref.title}
                    onChange={(e) => updateReference(index, 'title', e.target.value)}
                    className="h-9"
                  />
                  <Input
                    placeholder="URL (https://...)"
                    value={ref.url}
                    onChange={(e) => updateReference(index, 'url', e.target.value)}
                    className="h-9"
                  />
                </div>
                <IconButton
                  variant="ghost"
                  tooltipLabel="Upload"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                  <Upload className="w-4 h-4" />
                </IconButton>
                <IconButton
                  variant="ghost"
                  tooltipLabel="Delete"
                  onClick={() => removeReference(index)}
                  className="h-9 w-9 text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </IconButton>
              </div>
            ))}
            {formData.references.length === 0 && (
              <p className="text-body text-muted-foreground italic">No references added yet.</p>
            )}
            <Button variant="outline" size="sm" onClick={addReference} className="gap-1.5 mt-2">
              <Plus className="w-3.5 h-3.5" /> Add Reference
            </Button>
          </div>
        </SettingsSection>
        </div>

        {/* RIGHT COLUMN - PREVIEW */}
        <div className="hidden xl:block">
          <div className="sticky top-28 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-caption text-muted-foreground uppercase tracking-wider">Preview</h3>
              {isDirty ? (
                <span className="text-caption text-amber-500 flex items-center gap-1.5">
                  Unsaved changes
                </span>
              ) : (
                <span className="text-caption text-success flex items-center gap-1.5">
                  <Check className="w-3 h-3" /> Saved
                </span>
              )}
            </div>

            {/* Preview Card */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="h-28 bg-muted relative">
                <img
                  src="https://images.unsplash.com/photo-1767258274212-bfe8c3ec50e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
                  alt="Preview banner"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-caption">
                    {(formData.name || "U").substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-card-title truncate">{formData.name || "Untitled Space"}</h4>
                    <p className="text-caption text-muted-foreground truncate">{formData.tagline || "No tagline"}</p>
                  </div>
                </div>

                <div
                  className="text-caption text-muted-foreground line-clamp-2 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: formData.what || "<p class='italic'>No description yet...</p>" }}
                />

                <div className="flex flex-wrap gap-1.5">
                  {formData.tags.length > 0 ? formData.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-secondary px-2 py-0.5 rounded text-badge text-secondary-foreground">{tag}</span>
                  )) : (
                    <span className="bg-muted px-2 py-0.5 rounded text-badge text-muted-foreground">No Tags</span>
                  )}
                  {formData.tags.length > 3 && (
                    <span className="bg-muted px-2 py-0.5 rounded text-badge text-muted-foreground">+{formData.tags.length - 3}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-caption text-primary/80 space-y-1.5">
              <p className="font-semibold flex items-center gap-2">
                <Info className="w-3.5 h-3.5" />
                Live Preview
              </p>
              <p>Shows how your space card appears in the "Explore Spaces" directory.</p>
            </div>
          </div>
        </div>
      </div>

      <SaveBar
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />

      {/* Classification Picker Dialog */}
      <ClassificationPickerDialog
        open={classificationPickerOpen}
        onOpenChange={setClassificationPickerOpen}
        onAdd={(cls) => setClassifications((prev) => [...prev, cls])}
        onGoToTemplates={() => {
          // In a real app this would navigate to the Templates tab
          window.location.hash = "";
          const path = window.location.pathname.replace(/\/about$/, "/templates");
          window.history.pushState({}, "", path);
          window.location.reload();
        }}
        existingClassificationIds={classifications.map((c) => c.templateId)}
      />
    </>
  );
}

/* ─── Banner Editor: 3-step upload → crop/height → preview ─── */

const SAMPLE_BANNERS = [
  "https://images.unsplash.com/photo-1690191863988-f685cddde463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80",
];

const BANNER_MIN = 80;
const BANNER_MAX = 256;

function BannerEditor() {
  // Read existing banner settings from localStorage (shared with SpaceHeader)
  const stored = (() => {
    try {
      const raw = localStorage.getItem('alkemio-banner-settings');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();
  const existingBanner = stored?.image || "https://images.unsplash.com/photo-1690191863988-f685cddde463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200";
  const existingHeight = stored?.height || 160;
  const existingCropY = stored?.cropY ?? 30;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(existingBanner);
  const [bannerHeight, setBannerHeight] = useState(existingHeight);
  const [cropY, setCropY] = useState(existingCropY);
  const [savedImage, setSavedImage] = useState<string | null>(existingBanner);
  const [savedHeight, setSavedHeight] = useState(existingHeight);
  const [savedCropY, setSavedCropY] = useState(existingCropY);

  // Crop drag state
  const [isDragging, setIsDragging] = useState<false | "move" | "top" | "bottom">(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartCropY, setDragStartCropY] = useState(0);
  const [dragStartHeight, setDragStartHeight] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleOpenDialog = () => {
    setSelectedImage(savedImage);
    setBannerHeight(savedHeight);
    setCropY(savedCropY);
    setStep(savedImage ? 2 : 1);
    setDialogOpen(true);
  };

  const handleSelectImage = (url: string) => {
    setSelectedImage(url);
    setCropY(30);
    setBannerHeight(160);
    setStep(2);
  };

  const handleSave = () => {
    setSavedImage(selectedImage);
    setSavedHeight(bannerHeight);
    setSavedCropY(cropY);
    // Persist to localStorage so SpaceHeader reads it
    localStorage.setItem('alkemio-banner-settings', JSON.stringify({
      image: selectedImage,
      height: bannerHeight,
      cropY: cropY,
    }));
    setDialogOpen(false);
  };

  // Convert banner height to percentage of the image container (400px reference height)
  const imageDisplayHeight = 400;
  const cropHeightPercent = Math.max(20, Math.min(64, (bannerHeight / BANNER_MAX) * 64));

  const handleMouseDown = (e: React.MouseEvent, mode: "move" | "top" | "bottom") => {
    e.preventDefault();
    setIsDragging(mode);
    setDragStartY(e.clientY);
    setDragStartCropY(cropY);
    setDragStartHeight(bannerHeight);
  };

  React.useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const deltaPercent = ((e.clientY - dragStartY) / rect.height) * 100;

      if (isDragging === "move") {
        const newY = Math.max(0, Math.min(100 - cropHeightPercent, dragStartCropY + deltaPercent));
        setCropY(newY);
      } else if (isDragging === "top") {
        const newY = Math.max(0, dragStartCropY + deltaPercent);
        const heightDelta = (dragStartCropY - newY) / 64 * BANNER_MAX;
        const newHeight = Math.max(BANNER_MIN, Math.min(BANNER_MAX, dragStartHeight + heightDelta));
        setCropY(newY);
        setBannerHeight(Math.round(newHeight));
      } else if (isDragging === "bottom") {
        const heightDelta = deltaPercent / 64 * BANNER_MAX;
        const newHeight = Math.max(BANNER_MIN, Math.min(BANNER_MAX, dragStartHeight + heightDelta));
        setBannerHeight(Math.round(newHeight));
      }
    };
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStartY, dragStartCropY, dragStartHeight, cropHeightPercent]);

  return (
    <>
      {/* Trigger button — shows upload placeholder or saved preview */}
      <button
        type="button"
        onClick={handleOpenDialog}
        className={cn(
          "flex flex-col items-center justify-center gap-3 flex-1 rounded-xl border-2 transition-colors cursor-pointer overflow-hidden relative",
          savedImage
            ? "border-border hover:border-primary/40"
            : "border-dashed border-muted-foreground/25 bg-muted/20 hover:border-primary/40 hover:bg-primary/5"
        )}
        style={{ height: savedImage ? savedHeight : 160 }}
      >
        {savedImage ? (
          <>
            <img src={savedImage} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
              <span className="text-white text-sm font-medium opacity-0 hover:opacity-100 transition-opacity">
                Edit banner
              </span>
            </div>
          </>
        ) : (
          <>
            <Image className="w-10 h-10 text-muted-foreground/50" />
            <div className="text-center">
              <p className="text-body font-medium text-muted-foreground">Banner</p>
              <p className="text-caption text-muted-foreground/70">Click to upload</p>
            </div>
          </>
        )}
      </button>

      {/* Banner editor dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" style={{ color: "var(--primary)" }} />
              {step === 1 ? "Upload Banner Image" : "Adjust Banner"}
            </DialogTitle>
          </DialogHeader>

          {/* Step 1: Choose image (only shown for new uploads or when changing image) */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Choose an image for your space banner, or upload your own.</p>

              {/* Upload area */}
              <label className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 flex flex-col items-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      handleSelectImage(url);
                    }
                  }}
                />
                <Upload className="w-8 h-8 text-muted-foreground/50" />
                <div className="text-center">
                  <p className="text-sm font-medium">Drop an image here or click to browse</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB. Recommended: 1920px wide or larger.</p>
                </div>
              </label>
            </div>
          )}

          {/* Step 2: Interactive crop & height */}
          {step === 2 && selectedImage && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Drag the selection to choose which part of the image to show. Drag the edges to adjust height.</p>

              {/* Crop area — full image with draggable selection box */}
              <div
                ref={containerRef}
                className="relative rounded-lg overflow-hidden border border-border select-none"
                style={{ height: imageDisplayHeight }}
              >
                {/* Full image (dimmed) */}
                <img
                  src={selectedImage}
                  alt="Full image"
                  className="w-full h-full object-cover"
                  style={{ display: "block" }}
                  draggable={false}
                />

                {/* Dark overlay outside crop area */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: `linear-gradient(to bottom, 
                    rgba(0,0,0,0.5) 0%, 
                    rgba(0,0,0,0.5) ${cropY}%, 
                    transparent ${cropY}%, 
                    transparent ${cropY + cropHeightPercent}%, 
                    rgba(0,0,0,0.5) ${cropY + cropHeightPercent}%, 
                    rgba(0,0,0,0.5) 100%)`,
                }} />

                {/* Crop selection box */}
                <div
                  className="absolute left-0 right-0"
                  style={{
                    top: `${cropY}%`,
                    height: `${cropHeightPercent}%`,
                    cursor: isDragging === "move" ? "grabbing" : "grab",
                  }}
                  onMouseDown={(e) => handleMouseDown(e, "move")}
                >
                  {/* Dashed border */}
                  <div className="absolute inset-0 border-2 border-dashed border-white/80 pointer-events-none" />

                  {/* Corner handles */}
                  {[
                    { pos: "top-0 left-0", cursor: "ns-resize", edge: "top" as const },
                    { pos: "top-0 right-0", cursor: "ns-resize", edge: "top" as const },
                    { pos: "bottom-0 left-0", cursor: "ns-resize", edge: "bottom" as const },
                    { pos: "bottom-0 right-0", cursor: "ns-resize", edge: "bottom" as const },
                  ].map(({ pos, cursor, edge }, i) => (
                    <div
                      key={i}
                      className={`absolute ${pos} w-3 h-3 bg-white border border-gray-400 shadow-sm`}
                      style={{ cursor, transform: "translate(-50%, -50%)", zIndex: 10 }}
                      onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, edge); }}
                    />
                  ))}

                  {/* Center edge handles */}
                  <div
                    className="absolute top-0 left-1/2 w-8 h-2 bg-white border border-gray-400 rounded-sm shadow-sm"
                    style={{ cursor: "ns-resize", transform: "translate(-50%, -50%)", zIndex: 10 }}
                    onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, "top"); }}
                  />
                  <div
                    className="absolute bottom-0 left-1/2 w-8 h-2 bg-white border border-gray-400 rounded-sm shadow-sm"
                    style={{ cursor: "ns-resize", transform: "translate(-50%, -50%)", zIndex: 10 }}
                    onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, "bottom"); }}
                  />
                </div>

                {/* Height label */}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none">
                  {bannerHeight}px
                </div>
              </div>

              {/* Preview strip — what the banner will actually look like */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Preview</p>
                <div
                  className="overflow-hidden rounded-lg border border-border"
                  style={{ height: bannerHeight }}
                >
                  <img
                    src={selectedImage}
                    alt="Banner preview"
                    className="w-full object-cover"
                    style={{
                      height: "100%",
                      objectPosition: `center ${cropY + cropHeightPercent / 2}%`,
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                  Change Image
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Check className="w-4 h-4 mr-1.5" />
                  Save Banner
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
