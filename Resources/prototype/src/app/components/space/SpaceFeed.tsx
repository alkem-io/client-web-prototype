import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Plus, Pin, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { PostCard, PostProps } from "./PostCard";
import { AddPostModal } from "@/app/components/space/AddPostModal";
import { PostDetailDialog } from "@/app/components/dialogs/PostDetailDialog";
import { ResponseDetailDialog } from "@/app/components/dialogs/ResponseDetailDialog";
import { DocumentDetailDialog } from "@/app/components/dialogs/DocumentDetailDialog";
import { useSpaceFilters } from "@/app/components/space/FilterContext";
import { Card, CardContent } from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { ContributionGrid } from "../contribution/ContributionGrid";
import { ContributionPostCard } from "../contribution/ContributionPostCard";
import { ContributionWhiteboardCard } from "../contribution/ContributionWhiteboardCard";

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
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{ title: string; docType: 'word' | 'spreadsheet' | 'presentation'; size: string; lastEdited?: string } | null>(null);
  const [selectedDocAuthor, setSelectedDocAuthor] = useState<{ name: string; avatarUrl?: string; role: string } | undefined>(undefined);
  const [collapseEnabled, setCollapseEnabled] = useState(() => {
    const stored = localStorage.getItem('alkemio-collapse-posts');
    return stored !== null ? stored === 'true' : true;
  });
  const { searchValue, activeTags, viewMode } = useSpaceFilters();

  // Persist collapse preference and listen for changes from settings page
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
      snippet: "We are officially launching the strategy phase for the 2030 renewable transition. Our goal is to outline a clear path for municipalities to reach 100% renewable energy. This involves coordinating across all departments, securing federal and state grants, engaging community stakeholders, and building a robust timeline that accounts for infrastructure upgrades, workforce training, and regulatory compliance. Please review the initial policy draft in the 'Policy Drafts' channel and leave your comments by end of week. We'll be hosting a town hall next Thursday to discuss the first phase milestones and gather additional input from residents.",
      timestamp: "2 hours ago",
      stats: { comments: 5 },
      commentTexts: ["Great initiative! I think we should prioritize the northern districts first.", "Can we get a timeline for the stakeholder consultations?", "The policy draft looks solid, but we need more detail on subsidies.", "I agree with Sarah — let's set up a working group.", "Has anyone looked at the Danish model for comparison?"]
    },
    {
      id: "7",
      type: "text",
      tags: ["Updates", "Ideas"],
      author: {
        name: "David Miller",
        role: "Member",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        location: "Seoul, KR",
        skills: ["Software Development", "Grid Systems", "Infrastructure", "Smart Metering"],
      },
      title: "Site Visit Photos: Solar Installation Progress",
      snippet: "Here's the latest progress shot from the public library rooftop installation. The panels are about 60% complete and we're on track for the September deadline.",
      embeddedImages: [
        { url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1080", alt: "Solar panels being installed on rooftop", position: "after" }
      ],
      timestamp: "3 hours ago",
      stats: { comments: 4 },
      commentTexts: ["Looking great! The alignment is perfect.", "Are those the bifacial panels we discussed?", "Nice progress — the contractor is doing solid work.", "Can you share the specs on the inverter setup?"]
    },
    {
      id: "8",
      type: "text",
      tags: ["Announcements", "Events"],
      author: {
        name: "Elena Rodriguez",
        role: "Lead",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        location: "Valencia, ES",
        skills: ["Strategy", "Stakeholder Relations", "Policy", "Budgeting", "Presentations"],
      },
      title: "New EV Charging Network — Proposed Locations",
      snippet: "The infrastructure team has mapped out the first 12 proposed locations for public EV charging stations across the municipality. The map below shows the coverage zones. We prioritized areas near public transit hubs, shopping centers, and residential zones with limited home-charging access. Feedback from the community survey heavily influenced these placements — over 2,000 residents participated in the location preference poll last month.",
      embeddedImages: [
        { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1080", alt: "EV charging station map", position: "before" }
      ],
      timestamp: "4 hours ago",
      stats: { comments: 7 },
      commentTexts: ["The transit hub locations make perfect sense.", "Can we add one near the community center on 5th?", "Great coverage in the eastern district!", "What about fast-charging vs. Level 2 split?", "The survey results are really useful.", "We need to coordinate with the power grid capacity study.", "Looks good — let's present this at the next council meeting."]
    },
    {
      id: "9",
      type: "text",
      tags: ["Updates", "Discussion"],
      author: {
        name: "Alex Contributor",
        role: "Member",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        location: "Lisbon, PT",
        skills: ["Community Engagement", "Solar Energy", "Project Management"],
      },
      title: "Community Workshop Recap: Building Electrification",
      snippet: "Last Saturday's workshop on building electrification was a huge success — over 85 attendees joined us at the community center. We covered heat pump technology, induction cooking benefits, and the available rebate programs. The energy from the crowd was amazing. Below is a photo from the Q&A session, followed by some of the key takeaways we documented during the breakout groups. If you missed it, we'll be hosting another session in two weeks focused specifically on multi-family buildings and retrofit challenges for older construction types.",
      embeddedImages: [
        { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1080", alt: "Community workshop attendees during Q&A", position: "after" }
      ],
      timestamp: "6 hours ago",
      stats: { comments: 11 },
      commentTexts: ["This was such a great event! Learned so much about heat pumps.", "The rebate info was exactly what I needed.", "Can you share the slide deck?", "85 people — incredible turnout!", "When's the multi-family session happening?", "The breakout on older buildings was super informative.", "I'd love to volunteer for the next one.", "Great photos Alex!", "The induction cooking demo was the highlight for me.", "We should partner with the local contractor association.", "Please add me to the mailing list for future events."]
    },
    {
      id: "4",
      type: "whiteboard",
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
      contentPreview: {},
      enabledResponseTypes: ["whiteboards"],
      responses: {
        whiteboards: [
          { id: "w1", title: "Public Library Solar Roof", author: "Sarah Chen", type: "whiteboards", imageUrl: wb1 },
          { id: "w2", title: "Parking Lot Canopies", author: "David Miller", type: "whiteboards", imageUrl: wb2 },
          { id: "w3", title: "School Microgrids", author: "Elena Rodriguez", type: "whiteboards", imageUrl: wb3 },
          { id: "w4", title: "Bus Stop Solar Stations", author: "Marc Johnson", type: "whiteboards", imageUrl: wb4 },
          { id: "w5", title: "Community Center Solar Wall", author: "Sarah Chen", type: "whiteboards", imageUrl: wb1 },
          { id: "w6", title: "Stadium Roof Installation", author: "David Miller", type: "whiteboards", imageUrl: wb2 },
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
      type: "document",
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
      contentPreview: {},
      enabledResponseTypes: ["links-files"],
      responses: {
        "links-files": [
          {
            id: "lf1",
            title: "Test Link",
            author: "Sarah Chen",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            type: "links-files",
            date: "02/15/2026",
            description: "A curated link resource for policy reference",
            tags: ["policy", "reference"]
          },
          {
            id: "lf2",
            title: "Mobile Interactions in Context",
            author: "David Miller",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
            type: "links-files",
            date: "02/14/2026",
            description: "A Designerly Way Toward Digital Ecology",
            tags: ["design", "ux", "digital"]
          },
          {
            id: "lf3",
            title: "Interaction for Visualization",
            author: "Marc Johnson",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marc",
            type: "links-files",
            date: "02/13/2026",
            description: "Visualization has become a valuable means for data exploration and analysis. Interactive visualization combines expressive graphical representations and ef...",
            tags: ["visualization", "data", "analysis"]
          },
          {
            id: "lf4",
            title: "Burlington, VT Case Study",
            author: "Sarah Chen",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            type: "links-files",
            date: "02/12/2026",
            description: "A comprehensive renewable energy transition strategy for municipalities",
            tags: ["renewable", "case-study"]
          },
          {
            id: "lf5",
            title: "Aspen, CO Transition Plan",
            author: "David Miller",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
            type: "links-files",
            date: "02/11/2026",
            description: "Detailed policy framework and community engagement strategy",
            tags: ["aspen", "transition"]
          },
          {
            id: "lf6",
            title: "Copenhagen District Heating",
            author: "Marc Johnson",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marc",
            type: "links-files",
            date: "02/10/2026",
            description: "European model for sustainable energy infrastructure",
            tags: ["district-heating", "eu-model"]
          },
          {
            id: "lf7",
            title: "Grid Integration Standards",
            author: "Sarah Chen",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            type: "links-files",
            date: "02/09/2026",
            description: "Technical specifications for renewable grid integration",
            tags: ["grid", "standards"]
          },
          {
            id: "lf8",
            title: "Community Solar Implementation",
            author: "David Miller",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
            type: "links-files",
            date: "02/08/2026",
            description: "Best practices for community-owned solar projects",
            tags: ["solar", "community"]
          },
          {
            id: "lf9",
            title: "Energy Storage Solutions",
            author: "Marc Johnson",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marc",
            type: "links-files",
            date: "02/07/2026",
            description: "Technology overview and deployment strategies",
            tags: ["storage", "technology"]
          }
        ]
      },
      stats: { comments: 12 },
      commentTexts: ["The Burlington case study is incredibly relevant.", "Aspen's approach to community buy-in is worth studying.", "Grid integration analysis needs peer review.", "Can we add the Copenhagen model?", "The 2030 framework should reference EU directives.", "Essential reading — thanks for compiling this.", "I'd add the Freiburg solar settlement case.", "The policy docs section needs updating.", "Great collection for onboarding new members.", "Should we create a summary document?", "The Aspen plan has some transferable KPIs.", "Let's discuss these at the next strategy meeting."]
    },
    {
      id: "10",
      type: "text",
      tags: ["Updates", "Documentation"],
      author: {
        name: "Jeroen Nijkamp",
        role: "Designer",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jeroen",
        location: "Amsterdam, NL",
        skills: ["Design Systems", "Documentation", "UI/UX"],
      },
      title: "Test Post: Memo's",
      snippet: "Wikis are powered by wiki software, also known as wiki engines. Being a form of content management system, these differ from other web-based systems such as blog software or static site generators in that the content is created without any defined owner or leader. Wikis have little inherent structure, allowing one to emerge according to the needs of the users.",
      timestamp: "2/23/2026",
      enabledResponseTypes: ["memos"],
      responses: {
        memos: [
          {
            id: "m1",
            title: "Response Engagement Strategy",
            author: "Jeroen Nijkamp",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jeroen",
            type: "memos",
            date: "02/23/2026",
            description: "1. **Response Engagement:** 3x+ response contribution rate vs small button\n2. **Consistency:** 95%+ of buttons follow patterns\n3. **Accessibility:** 100% of icon buttons have tooltips\n4. **Maintainability:** ZERO custom button styling in component files\n5. **User Satisfaction:** Reduced support requests about \"How do I respond?\"",
            tags: ["engagement", "strategy"]
          },
          {
            id: "m2",
            title: "Label Standardization",
            author: "Jeroen Nijkamp",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jeroen",
            type: "memos",
            date: "02/23/2026",
            description: "### Label Standardization\n\n#### Standard Action Verbs\n\n| Action | Verb | Example | Avoid |\n|--------|------|---------|-------|\n| Create new | Create | \"Create Space\" | \"New\", \"Add\" (for creating) |\n| Add to collection | Add | \"Add Member\" | \"Create\", \"New\" |\n| Contribute | Add | \"Add Whiteboard\" | \"Submit\", \"Upload\" |\n| Save form | Save | \"Save Changes\" | \"Submit\", \"OK\" |\n| Navigation | Open/View | \"View Details\" | \"Open\", \"See\" |",
            tags: ["labels", "standards", "documentation"]
          },
          {
            id: "m3",
            title: "Button Variant Usage Guide",
            author: "Sarah Chen",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            type: "memos",
            date: "02/22/2026",
            description: "- **Default:** Primary CTAs (Create Space, Save Changes)\n- **Secondary:** Alternative important actions (Preview, Next Step)\n- **Outline:** Navigation and secondary actions (Load More, Cancel)\n- **Ghost:** Minimal contextual actions (Back, Toolbar buttons)\n- **Link:** Text-only actions in content (Show More, Learn More)\n- **Destructive:** Danger actions only in confirmation dialogs (Delete Space)",
            tags: ["buttons", "design-system", "implementation"]
          },
          {
            id: "m4",
            title: "Dialog Footer Patterns",
            author: "David Miller",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
            type: "memos",
            date: "02/22/2026",
            description: "Three button footer patterns emerged:\n\n**Multi-step:** [← Back] [Cancel/ghost] [Primary action/default]\n**Simple:** [Cancel/ghost] [Primary action/default]\n**Destructive:** [Keep/ghost] [Delete/destructive]\n\nKey insight: Always pair secondary actions on left with primary on right for consistent scannability.",
            tags: ["dialogs", "patterns", "ui-consistency"]
          },
          {
            id: "m5",
            title: "Icon Button Best Practices",
            author: "Elena Rodriguez",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
            type: "memos",
            date: "02/21/2026",
            description: "Every icon-only button MUST use the IconButton wrapper component. This ensures:\n\n✓ Automatic tooltips on hover\n✓ Proper aria-labels for accessibility\n✓ Consistent focus states across the app\n✓ Reduced custom styling in components\n\nSize guide: sm (32px), default (36px), lg (40px), icon (36px square)",
            tags: ["accessibility", "components", "icon-buttons"]
          }
        ]
      },
      stats: { comments: 0 },
      commentTexts: []
    },
    {
      id: "7",
      type: "text",
      tags: ["Updates", "Community"],
      author: {
        name: "John Smith",
        role: "Coordinator",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        location: "San Francisco, US",
        skills: ["Facilitation", "Community Building", "Project Coordination"],
      },
      title: "Community Stories: Your Transition Journey",
      snippet: "Share your personal story about transitioning to renewable energy or sustainable practices. How has this journey changed your perspective? What challenges and victories have you experienced? Help inspire others by sharing your experience.",
      timestamp: "2 days ago",
      enabledResponseTypes: ["posts"],
      responses: {
        posts: [
          { id: "p1", title: "My Family's Solar Installation Journey", author: "Maria Garcia", type: "posts", date: "02/17/2026", description: "Our family decided to invest in solar panels and it has been the best decision. Here's how we did it...", tags: ["solar", "family", "success"] },
          { id: "p2", title: "Building Our First Electric Vehicle Charging Station", author: "Thomas Mueller", type: "posts", date: "02/16/2026", description: "We worked with the city to install a public EV charging station in our neighborhood. The process was...", tags: ["ev", "infrastructure", "community"] },
          { id: "p3", title: "Heat Pump Retrofit Success Story", author: "Ana Silva", type: "posts", date: "02/15/2026", description: "Replacing our old gas heating system with a modern heat pump has cut our energy bills in half. Here's what I learned...", tags: ["heating", "retrofit", "savings"] },
          { id: "p4", title: "Community Garden Solar Setup", author: "James Chen", type: "posts", date: "02/14/2026", description: "We installed solar panels above our community garden to power irrigation and lighting. It's been amazing to see...", tags: ["community", "gardens", "renewable"] },
          { id: "p5", title: "My Journey to Zero Waste Living", author: "Sofia Rodriguez", type: "posts", date: "02/13/2026", description: "Starting from scratch with reducing waste has been challenging but incredibly rewarding. Here are my top 5 tips...", tags: ["waste", "sustainability", "lifestyle"] },
          { id: "p6", title: "Local Energy Cooperative Success", author: "Marcus Williams", type: "posts", date: "02/12/2026", description: "Our neighborhood formed an energy cooperative to bulk-purchase renewable energy. The results exceeded expectations...", tags: ["cooperative", "energy", "community"] },
        ]
      },
      stats: { comments: 15 },
      commentTexts: ["Love these real-world stories!", "More of this kind of content please!", "This is really inspiring", "Can't wait to hear more transitions"]
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
      {/* Lead Update — pinned announcement (temporarily hidden) */}
      {/* <LeadUpdate /> */}

      <div className="flex items-center justify-end mb-4">
        <button onClick={() => setCollapseEnabled(!collapseEnabled)} className="flex items-center gap-1.5 text-caption font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
          {collapseEnabled ? (<><ChevronsUpDown className="w-3.5 h-3.5" /> Expand all posts</>) : (<><ChevronsDownUp className="w-3.5 h-3.5" /> Collapse posts</>)}
        </button>
      </div>

      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
        {filteredPosts.map((post) => {
          // Build contributions preview if post has responses
          const totalResponses = (post as any).responses
            ? Object.values((post as any).responses || {}).reduce((sum: number, arr: any) => sum + arr.length, 0)
            : 0;

          const contributionsPreview = (post as any).responses && totalResponses > 0 ? (
            <div className="mt-6 pt-6 border-t space-y-4">
              <h3 className="text-label font-semibold text-muted-foreground">CONTRIBUTIONS ({totalResponses})</h3>

              {(post as any).enabledResponseTypes?.map((responseType: string) => {
                const responses = (post as any).responses?.[responseType] || [];
                if (!responses.length) return null;

                const typeLabel = {
                  'whiteboards': 'WHITEBOARDS',
                  'posts': 'POSTS',
                  'memos': 'MEMOS',
                  'links-files': 'RESOURCES'
                }[responseType] || responseType.toUpperCase();

                const addLabel = {
                  'whiteboards': '+ Add Whiteboard',
                  'posts': '+ Add Post',
                  'memos': '+ Add Memo',
                  'links-files': '+ Add Link or File'
                }[responseType] || '+ Add';

                return (
                  <div key={responseType}>
                    <h3 className="text-label font-semibold text-muted-foreground mb-3">{typeLabel}</h3>

                    {/* Whiteboards - use production component */}
                    {responseType === 'whiteboards' && (
                      <ContributionGrid
                        totalCount={responses.length}
                        onAddClick={() => console.log('Add whiteboard')}
                        onShowMore={() => setSelectedPost(post)}
                        addLabel={addLabel}
                        addCardClassName="h-[200px]"
                      >
                        {responses.map((item: any) => (
                          <ContributionWhiteboardCard
                            key={item.id}
                            title={item.title}
                            author={item.author}
                            previewUrl={item.imageUrl}
                            onClick={() => console.log('Open whiteboard in Excalidraw:', item.id)}
                          />
                        ))}
                      </ContributionGrid>
                    )}

                    {/* Posts - use production component */}
                    {responseType === 'posts' && (
                      <ContributionGrid
                        totalCount={responses.length}
                        onAddClick={() => console.log('Add post')}
                        onShowMore={() => setSelectedPost(post)}
                        addLabel={addLabel}
                      >
                        {responses.map((item: any) => (
                          <ContributionPostCard
                            key={item.id}
                            title={item.title}
                            author={{ name: item.author, avatarUrl: item.authorAvatar }}
                            createdDate={item.date}
                            description={item.description}
                            tags={item.tags}
                            commentCount={item.commentCount}
                            onClick={() => setSelectedResponse(item.id)}
                          />
                        ))}
                      </ContributionGrid>
                    )}

                    {/* Memos - use post card (simpler, no markdown deps) */}
                    {responseType === 'memos' && (
                      <ContributionGrid
                        totalCount={responses.length}
                        onAddClick={() => console.log('Add memo')}
                        onShowMore={() => setSelectedPost(post)}
                        addLabel={addLabel}
                      >
                        {responses.map((item: any) => (
                          <ContributionPostCard
                            key={item.id}
                            title={item.title}
                            author={{ name: item.author, avatarUrl: item.authorAvatar }}
                            createdDate={item.date}
                            description={item.description}
                            tags={item.tags}
                            onClick={() => setSelectedResponse(item.id)}
                          />
                        ))}
                      </ContributionGrid>
                    )}

                    {/* Links/Files - use post card as fallback */}
                    {responseType === 'links-files' && (
                      <ContributionGrid
                        totalCount={responses.length}
                        onAddClick={() => console.log('Add link or file')}
                        onShowMore={() => setSelectedPost(post)}
                        addLabel={addLabel}
                      >
                        {responses.map((item: any) => (
                          <ContributionPostCard
                            key={item.id}
                            title={item.title}
                            author={{ name: item.author, avatarUrl: item.authorAvatar }}
                            createdDate={item.date}
                            description={item.description}
                            tags={item.tags}
                            onClick={() => setSelectedResponse(item.id)}
                          />
                        ))}
                      </ContributionGrid>
                    )}
                  </div>
                );
              })}
            </div>
          ) : undefined;

          return (
            <PostCard
              key={post.id}
              post={{
                ...post,
                collapsed: collapseEnabled,
                onDocumentClick: (doc) => { setSelectedDocument(doc); setSelectedDocAuthor(post.author); }
              }}
              onClick={() => setSelectedPost(post)}
              contributionsPreview={contributionsPreview}
            />
          );
        })}
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
      <ResponseDetailDialog
        open={!!selectedResponse}
        onOpenChange={(open) => !open && setSelectedResponse(null)}
        responseId={selectedResponse}
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

