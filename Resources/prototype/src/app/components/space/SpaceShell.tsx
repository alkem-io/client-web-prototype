import { useState, useCallback } from "react";
import { useParams, useLocation, useSearchParams, Outlet, Link } from "react-router";
import { SpaceHeader } from "./SpaceHeader";
import { SpaceNavigationTabs } from "./SpaceNavigationTabs";
import { SpaceSidebar } from "./SpaceSidebar";
import { FilterProvider, useSpaceFilters } from "./FilterContext";
import { Activity, Video, FileText, Share2, Settings, Info, Menu, Filter, X, ChevronDown, ChevronUp, ArrowUp, Home, Users, Layers, BookOpen, MessageSquare, PanelLeftOpen, PanelLeftClose, Search, Plus, MessageCircle, LayoutGrid, List } from "lucide-react";
import { AboutThisSpaceDialog } from "./AboutThisSpaceDialog";
import { WelcomeSpaceDialog } from "@/app/components/dialogs/WelcomeSpaceDialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/app/components/ui/sheet";
import { Button } from "@/app/components/ui/button";
import { IconButton } from "@/app/components/ui/icon-button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * SpaceShell wraps the tab pages (Home, Community, Workspaces, Knowledge)
 * with the shared SpaceHeader banner, sidebar, and SpaceNavigationTabs.
 * Settings and Subspace pages render outside this shell.
 */
export function SpaceShell() {
  const { spaceSlug } = useParams<{ spaceSlug: string }>();
  const slug = spaceSlug || "default-space";
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const variant = (parseInt(searchParams.get("v") || "1") || 1) as 1 | 2 | 3 | 4 | 5;
  const [activeTabDescription, setActiveTabDescription] = useState("Activity and updates from members of this space.");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(searchParams.get("welcome") === "true");
  // Mobile responsive strategy: ?m=1..5 (0 = default/hidden)
  const mobileStrategy = Math.max(0, Math.min(5, parseInt(searchParams.get("m") || "0") || 0)) as 0 | 1 | 2 | 3 | 4 | 5;
  // Sidebar panel display mode: ?panel=full|rail|railed|hidden (admin setting)
  const rawPanel = searchParams.get("panel") || "full";
  const panelMode = (rawPanel === "railed" ? "rail" : rawPanel) as "full" | "rail" | "hidden";

  // Admin-configured sidebar features — per tab (from localStorage, set via Settings > Layout)
  type SidebarFeatureSet = { search: boolean; tags: boolean; post: boolean; addUser: boolean; createSubspace: boolean; subspaceLinks: boolean; index: boolean };
  const defaultFeatureSet: SidebarFeatureSet = { search: true, tags: true, post: true, addUser: true, createSubspace: true, subspaceLinks: true, index: true };
  const allTabFeatures = (() => {
    try {
      const stored = localStorage.getItem('alkemio-sidebar-features');
      if (stored) {
        const parsed = JSON.parse(stored);
        const defaults: Record<string, SidebarFeatureSet> = {
          home: { ...defaultFeatureSet },
          community: { ...defaultFeatureSet, createSubspace: false, subspaceLinks: false },
          workspaces: { ...defaultFeatureSet, addUser: false },
          knowledge: { ...defaultFeatureSet, addUser: false, createSubspace: false, subspaceLinks: false },
        };
        for (const tabId of Object.keys(defaults)) {
          if (parsed[tabId]) defaults[tabId] = { ...defaults[tabId], ...parsed[tabId] };
        }
        return defaults;
      }
      return {
        home: { ...defaultFeatureSet },
        community: { ...defaultFeatureSet, createSubspace: false, subspaceLinks: false },
        workspaces: { ...defaultFeatureSet, addUser: false },
        knowledge: { ...defaultFeatureSet, addUser: false, createSubspace: false, subspaceLinks: false },
      };
    } catch {
      return {
        home: { ...defaultFeatureSet },
        community: { ...defaultFeatureSet, createSubspace: false, subspaceLinks: false },
        workspaces: { ...defaultFeatureSet, addUser: false },
        knowledge: { ...defaultFeatureSet, addUser: false, createSubspace: false, subspaceLinks: false },
      };
    }
  })();

  // Get features for current tab variant
  const getCurrentTabFeatures = () => {
    const variant = getSidebarVariant();
    const variantMap: Record<string, string> = { home: 'home', community: 'community', workspaces: 'subspaces', knowledge: 'knowledge' };
    return allTabFeatures[variantMap[variant] || 'home'] || defaultFeatureSet;
  };

  // User-toggleable sidebar: reads admin default, user can switch expanded <-> railed
  const adminDefaultCollapsed = localStorage.getItem('alkemio-sidebar-default') === 'railed';
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    panelMode === "hidden" ? false : panelMode === "rail" ? true : adminDefaultCollapsed
  );
  // Effective panel mode: hidden stays hidden, otherwise user toggles between full/rail
  const effectivePanelMode = panelMode === "hidden" ? "hidden" : (sidebarCollapsed ? "rail" : "full");

  const handleActiveTabChange = useCallback((description: string) => {
    setActiveTabDescription(description);
  }, []);

  // Determine sidebar variant from current route
  const getSidebarVariant = () => {
    const path = location.pathname;
    if (path.includes("/community")) return "community";
    if (path.includes("/subspaces")) return "workspaces";
    if (path.includes("/knowledge-base")) return "knowledge";
    return "home";
  };

  // Compact action icons shown in the tab bar
  const actionIcons = (
    <div className="flex items-center gap-0.5">
      <IconButton
        tooltipLabel="Recent Activity"
        className="w-7 h-7"
        style={{
          background: "color-mix(in srgb, var(--foreground) 8%, transparent)",
          color: "var(--muted-foreground)",
        }}
      >
        <Activity className="w-3.5 h-3.5" />
      </IconButton>
      <IconButton
        tooltipLabel="Video Call"
        className="w-7 h-7"
        style={{
          background: "color-mix(in srgb, var(--foreground) 8%, transparent)",
          color: "var(--muted-foreground)",
        }}
      >
        <Video className="w-3.5 h-3.5" />
      </IconButton>
      <IconButton
        tooltipLabel="Share"
        className="w-7 h-7"
        style={{
          background: "color-mix(in srgb, var(--foreground) 8%, transparent)",
          color: "var(--muted-foreground)",
        }}
      >
        <Share2 className="w-3.5 h-3.5" />
      </IconButton>
      <IconButton
        tooltipLabel="Settings"
        className="w-7 h-7"
        asChild
        style={{
          background: "color-mix(in srgb, var(--foreground) 8%, transparent)",
          color: "var(--muted-foreground)",
        }}
      >
        <Link to={`/space/${slug}/settings`}>
          <Settings className="w-3.5 h-3.5" />
        </Link>
      </IconButton>
    </div>
  );

  // Action toolbar — icon buttons only; primary CTAs live in the left panel
  const getActionButtons = () => actionIcons;

  // V2+ use a max-width container so content scales into margins on zoom
  const usesScaling = variant !== 1;
  const scaledContainer = { maxWidth: 1536, margin: "0 auto", width: "100%" };

  return (
    <FilterProvider>
      <div className="flex flex-col bg-background">
        <SpaceHeader spaceSlug={slug} variant={variant} onInfoClick={() => setAboutOpen(true)} actionButtons={actionIcons} />

        {/* Content area */}
        <div className="w-full px-4 pt-0 pb-8" style={!usesScaling ? { paddingLeft: 32, paddingRight: 32 } : undefined}>
          <div style={usesScaling ? scaledContainer : undefined}>
            <div className="grid grid-cols-12 gap-6 items-start">
              {/* Sticky tab bar — full-width across both panels, parent of the layout below */}
              <div
                className={`col-span-12 ${!usesScaling ? "lg:col-start-2 lg:col-span-10" : ""} sticky top-16 z-10 pt-4 pb-0 ${mobileStrategy === 4 ? "hidden lg:block" : ""}`}
                style={{
                  background:
                    "color-mix(in srgb, var(--background) 95%, transparent)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
                <SpaceNavigationTabs spaceSlug={slug} onActiveTabChange={handleActiveTabChange} />
              </div>

              {/* ═══ MOBILE STRATEGY 1: Sheet / Drawer ═══ */}
              {mobileStrategy === 1 && (
                <MobileSheetDrawer slug={slug} sidebarVariant={getSidebarVariant()} activeTabDescription={activeTabDescription} usesScaling={usesScaling} />
              )}

              {/* ═══ MOBILE STRATEGY 2: Bottom Sheet ═══ */}
              {mobileStrategy === 2 && (
                <MobileBottomSheet slug={slug} sidebarVariant={getSidebarVariant()} activeTabDescription={activeTabDescription} usesScaling={usesScaling} />
              )}

              {/* ═══ MOBILE STRATEGY 3: Collapsible Inline ═══ */}
              {mobileStrategy === 3 && (
                <MobileCollapsibleInline slug={slug} sidebarVariant={getSidebarVariant()} activeTabDescription={activeTabDescription} usesScaling={usesScaling} />
              )}

              {/* ═══ MOBILE STRATEGY 4: Bottom Nav + FAB ═══ */}
              {mobileStrategy === 4 && (
                <MobileBottomNavFAB slug={slug} sidebarVariant={getSidebarVariant()} activeTabDescription={activeTabDescription} usesScaling={usesScaling} />
              )}

              {/* ═══ MOBILE STRATEGY 5: Tab Bar + Filter Icon ═══ */}
              {mobileStrategy === 5 && (
                <MobileTabBarFilter slug={slug} sidebarVariant={getSidebarVariant()} activeTabDescription={activeTabDescription} usesScaling={usesScaling} />
              )}

              {/* ═══ DEFAULT (m=0): Original behavior — sidebar hidden on mobile ═══ */}
              {mobileStrategy === 0 && effectivePanelMode === "full" && (
                <>
                  <div className={`hidden lg:block col-span-2 sticky top-[8.5rem] self-start ${!usesScaling ? "lg:col-start-2" : ""}`}>
                    <aside>
                      <SpaceSidebar spaceSlug={slug} variant={getSidebarVariant()} activeTabDescription={activeTabDescription} enabledFeatures={getCurrentTabFeatures()} />
                      {/* User collapse toggle */}
                      <button
                        onClick={() => setSidebarCollapsed(true)}
                        className="hidden lg:flex items-center gap-1.5 w-full mt-2 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Collapse sidebar"
                      >
                        <PanelLeftClose className="w-3.5 h-3.5" />
                        <span>Collapse</span>
                      </button>
                    </aside>
                  </div>
                  <div className={`col-span-12 ${usesScaling ? "lg:col-span-10" : "lg:col-span-8"} min-w-0`}>
                    <Outlet />
                  </div>
                </>
              )}

              {/* ═══ PANEL HIDDEN: Full-width one-pager layout ═══ */}
              {mobileStrategy === 0 && effectivePanelMode === "hidden" && (
                <div className={`col-span-12 ${!usesScaling ? "lg:col-start-2 lg:col-span-10" : ""} min-w-0`}>
                  <Outlet />
                </div>
              )}

              {/* ═══ PANEL RAIL: Slim icon rail + expanded content ═══ */}
              {mobileStrategy === 0 && effectivePanelMode === "rail" && (
                <div className={`col-span-12 ${!usesScaling ? "lg:col-start-2 lg:col-span-10" : ""} min-w-0`}>
                  <SidebarIconRail slug={slug} sidebarVariant={getSidebarVariant()} activeTabDescription={activeTabDescription} usesScaling={usesScaling} enabledFeatures={getCurrentTabFeatures()} onExpand={() => setSidebarCollapsed(false)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AboutThisSpaceDialog open={aboutOpen} onOpenChange={setAboutOpen} spaceSlug={slug} />
      <WelcomeSpaceDialog open={welcomeOpen} onOpenChange={setWelcomeOpen} spaceName={slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} />

      {/* Footer */}

      {/* Mobile strategy indicator badge */}
      {mobileStrategy > 0 && (
        <div className="fixed top-20 right-4 z-[100] bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
          Mobile Option {mobileStrategy} · ?m=1…5
        </div>
      )}
      {/* Panel mode indicator badge */}
      {effectivePanelMode !== "full" && (
        <div className="fixed top-20 right-4 z-[100] bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
          Panel: {effectivePanelMode} · {sidebarCollapsed ? "collapsed" : "expanded"}
        </div>
      )}
    </FilterProvider>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MOBILE STRATEGY COMPONENTS
// All options preserve persistent access to key sidebar actions
// (Post, Search, Filter) regardless of scroll position.
// ═══════════════════════════════════════════════════════════════════

interface MobileStrategyProps {
  slug: string;
  sidebarVariant: "home" | "community" | "workspaces" | "knowledge";
  activeTabDescription: string;
  usesScaling: boolean;
}

// ─── Shared: context-aware CTA labels ───────────────────────────

function getQuickActions(variant: string) {
  switch (variant) {
    case "community":
      return { primary: "Post", secondary: "Add User", tertiary: "Contact Leads" };
    case "workspaces":
      return { primary: "Post", secondary: "Create Subspace" };
    case "knowledge":
      return { primary: "Post" };
    default:
      return { primary: "Post" };
  }
}

// ═══════════════════════════════════════════════════════════════════
// OPTION 1: Sticky Floating Toolbar
// A compact, always-visible floating bar fixed to the bottom of the
// viewport with Post, Search, and Filter. Tapping Search or Filter
// expands the relevant section in a half-sheet overlay.
// ═══════════════════════════════════════════════════════════════════

function MobileSheetDrawer({ slug, sidebarVariant, activeTabDescription, usesScaling }: MobileStrategyProps) {
  const [activePanel, setActivePanel] = useState<"none" | "search" | "full">("none");
  const actions = getQuickActions(sidebarVariant);

  const togglePanel = (panel: "search" | "full") => {
    setActivePanel((prev) => (prev === panel ? "none" : panel));
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className={`hidden lg:block col-span-2 sticky top-[8.5rem] self-start ${!usesScaling ? "lg:col-start-2" : ""}`}>
        <aside>
          <SpaceSidebar spaceSlug={slug} variant={sidebarVariant} activeTabDescription={activeTabDescription} />
        </aside>
      </div>

      {/* Main content */}
      <div className={`col-span-12 ${usesScaling ? "lg:col-span-10" : "lg:col-span-8"} min-w-0 pb-20 lg:pb-0`}>
        <Outlet />
      </div>

      {/* Floating toolbar — always visible < lg */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
        {/* Expanded panel above toolbar */}
        {activePanel !== "none" && (
          <div className="mb-3 bg-background rounded-2xl border border-border shadow-2xl max-h-[60vh] overflow-y-auto animate-in slide-in-from-bottom-2 duration-200">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold">
                  {activePanel === "search" ? "Search & Filter" : "Space Panel"}
                </span>
                <button onClick={() => setActivePanel("none")} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-muted">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <SpaceSidebar spaceSlug={slug} variant={sidebarVariant} activeTabDescription={activeTabDescription} />
            </div>
          </div>
        )}

        {/* Toolbar pill */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-background/95 backdrop-blur-md border border-border shadow-xl">
          {/* Primary CTA */}
          <Button size="sm" className="gap-1.5 h-9 flex-1">
            <span className="text-base leading-none">+</span>
            {actions.primary}
          </Button>

          {/* Search toggle */}
          <button
            onClick={() => togglePanel("search")}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-colors border",
              activePanel === "search" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
            )}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Full panel toggle */}
          <button
            onClick={() => togglePanel("full")}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-colors border",
              activePanel === "full" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
            )}
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// OPTION 2: Sticky Compact Bar + Slide-up Sheet
// A slim fixed bar at the bottom with key action icons. The bar shows
// the current filter state. Full sidebar slides up as a sheet.
// ═══════════════════════════════════════════════════════════════════

function MobileBottomSheet({ slug, sidebarVariant, activeTabDescription, usesScaling }: MobileStrategyProps) {
  const [open, setOpen] = useState(false);
  const actions = getQuickActions(sidebarVariant);

  return (
    <>
      {/* Desktop sidebar */}
      <div className={`hidden lg:block col-span-2 sticky top-[8.5rem] self-start ${!usesScaling ? "lg:col-start-2" : ""}`}>
        <aside>
          <SpaceSidebar spaceSlug={slug} variant={sidebarVariant} activeTabDescription={activeTabDescription} />
        </aside>
      </div>

      {/* Main content */}
      <div className={`col-span-12 ${usesScaling ? "lg:col-span-10" : "lg:col-span-8"} min-w-0 pb-16 lg:pb-0`}>
        <Outlet />
      </div>

      {/* Fixed bottom bar — always visible < lg */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur-md border-t border-border">
        <div className="flex items-center gap-2 px-4 py-2.5">
          {/* Primary CTA */}
          <Button size="sm" className="gap-1.5 h-8">
            <span className="text-base leading-none">+</span>
            {actions.primary}
          </Button>

          {actions.secondary && (
            <Button size="sm" variant="outline" className="gap-1.5 h-8">
              <span className="text-base leading-none">+</span>
              <span className="hidden sm:inline">{actions.secondary}</span>
            </Button>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <button
            onClick={() => setOpen(true)}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Expand full panel */}
          <button
            onClick={() => setOpen(true)}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Full panel sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Space Panel</SheetTitle>
          </SheetHeader>
          <div className="px-1 pb-6">
            <SpaceSidebar spaceSlug={slug} variant={sidebarVariant} activeTabDescription={activeTabDescription} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// OPTION 3: Sticky Header Extension
// A compact sticky row directly below the tab bar that stays pinned
// with Post + Search input + Filter icon. Tapping filter shows tags
// and full sidebar in an expandable section.
// ═══════════════════════════════════════════════════════════════════

function MobileCollapsibleInline({ slug, sidebarVariant, activeTabDescription, usesScaling }: MobileStrategyProps) {
  const [expanded, setExpanded] = useState(false);
  const actions = getQuickActions(sidebarVariant);

  return (
    <>
      {/* Mobile sticky action row — pinned below tab bar < lg */}
      <div className="lg:hidden col-span-12 sticky top-[7.5rem] z-[9] -mb-2">
        <div
          className="flex items-center gap-2 py-2.5 -mx-4 px-4"
          style={{
            background: "color-mix(in srgb, var(--background) 95%, transparent)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {/* Primary CTA */}
          <Button size="sm" className="gap-1.5 h-8 shrink-0">
            <span className="text-base leading-none">+</span>
            {actions.primary}
          </Button>

          {/* Inline search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search…"
              className="w-full h-8 pl-8 pr-3 text-sm rounded-lg border border-border bg-input-background text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Filter expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-colors",
              expanded ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
            )}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Expanded full sidebar content */}
        {expanded && (
          <div className="mt-1 p-4 rounded-xl border border-border bg-card shadow-lg animate-in slide-in-from-top-2 duration-200 max-h-[60vh] overflow-y-auto">
            <SpaceSidebar spaceSlug={slug} variant={sidebarVariant} activeTabDescription={activeTabDescription} />
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:block col-span-2 sticky top-[8.5rem] self-start ${!usesScaling ? "lg:col-start-2" : ""}`}>
        <aside>
          <SpaceSidebar spaceSlug={slug} variant={sidebarVariant} activeTabDescription={activeTabDescription} />
        </aside>
      </div>

      {/* Main content */}
      <div className={`col-span-12 ${usesScaling ? "lg:col-span-10" : "lg:col-span-8"} min-w-0`}>
        <Outlet />
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// OPTION 4: Mobile-native — Bottom Tab Bar + Sticky Search + Chat FAB
// Tabs move to a bottom bar (like production mobile). Sticky search/filter
// bar stays pinned below the header. Chat guidance FAB in bottom-right.
// ═══════════════════════════════════════════════════════════════════

function MobileBottomNavFAB({ slug, sidebarVariant, activeTabDescription, usesScaling }: MobileStrategyProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const suffix = queryString ? `?${queryString}` : "";

  const currentPath = location.pathname;

  // Tab definitions matching SpaceNavigationTabs
  const tabs = [
    { id: "home", label: "Home", icon: Home, href: `/space/${slug}${suffix}` },
    { id: "community", label: "Community", icon: Users, href: `/space/${slug}/community${suffix}` },
    { id: "subspaces", label: "Subspaces", icon: Layers, href: `/space/${slug}/subspaces${suffix}` },
    { id: "knowledge", label: "Knowledge", icon: BookOpen, href: `/space/${slug}/knowledge-base${suffix}` },
  ];

  const isTabActive = (tab: typeof tabs[0]) => {
    const hrefPath = tab.href.split("?")[0];
    if (tab.id === "home") return currentPath === hrefPath;
    return currentPath.startsWith(hrefPath);
  };

  return (
    <>
      {/* Mobile sticky search/filter bar — pinned below tabs < lg */}
      <div className="lg:hidden col-span-12 sticky top-[7.5rem] z-[9] -mb-2">
        <div
          className="flex items-center gap-2 py-2.5 -mx-4 px-4"
          style={{
            background: "color-mix(in srgb, var(--background) 95%, transparent)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {/* Inline search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search…"
              className="w-full h-8 pl-8 pr-3 text-sm rounded-lg border border-border bg-input-background text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className={cn(
              "shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-colors",
              panelOpen ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
            )}
          >
            <Filter className="w-4 h-4" />
          </button>

          {/* Full sidebar sheet button */}
          <button
            onClick={() => setSheetOpen(true)}
            className="shrink-0 w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>

        {/* Expanded filter panel (inline) */}
        {panelOpen && (
          <div className="mt-1 p-4 rounded-xl border border-border bg-card shadow-lg animate-in slide-in-from-top-2 duration-200 max-h-[60vh] overflow-y-auto">
            <SpaceSidebar spaceSlug={slug} variant={sidebarVariant} activeTabDescription={activeTabDescription} />
          </div>
        )}
      </div>

      {/* Full sidebar sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[340px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Space Panel</SheetTitle>
          </SheetHeader>
          <div className="px-1 pb-6">
            <SpaceSidebar spaceSlug={slug} variant={sidebarVariant} activeTabDescription={activeTabDescription} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className={`hidden lg:block col-span-2 sticky top-[8.5rem] self-start ${!usesScaling ? "lg:col-start-2" : ""}`}>
        <aside>
          <SpaceSidebar spaceSlug={slug} variant={sidebarVariant} activeTabDescription={activeTabDescription} />
        </aside>
      </div>

      {/* Main content */}
      <div className={`col-span-12 ${usesScaling ? "lg:col-span-10" : "lg:col-span-8"} min-w-0 pb-20 lg:pb-0`}>
        <Outlet />
      </div>

      {/* Chat guidance FAB — bottom-right, above the tab bar */}
      <button className="lg:hidden fixed right-4 bottom-[4.5rem] z-50 w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-colors"
        style={{ background: "var(--foreground)", color: "var(--background)" }}
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* ─── Bottom tab bar — matches production mobile ─── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-background border-t border-border">
        <div className="flex items-center h-12 px-2">
          {/* Scrollable tab labels */}
          <div className="flex-1 flex items-center gap-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const active = isTabActive(tab);
              return (
                <Link
                  key={tab.id}
                  to={tab.href}
                  className={cn(
                    "shrink-0 px-4 py-2.5 text-sm whitespace-nowrap transition-colors",
                    active
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {/* Separator + hamburger menu icon */}
          <div className="flex items-center gap-0 shrink-0 border-l border-border ml-1 pl-2">
            <button
              onClick={() => setPanelOpen(!panelOpen)}
              className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR ICON RAIL: Slim vertical icon strip with popover overlays
// Replaces full sidebar when admin sets panel=rail
// ═══════════════════════════════════════════════════════════════════

interface SidebarIconRailProps extends MobileStrategyProps {
  enabledFeatures?: { search: boolean; tags: boolean; post: boolean; addUser: boolean; createSubspace: boolean; subspaceLinks: boolean; index: boolean };
  onExpand?: () => void;
}

function SidebarIconRail({ slug, sidebarVariant, activeTabDescription, usesScaling, enabledFeatures, onExpand }: SidebarIconRailProps) {
  const features = enabledFeatures || { search: true, tags: true, post: true, addUser: true, createSubspace: true, subspaceLinks: true, index: true };
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const { searchValue, setSearchValue, activeTags, toggleTag, clearTags } = useSpaceFilters();

  const TAB_TAGS: Record<string, string[]> = {
    home: ["Updates", "Announcements", "Events", "Ideas", "Questions", "Partnerships", "Research", "Progress"],
    community: ["Active", "Leads", "New Members", "Organizations", "Mentors"],
    workspaces: ["Energy", "Strategy", "Transport", "Urban", "Policy", "Community", "Digital"],
    knowledge: ["Reports", "Research", "Policy", "Technical", "Templates", "Community", "Data", "Funding"],
  };

  const SUBSPACE_LINKS = [
    { name: "Energy Transition", href: `/space/${slug}/subspaces` },
    { name: "Mobility Hub", href: `/space/${slug}/subspaces` },
    { name: "Circular Economy", href: `/space/${slug}/subspaces` },
  ];

  const tags = TAB_TAGS[sidebarVariant] || TAB_TAGS.home;

  const togglePopover = (id: string) => {
    setActivePopover(activePopover === id ? null : id);
  };

  return (
    <div className="flex relative">
      {/* Slim icon rail */}
      <div className="hidden lg:flex flex-col items-center gap-0 shrink-0 sticky top-[8.5rem] self-start">
        {/* Expand sidebar toggle */}
        {onExpand && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onExpand}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground hover:bg-muted mb-1"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand sidebar</TooltipContent>
          </Tooltip>
        )}

        {/* Search & Filter (merged) */}
        {(features.search || features.tags) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => togglePopover("search")}
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center transition-colors relative",
                  activePopover === "search"
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <div className="relative">
                  <Search className="w-4 h-4" />
                  {activeTags.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                      {activeTags.length}
                    </span>
                  )}
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Search & Filter</TooltipContent>
          </Tooltip>
        )}

        {/* Post/Contribute */}
        {(features.post || features.addUser || features.createSubspace) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => togglePopover("post")}
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                  activePopover === "post"
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Plus className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Contribute</TooltipContent>
          </Tooltip>
        )}

        {/* Subspaces */}
        {features.subspaceLinks && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => togglePopover("subspaces")}
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                  activePopover === "subspaces"
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Layers className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Subspaces</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Popover overlays — floating on top of content */}
      {activePopover && (
        <div className="hidden lg:block absolute left-10 top-0 w-64 z-20">
          <div className="relative rounded-xl border border-border bg-card shadow-lg p-4 animate-in slide-in-from-left-2 duration-200">
            {/* Close button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActivePopover(null)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Close</TooltipContent>
            </Tooltip>

            {/* Search & Filter combined popover */}
            {activePopover === "search" && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Search & Filter</h4>
                {features.search && (
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search posts, comments, documents…"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="w-full h-9 pl-8 pr-3 text-sm rounded-lg border border-border bg-input-background text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
                      autoFocus
                    />
                  </div>
                )}
                {searchValue && (
                  <p className="text-xs text-muted-foreground">
                    Filtering by: <span className="font-medium text-foreground">"{searchValue}"</span>
                    <button onClick={() => setSearchValue("")} className="ml-2 text-primary hover:underline">Clear</button>
                  </p>
                )}
                {features.tags && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tags</span>
                      {activeTags.length > 0 && (
                        <button onClick={clearTags} className="text-xs text-primary hover:underline">
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                            activeTags.includes(tag)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Post popover */}
            {activePopover === "post" && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Contribute</h4>
                <div className="space-y-2">
                  {features.post && (
                    <Button size="sm" className="w-full justify-start gap-2" onClick={() => { window.dispatchEvent(new Event("open-add-post-modal")); setActivePopover(null); }}>
                      <Plus className="w-3.5 h-3.5" />
                      New Post
                    </Button>
                  )}
                  {features.addUser && sidebarVariant === "community" && (
                    <Button size="sm" variant="outline" className="w-full justify-start gap-2">
                      <Users className="w-3.5 h-3.5" />
                      Add User
                    </Button>
                  )}
                  {features.createSubspace && (sidebarVariant === "workspaces" || sidebarVariant === "home") && (
                    <Button size="sm" variant="outline" className="w-full justify-start gap-2">
                      <Layers className="w-3.5 h-3.5" />
                      Create Subspace
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Subspaces popover */}
            {activePopover === "subspaces" && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Subspaces</h4>
                <div className="space-y-1">
                  {SUBSPACE_LINKS.map((sub) => (
                    <Link
                      key={sub.name}
                      to={sub.href}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main content — always full width */}
      <div className="flex-1 min-w-0 ml-3">
        <Outlet />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// OPTION 5: Split — Sticky Top Chips + Persistent Bottom Actions
// Filter chips sticky below tabs (scrollable), key actions fixed at
// bottom. The full sidebar is accessible via a "More" expansion.
// ═══════════════════════════════════════════════════════════════════

const TAB_QUICK_FILTERS: Record<string, string[]> = {
  home: ["All", "Updates", "Events", "Ideas", "Announcements"],
  community: ["All", "Members", "Active", "Leads", "New"],
  workspaces: ["All", "Energy", "Strategy", "Transport", "Urban", "Policy", "Community", "Digital"],
  knowledge: ["All", "Reports", "Policy", "Research", "Data", "Technical", "Funding"],
};

function MobileTabBarFilter({ slug, sidebarVariant, activeTabDescription, usesScaling }: MobileStrategyProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const actions = getQuickActions(sidebarVariant);
  const quickFilters = TAB_QUICK_FILTERS[sidebarVariant] || TAB_QUICK_FILTERS.home;

  return (
    <>
      {/* Mobile sticky filter chips — pinned below tabs < lg */}
      <div className="lg:hidden col-span-12 sticky top-[7.5rem] z-[9] -mb-2">
        <div
          className="py-2.5 -mx-4 px-4"
          style={{
            background: "color-mix(in srgb, var(--background) 95%, transparent)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <div className="flex items-center gap-2">
            {/* Scrollable filter chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 flex-1 scrollbar-hide">
              {quickFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap",
                    activeFilter === filter
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* More / expand full panel */}
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={cn(
                "shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-colors",
                moreOpen ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              )}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Full sidebar panel */}
        {moreOpen && (
          <div className="mt-1 p-4 rounded-xl border border-border bg-card shadow-lg animate-in slide-in-from-top-2 duration-200 max-h-[60vh] overflow-y-auto">
            <SpaceSidebar spaceSlug={slug} variant={sidebarVariant} activeTabDescription={activeTabDescription} />
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:block col-span-2 sticky top-[8.5rem] self-start ${!usesScaling ? "lg:col-start-2" : ""}`}>
        <aside>
          <SpaceSidebar spaceSlug={slug} variant={sidebarVariant} activeTabDescription={activeTabDescription} />
        </aside>
      </div>

      {/* Main content */}
      <div className={`col-span-12 ${usesScaling ? "lg:col-span-10" : "lg:col-span-8"} min-w-0 pb-16 lg:pb-0`}>
        <Outlet />
      </div>

      {/* Fixed bottom action bar — always visible < lg */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur-md border-t border-border">
        <div className="flex items-center gap-2 px-4 py-2.5">
          <Button size="sm" className="gap-1.5 h-9 flex-1">
            <span className="text-base leading-none">+</span>
            {actions.primary}
          </Button>
          {actions.secondary && (
            <Button size="sm" variant="outline" className="gap-1.5 h-9">
              <span className="text-base leading-none">+</span>
              {actions.secondary}
            </Button>
          )}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}