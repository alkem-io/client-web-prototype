import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Building2, FileText, MapPin, Tag, Link2, Bookmark, Upload, Globe, X, Plus, Trash2 } from "lucide-react";
import { SaveBar } from "@/app/components/shared/SaveBar";
import { UnsavedChangesGuard } from "@/app/components/shared/UnsavedChangesGuard";
import { SettingsSection } from "@/app/components/shared/SettingsSection";

interface OrgData {
  name: string;
  initials: string;
  avatarColor: string;
  logo?: string;
}

const INITIAL_DATA = {
  displayName: "Sandbox Organization",
  nameId: "faciliterende-organisatie",
  tagline: "For demonstration purposes",
  description: "<p>This Alkemio sandbox organization will be used for demonstration Spaces, Virtual Contributors and Innovation Packs for various use cases or sectors.</p>",
  city: "",
  country: "-",
  keywords: ["demo", "sandbox", "showcase", "examples"],
  website: "",
  references: [] as { title: string; url: string; description: string }[],
};

interface OrgSettingsProfileProps {
  org: OrgData;
}

export function OrgSettingsProfile({ org }: OrgSettingsProfileProps) {
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [savedData, setSavedData] = useState(INITIAL_DATA);
  const [keywordInput, setKeywordInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = JSON.stringify(formData) !== JSON.stringify(savedData);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      if (!formData.keywords.includes(keywordInput.trim())) {
        setFormData((prev) => ({ ...prev, keywords: [...prev.keywords, keywordInput.trim()] }));
      }
      setKeywordInput("");
    }
  };

  const removeKeyword = (value: string) => {
    setFormData((prev) => ({ ...prev, keywords: prev.keywords.filter((v) => v !== value) }));
  };

  const addReference = () => {
    setFormData((prev) => ({
      ...prev,
      references: [...prev.references, { title: "", url: "", description: "" }],
    }));
  };

  const updateReference = (index: number, field: "title" | "url" | "description", value: string) => {
    const newRefs = [...formData.references];
    newRefs[index] = { ...newRefs[index], [field]: value };
    setFormData((prev) => ({ ...prev, references: newRefs }));
  };

  const removeReference = (index: number) => {
    setFormData((prev) => ({ ...prev, references: prev.references.filter((_, i) => i !== index) }));
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "blockquote", "code-block"],
      ["clean"],
    ],
  };

  return (
    <>
      <UnsavedChangesGuard isDirty={isDirty} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main form column */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Identity */}
          <SettingsSection title="Identity" icon={<Building2 className="w-4 h-4" />} iconColor="blue">
            <div className="space-y-4">
              <div>
                <label className="text-body-emphasis block mb-1.5">Display Name</label>
                <Input name="displayName" value={formData.displayName} onChange={handleChange} className="w-full" />
                <p className="text-caption text-muted-foreground mt-1">How your organisation appears across Alkemio.</p>
              </div>
              <div>
                <label className="text-body-emphasis block mb-1.5">Name ID</label>
                <Input name="nameId" value={formData.nameId} readOnly className="w-full bg-muted/30 text-muted-foreground cursor-not-allowed" />
                <p className="text-caption text-muted-foreground mt-1">Cannot be changed after creation.</p>
              </div>
              <div>
                <label className="text-body-emphasis block mb-1.5">Tagline</label>
                <Input name="tagline" value={formData.tagline} onChange={handleChange} placeholder="A short line shown next to your organisation name." className="w-full" />
                <p className="text-caption text-muted-foreground mt-1">A short line shown next to your organisation name.</p>
              </div>
            </div>
          </SettingsSection>

          {/* About */}
          <SettingsSection title="About" icon={<FileText className="w-4 h-4" />} iconColor="green">
            <div className="space-y-6">
              {/* Description */}
              <div>
                <label className="text-body-emphasis block mb-1.5">Description</label>
                <div className="[&_.ql-toolbar.ql-snow]:rounded-t-lg [&_.ql-container.ql-snow]:rounded-b-lg">
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={(val) => setFormData((prev) => ({ ...prev, description: val }))}
                    modules={quillModules}
                    className="bg-background"
                  />
                </div>
                <p className="text-caption text-muted-foreground mt-1">Markdown supported.</p>
              </div>

              {/* Location */}
              <div>
                <label className="text-body-emphasis block mb-1.5">Location</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-caption text-muted-foreground block mb-1">City</label>
                    <Input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
                  </div>
                  <div>
                    <label className="text-caption text-muted-foreground block mb-1">Country</label>
                    <Input name="country" value={formData.country} onChange={handleChange} placeholder="-" />
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="text-body-emphasis block mb-1.5">Keywords</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.keywords.map((kw) => (
                    <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-caption bg-amber-100 text-amber-700">
                      {kw}
                      <button type="button" onClick={() => removeKeyword(kw)} className="hover:text-destructive transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleAddKeyword}
                  placeholder="Press Enter to add a keyword"
                  className="w-full"
                />
              </div>

              {/* Website */}
              <div>
                <label className="text-body-emphasis block mb-1.5">Website</label>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Input name="website" value={formData.website} onChange={handleChange} placeholder="https://your-organization.com" className="flex-1" />
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* References — collapsed */}
          <SettingsSection title="References" icon={<Bookmark className="w-4 h-4" />} iconColor="rose" defaultOpen={false}>
            <div className="space-y-4">
              {formData.references.map((ref, idx) => (
                <div key={idx} className="p-4 border rounded-lg space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeReference(idx)}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Input
                    value={ref.title}
                    onChange={(e) => updateReference(idx, "title", e.target.value)}
                    placeholder="Title"
                  />
                  <Input
                    value={ref.url}
                    onChange={(e) => updateReference(idx, "url", e.target.value)}
                    placeholder="URL"
                  />
                  <Input
                    value={ref.description}
                    onChange={(e) => updateReference(idx, "description", e.target.value)}
                    placeholder="Description (optional)"
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addReference}>
                <Plus className="w-4 h-4 mr-2" /> Add Reference
              </Button>
            </div>
          </SettingsSection>
        </div>

        {/* Sidebar — Logo card */}
        <div className="w-full lg:w-72 shrink-0 space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-subsection-title font-semibold mb-4">Logo</h3>
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-28 h-28 rounded-xl flex items-center justify-center text-white text-3xl font-bold"
                style={{ backgroundColor: org.avatarColor }}
              >
                {org.initials}
              </div>
              <p className="text-body font-medium">{formData.displayName}</p>
              <p className="text-caption text-muted-foreground">Not Verified</p>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" /> Change Logo
              </Button>
              <p className="text-caption text-muted-foreground text-center">Recommended: 400×400px. JPG, PNG or GIF.</p>
            </div>
          </div>
        </div>
      </div>

      <SaveBar isDirty={isDirty} isSaving={isSaving} onSave={handleSave} onDiscard={handleDiscard} />
    </>
  );
}
