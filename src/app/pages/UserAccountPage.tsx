import { useParams, Link } from "react-router";
import { Plus, MoreVertical, Layout, Bot, FileBox, Home, Settings, CreditCard, Users, Bell, User } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CreateSpaceDialogV3 } from "@/app/components/dialogs/CreateSpaceDialogV3";
import { CreateVCDialogV3 } from "@/app/components/dialogs/CreateVCDialogV3";
import { CreateTemplatePackDialogV3 } from "@/app/components/dialogs/CreateTemplatePackDialogV3";
import { CreateInnovationHubDialogV3 } from "@/app/components/dialogs/CreateInnovationHubDialogV3";

export default function UserAccountPage() {
  const { userSlug } = useParams<{ userSlug: string }>();
  const slug = userSlug || "user";
  const [showCreateSpace, setShowCreateSpace] = useState(false);
  const [showCreateVC, setShowCreateVC] = useState(false);
  const [showCreateTemplatePack, setShowCreateTemplatePack] = useState(false);
  const [showCreateHub, setShowCreateHub] = useState(false);

  // Navigation Tabs
  const tabs = [
    { label: "MY PROFILE", href: `/user/${slug}/settings/profile`, icon: User },
    { label: "ACCOUNT", href: `/user/${slug}/settings/account`, active: true, icon: Layout },
    { label: "MEMBERSHIP", href: `/user/${slug}/settings/membership`, icon: CreditCard },
    { label: "ORGANIZATIONS", href: `/user/${slug}/settings/organizations`, icon: Users },
    { label: "NOTIFICATIONS", href: `/user/${slug}/settings/notifications`, icon: Bell },
    { label: "SETTINGS", href: `/user/${slug}/settings/general`, icon: Settings },
  ];

  // Mock Data: Hosted Spaces
  const hostedSpaces = [
    {
      id: 1,
      name: "Green Energy Space Alpha",
      description: "Central collaborative workspace for the Q1 innovation sprint.",
      image: "https://images.unsplash.com/photo-1765728617352-895327fcf036?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBjb2xsYWJvcmF0aW9uJTIwc3BhY2V8ZW58MXx8fHwxNzY5MTczMjEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 2,
      name: "Design System Workshop",
      description: "A dedicated room for auditing and updating our design tokens.",
      image: "https://images.unsplash.com/photo-1568992688243-52608227497d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMG1lZXRpbmd8ZW58MXx8fHwxNzY5MTczMjEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 3,
      name: "Remote Team Lounge",
      description: "Casual hangout space for distributed team members.",
      image: "https://images.unsplash.com/photo-1623251606108-512c7c4a3507?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbm9tYWQlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzY5MTczMjEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    }
  ];

  // Mock Data: Virtual Contributors
  const virtualContributors = [
    {
      id: 1,
      name: "Research Assistant Bot",
      description: "AI agent specialized in summarizing lengthy documents and reports.",
    },
    {
      id: 2,
      name: "Data Visualizer",
      description: "Automatically generates charts from CSV uploads.",
    }
  ];

  // Mock Data: Template Packs
  const templatePacks = [
    {
      id: 1,
      name: "Agile Sprint Pack",
      description: "Complete set of templates for running agile ceremonies.",
    }
  ];

  // Mock Data: Custom Homepages
  const customHomepages = []; // Empty state example

  // Account capacity limits
  const capacity = {
    spaces: 5,
    virtualContributors: 3,
    templatePacks: 3,
    customHomepages: 2,
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header / Navigation Area */}
      <div className="sticky top-16 z-20 border-b border-border bg-card">
        <div className="px-6 md:px-8 pt-8 pb-0">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-start-2 lg:col-span-10">
          <div className="flex items-center gap-4 mb-8">
            <Avatar className="w-12 h-12 shrink-0">
              <AvatarImage
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Jeroen Nijkamp"
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-card-title font-bold">JN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-page-title">Jeroen Nijkamp</h1>
            </div>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <Link
                key={tab.label}
                to={tab.href}
                className={cn(
                  "flex items-center gap-2 pb-4 text-control border-b-2 transition-colors whitespace-nowrap",
                  tab.active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Link>
            ))}
          </div>
          </div>
        </div>
        </div>
      </div>

      <div className="px-6 md:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-start-2 lg:col-span-10 space-y-12">
        {/* Help Text */}
        <div className="flex items-center gap-2 p-4 bg-primary/5 border border-primary/20 rounded-lg text-body text-primary/80 max-w-3xl">
          <Layout className="w-4 h-4" />
          <p>Here you can view your active resources and manage your account allocation limits.</p>
        </div>

        {/* Section: Hosted Spaces */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-section-title font-bold flex items-center gap-2">
              Hosted Spaces
              <Badge variant="secondary" className="ml-2 font-normal text-caption">
                {hostedSpaces.length}/{capacity.spaces} Used
              </Badge>
            </h2>
            <Button size="sm" onClick={() => setShowCreateSpace(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Space
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostedSpaces.map((space) => (
              <Card key={space.id} className="group overflow-hidden flex flex-col h-full border-border hover:border-primary/50 transition-colors">
                <div className="relative aspect-video bg-muted overflow-hidden">
                  <img 
                    src={space.image} 
                    alt={space.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                  </div>
                </div>
                <CardHeader className="p-4 pb-2">
                  <h3 className="text-subsection-title group-hover:text-primary transition-colors">
                    {space.name}
                  </h3>
                </CardHeader>
                <CardContent className="p-4 pt-2 flex-grow">
                  <p className="text-body text-muted-foreground line-clamp-2">
                    {space.description}
                  </p>
                </CardContent>
              </Card>
            ))}
            
            {/* Empty slots for remaining capacity */}
            {Array.from({ length: capacity.spaces - hostedSpaces.length }).map((_, i) => (
              <button key={`empty-space-${i}`} onClick={() => setShowCreateSpace(true)} className="flex flex-col items-center justify-center h-full min-h-[280px] rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all group bg-muted/5">
                <div className="h-12 w-12 rounded-full bg-muted group-hover:bg-background flex items-center justify-center mb-4 transition-colors shadow-sm">
                  <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                </div>
                <h3 className="text-subsection-title text-foreground group-hover:text-primary transition-colors">Create New Space</h3>
              </button>
            ))}
          </div>
        </section>

        {/* Section: Virtual Contributors */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-section-title font-bold flex items-center gap-2">
              Virtual Contributors
              <Badge variant="secondary" className="ml-2 font-normal text-caption">
                {virtualContributors.length}/{capacity.virtualContributors} Used
              </Badge>
            </h2>
            <Button size="sm" variant="outline" onClick={() => setShowCreateVC(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Contributor
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {virtualContributors.map((vc) => (
              <Card key={vc.id} className="group overflow-hidden flex flex-col h-full hover:border-primary/50 transition-colors">
                <CardHeader className="p-5 pb-2 flex flex-row items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-subheader font-semibold group-hover:text-primary transition-colors truncate">
                      {vc.name}
                    </h3>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2 text-muted-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-5 pt-2 flex-grow">
                  <p className="text-body text-muted-foreground">
                    {vc.description}
                  </p>
                </CardContent>
              </Card>
            ))}
            
            {/* Empty slots for remaining capacity */}
            {Array.from({ length: capacity.virtualContributors - virtualContributors.length }).map((_, i) => (
              <button key={`empty-vc-${i}`} onClick={() => setShowCreateVC(true)} className="flex flex-col items-center justify-center h-full min-h-[160px] rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all group">
                <div className="h-10 w-10 rounded-full bg-muted group-hover:bg-background flex items-center justify-center mb-3 transition-colors">
                  <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                </div>
                <span className="text-control text-muted-foreground group-hover:text-primary">Create New Contributor</span>
              </button>
            ))}
          </div>
        </section>

          {/* Section: Template Packs */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-section-title font-bold flex items-center gap-2">
                Template Packs
                <Badge variant="secondary" className="ml-2 font-normal text-caption">
                  {templatePacks.length}/{capacity.templatePacks} Used
                </Badge>
              </h2>
              <Button size="sm" variant="outline" onClick={() => setShowCreateTemplatePack(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Pack
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {templatePacks.map((pack) => (
                <Card key={pack.id} className="group overflow-hidden flex flex-col h-full hover:border-primary/50 transition-colors">
                  <CardHeader className="p-5 pb-2 flex flex-row items-start gap-4">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'color-mix(in srgb, var(--chart-2) 15%, transparent)', color: 'var(--chart-2)' }}>
                      <FileBox className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-subheader font-semibold group-hover:text-primary transition-colors truncate">{pack.name}</h3>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2 text-muted-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-5 pt-2 flex-grow">
                    <p className="text-body text-muted-foreground">{pack.description}</p>
                  </CardContent>
                </Card>
               ))}
               
               {/* Empty slots for remaining capacity */}
               {Array.from({ length: capacity.templatePacks - templatePacks.length }).map((_, i) => (
                 <button key={`empty-pack-${i}`} onClick={() => setShowCreateTemplatePack(true)} className="flex flex-col items-center justify-center h-full min-h-[160px] rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all group">
                   <div className="h-10 w-10 rounded-full bg-muted group-hover:bg-background flex items-center justify-center mb-3 transition-colors">
                     <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                   </div>
                   <span className="text-control text-muted-foreground group-hover:text-primary">Create New Pack</span>
                 </button>
               ))}
            </div>
          </section>

          {/* Section: Custom Homepages */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-section-title font-bold flex items-center gap-2">
                Custom Homepages
                <Badge variant="secondary" className="ml-2 font-normal text-caption">
                  {customHomepages.length}/{capacity.customHomepages} Used
                </Badge>
              </h2>
              <Button size="sm" variant="outline" onClick={() => setShowCreateHub(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Page
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customHomepages.length > 0 ? (
                customHomepages.map((page: any) => (
                  <Card key={page.id} className="group overflow-hidden flex flex-col h-full hover:border-primary/50 transition-colors">
                    <CardHeader className="p-5 pb-2 flex flex-row items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Layout className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-subheader font-semibold group-hover:text-primary transition-colors truncate">{page.name}</h3>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              ) : null}
              
              {/* Empty slots for remaining capacity */}
              {Array.from({ length: capacity.customHomepages - customHomepages.length }).map((_, i) => (
                <button key={`empty-homepage-${i}`} onClick={() => setShowCreateHub(true)} className="flex flex-col items-center justify-center h-full min-h-[160px] rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all group">
                  <div className="h-10 w-10 rounded-full bg-muted group-hover:bg-background flex items-center justify-center mb-3 transition-colors">
                    <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <span className="text-control text-muted-foreground group-hover:text-primary">Create Homepage</span>
                </button>
              ))}
            </div>
          </section>
        </div>
        </div>
      </div>

      <CreateSpaceDialogV3 open={showCreateSpace} onOpenChange={setShowCreateSpace} />
      <CreateVCDialogV3 open={showCreateVC} onOpenChange={setShowCreateVC} />
      <CreateTemplatePackDialogV3 open={showCreateTemplatePack} onOpenChange={setShowCreateTemplatePack} />
      <CreateInnovationHubDialogV3 open={showCreateHub} onOpenChange={setShowCreateHub} />
    </div>
  );
}