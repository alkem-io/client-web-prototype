import { useState } from "react";
import { CreditCard, Layers, Bot, FileBox, Home, AlertTriangle, Plus, MoreVertical, Settings } from "lucide-react";
import { Badge } from "@/crd/primitives/badge";
import { Button } from "@/crd/primitives/button";
import { Card, CardContent, CardHeader } from "@/crd/primitives/card";
import { SettingsSection } from "@/app/components/shared/SettingsSection";
import { Link } from "react-router";

export function UserSettingsAccount() {
  const [showCreateSpace, setShowCreateSpace] = useState(false);

  // Mock data
  const hostedSpaces = [
    { id: 1, name: "Green Energy Space Alpha", description: "Central collaborative workspace for the Q1 innovation sprint.", image: "https://images.unsplash.com/photo-1765728617352-895327fcf036?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
    { id: 2, name: "Design System Workshop", description: "A dedicated room for auditing and updating our design tokens.", image: "https://images.unsplash.com/photo-1568992688243-52608227497d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
    { id: 3, name: "Remote Team Lounge", description: "Casual hangout space for distributed team members.", image: "https://images.unsplash.com/photo-1623251606108-512c7c4a3507?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
  ];

  const virtualContributors = [
    { id: 1, name: "Research Assistant Bot", description: "AI agent for summarizing lengthy documents." },
    { id: 2, name: "Data Visualizer", description: "Generates charts from CSV uploads." },
  ];

  const templatePacks = [
    { id: 1, name: "Agile Sprint Pack", description: "Complete set of templates for agile ceremonies." },
  ];

  const customHomepages = [
    { id: 1, name: "VNG Innovation Hub", slug: "vng-innovation-hub", description: "Open innovatiehub voor samenwerking." },
  ];

  const capacity = { spaces: 5, virtualContributors: 3, templatePacks: 3, customHomepages: 2 };

  return (
    <div className="space-y-6">
      {/* License */}
      <SettingsSection title="License" icon={<CreditCard className="w-4 h-4" />} iconColor="blue">
        <div className="flex items-center justify-between gap-4 p-4 rounded-lg border bg-muted/20">
          <div>
            <p className="text-body-emphasis">Free Plan</p>
            <p className="text-caption text-muted-foreground">Basic access · 5 Spaces · 3 VCs · 3 Template Packs · 2 Homepages</p>
          </div>
          <Badge variant="secondary">Active</Badge>
        </div>
      </SettingsSection>

      {/* Hosted Spaces */}
      <SettingsSection title="Hosted Spaces" icon={<Layers className="w-4 h-4" />} iconColor="purple">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hostedSpaces.map((space) => (
            <Card key={space.id} className="group overflow-hidden flex flex-col hover:border-primary/50 transition-colors">
              <div className="aspect-video bg-muted overflow-hidden">
                <img src={space.image} alt={space.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <CardHeader className="p-3 pb-1">
                <h4 className="text-body-emphasis truncate group-hover:text-primary transition-colors">{space.name}</h4>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="text-caption text-muted-foreground line-clamp-2">{space.description}</p>
              </CardContent>
            </Card>
          ))}
          {/* Empty slots */}
          {Array.from({ length: capacity.spaces - hostedSpaces.length }).map((_, i) => (
            <button key={`slot-${i}`} className="flex flex-col items-center justify-center min-h-[180px] rounded-lg border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all group">
              <div className="w-10 h-10 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-2 transition-colors">
                <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              </div>
              <span className="text-caption text-muted-foreground group-hover:text-primary">Create Space</span>
            </button>
          ))}
        </div>
      </SettingsSection>

      {/* Virtual Contributors */}
      <SettingsSection title="Virtual Contributors" icon={<Bot className="w-4 h-4" />} iconColor="green" defaultOpen={false}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {virtualContributors.map((vc) => (
            <div key={vc.id} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border bg-muted/10 group hover:border-primary/40 transition-colors text-center min-h-[100px]">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-body-emphasis truncate">{vc.name}</p>
                <p className="text-caption text-muted-foreground line-clamp-2">{vc.description}</p>
              </div>
            </div>
          ))}
          {/* Empty slots */}
          {Array.from({ length: capacity.virtualContributors - virtualContributors.length }).map((_, i) => (
            <button key={`vc-slot-${i}`} className="flex flex-col items-center justify-center min-h-[100px] rounded-lg border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all group">
              <div className="w-9 h-9 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-1.5 transition-colors">
                <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <span className="text-caption text-muted-foreground group-hover:text-primary">Add Contributor</span>
            </button>
          ))}
        </div>
      </SettingsSection>

      {/* Template Packs */}
      <SettingsSection title="Template Packs" icon={<FileBox className="w-4 h-4" />} iconColor="amber" defaultOpen={false}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templatePacks.map((pack) => (
            <div key={pack.id} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border bg-muted/10 group hover:border-primary/40 transition-colors text-center min-h-[100px]">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <FileBox className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-body-emphasis truncate">{pack.name}</p>
                <p className="text-caption text-muted-foreground line-clamp-2">{pack.description}</p>
              </div>
            </div>
          ))}
          {/* Empty slots */}
          {Array.from({ length: capacity.templatePacks - templatePacks.length }).map((_, i) => (
            <button key={`pack-slot-${i}`} className="flex flex-col items-center justify-center min-h-[100px] rounded-lg border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all group">
              <div className="w-9 h-9 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-1.5 transition-colors">
                <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <span className="text-caption text-muted-foreground group-hover:text-primary">New Pack</span>
            </button>
          ))}
        </div>
      </SettingsSection>

      {/* Custom Homepages */}
      <SettingsSection title="Custom Homepages" icon={<Home className="w-4 h-4" />} iconColor="orange" defaultOpen={false}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customHomepages.map((page) => (
            <div key={page.id} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border bg-muted/10 group hover:border-primary/40 transition-colors text-center min-h-[100px]">
              <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Home className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-body-emphasis truncate">{page.name}</p>
                <p className="text-caption text-muted-foreground line-clamp-2">{page.description}</p>
              </div>
            </div>
          ))}
          {/* Empty slots */}
          {Array.from({ length: capacity.customHomepages - customHomepages.length }).map((_, i) => (
            <button key={`hp-slot-${i}`} className="flex flex-col items-center justify-center min-h-[100px] rounded-lg border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all group">
              <div className="w-9 h-9 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-1.5 transition-colors">
                <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <span className="text-caption text-muted-foreground group-hover:text-primary">Create Homepage</span>
            </button>
          ))}
        </div>
      </SettingsSection>

      {/* Danger Zone */}
      <SettingsSection title="Danger Zone" icon={<AlertTriangle className="w-4 h-4" />} iconColor="rose" defaultOpen={false}>
        <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-destructive/20 bg-destructive/5">
          <div>
            <p className="text-body-emphasis">Delete Account</p>
            <p className="text-caption text-muted-foreground">Permanently remove your account and all data</p>
          </div>
          <Button variant="destructive" size="sm">Delete</Button>
        </div>
      </SettingsSection>
    </div>
  );
}
