import React, { useState } from "react";
import { Input } from "@/crd/primitives/input";
import { Button } from "@/crd/primitives/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/crd/primitives/avatar";
import { X, Plus, User, FileText, MapPin, Tag, Lightbulb, Link2, Bookmark, Upload, Globe, Mail, Phone, Trash2 } from "lucide-react";
// lucide v1 dropped its brand glyphs; production ships its own social SVGs.
import GitHubIcon from "@/crd/components/common/icons/social/GitHub.svg?react";
import LinkedInIcon from "@/crd/components/common/icons/social/LinkedIn.svg?react";
import { SaveBar } from "@/app/components/shared/SaveBar";
import { UnsavedChangesGuard } from "@/app/components/shared/UnsavedChangesGuard";
import { SettingsSection } from "@/app/components/shared/SettingsSection";
import { MarkdownEditor } from '@/crd/forms/markdown/MarkdownEditor';

const INITIAL_DATA = {
  displayName: "Jeroen Nijkamp",
  firstName: "Jeroen",
  lastName: "Nijkamp",
  email: "jeroen@alkem.io",
  phone: "0648194047",
  tagline: "Tagline",
  bio: "<p>UX Product Owner | UX/UI Designer | Conceptualized | AI Usability | Blockchain/eNova | Innovator | Researcher | Amateur Musician | Team Player</p>",
  city: "Escarnp",
  country: "NL (11838 Anc0)",
  skills: ["UX research", "TypeScript", "facilitation"],
  keywords: ["climate", "governance", "open source"],
  links: {
    linkedin: "https://linkedin.com/in/your-handle",
    twitter: "https://bsky.app/profile/your-handle",
    github: "https://github.com/your-handle"
  },
  references: [
    { title: "My Twitter", url: "https://x.com/alkemio_jeroen", description: "Because nobody uses blue sky" },
  ]
};

export function UserSettingsProfile() {
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [savedData, setSavedData] = useState(INITIAL_DATA);
  const [skillInput, setSkillInput] = useState("");
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

  const handleAddChip = (
    field: "skills" | "keywords",
    input: string,
    setInput: (v: string) => void
  ) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!formData[field].includes(input.trim())) {
        setFormData((prev) => ({ ...prev, [field]: [...prev[field], input.trim()] }));
      }
      setInput("");
    }
  };

  const removeChip = (field: "skills" | "keywords", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: prev[field].filter((v) => v !== value) }));
  };

  const handleLinkChange = (key: keyof typeof formData.links, value: string) => {
    setFormData((prev) => ({ ...prev, links: { ...prev.links, [key]: value } }));
  };

  const addReference = () => {
    setFormData((prev) => ({
      ...prev,
      references: [...prev.references, { title: "", url: "", description: "" }]
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

  return (
    <>
      <UnsavedChangesGuard isDirty={isDirty} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main form column */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Identity — open by default */}
          <SettingsSection title="Identity" icon={<User className="w-4 h-4" />} iconColor="blue">
            <div className="space-y-4">
              <div>
                <label className="text-body-emphasis block mb-1.5">Display Name</label>
                <Input name="displayName" value={formData.displayName} onChange={handleChange} className="w-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-body-emphasis block mb-1.5">First Name</label>
                  <Input name="firstName" value={formData.firstName} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-body-emphasis block mb-1.5">Last Name</label>
                  <Input name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-body-emphasis block mb-1.5">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                    <Input value={formData.email} readOnly className="flex-1 bg-muted/30 text-muted-foreground cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <label className="text-body-emphasis block mb-1.5">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                    <Input name="phone" value={formData.phone} onChange={handleChange} className="flex-1" />
                  </div>
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* About You — collapsed */}
          <SettingsSection title="About You" icon={<FileText className="w-4 h-4" />} iconColor="green" defaultOpen={false}>
            <div className="space-y-6">
              <div>
                <label className="text-body-emphasis block mb-1.5">Tagline</label>
                <Input name="tagline" value={formData.tagline} onChange={handleChange} placeholder="A short line shown on your profile" className="w-full" />
              </div>

              {/* Location */}
              <div>
                <label className="text-body-emphasis block mb-1.5">Location</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
                  <Input name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="text-body-emphasis block mb-1.5">Bio</label>
                <div>
                  <MarkdownEditor
                    value={formData.bio}
                    onChange={(val) => setFormData((prev) => ({ ...prev, bio: val }))}
                    className="bg-background"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="text-body-emphasis block mb-1.5">Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-caption bg-primary/10 text-primary">
                      {skill}
                      <button type="button" onClick={() => removeChip("skills", skill)} className="hover:text-destructive transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddChip("skills", skillInput, setSkillInput)}
                  placeholder="e.g. UX research, TypeScript, facilitation"
                  className="w-full"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="text-body-emphasis block mb-1.5">Keywords</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.keywords.map((kw) => (
                    <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-caption bg-amber-100 text-amber-700">
                      {kw}
                      <button type="button" onClick={() => removeChip("keywords", kw)} className="hover:text-destructive transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleAddChip("keywords", keywordInput, setKeywordInput)}
                  placeholder="e.g. climate, governance, open source"
                  className="w-full"
                />
              </div>
            </div>
          </SettingsSection>

          {/* Social Links — collapsed */}
          <SettingsSection title="Social Links" icon={<Link2 className="w-4 h-4" />} iconColor="blue" defaultOpen={false}>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <LinkedInIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                <Input value={formData.links.linkedin} onChange={(e) => handleLinkChange("linkedin", e.target.value)} placeholder="https://linkedin.com/in/your-handle" className="flex-1" />
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                <Input value={formData.links.twitter} onChange={(e) => handleLinkChange("twitter", e.target.value)} placeholder="https://bsky.app/profile/your-handle" className="flex-1" />
              </div>
              <div className="flex items-center gap-3">
                <GitHubIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                <Input value={formData.links.github} onChange={(e) => handleLinkChange("github", e.target.value)} placeholder="https://github.com/your-handle" className="flex-1" />
              </div>
            </div>
          </SettingsSection>

          {/* References — collapsed */}
          <SettingsSection title="References" icon={<Bookmark className="w-4 h-4" />} iconColor="rose" defaultOpen={false}>
            <div className="space-y-4">
              {formData.references.map((ref, idx) => (
                <div key={idx} className="p-3 rounded-lg border bg-muted/10 space-y-2">
                  <div className="flex items-center gap-3">
                    <Input value={ref.title} onChange={(e) => updateReference(idx, "title", e.target.value)} placeholder="Title" className="flex-1" />
                    <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeReference(idx)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <Input value={ref.url} onChange={(e) => updateReference(idx, "url", e.target.value)} placeholder="https://..." className="flex-1" />
                  </div>
                  <Input value={ref.description} onChange={(e) => updateReference(idx, "description", e.target.value)} placeholder="Description (optional)" className="w-full" />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addReference}>
                <Plus className="w-4 h-4 mr-1.5" />
                Add reference
              </Button>
            </div>
          </SettingsSection>
        </div>

        {/* Sidebar — Profile Picture card */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="rounded-lg border bg-card p-6 flex flex-col items-center gap-4 sticky top-40">
            <div className="flex items-center gap-2 self-start mb-2">
              <div className="w-7 h-7 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center">
                <User className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-card-title font-semibold">Profile Picture</h3>
            </div>
            <Avatar className="w-24 h-24">
              <AvatarImage
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt={formData.displayName}
              />
              <AvatarFallback className="text-page-title bg-primary text-primary-foreground">JN</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-body-emphasis">{formData.displayName}</p>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Change Avatar
            </Button>
            <p className="text-caption text-muted-foreground text-center">Recommended: 400×400px<br />JPG, PNG or GIF</p>
          </div>
        </div>
      </div>

      <SaveBar isDirty={isDirty} isSaving={isSaving} onSave={handleSave} onDiscard={handleDiscard} />
    </>
  );
}
