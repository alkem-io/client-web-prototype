import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/app/components/ui/button";
import { IconButton } from "@/app/components/ui/icon-button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { X, Plus, Type, MapPin, Image, FileText, Tag, Link2, Info, Check, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { SaveBar } from "@/app/components/shared/SaveBar";
import { UnsavedChangesGuard } from "@/app/components/shared/UnsavedChangesGuard";
import { SettingsSection } from "@/app/components/shared/SettingsSection";

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
    JSON.stringify(formData.references) !== JSON.stringify(savedData.references);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setSavedData({ ...formData });
      setIsSaving(false);
    }, 800);
  };

  const handleDiscard = () => {
    setFormData({ ...savedData });
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
            <button
              type="button"
              className="flex flex-col items-center justify-center gap-3 flex-1 h-40 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/20 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <Image className="w-10 h-10 text-muted-foreground/50" />
              <div className="text-center">
                <p className="text-body font-medium text-muted-foreground">Banner</p>
                <p className="text-caption text-muted-foreground/70">1920 × 400px</p>
              </div>
            </button>
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
    </>
  );
}
