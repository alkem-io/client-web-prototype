import { useState } from "react";
import { useParams } from "react-router";
import { SpaceHeader } from "@/app/components/space/SpaceHeader";
import { SpaceSidebar } from "@/app/components/space/SpaceSidebar";
import { SpaceNavigationTabs } from "@/app/components/space/SpaceNavigationTabs";
import { SpaceMembers } from "@/app/components/space/SpaceMembers";
import { SpaceChatPanel } from "@/app/components/messaging/SpaceChatPanel";
import { SpaceChatDrawer } from "@/app/components/messaging/SpaceChatDrawer";
import { useDesignVariant } from "@/app/contexts/DesignVariantContext";
import { useSpaceChatDrawer } from "@/app/contexts/SpaceChatDrawerContext";

export function SpaceCommunity() {
  const { spaceSlug } = useParams<{ spaceSlug: string }>();
  const slug = spaceSlug || "default-space";
  const [chatPanelOpen, setChatPanelOpen] = useState(false);
  const { variant } = useDesignVariant();
  const drawer = useSpaceChatDrawer();

  const showDrawer = variant === "B" && drawer.isOpen;

  const handleOpenChat = () => {
    if (variant === "A") setChatPanelOpen(true);
    else if (variant === "B") drawer.toggleDrawer(slug);
  };

  const content = (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <SpaceSidebar spaceSlug={slug} />
        <div className="flex-1 w-full">
          <div className={`sticky ${showDrawer ? "top-0" : "top-16"} z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-4 pb-2 mb-4 -mx-4 px-4 md:mx-0 md:px-0`}>
             <SpaceNavigationTabs spaceSlug={slug} />
          </div>
          <SpaceMembers />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col ${showDrawer ? "h-screen" : "min-h-screen"} bg-background`}>
      <SpaceHeader spaceSlug={slug} onOpenChat={handleOpenChat} />

      {showDrawer ? (
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 min-w-0 overflow-y-auto">{content}</div>
          <SpaceChatDrawer spaceSlug={slug} />
        </div>
      ) : (
        content
      )}

      {variant === "A" && (
        <SpaceChatPanel
          open={chatPanelOpen}
          onClose={() => setChatPanelOpen(false)}
          spaceSlug={slug}
        />
      )}
    </div>
  );
}