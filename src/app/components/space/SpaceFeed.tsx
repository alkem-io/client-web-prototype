import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Plus, Pin } from "lucide-react";
import { PostCard, PostProps } from "./PostCard";
import { AddPostModal } from "@/app/components/space/AddPostModal";
import { PostDetailDialog } from "@/app/components/dialogs/PostDetailDialog";
import { DocumentDetailDialog } from "@/app/components/dialogs/DocumentDetailDialog";
import { useSpaceFilters } from "@/app/components/space/FilterContext";
import { Card, CardContent } from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";

// Whiteboard Preview Images (using Unsplash to avoid module loading errors)
const wb1 = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1080";
const wb2 = "https://images.unsplash.com/photo-1574359219611-a3031f074b2c?auto=format&fit=crop&q=80&w=1080";
const wb3 = "https://images.unsplash.com/photo-1578401058525-35aaec0b4658?auto=format&fit=crop&q=80&w=1080";
const wb4 = "https://images.unsplash.com/photo-1596496050844-3613acf57a8e?auto=format&fit=crop&q=80&w=1080";

interface PostWithTags extends PostProps {
  tags: string[];
}

export function SpaceFeed() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostProps | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{ title: string; docType: 'word' | 'spreadsheet' | 'presentation'; size: string; lastEdited?: string } | null>(null);
  const [selectedDocAuthor, setSelectedDocAuthor] = useState<{ name: string; avatarUrl?: string; role: string } | undefined>(undefined);
  const { searchValue, activeTags, viewMode } = useSpaceFilters();

  const posts: PostWithTags[] = [
    {
      id: "1",
      type: "text",
      tags: ["Updates", "Announcements"],
      author: {
        name: "Sarah Chen",
        role: "Lead",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        location: "Amsterdam, NL",
        skills: ["Energy Systems", "Green Tech", "Data Analysis", "Renewable Energy", "Smart Grids"],
      },
      title: "Kickoff: Municipal Transition Strategy",
      snippet: "We are officially launching the strategy phase for the 2030 renewable transition. Our goal is to outline a clear path for municipalities to reach 100% renewable energy. Please review the initial policy draft in the 'Policy Drafts' channel.",
      timestamp: "2 hours ago",
      stats: { comments: 5 },
      commentTexts: ["Great initiative! I think we should prioritize the northern districts first.", "Can we get a timeline for the stakeholder consultations?", "The policy draft looks solid, but we need more detail on subsidies.", "I agree with Sarah — let's set up a working group.", "Has anyone looked at the Danish model for comparison?"]
    },
    {
      id: "4",
      type: "call-for-whiteboards",
      tags: ["Ideas", "Updates"],
      author: {
        name: "Alex Contributor",
        role: "Member",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        location: "Lisbon, PT",
        skills: ["Community Engagement", "Solar Energy", "Project Management"],
      },
      title: "Call for Ideas: Community Solar Projects",
      snippet: "We need innovative concepts for integrating solar into existing municipal infrastructure. Please sketch out your ideas for public buildings, parking lots, and open spaces.",
      timestamp: "3 hours ago",
      contentPreview: {
        whiteboards: [
            { title: "Public Library Solar Roof", imageUrl: wb1, author: "Sarah Chen" },
            { title: "Parking Lot Canopies", imageUrl: wb2, author: "David Miller" },
            { title: "School Microgrids", imageUrl: wb3, author: "Elena Rodriguez" },
            { title: "Bus Stop Solar Stations", imageUrl: wb4, author: "Marc Johnson" },
            { title: "Town Hall Retrofit", imageUrl: wb1, author: "John Smith" },
            { title: "Park Lighting", imageUrl: wb2, author: "Emily Davis" }
        ]
      },
      stats: { comments: 8 },
      commentTexts: ["Love the parking lot canopy concept!", "We should consider wind load requirements for the school microgrids.", "The bus stop stations could double as EV chargers.", "What's the estimated ROI on the library roof?", "Can we integrate battery storage into these designs?", "The town hall retrofit should be our flagship project.", "Great sketches David — very detailed.", "Let's schedule a site visit for the top 3 locations."]
    },
    {
      id: "2",
      type: "document",
      tags: ["Updates", "Events"],
      author: {
        name: "David Miller",
        role: "Member",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        location: "Seoul, KR",
        skills: ["Software Development", "Grid Systems", "Infrastructure", "Smart Metering"],
      },
      title: "2030 Renewable Transition Policy Proposal",
      snippet: "The latest draft of our comprehensive policy proposal is ready for review. It covers the full strategic framework including grid modernization, community solar, building electrification, and fleet conversion — with updated budget projections and implementation timeline.",
      timestamp: "4 hours ago",
      contentPreview: {
        documents: [
          { title: "2030 Renewable Transition Policy Proposal.docx", docType: "word", size: "1.8 MB", lastEdited: "2 hours ago" }
        ],
        documentDisplayMode: 'scroll'
      },
      stats: { comments: 6 },
      commentTexts: ["The budget projections look reasonable but we need to factor in inflation.", "Section 3 on grid modernization needs more technical detail.", "Can we add a risk assessment section?", "The community solar chapter is excellent.", "I've sent my tracked changes to David.", "When is the final review deadline?"]
    },
    {
      id: "5",
      type: "whiteboard",
      tags: ["Ideas", "Updates"],
      author: {
        name: "David Miller",
        role: "Member",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        location: "Seoul, KR",
        skills: ["Software Development", "Grid Systems", "Infrastructure", "Smart Metering"],
      },
      title: "Brainstorming: Municipal Infrastructure Upgrades",
      snippet: "Outputs from our session on grid modernization. Key clusters include smart metering, battery storage integration, and EV charging networks.",
      timestamp: "5 hours ago",
      contentPreview: {
        imageUrl: wb3
      },
      stats: { comments: 3 },
      commentTexts: ["The smart metering cluster is the highest priority.", "We should explore partnerships with local utilities for battery storage.", "EV charging networks need a phased rollout plan."]
    },
    {
      id: "3",
      type: "document",
      tags: ["Announcements", "Events"],
      author: {
        name: "Elena Rodriguez",
        role: "Lead",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        location: "Valencia, ES",
        skills: ["Strategy", "Stakeholder Relations", "Policy", "Budgeting", "Presentations"],
      },
      title: "2030 Renewable Transition — Working Documents",
      snippet: "Sharing the latest drafts for the transition strategy. The policy proposal has been updated with feedback from last week's stakeholder session, and the budget model now includes the revised subsidy figures.",
      timestamp: "1 day ago",
      contentPreview: {
        documents: [
          { title: "2030 Renewable Transition Policy Proposal.docx", docType: "word", size: "1.8 MB", lastEdited: "6 hours ago" },
          { title: "Municipal Budget Model FY2027–2030.xlsx", docType: "spreadsheet", size: "3.1 MB", lastEdited: "1 day ago" },
          { title: "Stakeholder Presentation — April Update.pptx", docType: "presentation", size: "12.4 MB", lastEdited: "2 days ago" }
        ],
        documentDisplayMode: 'paginated'
      },
      stats: { comments: 9 },
      commentTexts: ["The revised subsidy figures look much more realistic.", "Can we add a comparison table for the three scenarios?", "The stakeholder presentation needs updating for the May meeting.", "Budget model looks great — nice work on the projections.", "I noticed a formula error in the FY2029 column.", "Should we include contingency funding?", "The policy proposal is ready for external review.", "Let's share this with the mayor's office.", "When do we present to council?"]
    },
    {
      id: "6",
      type: "collection",
      tags: ["Updates", "Ideas"],
      author: {
        name: "Elena Rodriguez",
        role: "Lead",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        location: "Valencia, ES",
        skills: ["Strategy", "Stakeholder Relations", "Policy", "Budgeting", "Presentations"],
      },
      title: "Transition Case Studies & Policy Docs",
      snippet: "A collection of successful case studies from similar sized municipalities reaching 100% renewables. Essential reading for the strategy team.",
      timestamp: "1 day ago",
      contentPreview: {
        items: [
          { title: "Burlington, VT Case Study", type: "pdf" },
          { title: "Aspen, CO Transition Plan", type: "pdf" },
          { title: "Grid Integration Analysis", type: "doc" },
          { title: "2030 Policy Framework", type: "pdf" }
        ]
      },
      stats: { comments: 12 },
      commentTexts: ["The Burlington case study is incredibly relevant.", "Aspen's approach to community buy-in is worth studying.", "Grid integration analysis needs peer review.", "Can we add the Copenhagen model?", "The 2030 framework should reference EU directives.", "Essential reading — thanks for compiling this.", "I'd add the Freiburg solar settlement case.", "The policy docs section needs updating.", "Great collection for onboarding new members.", "Should we create a summary document?", "The Aspen plan has some transferable KPIs.", "Let's discuss these at the next strategy meeting."]
    }
  ];

  // Filter posts based on search and tag filters
  const filteredPosts = posts.filter((post) => {
    const q = searchValue.toLowerCase();
    const matchesSearch = !searchValue || 
      post.title.toLowerCase().includes(q) ||
      post.snippet.toLowerCase().includes(q) ||
      post.author.name.toLowerCase().includes(q) ||
      (post.commentTexts && post.commentTexts.some((c: string) => c.toLowerCase().includes(q))) ||
      (post.contentPreview?.documents && post.contentPreview.documents.some((d) => d.title.toLowerCase().includes(q))) ||
      (post.contentPreview?.items && post.contentPreview.items.some((i) => i.title.toLowerCase().includes(q))) ||
      (post.contentPreview?.whiteboards && post.contentPreview.whiteboards.some((w) => w.title.toLowerCase().includes(q)));
    
    const matchesTags = activeTags.length === 0 || activeTags.every((tag) => post.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  return (
    <div className="w-full">
      {/* Lead Update — pinned announcement */}
      <LeadUpdate />

      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
        {filteredPosts.map((post) => (
          <PostCard 
            key={post.id} 
            post={{
              ...post, 
              onClick: () => setSelectedPost(post),
              onDocumentClick: (doc) => { setSelectedDocument(doc); setSelectedDocAuthor(post.author); }
            }} 
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

