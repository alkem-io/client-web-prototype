import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Plus, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { PostCard, type PostCardData } from "./PostCard";
import { AddPostModal } from "@/app/components/space/AddPostModal";
import { PostDetailDialog } from "@/app/components/dialogs/PostDetailDialog";
import { useSpaceFilters } from "@/app/components/space/FilterContext";
import { ContributionGrid } from "@/app/components/contribution/ContributionGrid";
import { ContributionWhiteboardCard } from "@/app/components/contribution/ContributionWhiteboardCard";
import { ContributionPostCard } from "@/app/components/contribution/ContributionPostCard";
import { ContributionMemoCard } from "@/app/components/contribution/ContributionMemoCard";
import { ContributionLinkCard } from "@/app/components/contribution/ContributionLinkCard";

// Whiteboard / visual preview images
const wb1 = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1080";
const wb2 = "https://images.unsplash.com/photo-1574359219611-a3031f074b2c?auto=format&fit=crop&q=80&w=1080";
const wb3 = "https://images.unsplash.com/photo-1578401058525-35aaec0b4658?auto=format&fit=crop&q=80&w=1080";
const wb4 = "https://images.unsplash.com/photo-1596496050844-3613acf57a8e?auto=format&fit=crop&q=80&w=1080";

// Media gallery images
const mg1 = "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800";
const mg2 = "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800";
const mg3 = "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800";
const mg4 = "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&q=80&w=800";

interface PostWithTags extends PostCardData {
  tags: string[];
  contributionType?: 'links' | 'posts' | 'memos' | 'whiteboards';
}

export function SpaceKnowledgeFeed() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostCardData | null>(null);
  const [collapseEnabled, setCollapseEnabled] = useState(() => {
    const stored = localStorage.getItem('alkemio-collapse-posts');
    return stored !== null ? stored === 'true' : true;
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

  // Listen for sidebar "New Post" button event
  useEffect(() => {
    const handler = () => setIsPostModalOpen(true);
    window.addEventListener("open-add-post-modal", handler);
    return () => window.removeEventListener("open-add-post-modal", handler);
  }, []);

  const posts: PostWithTags[] = [
    // ═══════════════════════════════════════════════════════════════
    // BASIC FRAMING TYPES (no contributions)
    // ═══════════════════════════════════════════════════════════════

    // 1. Post (plain text)
    {
      id: "kb-01",
      type: "text",
      tags: ["Research", "Community"],
      author: {
        name: "James Wilson",
        role: "Community Lead",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Community Workshop Guidelines",
      snippet: "Best practices and facilitation guide for running effective community engagement workshops. Covers preparation checklists, participant engagement techniques, and post-workshop follow-up templates.",
      timestamp: "2 weeks ago",
      commentCount: 14,
    },

    // 2. Post with a whiteboard
    {
      id: "kb-02",
      type: "whiteboard",
      tags: ["Ideas", "Technical"],
      author: {
        name: "David Miller",
        role: "Energy Analyst",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "System Architecture: Grid Modernisation Plan",
      snippet: "Visual overview of the proposed smart grid architecture, including sensor networks, data pipelines, and control systems.",
      timestamp: "3 weeks ago",
      framingImageUrl: wb1,
      commentCount: 9,
    },

    // 3. Post with a memo
    {
      id: "kb-03",
      type: "memo",
      tags: ["Documentation", "Governance"],
      author: {
        name: "Elena Rodriguez",
        role: "Policy Expert",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Policy Decision Record: Community Solar",
      snippet: "Structured memo capturing the decision rationale for the community solar program design choices.",
      timestamp: "1 month ago",
      framingMemoMarkdown: "# Decision Record: Community Solar Program\n\n## Context\nMunicipality needs to decide between:\n1. Centralized solar farm\n2. Distributed rooftop program\n3. Hybrid approach\n\n## Decision\nHybrid approach selected.\n\n## Rationale\n- Maximizes community participation\n- Balances grid stability with local ownership\n- Eligible for both federal and state incentives",
      commentCount: 6,
    },

    // 4. Post with a document
    {
      id: "kb-04",
      type: "document",
      tags: ["Policy", "Reports"],
      author: {
        name: "Robert Hayes",
        role: "Legal Advisor",
        avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "2030 Renewable Transition Policy Proposal",
      snippet: "The comprehensive policy proposal covering grid modernization, community solar, building electrification, and fleet conversion — with updated budget projections.",
      timestamp: "1 month ago",
      framingDocumentType: "text",
      commentCount: 11,
    },

    // 5. Post with a call to action
    {
      id: "kb-05",
      type: "callToAction",
      tags: ["Funding", "Community"],
      author: {
        name: "Nina Petrova",
        role: "Finance Director",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Apply Now: DOE Community Power Accelerator",
      snippet: "The Department of Energy Community Power Accelerator grant deadline is approaching. This is a $50M program for municipalities pursuing 100% clean energy.",
      timestamp: "5 weeks ago",
      framingCallToAction: { uri: "https://energy.gov/community-power", displayName: "Apply on Energy.gov", isExternal: true, isValid: true },
      commentCount: 8,
    },

    // 6. Post with a media gallery
    {
      id: "kb-06",
      type: "mediaGallery",
      tags: ["Community", "Events"],
      author: {
        name: "Lisa Park",
        role: "Program Manager",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Solar Installation Progress Photos — Phase 1",
      snippet: "Documentation of the first phase of solar panel installations across 12 municipal buildings. Includes before/after shots and drone aerial views.",
      timestamp: "6 weeks ago",
      framingMediaGallery: {
        thumbnails: [
          { id: "mg1", url: mg1 },
          { id: "mg2", url: mg2 },
          { id: "mg3", url: mg3 },
          { id: "mg4", url: mg4 },
        ],
        totalCount: 24,
      },
      commentCount: 15,
    },

    // 7. Post with a poll
    {
      id: "kb-07",
      type: "poll",
      tags: ["Governance", "Community"],
      author: {
        name: "Michael Chang",
        role: "Researcher",
        avatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Priority Vote: Next Infrastructure Investment",
      snippet: "Help us decide where to allocate the next round of infrastructure funding. Vote on which project should receive priority.",
      timestamp: "2 months ago",
      commentCount: 22,
    },

    // ═══════════════════════════════════════════════════════════════
    // TEXT POSTS WITH CONTRIBUTIONS
    // ═══════════════════════════════════════════════════════════════

    // 8. Post with a call for links & files
    {
      id: "kb-08",
      type: "text",
      tags: ["Research", "Data"],
      contributionType: "links",
      author: {
        name: "Priya Sharma",
        role: "Data Scientist",
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Collect: Energy Consumption Datasets & Tools",
      snippet: "We need links to publicly available energy consumption datasets, analysis tools, and benchmarking platforms. Share anything relevant to municipal-scale energy tracking.",
      timestamp: "2 months ago",
      commentCount: 7,
    },

    // 9. Post with a call for posts
    {
      id: "kb-09",
      type: "text",
      tags: ["Community", "Education"],
      contributionType: "posts",
      author: {
        name: "James Wilson",
        role: "Community Lead",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Share: Your Neighbourhood's Transition Experience",
      snippet: "Tell us about your community's journey. What challenges did you face? What support did you receive? Your stories help us design better programs.",
      timestamp: "2 months ago",
      commentCount: 18,
    },

    // 10. Post with a call for memos
    {
      id: "kb-10",
      type: "text",
      tags: ["Documentation", "Technical"],
      contributionType: "memos",
      author: {
        name: "Tom Bradley",
        role: "Infrastructure Engineer",
        avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Document: EV Charging Station Installation Guides",
      snippet: "Help build our knowledge base of installation procedures. Write up step-by-step guides covering site assessment, electrical requirements, and commissioning.",
      timestamp: "2.5 months ago",
      commentCount: 11,
    },

    // 11. Post with a call for whiteboards
    {
      id: "kb-11",
      type: "text",
      tags: ["Ideas", "Infrastructure"],
      contributionType: "whiteboards",
      author: {
        name: "Sarah Chen",
        role: "Facilitator",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Sketch: Future Building Energy Retrofit Concepts",
      snippet: "Visualise your ideas for retrofitting municipal buildings with modern energy systems. Think heat pumps, solar integration, smart controls, and insulation strategies.",
      timestamp: "2.5 months ago",
      commentCount: 8,
    },

    // ═══════════════════════════════════════════════════════════════
    // WHITEBOARD POSTS WITH CONTRIBUTIONS
    // ═══════════════════════════════════════════════════════════════

    // 12. Post with a whiteboard with a call for links & files
    {
      id: "kb-12",
      type: "whiteboard",
      tags: ["Technical", "Research"],
      contributionType: "links",
      author: {
        name: "David Miller",
        role: "Energy Analyst",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Grid Topology Map — Share Supporting Docs",
      snippet: "Here's our current grid topology diagram. Please share links to relevant vendor documentation, technical standards, and reference architectures.",
      timestamp: "3 months ago",
      framingImageUrl: wb2,
      commentCount: 5,
    },

    // 13. Post with a whiteboard with a call for posts
    {
      id: "kb-13",
      type: "whiteboard",
      tags: ["Ideas", "Community"],
      contributionType: "posts",
      author: {
        name: "Alex Contributor",
        role: "Member",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Neighbourhood Energy Map — Share Your Observations",
      snippet: "This whiteboard maps energy usage patterns across neighbourhoods. Share posts about what you've noticed in your area — unusual consumption patterns, infrastructure issues, or opportunities.",
      timestamp: "3 months ago",
      framingImageUrl: wb3,
      commentCount: 10,
    },

    // 14. Post with a whiteboard with a call for memos
    {
      id: "kb-14",
      type: "whiteboard",
      tags: ["Documentation", "Technical"],
      contributionType: "memos",
      author: {
        name: "Tom Bradley",
        role: "Infrastructure Engineer",
        avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Substation Upgrade Diagram — Document Procedures",
      snippet: "The whiteboard shows our substation upgrade sequence. Please contribute detailed procedure memos for each stage of the upgrade process.",
      timestamp: "3 months ago",
      framingImageUrl: wb4,
      commentCount: 7,
    },

    // 15. Post with a whiteboard with a call for whiteboards
    {
      id: "kb-15",
      type: "whiteboard",
      tags: ["Ideas", "Design"],
      contributionType: "whiteboards",
      author: {
        name: "Sarah Chen",
        role: "Facilitator",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Solar Farm Layout Concept — Add Your Designs",
      snippet: "Here's our initial solar farm layout. We want alternative layout proposals — sketch your ideas considering terrain, access roads, and wildlife corridors.",
      timestamp: "3.5 months ago",
      framingImageUrl: wb1,
      commentCount: 13,
    },

    // ═══════════════════════════════════════════════════════════════
    // MEMO POSTS WITH CONTRIBUTIONS
    // ═══════════════════════════════════════════════════════════════

    // 16. Post with a memo with a call for links & files
    {
      id: "kb-16",
      type: "memo",
      tags: ["Research", "Policy"],
      contributionType: "links",
      author: {
        name: "Robert Hayes",
        role: "Legal Advisor",
        avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Regulatory Compliance Summary — Add References",
      snippet: "This memo outlines our compliance obligations. Please share links to the actual regulatory documents, official guidance, and relevant case law.",
      timestamp: "3.5 months ago",
      framingMemoMarkdown: "# Regulatory Compliance Summary\n\n## Federal Requirements\n- FERC Order 2222 compliance\n- EPA Clean Power Plan alignment\n- DOE reporting obligations\n\n## State Requirements\n- Renewable Portfolio Standard (35% by 2030)\n- Net metering regulations\n- Interconnection standards\n\n## Local Requirements\n- Building code updates\n- Zoning approvals for installations\n- Environmental impact assessments",
      commentCount: 4,
    },

    // 17. Post with a memo with a call for posts
    {
      id: "kb-17",
      type: "memo",
      tags: ["Community", "Governance"],
      contributionType: "posts",
      author: {
        name: "Elena Rodriguez",
        role: "Policy Expert",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Stakeholder Engagement Plan — Share Feedback",
      snippet: "Our engagement plan is outlined in this memo. We'd love posts from community members with feedback, concerns, or suggestions for improvement.",
      timestamp: "4 months ago",
      framingMemoMarkdown: "# Stakeholder Engagement Plan\n\n## Phase 1: Inform (Month 1-2)\n- Public website launch\n- Newsletter campaign\n- Social media presence\n\n## Phase 2: Consult (Month 3-4)\n- Town halls (3 events)\n- Online surveys\n- Focus groups\n\n## Phase 3: Involve (Month 5-6)\n- Citizen advisory panel\n- Co-design workshops\n- Pilot program enrollment",
      commentCount: 16,
    },

    // 18. Post with a memo with a call for memos
    {
      id: "kb-18",
      type: "memo",
      tags: ["Documentation", "Templates"],
      contributionType: "memos",
      author: {
        name: "Lisa Park",
        role: "Program Manager",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Project Retrospective Template — Submit Your Retros",
      snippet: "Here's our standard retrospective template. Use it to write up your project retrospectives and share them below.",
      timestamp: "4 months ago",
      framingMemoMarkdown: "# Project Retrospective Template\n\n## What Went Well\n- [List successes]\n\n## What Could Be Improved\n- [List areas for improvement]\n\n## Action Items\n| Action | Owner | Due Date |\n|--------|-------|----------|\n| | | |\n\n## Lessons Learned\n- [Key takeaways for future projects]",
      commentCount: 9,
    },

    // 19. Post with a memo with a call for whiteboards
    {
      id: "kb-19",
      type: "memo",
      tags: ["Ideas", "Technical"],
      contributionType: "whiteboards",
      author: {
        name: "Michael Chang",
        role: "Researcher",
        avatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Research Brief: Battery Storage — Visualise Solutions",
      snippet: "This research brief outlines battery storage challenges. Sketch your proposed solutions — system architectures, placement strategies, or novel approaches.",
      timestamp: "4 months ago",
      framingMemoMarkdown: "# Battery Storage: Challenges & Opportunities\n\n## Current Challenges\n- Grid-scale storage costs still declining\n- Siting constraints in urban areas\n- Fire safety regulations\n- End-of-life recycling\n\n## Opportunities\n- Vehicle-to-grid (V2G) integration\n- Second-life EV batteries\n- Community battery schemes\n- Behind-the-meter residential\n\n## Open Questions\n- Optimal size for municipal deployment?\n- Centralised vs distributed topology?",
      commentCount: 6,
    },

    // ═══════════════════════════════════════════════════════════════
    // DOCUMENT POSTS WITH CONTRIBUTIONS
    // ═══════════════════════════════════════════════════════════════

    // 20. Post with a document with a call for links & files
    {
      id: "kb-20",
      type: "document",
      tags: ["Policy", "Research"],
      contributionType: "links",
      author: {
        name: "Robert Hayes",
        role: "Legal Advisor",
        avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Procurement Guidelines Draft — Share Reference Material",
      snippet: "The procurement guidelines document is ready for review. Please share links to example PPAs, legal precedents, and template contracts from other municipalities.",
      timestamp: "4.5 months ago",
      framingDocumentType: "text",
      commentCount: 8,
    },

    // 21. Post with a document with a call for posts
    {
      id: "kb-21",
      type: "document",
      tags: ["Reports", "Community"],
      contributionType: "posts",
      author: {
        name: "Nina Petrova",
        role: "Finance Director",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Q2 Budget Report — Share Your Department Updates",
      snippet: "The Q2 budget report is attached. Each department lead should submit a post with their spending highlights, variances, and projections for Q3.",
      timestamp: "4.5 months ago",
      framingDocumentType: "spreadsheet",
      commentCount: 12,
    },

    // 22. Post with a document with a call for memos
    {
      id: "kb-22",
      type: "document",
      tags: ["Technical", "Documentation"],
      contributionType: "memos",
      author: {
        name: "Tom Bradley",
        role: "Infrastructure Engineer",
        avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Technical Specification v2.1 — Contribute Procedures",
      snippet: "The updated technical specification is attached. We need structured memos documenting the implementation procedure for each section.",
      timestamp: "5 months ago",
      framingDocumentType: "text",
      commentCount: 6,
    },

    // 23. Post with a document with a call for whiteboards
    {
      id: "kb-23",
      type: "document",
      tags: ["Ideas", "Infrastructure"],
      contributionType: "whiteboards",
      author: {
        name: "David Miller",
        role: "Energy Analyst",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Site Assessment Report — Sketch Layout Proposals",
      snippet: "The site assessment document identifies 8 candidate locations for solar installations. Sketch your proposed panel layouts for any of the sites.",
      timestamp: "5 months ago",
      framingDocumentType: "presentation",
      commentCount: 10,
    },

    // ═══════════════════════════════════════════════════════════════
    // CALL TO ACTION POSTS WITH CONTRIBUTIONS
    // ═══════════════════════════════════════════════════════════════

    // 24. Post with a call to action with a call for links & files
    {
      id: "kb-24",
      type: "callToAction",
      tags: ["Funding", "Research"],
      contributionType: "links",
      author: {
        name: "Nina Petrova",
        role: "Finance Director",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Grant Portal: Share Supporting Evidence",
      snippet: "Use the grant portal link to submit our application. Below, share links to supporting documents, data sources, and letters of support that strengthen our case.",
      timestamp: "5 months ago",
      framingCallToAction: { uri: "https://grants.gov/energy-transition", displayName: "Open Grant Portal", isExternal: true, isValid: true },
      commentCount: 5,
    },

    // 25. Post with a call to action with a call for posts
    {
      id: "kb-25",
      type: "callToAction",
      tags: ["Community", "Events"],
      contributionType: "posts",
      author: {
        name: "James Wilson",
        role: "Community Lead",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Register for the Summit — Then Share Your Topics",
      snippet: "Register for the upcoming Energy Transition Summit using the link below. Then post your proposed discussion topics and questions for the panel sessions.",
      timestamp: "5.5 months ago",
      framingCallToAction: { uri: "https://events.municipality.org/summit-2026", displayName: "Register for Summit", isExternal: true, isValid: true },
      commentCount: 14,
    },

    // 26. Post with a call to action with a call for memos
    {
      id: "kb-26",
      type: "callToAction",
      tags: ["Documentation", "Policy"],
      contributionType: "memos",
      author: {
        name: "Elena Rodriguez",
        role: "Policy Expert",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Public Comment Portal — Submit Position Memos",
      snippet: "The state regulatory body is accepting public comments on the new energy code. Use the link to view the draft, then submit your position memos below for team review before filing.",
      timestamp: "5.5 months ago",
      framingCallToAction: { uri: "https://state.gov/energy-code-comments", displayName: "View Draft Energy Code", isExternal: true, isValid: true },
      commentCount: 7,
    },

    // 27. Post with a call to action with a call for whiteboards
    {
      id: "kb-27",
      type: "callToAction",
      tags: ["Ideas", "Design"],
      contributionType: "whiteboards",
      author: {
        name: "Lisa Park",
        role: "Program Manager",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Design Competition Brief — Submit Visual Concepts",
      snippet: "Read the full competition brief using the link below. Then submit your visual design concepts as whiteboards — top entries will be presented to the mayor's office.",
      timestamp: "6 months ago",
      framingCallToAction: { uri: "https://design.municipality.org/competition-2026", displayName: "Read Competition Brief", isExternal: true, isValid: true },
      commentCount: 19,
    },

    // ═══════════════════════════════════════════════════════════════
    // MEDIA GALLERY POSTS WITH CONTRIBUTIONS
    // ═══════════════════════════════════════════════════════════════

    // 28. Post with a media gallery with a call for links & files
    {
      id: "kb-28",
      type: "mediaGallery",
      tags: ["Data", "Research"],
      contributionType: "links",
      author: {
        name: "Priya Sharma",
        role: "Data Scientist",
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Thermal Imaging Results — Share Analysis Tools",
      snippet: "Here are thermal images from our building audits. Share links to analysis software, comparison databases, and interpretation guides.",
      timestamp: "6 months ago",
      framingMediaGallery: {
        thumbnails: [
          { id: "th1", url: mg1 },
          { id: "th2", url: mg2 },
          { id: "th3", url: mg3 },
        ],
        totalCount: 18,
      },
      commentCount: 6,
    },

    // 29. Post with a media gallery with a call for posts
    {
      id: "kb-29",
      type: "mediaGallery",
      tags: ["Community", "Events"],
      contributionType: "posts",
      author: {
        name: "James Wilson",
        role: "Community Lead",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Community Event Photos — Share Your Highlights",
      snippet: "Photos from last week's community energy fair. Share posts about your favourite moments, interesting conversations, or ideas you took away.",
      timestamp: "6 months ago",
      framingMediaGallery: {
        thumbnails: [
          { id: "ev1", url: mg2 },
          { id: "ev2", url: mg4 },
          { id: "ev3", url: mg1 },
          { id: "ev4", url: mg3 },
        ],
        totalCount: 32,
      },
      commentCount: 21,
    },

    // 30. Post with a media gallery with a call for memos
    {
      id: "kb-30",
      type: "mediaGallery",
      tags: ["Technical", "Documentation"],
      contributionType: "memos",
      author: {
        name: "Tom Bradley",
        role: "Infrastructure Engineer",
        avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Installation Photos — Document the Process",
      snippet: "Here are photos from the EV charger installations. For each site, please contribute a memo documenting the installation procedure and any issues encountered.",
      timestamp: "6.5 months ago",
      framingMediaGallery: {
        thumbnails: [
          { id: "in1", url: mg3 },
          { id: "in2", url: mg1 },
          { id: "in3", url: mg4 },
        ],
        totalCount: 12,
      },
      commentCount: 8,
    },

    // 31. Post with a media gallery with a call for whiteboards
    {
      id: "kb-31",
      type: "mediaGallery",
      tags: ["Ideas", "Design"],
      contributionType: "whiteboards",
      author: {
        name: "Alex Contributor",
        role: "Member",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Site Photos: Proposed Solar Locations — Sketch Layouts",
      snippet: "Aerial and ground-level photos of 6 candidate sites. Use these as reference and sketch your proposed panel layouts and infrastructure placement.",
      timestamp: "6.5 months ago",
      framingMediaGallery: {
        thumbnails: [
          { id: "st1", url: mg4 },
          { id: "st2", url: mg2 },
          { id: "st3", url: mg1 },
          { id: "st4", url: mg3 },
        ],
        totalCount: 6,
      },
      commentCount: 11,
    },

    // ═══════════════════════════════════════════════════════════════
    // POLL POSTS WITH CONTRIBUTIONS
    // ═══════════════════════════════════════════════════════════════

    // 32. Post with a poll with a call for links & files
    {
      id: "kb-32",
      type: "poll",
      tags: ["Research", "Governance"],
      contributionType: "links",
      author: {
        name: "Michael Chang",
        role: "Researcher",
        avatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Vote: Preferred Energy Monitoring Platform — Share Reviews",
      snippet: "Vote on which energy monitoring platform we should adopt. After voting, share links to reviews, comparisons, and user testimonials for your preferred choice.",
      timestamp: "7 months ago",
      commentCount: 15,
    },

    // 33. Post with a poll with a call for posts
    {
      id: "kb-33",
      type: "poll",
      tags: ["Community", "Governance"],
      contributionType: "posts",
      author: {
        name: "Elena Rodriguez",
        role: "Policy Expert",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Vote: Top Priority for Q4 — Explain Your Reasoning",
      snippet: "Cast your vote for the Q4 priority, then write a post explaining your reasoning. We'll compile the arguments for the steering committee.",
      timestamp: "7 months ago",
      commentCount: 24,
    },

    // 34. Post with a poll with a call for memos
    {
      id: "kb-34",
      type: "poll",
      tags: ["Technical", "Documentation"],
      contributionType: "memos",
      author: {
        name: "David Miller",
        role: "Energy Analyst",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Vote: Best Battery Technology — Submit Technical Memos",
      snippet: "Vote on which battery technology we should prioritise. Then contribute a technical memo evaluating your chosen technology against our requirements.",
      timestamp: "7.5 months ago",
      commentCount: 13,
    },

    // 35. Post with a poll with a call for whiteboards
    {
      id: "kb-35",
      type: "poll",
      tags: ["Ideas", "Infrastructure"],
      contributionType: "whiteboards",
      author: {
        name: "Sarah Chen",
        role: "Facilitator",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      title: "Vote: Preferred Microgrid Topology — Sketch Your Design",
      snippet: "Vote on the microgrid topology that best fits our municipality. Then sketch your preferred implementation showing how it connects to existing infrastructure.",
      timestamp: "7.5 months ago",
      commentCount: 17,
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
              <span className="text-label font-semibold text-muted-foreground">CONTRIBUTIONS (9)</span>
              <button className="inline-flex items-center gap-1.5 text-label font-semibold text-muted-foreground hover:text-foreground transition-colors">
                + ADD LINK OR FILE
              </button>
            </div>
            <div className="space-y-2">
              <ContributionLinkCard
                title="IEEE Smart Grid Standards"
                description="Comprehensive standards for smart grid interoperability and communication protocols"
              />
              <ContributionLinkCard
                title="Energy Transition Toolkit.pdf"
                description="A practical guide for municipalities planning renewable transitions"
                isFile={true}
              />
              <ContributionLinkCard
                title="EU Clean Energy Package"
                description="European Commission clean energy legislative package overview"
              />
            </div>
            <button className="text-label font-semibold text-muted-foreground hover:text-foreground transition-colors">
              +6 MORE
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
                title="Our District's Solar Journey: Year One"
                author={{ name: "James Wilson" }}
                createdDate="04/10/2026"
                description="How we went from scepticism to 40% solar adoption in our neighbourhood through peer education and community financing."
                tags={["community", "solar", "adoption"]}
                commentCount={8}
              />
              <ContributionPostCard
                title="Lessons from the Nordic Model"
                author={{ name: "Priya Sharma" }}
                createdDate="03/22/2026"
                description="What we can learn from Denmark and Norway about community ownership and distributed generation."
                tags={["nordic", "ownership", "research"]}
                commentCount={5}
              />
              <ContributionPostCard
                title="The Business Case for Municipal Solar"
                author={{ name: "Nina Petrova" }}
                createdDate="03/05/2026"
                description="Financial analysis showing 7-year payback on municipal solar installations with current incentive structures."
                tags={["finance", "ROI", "municipal"]}
                commentCount={3}
              />
              <ContributionPostCard
                title="Grid Integration Challenges We Faced"
                author={{ name: "David Miller" }}
                createdDate="02/18/2026"
                description="Technical hurdles we encountered connecting our 2MW community array to the municipal distribution grid."
                tags={["grid", "technical"]}
                commentCount={7}
              />
              <ContributionPostCard
                title="Financing Models That Work"
                author={{ name: "Tom Bradley" }}
                createdDate="02/01/2026"
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
              <span className="text-label font-semibold text-muted-foreground">CONTRIBUTIONS (4)</span>
            </div>
            <ContributionGrid totalCount={4} onAddClick={() => {}} addLabel="+ Add Memo">
              <ContributionMemoCard
                title="Site Assessment Procedure"
                author="Tom Bradley"
                markdownContent="## Site Assessment Steps\n\n1. Initial desk review\n2. Solar irradiance analysis\n3. Structural assessment\n4. Grid connection feasibility\n5. Environmental screening\n\n### Required Equipment\n- Drone for aerial survey\n- Irradiance meter\n- Structural testing kit"
              />
              <ContributionMemoCard
                title="Safety Protocols for Installation"
                author="David Miller"
                markdownContent="## Safety Protocols\n\n### Before Work Begins\n- [ ] Risk assessment complete\n- [ ] Permits obtained\n- [ ] Team briefing done\n\n### During Installation\n- Hard hats mandatory\n- Harness required above 2m\n- Electrical isolation verified\n\n### Post-Installation\n- Final inspection checklist\n- Commissioning tests"
              />
              <ContributionMemoCard
                title="Commissioning Checklist"
                author="Sarah Chen"
                markdownContent="## Commissioning Steps\n\n1. Visual inspection\n2. Electrical testing\n3. Performance verification\n4. Documentation\n5. Handover\n\n### Sign-Off\n- Engineer approval\n- Client acceptance"
              />
              <ContributionMemoCard
                title="Maintenance Schedule Template"
                author="Alex Contributor"
                markdownContent="## Quarterly Maintenance\n\n- Panel cleaning\n- Inverter check\n- Wiring inspection\n- Performance data review\n\n## Annual Maintenance\n- Full system audit\n- Thermal imaging\n- Degradation assessment"
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
                title="Rooftop Array Design A"
                author="David Miller"
                previewUrl={wb1}
              />
              <ContributionWhiteboardCard
                title="Ground-Mount Concept"
                author="Tom Bradley"
                previewUrl={wb2}
              />
              <ContributionWhiteboardCard
                title="Carpark Canopy Layout"
                author="Alex Contributor"
                previewUrl={wb3}
              />
              <ContributionWhiteboardCard
                title="Facade Integration Sketch"
                author="Sarah Chen"
                previewUrl={wb4}
              />
              <ContributionWhiteboardCard
                title="Community Centre Retrofit"
                author="Elena Rodriguez"
                previewUrl={wb1}
              />
              <ContributionWhiteboardCard
                title="Sports Centre Array"
                author="Michael Chang"
                previewUrl={wb3}
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
      <div className="flex items-center justify-end mb-4">
        <button onClick={() => setCollapseEnabled(!collapseEnabled)} className="flex items-center gap-1.5 text-caption font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
          {collapseEnabled ? (<><ChevronsUpDown className="w-3.5 h-3.5" /> Expand all posts</>) : (<><ChevronsDownUp className="w-3.5 h-3.5" /> Collapse posts</>)}
        </button>
      </div>

      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
        {filteredPosts.map((post) => (
          <div key={post.id} id={post.id}>
            <PostCard
              post={{
                ...post,
                descriptionExpanded: !collapseEnabled,
              }}
              onClick={() => setSelectedPost(post)}
              onExpandClick={() => setSelectedPost(post)}
              contributionsPreview={getContributionPreview(post)}
            />
          </div>
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
    </div>
  );
}