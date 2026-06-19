import { useState } from "react";
import { useSearchParams } from "react-router";
import { cn } from "@/lib/utils";
import {
  Search, Plus, Mail, UserPlus, List, FileText, Calendar, ChevronDown,
  Menu, Filter, X, Home, Users, Layers, BookOpen, MessageSquare,
  PanelLeftOpen, GripHorizontal, ArrowUp, ChevronUp
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger
} from "@/app/components/ui/sheet";

/* ═══════════════════════════════════════════════════════════════════
   RESPONSIVE SIDEBAR DEMO PAGE
   Compare 5 different mobile-responsive approaches for the sidebar.
   Resize your browser to < 1024px to see the mobile behavior.
   ═══════════════════════════════════════════════════════════════════ */

// ─── Shared mock sidebar content ─────────────────────────────────

const TAGS = ["Energy", "Strategy", "Transport", "Urban", "Green Spaces", "Policy", "Community", "Digital"];

function SidebarContent({ compact = false }: { compact?: boolean }) {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className={cn("flex flex-col w-full", compact ? "gap-3" : "gap-4")}>
      {/* Description */}
      <p className="text-sm text-foreground/85 leading-relaxed">
        Explore the subspaces within this collaborative space. Filter by topic or search for specific areas.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-2">
        <Button size="sm" className="w-full gap-2 justify-start">
          <Plus className="w-4 h-4" />
          Post
        </Button>
        <Button variant="outline" size="sm" className="w-full gap-2 justify-start">
          <Plus className="w-4 h-4" />
          Create Subspace
        </Button>
      </div>

      <hr className="border-border" />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search subspaces…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-9 pl-8 pr-3 text-sm rounded-md border border-border bg-input-background text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={cn(
              "px-2 py-0.5 rounded-full text-xs border transition-colors",
              activeTags.includes(tag)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Filter feedback */}
      {(search || activeTags.length > 0) && (
        <div className="flex items-center justify-between gap-2 p-2 rounded-md text-xs"
          style={{
            background: "color-mix(in srgb, var(--primary) 10%, transparent)",
            color: "var(--primary)",
          }}
        >
          <span>Filtering active</span>
          <button onClick={() => { setSearch(""); setActiveTags([]); }}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-primary/20">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <hr className="border-border" />

      {/* Events */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Events</p>
        <div className="flex flex-col gap-1">
          {[
            { title: "GovTechDay", date: "Today" },
            { title: "Stakeholder Workshop", date: "Jun 14" },
            { title: "Community Solar Session", date: "Jun 18" },
          ].map((e) => (
            <div key={e.title} className="flex items-center justify-between py-1.5 text-sm">
              <span className="text-foreground/85">{e.title}</span>
              <span className="text-xs text-muted-foreground">{e.date}</span>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-border" />

      {/* Index */}
      <Button variant="outline" size="sm" className="w-full gap-2 justify-start">
        <List className="w-3.5 h-3.5" />
        Index
      </Button>
    </div>
  );
}

// ─── Mock main content ──────────────────────────────────────────

function MockContent() {
  const cards = [
    { title: "Renewable Energy Transition", author: "Sarah Chen", type: "Subspace" },
    { title: "Urban Mobility Lab", author: "David Kim", type: "Subspace" },
    { title: "Green Infrastructure", author: "Emily Davis", type: "Subspace" },
    { title: "Policy Frameworks", author: "Policy Institute", type: "Subspace" },
    { title: "Community Engagement", author: "Anna Martinez", type: "Subspace" },
    { title: "Digital Twin Project", author: "Robert Fox", type: "Subspace" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="rounded-xl border border-border p-4 hover:shadow-md transition-shadow bg-card">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-foreground truncate">{card.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{card.type} · {card.author}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Mock navigation tabs ────────────────────────────────────────

function MockTabs() {
  const [active, setActive] = useState("subspaces");
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "community", label: "Community", icon: Users },
    { id: "subspaces", label: "Subspaces", icon: Layers },
    { id: "knowledge", label: "Knowledge", icon: BookOpen },
  ];
  return (
    <div className="flex gap-1 border-b border-border pb-0 mb-4 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap border-b-2 transition-colors -mb-px",
            active === tab.id
              ? "border-primary text-foreground font-medium"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <tab.icon className="w-4 h-4" />
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// OPTION 1: Slide-out Sheet / Drawer
// ═══════════════════════════════════════════════════════════════════

function Option1SheetDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Mobile trigger — visible only < lg */}
      <div className="lg:hidden flex items-center gap-2 mb-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Menu className="w-4 h-4" />
              <span className="text-sm">Filters & Actions</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[340px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Space Panel</SheetTitle>
            </SheetHeader>
            <div className="px-1 pb-6">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <MockTabs />
      <div className="grid grid-cols-12 gap-6">
        {/* Desktop sidebar */}
        <div className="hidden lg:block col-span-3">
          <div className="sticky top-4">
            <SidebarContent />
          </div>
        </div>
        {/* Main content */}
        <div className="col-span-12 lg:col-span-9">
          <MockContent />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// OPTION 2: Bottom Sheet (pull-up panel)
// ═══════════════════════════════════════════════════════════════════

function Option2BottomSheet() {
  const [sheetState, setSheetState] = useState<"closed" | "peek" | "open">("peek");

  return (
    <div className="flex flex-col h-full relative">
      <MockTabs />
      <div className="grid grid-cols-12 gap-6">
        {/* Desktop sidebar */}
        <div className="hidden lg:block col-span-3">
          <div className="sticky top-4">
            <SidebarContent />
          </div>
        </div>
        {/* Main content */}
        <div className="col-span-12 lg:col-span-9 pb-20 lg:pb-0">
          <MockContent />
        </div>
      </div>

      {/* Bottom sheet — visible only < lg */}
      <div className={cn(
        "lg:hidden fixed inset-x-0 bottom-0 z-50 bg-background border-t border-border rounded-t-2xl shadow-2xl transition-all duration-300 ease-in-out",
        sheetState === "closed" ? "translate-y-[calc(100%-2.5rem)]" :
        sheetState === "peek" ? "translate-y-[calc(100%-7rem)]" :
        "translate-y-0 max-h-[80vh]"
      )}>
        {/* Handle */}
        <button
          className="w-full flex flex-col items-center pt-2 pb-1 cursor-grab active:cursor-grabbing"
          onClick={() => setSheetState(sheetState === "open" ? "peek" : sheetState === "peek" ? "open" : "peek")}
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </button>

        {/* Peek content — always visible in peek/open states */}
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters & Actions</span>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs"
                onClick={() => setSheetState(sheetState === "open" ? "peek" : "open")}>
                {sheetState === "open" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
              {sheetState !== "closed" && (
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs"
                  onClick={() => setSheetState("closed")}>
                  <X className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
          {/* Quick action buttons visible in peek */}
          <div className="flex gap-2 mt-2">
            <Button size="sm" className="h-7 text-xs gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Post
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Subspace
            </Button>
          </div>
        </div>

        {/* Full content — visible only when open */}
        {sheetState === "open" && (
          <div className="px-4 pb-6 overflow-y-auto max-h-[60vh] border-t border-border mt-2 pt-4">
            <SidebarContent />
          </div>
        )}
      </div>

      {/* Closed state indicator */}
      {sheetState === "closed" && (
        <button
          className="lg:hidden fixed bottom-0 inset-x-0 z-50 flex items-center justify-center h-10 bg-background border-t border-border"
          onClick={() => setSheetState("peek")}
        >
          <ArrowUp className="w-4 h-4 text-muted-foreground mr-2" />
          <span className="text-xs text-muted-foreground">Show panel</span>
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// OPTION 3: Collapsible Inline Section (above content)
// ═══════════════════════════════════════════════════════════════════

function Option3CollapsibleInline() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <MockTabs />

      {/* Inline collapsible — visible only < lg */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all",
            expanded ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30"
          )}
        >
          <div className="flex items-center gap-2">
            <PanelLeftOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters, Search & Actions</span>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", expanded && "rotate-180")} />
        </button>

        {expanded && (
          <div className="mt-3 px-4 py-4 rounded-xl border border-border bg-card animate-in slide-in-from-top-2 duration-200">
            <SidebarContent />
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Desktop sidebar */}
        <div className="hidden lg:block col-span-3">
          <div className="sticky top-4">
            <SidebarContent />
          </div>
        </div>
        {/* Main content */}
        <div className="col-span-12 lg:col-span-9">
          <MockContent />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// OPTION 4: Bottom Navigation Bar + Filter FAB
// ═══════════════════════════════════════════════════════════════════

function Option4BottomNavFAB() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("subspaces");

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "community", label: "Community", icon: Users },
    { id: "subspaces", label: "Subspaces", icon: Layers },
    { id: "knowledge", label: "Knowledge", icon: BookOpen },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col h-full relative">
      <MockTabs />

      <div className="grid grid-cols-12 gap-6">
        {/* Desktop sidebar */}
        <div className="hidden lg:block col-span-3">
          <div className="sticky top-4">
            <SidebarContent />
          </div>
        </div>
        {/* Main content */}
        <div className="col-span-12 lg:col-span-9 pb-24 lg:pb-0">
          <MockContent />
        </div>
      </div>

      {/* FAB — filter button — visible only < lg */}
      <button
        onClick={() => setFilterOpen(!filterOpen)}
        className={cn(
          "lg:hidden fixed right-4 bottom-20 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all",
          filterOpen ? "bg-primary text-primary-foreground rotate-45" : "bg-primary text-primary-foreground"
        )}
      >
        {filterOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
      </button>

      {/* Filter overlay */}
      {filterOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex items-end justify-center" onClick={() => setFilterOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative w-full max-w-md mx-4 mb-24 bg-background rounded-2xl border border-border shadow-2xl p-5 max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Filters & Actions</h3>
              <button onClick={() => setFilterOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Bottom navigation bar — visible only < lg */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-background border-t border-border px-2 pb-safe">
        <div className="flex items-center justify-around h-14">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors",
                activeNav === item.id ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// OPTION 5: Horizontal Tab Bar + Icon Trigger
// ═══════════════════════════════════════════════════════════════════

function Option5TabBarBelow() {
  const [filterOpen, setFilterOpen] = useState(false);

  const quickFilters = ["All", "Energy", "Strategy", "Transport", "Urban", "Community"];
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="flex flex-col h-full">
      <MockTabs />

      {/* Mobile horizontal filter bar — visible only < lg */}
      <div className="lg:hidden mb-4 -mx-2">
        <div className="flex items-center gap-2 px-2">
          {/* Filter/search trigger */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={cn(
              "shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center transition-colors",
              filterOpen ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
            )}
          >
            <Filter className="w-4 h-4" />
          </button>

          {/* Scrollable quick filter chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {quickFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap",
                  activeFilter === filter
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Expanded filter panel */}
        {filterOpen && (
          <div className="mt-3 mx-2 p-4 rounded-xl border border-border bg-card animate-in slide-in-from-top-2 duration-200">
            <SidebarContent compact />
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Desktop sidebar */}
        <div className="hidden lg:block col-span-3">
          <div className="sticky top-4">
            <SidebarContent />
          </div>
        </div>
        {/* Main content */}
        <div className="col-span-12 lg:col-span-9">
          <MockContent />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN DEMO PAGE — URL driven: ?v=1 through ?v=5
// ═══════════════════════════════════════════════════════════════════

const OPTIONS: Record<number, { label: string; component: React.FC }> = {
  1: { label: "Sheet / Drawer", component: Option1SheetDrawer },
  2: { label: "Bottom Sheet", component: Option2BottomSheet },
  3: { label: "Collapsible Inline", component: Option3CollapsibleInline },
  4: { label: "Bottom Nav + FAB", component: Option4BottomNavFAB },
  5: { label: "Tab Bar + Filter Icon", component: Option5TabBarBelow },
};

export default function ResponsiveSidebarDemo() {
  const [searchParams] = useSearchParams();
  const v = Math.max(1, Math.min(5, parseInt(searchParams.get("v") || "1") || 1));
  const { label, component: ActiveComponent } = OPTIONS[v];

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header showing which option is active */}
      <div className="sticky top-0 z-[60] bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-sm font-medium text-foreground">
            Option {v}: {label}
          </h1>
          <span className="text-xs text-muted-foreground">
            ?v=1…5 · Resize to &lt; 1024px
          </span>
        </div>
      </div>

      {/* Demo area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ActiveComponent />
      </div>
    </div>
  );
}
