import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { SubspaceHeader } from "@/app/components/space/SubspaceHeader";
import { SubspaceSidebar } from "@/app/components/space/SubspaceSidebar";
import { CalloutTabs } from "@/app/components/space/ChannelTabs";
import type { CalloutTab } from "@/app/components/space/ChannelTabs";
import { SpaceFeed } from "@/app/components/space/SpaceFeed";
import { Button } from "@/app/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip";
import { Layout, Plus } from "lucide-react";

export default function SubspacePage() {
  const { spaceSlug = "innovation-hub", subspaceSlug = "renewable-transition" } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("strategy");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const callouts: CalloutTab[] = [
    { id: "strategy", label: "Strategy Docs", description: "Core strategy documents and frameworks.", count: 5, linkedToNext: true },
    { id: "municipal", label: "Municipal Data", description: "Data sets and reports from municipalities.", linkedToNext: true },
    { id: "policy", label: "Policy Drafts", description: "Draft policy frameworks and proposals.", count: 2, linkedToNext: false },
    { id: "stakeholders", label: "Stakeholders", description: "Stakeholder mapping and engagement.", linkedToNext: false },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SubspaceHeader 
        spaceSlug={spaceSlug}
        subspaceSlug={subspaceSlug}
        title="Renewable Energy Transition"
        description="Developing strategies for municipal energy transition to 100% renewables by 2030."
        parentSpaceName="Innovation Hub"
        imageUrl="https://images.unsplash.com/photo-1690191863988-f685cddde463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBjaGFsbGVuZ2UlMjBjcmVhdGl2ZSUyMHdvcmtzaG9wJTIwdGVhbSUyMGNvbGxhYm9yYXRpb24lMjBpbm5vdmF0aW9uJTIwc3ByaW50JTIwZGVzaWduJTIwc3ByaW50fGVufDF8fHx8MTc2OTA5NDMxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      />

      <main className="flex-1 container mx-auto px-4 py-8 flex gap-8 relative items-start">
        {/* Left Sidebar */}
        <div className={`shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-12' : 'w-80'} hidden md:block sticky top-24 self-start`}>
          <SubspaceSidebar 
            isCollapsed={isSidebarCollapsed} 
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div
            className="sticky top-16 z-10 pt-4 pb-3 mb-4 -mx-4 px-4 md:mx-0 md:px-0"
            style={{
              background: "color-mix(in srgb, var(--background) 95%, transparent)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <div className="flex items-center justify-between gap-4">
              {/* Edit flow button */}
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() =>
                        navigate(`/space/${spaceSlug}/subspaces/${subspaceSlug}/settings/layout`)
                      }
                      className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      aria-label="Edit innovation flow"
                    >
                      <Layout className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Edit innovation flow</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Callout tabs with flow arrows */}
              <CalloutTabs
                tabs={callouts}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              {/* Add post button */}
              <Button
                size="sm"
                className="shrink-0 gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Post
              </Button>
            </div>
          </div>
          
          <div className="max-w-3xl">
             <SpaceFeed />
          </div>
        </div>
      </main>
    </div>
  );
}
