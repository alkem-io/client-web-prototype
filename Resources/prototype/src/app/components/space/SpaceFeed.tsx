import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Plus, Pin, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { PostCard, type PostCardData } from "./PostCard";
import { AddPostModal } from "@/app/components/space/AddPostModal";
import { PostDetailDialog } from "@/app/components/dialogs/PostDetailDialog";
import { DocumentDetailDialog } from "@/app/components/dialogs/DocumentDetailDialog";
import { useSpaceFilters } from "@/app/components/space/FilterContext";
import { Card, CardContent } from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { ContributionGrid } from "@/app/components/contribution/ContributionGrid";
import { ContributionWhiteboardCard } from "@/app/components/contribution/ContributionWhiteboardCard";
import { ContributionPostCard } from "@/app/components/contribution/ContributionPostCard";
import { ContributionMemoCard } from "@/app/components/contribution/ContributionMemoCard";
import { ContributionLinkCard } from "@/app/components/contribution/ContributionLinkCard";

// Whiteboard Preview Images (using Unsplash to avoid module loading errors)
const wb1 = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1080";
const wb2 = "https://images.unsplash.com/photo-1574359219611-a3031f074b2c?auto=format&fit=crop&q=80&w=1080";
const wb3 = "https://images.unsplash.com/photo-1578401058525-35aaec0b4658?auto=format&fit=crop&q=80&w=1080";
const wb4 = "https://images.unsplash.com/photo-1596496050844-3613acf57a8e?auto=format&fit=crop&q=80&w=1080";

interface PostWithTags extends PostCardData {
  tags: string[];
  contributionType?: 'links' | 'posts' | 'memos' | 'whiteboards';
}

export function SpaceFeed() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostCardData | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{ title: string; docType: 'word' | 'spreadsheet' | 'presentation'; size: string; lastEdited?: string } | null>(null);
  const [selectedDocAuthor, setSelectedDocAuthor] = useState<{ name: string; avatarUrl?: string; role: string } | undefined>(undefined);
  const [collapseEnabled, setCollapseEnabled] = useState(() => {
    const stored = localStorage.getItem('alkemio-collapse-posts');
    return stored !== null ? stored === 'true' : false;
  });
  const { searchValue, activeTags, viewMode } = useSpaceFilters();

  // Persist collapse preference
  useEffect(() => {
    localStorage.setItem('alkemio-collapse-posts', String(collapseEnabled));
  }, [collapseEnabled]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'alkemio-collapse-posts' && e.newValue !== null) {
        setCollapseEnabled(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const posts: PostWithTags[] = [
    // 1. Plain post (text, no contributions)
    {
      id: "space-1",
      type: "text",
      tags: ["Updates", "Announcements"],
      author: {
        name: "Sarah Chen",
        role: "Lead",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      title: "Kickoff: Municipal Transition Strategy",
      snippet: "We are officially launching the strategy phase for the 2030 renewable transition. Our goal is to outline a clear path for municipalities to reach 100% renewable energy. Please review the initial policy draft in the 'Policy Drafts' channel.\n\nKey milestones for this quarter include completing the stakeholder mapping exercise, finalising the baseline energy consumption analysis, and drafting the first version of the policy framework. We've also scheduled three community workshops in April to gather public input on priority areas.\n\nPlease make sure to review the attached timeline and flag any conflicts with your department's schedule before Friday.",
      timestamp: "2 hours ago",
      commentCount: 5,
      embeddedImages: [
        { url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800", alt: "Solar panels on rooftop", position: "after" as const }
      ],
    },
    // 2. Post with a call for links & files
    {
      id: "space-2",
      type: "text",
      tags: ["Research", "Data"],
      contributionType: "links",
      author: {
        name: "David Miller",
        role: "Energy Analyst",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      title: "Share Resources: Grid Modernisation References",
      snippet: "We're collecting links to relevant research papers, vendor documentation, and regulatory databases. Drop your best resources below — anything related to smart meters, battery storage, or grid balancing.\n\nSpecifically, we need references covering: (1) IEEE standards for smart grid interoperability, (2) comparative analysis of battery storage technologies for municipal-scale deployment, (3) regulatory frameworks from municipalities that have already completed grid modernisation, and (4) cost-benefit analyses from pilot projects in comparable climates.\n\nPlease include a short description with each link so we can categorise them effectively.",
      timestamp: "4 hours ago",
      commentCount: 7,
    },
    // 3. Post with a call for posts
    {
      id: "space-3",
      type: "text",
      tags: ["Community", "Ideas"],
      contributionType: "posts",
      author: {
        name: "Elena Rodriguez",
        role: "Lead",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      title: "Share Your Success Stories: Community Solar Wins",
      snippet: "We want to hear from communities that have already started their solar journey. Share your experiences — what worked, what didn't, and advice for others just getting started.\n\nYour stories will be compiled into a best-practices guide that we'll distribute to all participating municipalities. We're especially interested in hearing about community engagement strategies, financing models that worked well, and any unexpected challenges you encountered during installation or grid connection.\n\nDon't worry about polish — authentic, practical accounts are exactly what we need.",
      timestamp: "6 hours ago",
      commentCount: 14,
    },
    // 4. Post with a call for memos
    {
      id: "space-4",
      type: "text",
      tags: ["Documentation", "Knowledge"],
      contributionType: "memos",
      author: {
        name: "Alex Contributor",
        role: "Member",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      title: "Document Best Practices: Energy Auditing Procedures",
      snippet: "Help us build a comprehensive library of energy auditing procedures. Write up your methodology, checklists, and lessons learned as structured memos.\n\nWe need documentation covering commercial buildings, residential properties, and municipal facilities. Each memo should include the pre-visit preparation steps, on-site assessment procedure, equipment list, and a template for the final report. If you've developed any innovative approaches to thermal imaging analysis or air infiltration testing, those would be particularly valuable.\n\nUse the memo format so we can maintain consistency across the knowledge base.",
      timestamp: "1 day ago",
      commentCount: 9,
    },
    // 5. Post with a call for whiteboards
    {
      id: "space-5",
      type: "text",
      tags: ["Ideas", "Design"],
      contributionType: "whiteboards",
      author: {
        name: "Michael Chang",
        role: "Researcher",
        avatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      title: "Call for Ideas: Community Solar Projects",
      snippet: "We need innovative concepts for integrating solar into existing municipal infrastructure. Sketch out your ideas for public buildings, parking lots, and open spaces.\n\nThink creatively about dual-use structures — solar canopies over parking lots that also provide EV charging, building-integrated photovoltaics on facades, or floating solar on reservoirs. Consider aesthetic integration with the urban landscape, maintenance access, and how each concept could serve as a visible symbol of the community's commitment to renewable energy.\n\nThe top three concepts will be presented to the city council next month.",
      timestamp: "1 day ago",
      commentCount: 12,
    },
  ];

  // Build contribution previews for each post
  function getContributionPreview(post: PostWithTags) {
    if (!post.contributionType) return undefined;

    switch (post.contributionType) {
      case 'links':
        return (
          <div className="mt-6 space-y-3 pt-6 border-t">
            <div className="flex items-center justify-between">
              <span className="text-label font-semibold text-muted-foreground">CONTRIBUTIONS (3)</span>
              <button className="inline-flex items-center gap-1.5 text-label font-semibold text-muted-foreground hover:text-foreground transition-colors">
                + ADD LINK OR FILE
              </button>
            </div>
            <div className="space-y-2">
              <ContributionLinkCard
                title="IEEE Smart Grid Standards"
                description="Comprehensive standards for smart grid interoperability"
              />
              <ContributionLinkCard
                title="Grid Modernisation Report 2026.pdf"
                description="Annual report on grid infrastructure upgrades"
                isFile={true}
              />
              <ContributionLinkCard
                title="Battery Storage Regulations EU"
                description="European Commission energy storage regulatory framework"
              />
            </div>
            <button className="text-label font-semibold text-muted-foreground hover:text-foreground transition-colors">
              +3 MORE
            </button>
          </div>
        );
      case 'posts':
        return (
          <div className="mt-6 space-y-3 pt-6 border-t">
            <div className="flex items-center justify-between">
              <span className="text-label font-semibold text-muted-foreground">CONTRIBUTIONS (5)</span>
            </div>
            <ContributionGrid totalCount={5} onAddClick={() => {}} addLabel="+ Add Post">
              <ContributionPostCard
                title="How Our Community Powered 200 Homes with Solar"
                author={{ name: "James Wilson" }}
                createdDate="03/12/2026"
                description="A practical story of how we navigated permits, funding, and installation to bring solar to a low-income housing estate."
                tags={["community", "solar", "case-study"]}
                commentCount={6}
              />
              <ContributionPostCard
                title="Lessons Learned: Our First Municipal Solar Farm"
                author={{ name: "Priya Sharma" }}
                createdDate="02/28/2026"
                description="Three years in, here's what we'd do differently — from vendor selection to community engagement."
                tags={["lessons", "solar-farm"]}
                commentCount={4}
              />
              <ContributionPostCard
                title="The Case for Community Ownership"
                author={{ name: "Elena Rodriguez" }}
                createdDate="02/15/2026"
                description="Why community-owned solar cooperatives outperform developer-led models in long-term community value."
                tags={["ownership", "cooperatives"]}
                commentCount={3}
              />
              <ContributionPostCard
                title="Grid Integration Challenges We Faced"
                author={{ name: "David Miller" }}
                createdDate="02/01/2026"
                description="Technical hurdles we encountered connecting our 2MW community array to the municipal distribution grid."
                tags={["grid", "technical", "integration"]}
                commentCount={7}
              />
              <ContributionPostCard
                title="Financing Models That Work"
                author={{ name: "Nina Petrova" }}
                createdDate="01/20/2026"
                description="Comparing PPAs, community bonds, and municipal green bonds for funding distributed solar projects."
                tags={["finance", "bonds", "PPA"]}
                commentCount={2}
              />
            </ContributionGrid>
          </div>
        );
      case 'memos':
        return (
          <div className="mt-6 space-y-3 pt-6 border-t">
            <div className="flex items-center justify-between">
              <span className="text-label font-semibold text-muted-foreground">CONTRIBUTIONS (3)</span>
            </div>
            <ContributionGrid totalCount={3} onAddClick={() => {}} addLabel="+ Add Memo">
              <ContributionMemoCard
                title="Commercial Building Audit Checklist"
                author="David Miller"
                markdownContent="## Commercial Building Energy Audit\n\n### Pre-Visit Checklist\n- [ ] Obtain floor plans\n- [ ] Review utility bills (12 months)\n- [ ] Identify HVAC systems\n\n### On-Site Steps\n1. Thermal imaging scan\n2. Air infiltration test\n3. Lighting assessment"
              />
              <ContributionMemoCard
                title="Residential Audit Quick Guide"
                author="Sarah Chen"
                markdownContent="## Residential Energy Audit\n\n### Key Areas\n- Insulation quality\n- Window seals & glazing\n- Heating system efficiency\n- Hot water system\n\n### Red Flags\n- Drafts near windows\n- Uneven temperatures\n- High baseline consumption"
              />
              <ContributionMemoCard
                title="Post-Audit Reporting Template"
                author="Alex Contributor"
                markdownContent="## Audit Report Template\n\n### Executive Summary\n[Brief overview of findings]\n\n### Recommendations\n| Priority | Action | Est. Savings |\n|----------|--------|-------------|\n| High | LED retrofit | 15% |\n| Medium | HVAC upgrade | 25% |"
              />
            </ContributionGrid>
          </div>
        );
      case 'whiteboards':
        return (
          <div className="mt-6 space-y-3 pt-6 border-t">
            <div className="flex items-center justify-between">
              <span className="text-label font-semibold text-muted-foreground">CONTRIBUTIONS (6)</span>
            </div>
            <ContributionGrid totalCount={6} onAddClick={() => {}} addLabel="+ Add Whiteboard">
              <ContributionWhiteboardCard
                title="Public Library Solar Roof"
                author="Sarah Chen"
                previewUrl={wb1}
              />
              <ContributionWhiteboardCard
                title="Parking Lot Canopies"
                author="David Miller"
                previewUrl={wb2}
              />
              <ContributionWhiteboardCard
                title="School Microgrids"
                author="Elena Rodriguez"
                previewUrl={wb3}
              />
              <ContributionWhiteboardCard
                title="Bus Stop Solar Stations"
                author="Michael Chang"
                previewUrl={wb4}
              />
              <ContributionWhiteboardCard
                title="Town Hall Retrofit"
                author="James Wilson"
                previewUrl={wb1}
              />
              <ContributionWhiteboardCard
                title="Park Lighting Solar"
                author="Lisa Park"
                previewUrl={wb2}
              />
            </ContributionGrid>
          </div>
        );
      default:
        return undefined;
    }
  }

  // Filter posts based on search and tag filters
  const filteredPosts = posts.filter((post) => {
    const q = searchValue.toLowerCase();
    const matchesSearch = !searchValue || 
      post.title.toLowerCase().includes(q) ||
      (post.snippet?.toLowerCase().includes(q) ?? false) ||
      (post.author?.name.toLowerCase().includes(q) ?? false);
    
    const matchesTags = activeTags.length === 0 || activeTags.every((tag) => post.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  return (
    <div className="w-full">
      {/* Lead Update — pinned announcement (temporarily hidden) */}
      {/* <LeadUpdate /> */}

      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
        {filteredPosts.map((post) => (
          <PostCard 
            key={post.id} 
            post={{
              ...post,
              descriptionExpanded: !collapseEnabled,
            }}
            onClick={() => setSelectedPost(post)}
            onExpandClick={() => setSelectedPost(post)}
            contributionsPreview={getContributionPreview(post)}
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" className="w-full sm:w-auto">
          Show More
        </Button>
      </div>

      <AddPostModal 
        open={isPostModalOpen} 
        onOpenChange={setIsPostModalOpen} 
      />
      <PostDetailDialog 
        open={!!selectedPost} 
        onOpenChange={(open) => !open && setSelectedPost(null)}
        post={selectedPost}
      />
      <DocumentDetailDialog
        open={!!selectedDocument}
        onOpenChange={(open) => !open && setSelectedDocument(null)}
        document={selectedDocument}
        author={selectedDocAuthor}
      />
    </div>
  );
}

/* ─── Lead Update (pinned announcement from space lead) ───────── */

function LeadUpdate() {
  return (
    <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/[0.03] to-transparent">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-9 h-9 border border-border shrink-0">
            <AvatarImage
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Elena Rodriguez"
            />
            <AvatarFallback>E</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Pin className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--primary)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--primary)" }}>
                Pinned by Elena Rodriguez · Lead
              </span>
              <span className="text-xs text-muted-foreground ml-auto shrink-0">3 days ago</span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              Welcome to the Q2 sprint! We're focusing on stakeholder alignment and finalizing the policy proposal. Please review the updated timeline in the Knowledge Base and flag any blockers in this week's check-in post.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

