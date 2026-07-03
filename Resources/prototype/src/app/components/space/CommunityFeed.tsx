import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";
import { PostCard, PostProps } from "./PostCard";
import { AddPostModal } from "@/app/components/space/AddPostModal";
import { PostDetailDialog } from "@/app/components/dialogs/PostDetailDialog";
import { useSpaceFilters } from "./FilterContext";

const COMMUNITY_POSTS: PostProps[] = [
  {
    id: "community-1",
    type: "text",
    author: {
      name: "Elena Martinez",
      avatarUrl:
        "https://images.unsplash.com/photo-1623853589874-864b1dd4d922?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGdsYXNzZXMlMjBibGFjayUyMGFuZCUyMHdoaXRlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5NDQyNTM3fDA&ixlib=rb-4.1.0&q=80&w=256",
      location: "Barcelona, ES",
      skills: ["Urban Planning", "Sustainability", "Community Design", "Policy", "Innovation"],
    },
    title: "Welcome new members & organizations!",
    snippet:
      "We're thrilled to welcome Green Future Labs and the Sustainable Cities Fund to the space this month. Together with our 29 members, we now have four organizations actively contributing to the transition strategy. If you're new, please introduce yourself below — we'd love to hear about your background and what you hope to contribute!",
    timestamp: "3 hours ago",
    stats: { likes: 18, comments: 7 },
    commentTexts: ["Welcome Green Future Labs! Excited to collaborate.", "Great to have the Sustainable Cities Fund on board.", "I'm new here — background in urban planning and circular economy.", "Looking forward to contributing to the transition strategy.", "Can we schedule a welcome session for all new members?"],
  },
  {
    id: "community-2",
    type: "call-for-whiteboards",
    author: {
      name: "Maya Ross",
      avatarUrl:
        "https://images.unsplash.com/photo-1589332911105-a6b59f2e4c4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNtaWxpbmclMjBkYXJrJTIwaGFpciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTQ0MjUzN3ww&ixlib=rb-4.1.0&q=80&w=256",
      location: "Berlin, DE",
      skills: ["Community Engagement", "Facilitation", "Stakeholder Management", "Workshop Design"],
    },
    title: "Call for Volunteers: Community Engagement Working Group",
    snippet:
      "We're forming a working group to design our community engagement strategy for Q3. We need volunteers with experience in stakeholder outreach, workshop facilitation, or public communication. Comment below if you'd like to join — we'll kick off with an introductory call next week.",
    timestamp: "1 day ago",
    contentPreview: {
      whiteboards: [
        {
          title: "Engagement Framework",
          imageUrl:
            "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1080",
          author: "Maya Ross",
        },
        {
          title: "Stakeholder Map",
          imageUrl:
            "https://images.unsplash.com/photo-1574359219611-a3031f074b2c?auto=format&fit=crop&q=80&w=1080",
          author: "David Kim",
        },
      ],
    },
    stats: { likes: 31, comments: 14 },
    commentTexts: ["I'd love to volunteer — I have experience in workshop facilitation.", "The stakeholder map needs input from the transport sector.", "Can we include youth representatives in the working group?", "Public communication strategy should cover social media.", "Introductory call works for me — please share the calendar invite."],
  },
];

export function CommunityFeed() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostProps | null>(null);
  const { searchValue } = useSpaceFilters();

  const filteredPosts = COMMUNITY_POSTS.filter((post) => {
    if (!searchValue) return true;
    const q = searchValue.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.snippet.toLowerCase().includes(q) ||
      post.author.name.toLowerCase().includes(q) ||
      (post.commentTexts && post.commentTexts.some((c) => c.toLowerCase().includes(q))) ||
      (post.contentPreview?.documents && post.contentPreview.documents.some((d) => d.title.toLowerCase().includes(q))) ||
      (post.contentPreview?.items && post.contentPreview.items.some((i) => i.title.toLowerCase().includes(q))) ||
      (post.contentPreview?.whiteboards && post.contentPreview.whiteboards.some((w) => w.title.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="w-full">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-section-title"
          style={{
            color: "var(--foreground)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Community Posts
        </h2>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={{
              ...post,
              onClick: () => setSelectedPost(post),
            }}
          />
        ))}
      </div>

      {/* Modals */}
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
