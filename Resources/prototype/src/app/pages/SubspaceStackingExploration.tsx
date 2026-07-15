/**
 * Subspace Depth Exploration — Bold Approaches
 * 
 * The goal: make it UNMISSABLE that users are one level deeper.
 * Previous iterations were too subtle. This version explores bolder patterns
 * that fundamentally change how the sidebar area looks when you're in a subspace.
 */
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Info,
  MapPin,
  Users,
  Bot,
  Activity,
  CalendarDays,
  List,
  Layers,
  ChevronRight,
  ChevronUp,
  Check,
  ArrowUpLeft,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";

/* ─── APPROACH 1: Parent Frame ───
 * The ENTIRE sidebar sits inside a visible "parent space frame" — 
 * a colored container with the parent name on top that wraps the sidebar content.
 * You literally SEE the parent wrapping around the child.
 */
function ApproachParentFrame({ depth }: { depth: 1 | 2 }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex flex-col gap-0">
      {/* Parent frame — this IS the parent space, visible as a container */}
      <div
        className="relative transition-colors duration-200"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? "color-mix(in srgb, var(--primary) 8%, var(--secondary))" : "var(--secondary)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "10px 10px 12px 10px",
        }}
      >
        {/* Parent space header — always visible */}
        <a
          href="#"
          className="flex items-center gap-2 mb-3 px-1 group/parent transition-colors"
          style={{ textDecoration: "none" }}
        >
          <div
            className="w-5 h-5 rounded-sm flex items-center justify-center shrink-0 transition-transform duration-200 group-hover/parent:scale-110"
            style={{ background: "#22c55e" }}
          >
            <span style={{ color: "white", fontSize: "8px", fontWeight: 700 }}>S</span>
          </div>
          <span
            className="uppercase tracking-wider transition-colors duration-200"
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: hovered ? "var(--primary)" : "var(--muted-foreground)",
            }}
          >
            The Sandbox
          </span>
          <ArrowUpLeft className="w-3 h-3 opacity-0 group-hover/parent:opacity-60 transition-opacity" style={{ color: "var(--primary)" }} />
        </a>

        {depth === 2 && (
          <div
            style={{
              background: "color-mix(in srgb, var(--secondary) 60%, var(--background))",
              border: "1px solid var(--border)",
              borderRadius: "calc(var(--radius) - 2px)",
              padding: "8px 8px 10px 8px",
              marginBottom: 0,
            }}
          >
            <a href="#" className="flex items-center gap-2 mb-2 px-1 group/mid" style={{ textDecoration: "none" }}>
              <div className="w-4 h-4 rounded-sm flex items-center justify-center shrink-0" style={{ background: "#0ea5e9" }}>
                <span style={{ color: "white", fontSize: "7px", fontWeight: 700 }}>L</span>
              </div>
              <span className="uppercase tracking-wider" style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted-foreground)" }}>
                Lux-Lab
              </span>
            </a>
            <ChallengeBox />
          </div>
        )}

        {depth === 1 && <ChallengeBox />}
      </div>

      {/* Rest of sidebar (outside the frame) */}
      <div className="mt-6">
        <QuickActions />
      </div>
      <div className="mt-6">
        <VCCard />
      </div>
    </div>
  );
}

/* ─── APPROACH 2: Stacked with Visible Tab ───
 * The challenge box has a large visible "tab" above it showing the parent space.
 * Like a file folder tab — the parent is the folder, the content is inside.
 */
function ApproachStackedTab({ depth }: { depth: 1 | 2 }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        {/* Parent tab — sticking out above the challenge box */}
        <a
          href="#"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-t-md -mb-[1px] relative z-10 group/tab transition-colors duration-200 hover:bg-primary/5"
          style={{
            background: "var(--secondary)",
            border: "1px solid var(--border)",
            borderBottom: "1px solid var(--secondary)",
            textDecoration: "none",
            marginLeft: 8,
          }}
        >
          <div className="w-4 h-4 rounded-sm flex items-center justify-center" style={{ background: "#22c55e" }}>
            <span style={{ color: "white", fontSize: "7px", fontWeight: 700 }}>S</span>
          </div>
          <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted-foreground)" }}>
            The Sandbox
          </span>
          <ChevronUp className="w-3 h-3 opacity-40 group-hover/tab:opacity-80 transition-opacity" style={{ color: "var(--primary)" }} />
        </a>

        {depth === 2 && (
          <div
            className="-mb-[1px] relative z-[5]"
            style={{
              background: "color-mix(in srgb, var(--secondary) 70%, var(--background))",
              border: "1px solid var(--border)",
              borderBottom: "none",
              borderRadius: "var(--radius) var(--radius) 0 0",
              padding: "6px 10px",
            }}
          >
            <a href="#" className="inline-flex items-center gap-1.5" style={{ textDecoration: "none" }}>
              <div className="w-3.5 h-3.5 rounded-sm flex items-center justify-center" style={{ background: "#0ea5e9" }}>
                <span style={{ color: "white", fontSize: "6px", fontWeight: 700 }}>L</span>
              </div>
              <span style={{ fontSize: "9px", fontWeight: 600, color: "var(--muted-foreground)" }}>Lux-Lab</span>
            </a>
          </div>
        )}

        {/* Challenge box — connected to the tab */}
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: depth === 2 ? "0 var(--radius) var(--radius) var(--radius)" : "var(--radius)",
            overflow: "hidden",
          }}
        >
          <ChallengeBox noBorderRadius />
        </div>
      </div>
      <QuickActions />
      <VCCard />
    </div>
  );
}

/* ─── APPROACH 3: Bold Offset Stack ───
 * Massive offset — the parent card is clearly visible with a colored accent stripe.
 * The front box casts a strong shadow. Impossible to miss.
 */
function ApproachBoldStack({ depth }: { depth: 1 | 2 }) {
  const [parentHovered, setParentHovered] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div style={{ marginTop: 20, marginLeft: 16 }} className="relative">
        {/* Depth 2: grandparent card */}
        {depth === 2 && (
          <div
            className="absolute pointer-events-none"
            style={{
              top: -36,
              left: -28,
              width: "calc(100% + 4px)",
              height: "calc(100% + 8px)",
              background: "var(--muted)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-4 rounded-t-[5px] overflow-hidden" style={{ background: "#22c55e", opacity: 0.3 }} />
          </div>
        )}

        {/* Parent card — very visible, with colored header stripe */}
        <div
          className="absolute transition-all duration-200 cursor-pointer"
          style={{
            top: -20,
            left: -16,
            width: "calc(100% + 4px)",
            height: "calc(100% + 8px)",
            background: parentHovered ? "color-mix(in srgb, var(--primary) 4%, var(--card))" : "var(--card)",
            border: parentHovered ? "1.5px solid color-mix(in srgb, var(--primary) 30%, var(--border))" : "1px solid var(--border)",
            borderRadius: "var(--radius)",
            boxShadow: parentHovered ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
          }}
          onMouseEnter={() => setParentHovered(true)}
          onMouseLeave={() => setParentHovered(false)}
          title="Go to The Sandbox"
        >
          {/* Colored accent stripe — parent space identity */}
          <div
            className="absolute top-0 left-0 right-0 overflow-hidden"
            style={{ height: 6, borderRadius: "5px 5px 0 0", background: "#22c55e" }}
          />
          {/* Parent name on exposed area */}
          <div
            className="absolute flex items-center gap-2 transition-opacity duration-200"
            style={{
              top: 9,
              left: 10,
              opacity: parentHovered ? 1 : 0.7,
            }}
          >
            <div className="w-4 h-4 rounded-sm flex items-center justify-center" style={{ background: "#22c55e" }}>
              <span style={{ color: "white", fontSize: "7px", fontWeight: 700 }}>S</span>
            </div>
            <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--muted-foreground)" }}>
              The Sandbox
            </span>
            {parentHovered && (
              <ArrowUpLeft className="w-3 h-3" style={{ color: "var(--primary)", opacity: 0.6 }} />
            )}
          </div>
        </div>

        {/* Front: Challenge box — elevated, strong shadow */}
        <div
          className="relative"
          style={{
            boxShadow: "0 6px 20px -4px rgba(0,0,0,0.15), 0 2px 6px -2px rgba(0,0,0,0.08)",
            borderRadius: "var(--radius)",
          }}
        >
          <ChallengeBox />
        </div>
      </div>
      <QuickActions />
      <VCCard />
    </div>
  );
}

/* ─── APPROACH 4: Depth Rail ───
 * A polished vertical depth indicator on the left edge of the challenge box.
 * 
 * Design decisions (informed by platform audit):
 * - Width: 36px (matches w-9 rail buttons from SidebarIconRail)
 * - Avatar: uses the same 22×22px badge size as the parent badge overlay in SubspaceHeader
 * - Border-right: 2px solid, using color-mix with primary (matches existing hover-tinted borders)
 * - Rounded corners: radius-md (4px) on the left side only — matches avatar border-radius
 * - Hover: bg-muted (same as rail icon buttons), border → primary/40
 * - Typography: 10px uppercase tracking-wider (matches "LEAD" sub-labels)
 * - Spacing: gap of 6px (gap-1.5) between rail and box — matches sidebar icon gaps
 * - The rail has a subtle rounded-top-left and rounded-bottom-left to feel like a cohesive shape
 */
function ApproachRail({ depth }: { depth: 1 | 2 }) {
  const [railHovered, setRailHovered] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Challenge box with depth rail */}
      <div className="flex items-stretch gap-0">
        {/* Depth 2: Grandparent rail — shows the top-level space */}
        {depth === 2 && (
          <a
            href="#"
            className="shrink-0 flex flex-col items-center self-stretch transition-all duration-200 hover:bg-muted group/rail2"
            style={{
              width: 36,
              paddingTop: 10,
              paddingBottom: 10,
              borderRight: "1.5px solid var(--border)",
              borderTopLeftRadius: 6,
              borderBottomLeftRadius: 6,
              textDecoration: "none",
              marginRight: 2,
            }}
            title="Go to The Sandbox"
          >
            <div
              className="flex items-center justify-center transition-transform duration-200 group-hover/rail2:scale-110"
              style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                background: "#22c55e",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              <span style={{ color: "white", fontSize: "8px", fontWeight: 700, letterSpacing: "-0.02em" }}>S</span>
            </div>
            <div
              className="flex-1 flex items-center justify-center mt-2 overflow-hidden"
              style={{ maxHeight: "100%" }}
            >
              <span
                className="transition-opacity duration-200 group-hover/rail2:opacity-100"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                  fontSize: "9px",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "var(--muted-foreground)",
                  opacity: 0.5,
                  whiteSpace: "nowrap",
                }}
              >
                The Sandbox
              </span>
            </div>
          </a>
        )}

        {/* Primary parent rail */}
        <a
          href="#"
          className="shrink-0 flex flex-col items-center self-stretch transition-all duration-200 no-underline"
          style={{
            width: 36,
            paddingTop: 10,
            paddingBottom: 10,
            borderRight: railHovered
              ? "2px solid color-mix(in srgb, var(--primary) 50%, var(--border))"
              : "2px solid color-mix(in srgb, var(--primary) 20%, var(--border))",
            borderTopLeftRadius: depth === 2 ? 0 : 6,
            borderBottomLeftRadius: depth === 2 ? 0 : 6,
            background: railHovered ? "var(--muted)" : "transparent",
            textDecoration: "none",
          }}
          title={depth === 2 ? "Go to Lux-Lab" : "Go to The Sandbox"}
          onMouseEnter={() => setRailHovered(true)}
          onMouseLeave={() => setRailHovered(false)}
        >
          {/* Parent space avatar — matches SubspaceHeader parent badge sizing */}
          <div
            className="flex items-center justify-center transition-transform duration-200"
            style={{
              width: 22,
              height: 22,
              borderRadius: 4,
              background: depth === 2 ? "#0ea5e9" : "#22c55e",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              transform: railHovered ? "scale(1.1)" : "scale(1)",
            }}
          >
            <span style={{ color: "white", fontSize: "8px", fontWeight: 700, letterSpacing: "-0.02em" }}>
              {depth === 2 ? "L" : "S"}
            </span>
          </div>

          {/* Parent space name — vertical text */}
          <div
            className="flex-1 flex items-center justify-center mt-2 overflow-hidden"
            style={{ maxHeight: "100%" }}
          >
            <span
              className="transition-opacity duration-200"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                transform: "rotate(180deg)",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: railHovered ? "var(--foreground)" : "var(--muted-foreground)",
                opacity: railHovered ? 1 : 0.7,
                whiteSpace: "nowrap",
              }}
            >
              {depth === 2 ? "Lux-Lab" : "The Sandbox"}
            </span>
          </div>

          {/* Hover indicator — small arrow */}
          <div
            className="flex items-center justify-center transition-opacity duration-200"
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: railHovered ? "color-mix(in srgb, var(--primary) 10%, transparent)" : "transparent",
              opacity: railHovered ? 1 : 0,
            }}
          >
            <ArrowUpLeft className="w-3 h-3" style={{ color: "var(--primary)" }} />
          </div>
        </a>

        {/* Challenge box — with left border-radius removed to connect to rail */}
        <div className="flex-1 min-w-0" style={{ marginLeft: -1 }}>
          <div
            className="p-5"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              borderRadius: "0 var(--radius) var(--radius) 0",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4" style={{ opacity: 0.8 }} />
              <span className="uppercase tracking-wider" style={{ fontSize: "11px", fontWeight: 700, opacity: 0.8 }}>
                Challenge Statement
              </span>
            </div>
            <p style={{ fontSize: "13px", lineHeight: 1.6, opacity: 0.92 }}>
              How might we design a collaborative platform that empowers distributed teams to innovate effectively while maintaining social connection?
            </p>
            <div className="pt-3 mt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
              <p className="uppercase tracking-wider mb-2" style={{ fontSize: "10px", fontWeight: 700, opacity: 0.6 }}>Lead</p>
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8" style={{ border: "2px solid rgba(255,255,255,0.25)" }}>
                  <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
                  <AvatarFallback style={{ background: "rgba(255,255,255,0.15)", color: "white", fontSize: "9px", fontWeight: 700 }}>DK</AvatarFallback>
                </Avatar>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600 }}>David Kim</p>
                  <p className="flex items-center gap-1" style={{ fontSize: "11px", opacity: 0.7 }}>
                    <MapPin className="w-3 h-3" /> Berlin, DE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of sidebar — normal, no rail */}
      <QuickActions />
      <VCCard />
    </div>
  );
}

/* ─── Shared Components ─── */
function ChallengeBox({ noBorderRadius }: { noBorderRadius?: boolean }) {
  return (
    <div
      className="p-5"
      style={{
        background: "var(--primary)",
        color: "var(--primary-foreground)",
        borderRadius: noBorderRadius ? 0 : "var(--radius)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-4 h-4" style={{ opacity: 0.8 }} />
        <span className="uppercase tracking-wider" style={{ fontSize: "11px", fontWeight: 700, opacity: 0.8 }}>
          Challenge Statement
        </span>
      </div>
      <p style={{ fontSize: "13px", lineHeight: 1.6, opacity: 0.92 }}>
        How might we design a collaborative platform that empowers distributed teams to innovate effectively while maintaining social connection?
      </p>
      <div className="pt-3 mt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
        <p className="uppercase tracking-wider mb-2" style={{ fontSize: "10px", fontWeight: 700, opacity: 0.6 }}>Lead</p>
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8" style={{ border: "2px solid rgba(255,255,255,0.25)" }}>
            <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
            <AvatarFallback style={{ background: "rgba(255,255,255,0.15)", color: "white", fontSize: "9px", fontWeight: 700 }}>DK</AvatarFallback>
          </Avatar>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600 }}>David Kim</p>
            <p className="flex items-center gap-1" style={{ fontSize: "11px", opacity: 0.7 }}>
              <MapPin className="w-3 h-3" /> Berlin, DE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div>
      <p className="uppercase tracking-wider mb-3 px-1" style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted-foreground)" }}>
        Quick Actions
      </p>
      <div className="space-y-1">
        {[
          { icon: Activity, label: "Recent Activity" },
          { icon: Users, label: "Community" },
          { icon: CalendarDays, label: "Events" },
          { icon: List, label: "Index" },
          { icon: Layers, label: "Subspaces" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-md transition-colors hover:bg-muted/50"
            style={{ background: "color-mix(in srgb, var(--secondary) 30%, transparent)" }}
          >
            <Icon className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
            <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--foreground)" }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function VCCard() {
  return (
    <div className="p-4" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
      <div className="flex items-center gap-1.5 mb-3">
        <Bot className="w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} />
        <p className="uppercase tracking-wider" style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted-foreground)" }}>Virtual Contributor</p>
      </div>
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarFallback style={{ background: "color-mix(in srgb, var(--info) 15%, transparent)", color: "var(--info)", fontSize: "9px", fontWeight: 700 }}>DA</AvatarFallback>
        </Avatar>
        <div>
          <p style={{ fontSize: "13px", fontWeight: 500 }}>Design Advisor</p>
          <p className="line-clamp-2 mt-0.5" style={{ fontSize: "12px", color: "var(--muted-foreground)", lineHeight: 1.4 }}>AI assistant trained on design thinking frameworks.</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function SubspaceStackingExploration() {
  const [activeVariant, setActiveVariant] = useState<1 | 2 | 3 | 4>(1);
  const [depth, setDepth] = useState<1 | 2>(1);

  const variants = [
    { id: 1 as const, label: "Parent Frame", desc: "The sidebar content lives INSIDE a visible parent container — you can see the parent wrapping around you" },
    { id: 2 as const, label: "Folder Tab", desc: "A file-folder tab above the challenge box shows the parent — the content is 'inside' the folder" },
    { id: 3 as const, label: "Bold Stack", desc: "Massive offset with colored accent stripe — parent card clearly visible behind with name and color" },
    { id: 4 as const, label: "Depth Rail", desc: "A vertical rail on the left edge shows the parent — like indentation in a file tree" },
  ];

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "var(--font-family, 'Inter', sans-serif)" }}>
      {/* Header */}
      <div className="sticky top-0 z-50 border-b" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <h1 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
            Subspace Depth — Bold Approaches
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            Making it unmissable that you're one level deeper. The parent should be VISIBLE, not just hinted at.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Controls */}
        <div className="flex flex-wrap gap-6 mb-10">
          <div className="flex-1 min-w-[300px] p-4 rounded-lg" style={{ border: "1px solid var(--border)" }}>
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>Approach</p>
            <div className="space-y-1.5">
              {variants.map(v => (
                <button
                  key={v.id}
                  onClick={() => setActiveVariant(v.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-md transition-colors text-sm",
                    activeVariant === v.id ? "bg-primary/10 font-medium" : "hover:bg-muted"
                  )}
                  style={{ color: activeVariant === v.id ? "var(--primary)" : "var(--foreground)" }}
                >
                  <div className="flex items-center gap-2">
                    {activeVariant === v.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                    <span>{v.id}. {v.label}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)", paddingLeft: activeVariant === v.id ? 22 : 0 }}>
                    {v.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="w-[180px] p-4 rounded-lg" style={{ border: "1px solid var(--border)" }}>
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>Depth</p>
            <div className="space-y-2">
              {([1, 2] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDepth(d)}
                  className={cn(
                    "w-full px-3 py-2 rounded-md text-sm transition-colors text-left",
                    depth === d ? "bg-primary text-primary-foreground font-medium" : "bg-muted text-foreground hover:bg-muted/80"
                  )}
                >
                  {d === 1 ? "1 level" : "2 levels"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--background)" }}>
          {/* Mock nav */}
          <div className="px-6 py-3 flex items-center gap-3" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
            <div className="w-6 h-6 rounded bg-white/20" />
            <span className="text-xs font-medium opacity-80">THE SANDBOX</span>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <span className="text-xs font-semibold">RENEWABLE ENERGY</span>
          </div>

          {/* Banner */}
          <div className="h-16 bg-gradient-to-r from-emerald-500 to-teal-400" />

          {/* Subspace info bar */}
          <div className="px-6 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="w-10 h-10 rounded-md flex items-center justify-center text-xs font-bold text-white" style={{ background: "#22c55e" }}>RE</div>
            <div>
              <h2 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>Renewable Energy Transition</h2>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Accelerating the shift to sustainable energy sources</p>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-12 gap-6 p-6">
            {/* Sidebar with selected approach */}
            <div className="col-span-3 pt-2">
              {activeVariant === 1 && <ApproachParentFrame depth={depth} />}
              {activeVariant === 2 && <ApproachStackedTab depth={depth} />}
              {activeVariant === 3 && <ApproachBoldStack depth={depth} />}
              {activeVariant === 4 && <ApproachRail depth={depth} />}
            </div>

            {/* Content */}
            <div className="col-span-9">
              <div className="flex gap-4 mb-6 pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
                {["Introduction", "Body of Knowledge", "Platform Playground", "Creative Space"].map((tab, i) => (
                  <button
                    key={tab}
                    className={cn("text-sm pb-1 transition-colors", i === 1 ? "font-medium border-b-2" : "text-muted-foreground hover:text-foreground")}
                    style={i === 1 ? { borderColor: "var(--primary)", color: "var(--foreground)" } : undefined}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-4 rounded-md" style={{ border: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-muted" />
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Contributor Name</p>
                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>7/{i}/2025 · Post</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>Post title {i}</p>
                    <div className="h-3 w-3/4 rounded bg-muted/50" />
                    <div className="h-3 w-1/2 rounded bg-muted/50 mt-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
