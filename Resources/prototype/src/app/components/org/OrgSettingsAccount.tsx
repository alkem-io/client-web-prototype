import { Layers, Bot, FileBox, Home, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { SettingsSection } from "@/app/components/shared/SettingsSection";

export function OrgSettingsAccount() {
  const hostedSpaces = [
    { id: 1, name: "VNG Realisatie", description: "Collaboration space for VNG Realisatie projects.", image: "https://images.unsplash.com/photo-1690191863988-f685cddde463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
    { id: 2, name: "Demo Space", description: "A demo space for showcasing platform features.", image: "https://images.unsplash.com/photo-1568992688243-52608227497d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
    { id: 3, name: "Dagelijken Gemeenten", description: "Dagelijkse samenwerking voor gemeenten.", image: "https://images.unsplash.com/photo-1623251606108-512c7c4a3507?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
    { id: 4, name: "Open Innovation", description: "Open innovation practices and methodology.", image: "https://images.unsplash.com/photo-1676276376052-dc9c9c0b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
    { id: 5, name: "Community of Practice", description: "A community for practitioners to share experiences.", image: "https://images.unsplash.com/photo-1623652554515-91c833e3080e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
    { id: 6, name: "Digital Autonomy", description: "The European Landscape for digital autonomy.", image: "https://images.unsplash.com/photo-1735639013995-086e648eaa38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
  ];

  const virtualContributors = [
    { id: 1, name: "Design contestexplorer", description: "AI agent for contest analysis." },
    { id: 2, name: "Whitepaper summarizer 0l", description: "Summarizes whitepapers." },
    { id: 3, name: "Data Research Explorer", description: "Research data explorer." },
    { id: 4, name: "Meeting Scheduler", description: "Assists with meeting planning." },
  ];

  const templatePacks = [
    { id: 1, name: "ALK Kennis energie Groene", description: "Template pack for green energy." },
    { id: 2, name: "Samenleveling Realisatie-bou0", description: "Realisatie templates." },
  ];

  const customHomepages = [
    { id: 1, name: "VNG Innovation Hub", description: "Open innovatiehub voor samenwerking.", slug: "vng-innovation-hub" },
    { id: 2, name: "Alkemio Knobi", description: "Knowledge base homepage.", slug: "alkemio-knobi" },
    { id: 3, name: "Energy Transition Hub", description: "Energy transition resources.", slug: "energy-hub" },
  ];

  return (
    <div className="space-y-6">
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
          <button className="flex flex-col items-center justify-center min-h-[180px] rounded-lg border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all group">
            <div className="w-10 h-10 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-2 transition-colors">
              <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
            </div>
            <span className="text-caption text-muted-foreground group-hover:text-primary">Create Space</span>
          </button>
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
              <h4 className="text-body-emphasis">{vc.name}</h4>
              <p className="text-caption text-muted-foreground line-clamp-2">{vc.description}</p>
            </div>
          ))}
          <button className="flex flex-col items-center justify-center min-h-[100px] rounded-lg border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all group p-4">
            <div className="w-9 h-9 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-2 transition-colors">
              <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </div>
            <span className="text-caption text-muted-foreground group-hover:text-primary">Add VC</span>
          </button>
        </div>
      </SettingsSection>

      {/* Template Packs */}
      <SettingsSection title="Template Packs" icon={<FileBox className="w-4 h-4" />} iconColor="orange" defaultOpen={false}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templatePacks.map((pack) => (
            <div key={pack.id} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border bg-muted/10 group hover:border-primary/40 transition-colors text-center min-h-[100px]">
              <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <FileBox className="w-4 h-4" />
              </div>
              <h4 className="text-body-emphasis">{pack.name}</h4>
              <p className="text-caption text-muted-foreground line-clamp-2">{pack.description}</p>
            </div>
          ))}
          <button className="flex flex-col items-center justify-center min-h-[100px] rounded-lg border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all group p-4">
            <div className="w-9 h-9 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-2 transition-colors">
              <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </div>
            <span className="text-caption text-muted-foreground group-hover:text-primary">Add Pack</span>
          </button>
        </div>
      </SettingsSection>

      {/* Custom Homepages */}
      <SettingsSection title="Custom Homepages" icon={<Home className="w-4 h-4" />} iconColor="rose" defaultOpen={false}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customHomepages.map((hp) => (
            <div key={hp.id} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border bg-muted/10 group hover:border-primary/40 transition-colors text-center min-h-[100px]">
              <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Home className="w-4 h-4" />
              </div>
              <h4 className="text-body-emphasis">{hp.name}</h4>
              <p className="text-caption text-muted-foreground line-clamp-2">{hp.description}</p>
            </div>
          ))}
          <button className="flex flex-col items-center justify-center min-h-[100px] rounded-lg border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all group p-4">
            <div className="w-9 h-9 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-2 transition-colors">
              <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </div>
            <span className="text-caption text-muted-foreground group-hover:text-primary">Add Homepage</span>
          </button>
        </div>
      </SettingsSection>
    </div>
  );
}
