import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router";
import { Plus, Layout, Activity, Video, FileText, Share2, Settings, ChevronsDownUp, ChevronsUpDown, PanelLeftClose, PanelLeftOpen, Search, Layers, X, Users, CalendarDays, List } from "lucide-react";
import { ReadMoreText } from "@/app/components/ui/ReadMoreText";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { Button } from "@/app/components/ui/button";
import { IconButton } from "@/app/components/ui/icon-button";
import { cn } from "@/lib/utils";
import { SubspaceHeader } from "@/app/components/space/SubspaceHeader";
import { SubspaceSidebar } from "@/app/components/space/SubspaceSidebar";
import { CalloutTabs, type CalloutTab } from "@/app/components/space/ChannelTabs";
import { PostCard, type PostProps } from "@/app/components/space/PostCard";
import { AddPostModal } from "@/app/components/space/AddPostModal";
import { PostDetailDialog } from "@/app/components/dialogs/PostDetailDialog";
import { ResponseDetailDialog } from "@/app/components/dialogs/ResponseDetailDialog";
import { SubspaceCommunityDialog } from "@/app/components/space/SubspaceCommunityDialog";
import { ContributionGrid } from "../components/contribution/ContributionGrid";
import { ContributionWhiteboardCard } from "../components/contribution/ContributionWhiteboardCard";
import { ContributionPostCard } from "../components/contribution/ContributionPostCard";

/* ─── Mock subspace metadata ─── */

// Parent space banner — subspaces always inherit their parent's banner
const PARENT_SPACE_BANNER = "https://images.unsplash.com/photo-1690191863988-f685cddde463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBjaGFsbGVuZ2UlMjBjcmVhdGl2ZSUyMHdvcmtzaG9wJTIwdGVhbSUyMGNvbGxhYm9yYXRpb24lMjBpbm5vdmF0aW9uJTIwc3ByaW50JTIwZGVzaWduJTIwc3ByaW50fGVufDF8fHx8MTc2OTA5NDMxMHww&ixlib=rb-4.1.0&q=80&w=1920";

interface SubspaceInfo {
  title: string;
  description: string;
  parentName: string;
  initials: string;
  avatarColor: string;
  avatarImage?: string;
  parentInitials: string;
  parentAvatarColor: string;
  memberCount: number;
  callouts: CalloutTab[];
}

const SUBSPACE_MAP: Record<string, SubspaceInfo> = {
  "renewable-energy-transition": {
    title: "Renewable Energy Transition",
    description:
      "Developing strategies for municipal energy transition to 100% renewables by 2030.",
    parentName: "Green Energy Space",
    initials: "RE",
    avatarColor: "#22c55e",
    avatarImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    parentInitials: "GE",
    parentAvatarColor: "#2563eb",
    memberCount: 24,
    callouts: [
      { id: "strategy", label: "Strategy Docs", description: "Core strategy documents and roadmaps for the 2030 municipal energy transition. This collection includes multi-year planning frameworks, cost-benefit analyses for renewable infrastructure, stakeholder alignment reports, and phased deployment timelines developed in collaboration with regional energy authorities and academic research partners.", count: 5, linkedToNext: true },
      { id: "municipal", label: "Municipal Data", description: "Data sets and reports from participating municipalities, including energy consumption baselines, renewable capacity assessments, grid infrastructure surveys, and quarterly progress metrics tracked across all pilot regions.", linkedToNext: true },
      { id: "policy", label: "Policy Drafts", description: "Draft policy frameworks and regulatory proposals.", count: 2, linkedToNext: false },
      { id: "stakeholders", label: "Stakeholders", description: "Stakeholder mapping, contacts, and engagement plans.", linkedToNext: false },
    ],
  },
  "urban-mobility-lab": {
    title: "Urban Mobility Lab",
    description:
      "Reimagining city transportation networks for better accessibility and reduced carbon footprint.",
    parentName: "Green Energy Space",
    initials: "UM",
    avatarColor: "#0891b2",
    avatarImage: "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    parentInitials: "GE",
    parentAvatarColor: "#2563eb",
    memberCount: 18,
    callouts: [
      { id: "research", label: "Research", description: "Studies and literature on urban mobility patterns.", count: 3, linkedToNext: true },
      { id: "prototypes", label: "Prototypes", description: "Prototype designs and pilot programme documentation.", linkedToNext: false },
      { id: "field-tests", label: "Field Tests", description: "On-the-ground testing results and feedback.", count: 1, linkedToNext: false },
    ],
  },
  "green-infrastructure": {
    title: "Green Infrastructure",
    description:
      "Planning and implementation of urban green spaces, vertical gardens, and sustainable drainage.",
    parentName: "Green Energy Space",
    initials: "GI",
    avatarColor: "#16a34a",
    avatarImage: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    parentInitials: "GE",
    parentAvatarColor: "#2563eb",
    memberCount: 12,
    callouts: [
      { id: "planning", label: "Planning", description: "Urban green space planning documents and proposals.", count: 4, linkedToNext: true },
      { id: "implementation", label: "Implementation", description: "Progress updates and implementation guides.", linkedToNext: false },
    ],
  },
};

// Fallback for unrecognized slugs
const DEFAULT_SUBSPACE: SubspaceInfo = {
  title: "Subspace",
  description: "A focused collaboration area.",
  parentName: "Space",
  initials: "SS",
  avatarColor: "#64748b",
  parentInitials: "SP",
  parentAvatarColor: "#475569",
  memberCount: 10,
  callouts: [
    { id: "general", label: "General", description: "General discussions and shared content." },
  ],
};

/* ─── Mock posts with callout tags ─── */
const wb1 =
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1080";
const wb2 =
  "https://images.unsplash.com/photo-1574359219611-a3031f074b2c?auto=format&fit=crop&q=80&w=1080";

interface Response {
  id: string;
  type: "whiteboard" | "document" | "post" | "memo" | "link-file";
  title: string;
  author?: { name: string; role?: string; avatarUrl?: string };
  previewUrl?: string;
  createdDate?: string;
  description?: string;
  tags?: string[];
  commentCount?: number;
}

interface CalloutPost extends PostProps {
  callout: string; // matches a callout id
  responses?: Response[];
  /** @deprecated legacy compat — use commentCount */
  stats?: { comments: number; likes: number };
}

const SUBSPACE_POSTS: CalloutPost[] = [
  {
    id: "sp-1",
    type: "text",
    callout: "strategy",
    author: {
      name: "Sarah Chen",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    title: "Kickoff: Municipal Transition Strategy",
    snippet:
      "We are officially launching the strategy phase for the 2030 renewable transition. Our goal is to outline a clear path for municipalities to reach 100% renewable energy.",
    timestamp: "2 hours ago",
    commentCount: 5,
  },
  {
    id: "sp-2",
    type: "whiteboard",
    callout: "strategy",
    author: {
      name: "David Kim",
      avatarUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    title: "Renewable Grid Architecture — Visual Mapping",
    snippet:
      "Interactive whiteboard exploring the interconnections between solar, wind and storage for the 2030 grid model.",
    timestamp: "5 hours ago",
    framingImageUrl: wb1,
    commentCount: 3,
  },
  {
    id: "sp-3",
    type: "text",
    callout: "policy",
    author: {
      name: "Emily Davis",
      avatarUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    title: "Draft: Incentive Framework for Early Adopters",
    snippet:
      "Sharing the first draft of the municipal incentive framework. Please review Section 3 on tax credits and provide feedback by Friday.",
    timestamp: "1 day ago",
    commentCount: 8,
  },
  {
    id: "sp-4",
    type: "text",
    callout: "municipal",
    author: {
      name: "Alex Torres",
      avatarUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    title: "Call for Ideas: Community Solar Projects",
    snippet:
      "We need ideas on how to best involve communities in shared solar projects. Submit your whiteboard proposals below.",
    timestamp: "2 days ago",
    commentCount: 12,
    responses: [
      {
        id: "r1",
        type: "whiteboard",
        title: "Community Solar Model A",
        author: { name: "Sarah Chen", role: "Lead", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
        previewUrl: wb1,
        createdDate: "2 days ago",
        commentCount: 4
      },
      {
        id: "r2",
        type: "whiteboard",
        title: "Rooftop Sharing Plan",
        author: { name: "David Kim", role: "Member", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
        previewUrl: wb2,
        createdDate: "2 days ago",
        commentCount: 2
      },
    ],
  },
  {
    id: "sp-5",
    type: "text",
    callout: "stakeholders",
    author: {
      name: "Anna Martinez",
      avatarUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    title: "Stakeholder Contact Directory",
    snippet:
      "Compiled directory of all stakeholders across municipal, industry, and NGO sectors involved in the transition programme.",
    timestamp: "3 days ago",
    commentCount: 2,
    responses: [
      {
        id: "r1",
        type: "document",
        title: "Municipality Contacts",
        author: { name: "Anna Martinez", role: "Lead", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
        createdDate: "3 days ago",
        commentCount: 1
      },
      {
        id: "r2",
        type: "document",
        title: "Industry Partners",
        author: { name: "Anna Martinez", role: "Lead", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
        createdDate: "3 days ago",
        commentCount: 0
      },
      {
        id: "r3",
        type: "document",
        title: "NGO Directory",
        author: { name: "Anna Martinez", role: "Lead", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
        createdDate: "3 days ago",
        commentCount: 1
      },
    ],
  },
  {
    id: "sp-6",
    type: "text",
    callout: "policy",
    author: {
      name: "Robert Fox",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    title: "Comparative Analysis: EU Renewable Directives",
    snippet:
      "A comparative study of EU member-state approaches to the Renewable Energy Directive (RED III) and implications for our municipal framework.",
    timestamp: "4 days ago",
    commentCount: 4,
  },
];

/* ─── Page Component ─── */
export default function SubspacePage() {
  const {
    spaceSlug = "green-energy",
    subspaceSlug = "renewable-energy-transition",
  } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const variant = (parseInt(searchParams.get("v") || "1") || 1) as 1 | 2 | 3 | 4 | 5;

  const info = SUBSPACE_MAP[subspaceSlug] || {
    ...DEFAULT_SUBSPACE,
    title: subspaceSlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  };

  const [activeCallout, setActiveCallout] = useState(info.callouts[0]?.id ?? "");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCommunityDialogOpen, setIsCommunityDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostProps | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);

  // Listen for sidebar "New Post" button event
  useEffect(() => {
    const handler = () => setIsPostModalOpen(true);
    window.addEventListener("open-add-post-modal", handler);
    return () => window.removeEventListener("open-add-post-modal", handler);
  }, []);
  const [collapseEnabled, setCollapseEnabled] = useState(() => {
    const stored = localStorage.getItem('alkemio-collapse-posts');
    return stored !== null ? stored === 'true' : true;
  });

  // Sync collapse preference with space-level
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'alkemio-collapse-posts' && e.newValue !== null) {
        setCollapseEnabled(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Filter posts by active phase
  const filteredPosts = useMemo(
    () => SUBSPACE_POSTS.filter((p) => p.callout === activeCallout),
    [activeCallout]
  );

  /* ─── Feed content (shared between full & railed modes) ─── */
  const feedContent = (
    <>
      {/* Sticky innovation flow bar — inside content column, above feed */}
      <div
        className="sticky top-16 z-10 pt-4 pb-0"
        style={{
          background:
            "color-mix(in srgb, var(--background) 95%, transparent)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          paddingLeft: 10,
          paddingRight: 10,
          marginLeft: -10,
          marginRight: -10,
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() =>
                    navigate(
                      `/space/${spaceSlug}/subspaces/${subspaceSlug}/settings/layout`
                    )
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
          <CalloutTabs
            tabs={info.callouts}
            activeTab={activeCallout}
            onTabChange={setActiveCallout}
          />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[
                { icon: Activity, title: "Recent Activity" },
                { icon: Video, title: "Video Call" },
                { icon: FileText, title: "Documents" },
                { icon: Share2, title: "Share" },
              ].map(({ icon: Icon, title }) => (
                <IconButton
                  key={title}
                  tooltipLabel={title}
                  className="w-7 h-7 rounded-lg"
                  style={{
                    background: "color-mix(in srgb, var(--foreground) 8%, transparent)",
                    color: "var(--muted-foreground)",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </IconButton>
              ))}
              <IconButton
                tooltipLabel="Settings"
                className="w-7 h-7 rounded-lg"
                asChild
                style={{
                  background: "color-mix(in srgb, var(--foreground) 8%, transparent)",
                  color: "var(--muted-foreground)",
                }}
              >
                <Link to={`/space/${spaceSlug}/subspaces/${subspaceSlug}/settings/about`}>
                  <Settings className="w-3.5 h-3.5" />
                </Link>
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      {/* Content below innovation flow — mt-6 matches grid gap-6 from space level */}
      <div className="mt-6">
        {/* Tab description */}
        {info.callouts.find((c) => c.id === activeCallout)?.description && (
          <div className="mb-4">
            <ReadMoreText
              maxLines={2}
              className="text-sm text-foreground/85 leading-relaxed"
              toggleColor="var(--foreground)"
              toggleOpacity={0.75}
            >
              {info.callouts.find((c) => c.id === activeCallout)?.description}
            </ReadMoreText>
          </div>
        )}

        {/* Feed */}
        <div className="flex items-center justify-end mb-4">
          <button onClick={() => { setCollapseEnabled(!collapseEnabled); localStorage.setItem('alkemio-collapse-posts', String(!collapseEnabled)); }} className="flex items-center gap-1.5 text-caption font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            {collapseEnabled ? (<><ChevronsUpDown className="w-3.5 h-3.5" /> Expand all posts</>) : (<><ChevronsDownUp className="w-3.5 h-3.5" /> Collapse posts</>)}
          </button>
        </div>

        <div className="space-y-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => {
              const contributionsPreview = post.responses && post.responses.length > 0 ? (
                <div className="pt-4">
                  <div className="text-sm font-semibold text-foreground mb-3">CONTRIBUTIONS ({post.responses.length})</div>
                  <ContributionGrid
                    totalCount={post.responses.length}
                  >
                    {post.responses.map((response) => (
                      response.type === 'whiteboard' ? (
                        <ContributionWhiteboardCard
                          key={response.id}
                          title={response.title}
                          previewUrl={response.previewUrl}
                          author={response.author?.name}
                          onClick={() => setSelectedResponse(response)}
                        />
                      ) : (
                        <ContributionPostCard
                          key={response.id}
                          title={response.title}
                          author={response.author}
                          createdDate={response.createdDate}
                          description={response.description}
                          tags={response.tags}
                          commentCount={response.commentCount}
                          onClick={() => setSelectedResponse(response)}
                        />
                      )
                    ))}
                  </ContributionGrid>
                </div>
              ) : undefined;

              return (
                <PostCard
                  key={post.id}
                  post={{
                    ...post,
                    descriptionExpanded: !collapseEnabled,
                  }}
                  onClick={() => setSelectedPost(post)}
                  contributionsPreview={contributionsPreview}
                />
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-md">
              <p className="text-sm text-foreground mb-1">
                No posts in this phase yet
              </p>
              <p className="text-sm text-muted-foreground">
                Be the first to share something here.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col bg-background">
      {/* ── Subspace Banner Header ── */}
      <SubspaceHeader
        spaceSlug={spaceSlug}
        subspaceSlug={subspaceSlug}
        title={info.title}
        description={info.description}
        parentSpaceName={info.parentName}
        imageUrl={PARENT_SPACE_BANNER}
        initials={info.initials}
        avatarColor={info.avatarColor}
        avatarImage={info.avatarImage}
        parentInitials={info.parentInitials}
        parentAvatarColor={info.parentAvatarColor}
        parentBannerImage={PARENT_SPACE_BANNER}
        memberCount={info.memberCount}
        onCommunityClick={() => setIsCommunityDialogOpen(true)}
        variant={variant}
      />

      {/* ── Main Content Area (mirrors SpaceShell grid) ── */}
      <div className="w-full px-4 pt-0 pb-8" style={{ paddingLeft: 32, paddingRight: 32 }}>
        <div className="grid grid-cols-12 gap-6 items-start">

          {!isSidebarCollapsed ? (
            <>
              {/* ═══ FULL SIDEBAR MODE ═══ */}
              <div className="hidden lg:block col-span-2 lg:col-start-2 sticky top-[8.5rem] self-start">
                <aside>
                  <SubspaceSidebar
                    isCollapsed={false}
                    onToggleCollapse={() => setIsSidebarCollapsed(true)}
                  />
                  <button
                    onClick={() => setIsSidebarCollapsed(true)}
                    className="hidden lg:flex items-center gap-1.5 w-full mt-2 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Collapse sidebar"
                  >
                    <PanelLeftClose className="w-3.5 h-3.5" />
                    <span>Collapse</span>
                  </button>
                </aside>
              </div>
              <div className="col-span-12 lg:col-span-8 min-w-0">
                {feedContent}
              </div>
            </>
          ) : (
            /* ═══ RAILED MODE: flex layout matching SpaceShell ═══ */
            <div className="col-span-12 lg:col-start-2 lg:col-span-10 min-w-0">
              <div className="flex relative">
                <SubspaceIconRail
                  onExpand={() => setIsSidebarCollapsed(false)}
                  onPostClick={() => setIsPostModalOpen(true)}
                />
                <div className="flex-1 min-w-0 ml-3">
                  {feedContent}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Add Post Modal */}
      <AddPostModal
        open={isPostModalOpen}
        onOpenChange={setIsPostModalOpen}
      />

      {/* Post Detail Dialog (L1) */}
      <PostDetailDialog
        open={!!selectedPost}
        onOpenChange={(open) => !open && setSelectedPost(null)}
        post={selectedPost}
      />

      {/* Response Detail Dialog (L2) */}
      <ResponseDetailDialog
        open={!!selectedResponse}
        onOpenChange={(open) => !open && setSelectedResponse(null)}
        responseId={selectedResponse?.id}
      />

      {/* Community Dialog */}
      <SubspaceCommunityDialog
        open={isCommunityDialogOpen}
        onOpenChange={setIsCommunityDialogOpen}
      />
    </div>
  );
}

/* ─── SubspaceIconRail — collapsed sidebar icon strip ─── */

const SUB_SUBSPACE_LINKS = [
  { name: "Solar Panel Deployment", id: "solar" },
  { name: "Wind Farm Feasibility", id: "wind" },
  { name: "Battery Storage Research", id: "battery" },
];

function SubspaceIconRail({ onExpand, onPostClick }: { onExpand: () => void; onPostClick: () => void }) {
  const [activePopover, setActivePopover] = useState<string | null>(null);

  const togglePopover = (id: string) => {
    setActivePopover(activePopover === id ? null : id);
  };

  return (
    <div className="hidden lg:flex flex-col items-center gap-0 shrink-0 sticky top-[8.5rem] self-start">
      <div className="relative">
        {/* Icon rail */}
        <div className="flex flex-col items-center gap-0">
          {/* Expand toggle */}
          <TooltipProvider delayDuration={300}>
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

            {/* Search & Filter */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => togglePopover("search")}
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                    activePopover === "search"
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Search className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Search & Filter</TooltipContent>
            </Tooltip>

            {/* Post/Contribute */}
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

            {/* Subspaces */}
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

            {/* Recent Activity */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => togglePopover("activity")}
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                    activePopover === "activity"
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Activity className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Recent Activity</TooltipContent>
            </Tooltip>

            {/* Community */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => togglePopover("community")}
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                    activePopover === "community"
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Users className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Community</TooltipContent>
            </Tooltip>

            {/* Events */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => togglePopover("events")}
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                    activePopover === "events"
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <CalendarDays className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Events</TooltipContent>
            </Tooltip>

            {/* Index */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => togglePopover("index")}
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                    activePopover === "index"
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Index</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Floating popover overlays */}
        {activePopover && (
          <div className="absolute left-10 top-0 w-64 z-20">
            <div className="relative rounded-xl border border-border bg-card shadow-lg p-4 animate-in slide-in-from-left-2 duration-200">
              {/* Close button */}
              <button
                onClick={() => setActivePopover(null)}
                className="absolute top-2 right-2 w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Search popover */}
              {activePopover === "search" && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Search & Filter</h4>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search posts…"
                      className="w-full h-9 pl-8 pr-3 text-sm rounded-lg border border-border bg-input-background text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Strategy", "Policy", "Solar", "Grid", "Stakeholders", "Data", "Funding", "Community"].map((tag) => (
                      <button
                        key={tag}
                        className="px-2.5 py-1 rounded-full text-xs font-medium transition-colors bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Post popover */}
              {activePopover === "post" && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Contribute</h4>
                  <div className="space-y-2">
                    <Button size="sm" className="w-full justify-start gap-2" onClick={() => { setActivePopover(null); onPostClick(); }}>
                      <Plus className="w-3.5 h-3.5" />
                      New Post
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start gap-2">
                      <Layers className="w-3.5 h-3.5" />
                      Create Subspace
                    </Button>
                  </div>
                </div>
              )}

              {/* Subspaces popover */}
              {activePopover === "subspaces" && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Subspaces</h4>
                  <div className="space-y-1">
                    {SUB_SUBSPACE_LINKS.map((sub) => (
                      <button
                        key={sub.id}
                        className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Activity popover */}
              {activePopover === "activity" && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Recent Activity</h4>
                  <div className="space-y-2.5">
                    {[
                      { user: "Sarah Chen", action: "posted", target: "Kickoff: Municipal Transition Strategy", time: "2h ago" },
                      { user: "David Kim", action: "added whiteboard", target: "Grid Architecture", time: "5h ago" },
                      { user: "Emily Davis", action: "commented on", target: "Incentive Framework", time: "1d ago" },
                    ].map((item, i) => (
                      <div key={i} className="text-sm">
                        <p className="text-foreground">
                          <span className="font-medium">{item.user}</span>{" "}
                          <span className="text-muted-foreground">{item.action}</span>{" "}
                          <span className="font-medium">{item.target}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Community popover */}
              {activePopover === "community" && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Community</h4>
                  <p className="text-xs text-muted-foreground">16 members</p>
                  <div className="space-y-1.5">
                    {[
                      { name: "Sarah Chen", role: "Lead" },
                      { name: "David Kim", role: "Lead" },
                      { name: "Emily Davis", role: "Member" },
                      { name: "Alex Torres", role: "Member" },
                    ].map((m) => (
                      <div key={m.name} className="flex items-center justify-between px-2 py-1.5 rounded-md text-sm hover:bg-muted/50 transition-colors">
                        <span className="text-foreground">{m.name}</span>
                        <span className="text-xs text-muted-foreground">{m.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events popover */}
              {activePopover === "events" && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Events</h4>
                  <div className="space-y-2">
                    {[
                      { title: "Strategy Workshop", date: "Apr 25", status: "upcoming" },
                      { title: "Stakeholder Review", date: "Apr 28", status: "upcoming" },
                      { title: "Policy Feedback Session", date: "May 2", status: "upcoming" },
                    ].map((ev) => (
                      <div key={ev.title} className="flex items-center justify-between px-2 py-1.5 rounded-md text-sm hover:bg-muted/50 transition-colors">
                        <span className="text-foreground">{ev.title}</span>
                        <span className="text-xs text-muted-foreground">{ev.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Index popover */}
              {activePopover === "index" && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Index</h4>
                  <div className="space-y-1">
                    {[
                      { title: "Kickoff: Municipal Transition Strategy", type: "Post" },
                      { title: "Renewable Grid Architecture", type: "Whiteboard" },
                      { title: "Draft: Incentive Framework", type: "Post" },
                      { title: "Call for Ideas: Community Solar", type: "Call" },
                    ].map((item) => (
                      <button key={item.title} className="flex items-start gap-2 w-full text-left px-2 py-1.5 rounded-md text-sm hover:bg-muted/50 transition-colors">
                        <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
                        <div className="min-w-0">
                          <p className="truncate text-foreground">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.type}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}