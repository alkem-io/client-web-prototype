import { PostCard, type PostCardData } from '@/app/components/space/PostCard';
import { ContributionGrid } from '@/app/components/contribution/ContributionGrid';
import { ContributionWhiteboardCard } from '@/app/components/contribution/ContributionWhiteboardCard';
import { ContributionPostCard } from '@/app/components/contribution/ContributionPostCard';
import { ContributionMemoCard } from '@/app/components/contribution/ContributionMemoCard';
import { ContributionAddCard } from '@/app/components/contribution/ContributionAddCard';

import wb1 from '@/app/assets/wb1.png';
import wb2 from '@/app/assets/wb2.png';
import wb3 from '@/app/assets/wb3.png';
import wb4 from '@/app/assets/wb4.png';

/**
 * Complete showcase of all post types using the production PostCard component.
 * This demonstrates the exact same visual design as production.
 */
export function PostShowcasePage() {
  const posts: PostCardData[] = [
    // 1. TEXT POST WITH FULL DESCRIPTION
    {
      id: '1',
      type: 'text',
      title: 'Q3 2026 Product Roadmap & Strategic Priorities',
      snippet: `We're thrilled to announce our Q3 priorities focusing on three key areas: performance optimization, user experience enhancement, and infrastructure modernization.

**Performance Improvements:**
- Reducing initial load time by 40%
- Optimizing database queries
- Implementing progressive image loading

**User Experience Enhancements:**
- New dashboard redesign
- Mobile app improvements
- Accessibility upgrades

**Infrastructure:**
- Migrating to new CDN
- Implementing auto-scaling
- Security hardening

Please join us for the strategy session on Thursday at 2 PM. We'd love your feedback!`,
      timestamp: '2 hours ago',
      author: {
        name: 'Sarah Chen',
        role: 'Product Lead',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64',
      },
      tags: ['product', 'roadmap', 'q3-2026', 'strategy'],
      references: [
        { id: '1', name: 'Q3 Roadmap Spreadsheet', uri: 'https://example.com', description: 'Detailed breakdown with timelines' },
        { id: '2', name: 'design-system.example.com', uri: 'https://example.com' },
      ],
      commentCount: 24,
      descriptionExpanded: false,
    },

    // 2. WHITEBOARD POST
    {
      id: '2',
      type: 'whiteboard',
      title: 'System Architecture Redesign - Microservices Strategy',
      snippet: 'Breaking down the monolithic system into microservices. Here\'s our proposed architecture and service boundaries.',
      timestamp: '1 day ago',
      author: {
        name: 'Alex Rodriguez',
        role: 'Architecture Lead',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64',
      },
      framingImageUrl: wb1,
      tags: ['architecture', 'infrastructure', 'microservices'],
      commentCount: 18,
    },

    // 3. MEMO POST
    {
      id: '3',
      type: 'memo',
      title: 'Weekly Team Standup Notes - Week of June 23',
      snippet: 'Key discussion points and action items from this week\'s team meeting.',
      timestamp: '3 hours ago',
      author: {
        name: 'Jordan Smith',
        role: 'Engineering Manager',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64',
      },
      framingMemoMarkdown: `# Weekly Standup - June 23, 2026

## Accomplishments
- Completed migration to new database schema
- Shipped performance optimizations (40% faster)
- Launched new dashboard beta

## Blockers
- GraphQL schema validation needs review
- Two PRs awaiting security audit
- Database optimization still in progress

## Next Week
- Complete security audit
- Launch dashboard to 10% of users
- Begin API v2 design

## Action Items
- Sarah: Prepare investor deck
- Alex: Review GraphQL schema
- Jordan: Schedule security review meeting`,
      tags: ['standup', 'weekly', 'team'],
      commentCount: 7,
    },

    // 4. DRAFT POST
    {
      id: '4',
      type: 'text',
      title: 'Draft: New Company Values & Culture Framework',
      snippet: 'Working on our updated company values. Still gathering feedback from across the organization before finalizing...',
      timestamp: '6 hours ago',
      author: {
        name: 'Emma Wilson',
        role: 'Head of People',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64',
      },
      isDraft: true,
      commentCount: 12,
    },

    // 5. CALL FOR WHITEBOARDS
    {
      id: '5',
      type: 'whiteboard',
      title: 'Help Us Design: Community Solar Integration Concepts',
      snippet: 'We want YOUR creative ideas for integrating solar energy into existing municipal infrastructure. Sketch out your concepts - all ideas welcome, no matter how unconventional!',
      timestamp: '4 days ago',
      author: {
        name: 'Michael Park',
        role: 'Product Manager',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64',
      },
      tags: ['features', 'brainstorm', 'open-call', 'design'],
      references: [
        { id: '1', name: 'Solar Integration Proposal', uri: 'https://example.com', isFile: true },
      ],
      commentCount: 42,
    },

    // 6. CALL FOR POSTS (STORIES/EXPERIENCES)
    {
      id: '6',
      type: 'text',
      title: 'Share Your Success Stories: How Did You Overcome Challenges?',
      snippet: 'We want to hear from you! Share how you\'ve achieved your goals, overcame obstacles, or had breakthrough moments. Your stories inspire and motivate the entire team. No story is too small!',
      timestamp: '1 day ago',
      author: {
        name: 'Lisa Chen',
        role: 'Culture & Community',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64',
      },
      tags: ['culture', 'stories', 'community', 'experience'],
      commentCount: 28,
    },

    // 7. CALL FOR MEMOS
    {
      id: '7',
      type: 'memo',
      title: 'Build Our Knowledge Base: Submit Best Practices & Tips',
      snippet: 'Help us create comprehensive documentation. Share your best practices, lessons learned, and expert tips in memo form.',
      timestamp: '2 days ago',
      author: {
        name: 'David Kumar',
        role: 'Knowledge Manager',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64',
      },
      tags: ['documentation', 'knowledge', 'contribute'],
      commentCount: 15,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-page-title font-bold">Post Showcase</h1>
        <p className="text-body text-muted-foreground">
          Complete reference of all post types from production, now in the prototype
        </p>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => {
              console.log('Post clicked:', post.id, post.title);
            }}
            onExpandClick={() => {
              console.log('Expand clicked:', post.id);
            }}
          />
        ))}
      </div>

      {/* EXAMPLE: Post with Whiteboard Contributions */}
      <div className="mt-16 pt-12 border-t space-y-6">
        <div>
          <h2 className="text-subsection-title font-bold">Example: Post with Whiteboard Contributions</h2>
          <p className="text-body text-muted-foreground">This shows how posts display with response items below</p>
        </div>

        <PostCard
          post={{
            id: 'with-whiteboard-responses',
            type: 'whiteboard',
            title: 'Call for Ideas: Community Solar Projects',
            snippet: 'We need innovative concepts for integrating solar into existing municipal infrastructure. Please sketch out your ideas for public buildings, parking lots, and open spaces.',
            timestamp: '3 hours ago',
            author: {
              name: 'Alex Contributor',
              role: 'Energy Lead',
              avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64',
            },
            tags: ['solar', 'infrastructure', 'community'],
            commentCount: 8,
          }}
          contributionsPreview={
            <div className="mt-6 space-y-3 pt-6 border-t">
              <div className="flex items-center justify-between">
                <span className="text-label font-semibold text-muted-foreground">CONTRIBUTIONS (6)</span>
              </div>

              <ContributionGrid totalCount={6} onAddClick={() => {}} addLabel="+ Add Whiteboard">
                <ContributionWhiteboardCard
                  title="Public Library Solar Roof"
                  author="Sarah Chen"
                  previewUrl={wb1}
                  onClick={() => console.log('Whiteboard clicked')}
                />
                <ContributionWhiteboardCard
                  title="Parking Lot Canopies"
                  author="David Miller"
                  previewUrl={wb2}
                  onClick={() => console.log('Whiteboard clicked')}
                />
                <ContributionWhiteboardCard
                  title="School Microgrids"
                  author="Elena Rodriguez"
                  previewUrl={wb3}
                  onClick={() => console.log('Whiteboard clicked')}
                />
                <ContributionWhiteboardCard
                  title="Bus Stop Solar Stations"
                  author="Marc Johnson"
                  previewUrl={wb4}
                  onClick={() => console.log('Whiteboard clicked')}
                />
                <ContributionWhiteboardCard
                  title="Town Hall Retrofit"
                  author="John Smith"
                  previewUrl={wb1}
                  onClick={() => console.log('Whiteboard clicked')}
                />
                <ContributionWhiteboardCard
                  title="Park Lighting"
                  author="Emily Davis"
                  previewUrl={wb2}
                  onClick={() => console.log('Whiteboard clicked')}
                />
              </ContributionGrid>
            </div>
          }
        />
      </div>

      {/* EXAMPLE: Post with Post Contributions */}
      <div className="mt-16 pt-12 border-t space-y-6">
        <div>
          <h2 className="text-subsection-title font-bold">Example: Post with Post Contributions</h2>
          <p className="text-body text-muted-foreground">Shows response items that are text-based posts</p>
        </div>

        <PostCard
          post={{
            id: 'with-post-responses',
            type: 'text',
            title: 'Share Your Success Stories',
            snippet: 'Help inspire the team by sharing your breakthrough moments and victories.',
            timestamp: '1 day ago',
            author: {
              name: 'Lisa Chen',
              role: 'Culture Lead',
              avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64',
            },
            commentCount: 18,
          }}
          contributionsPreview={
            <div className="mt-6 space-y-3 pt-6 border-t">
              <div className="flex items-center justify-between">
                <span className="text-label font-semibold text-muted-foreground">CONTRIBUTIONS (2)</span>
              </div>

              <ContributionGrid totalCount={2} onAddClick={() => {}} addLabel="+ Add Post">
                <ContributionPostCard
                  title="My Journey: From Doubt to Confidence"
                  author={{ name: 'Maria Garcia' }}
                  onClick={() => console.log('Post clicked')}
                />
                <ContributionPostCard
                  title="How Our Team Shipped 3x Faster"
                  author={{ name: 'Thomas Mueller' }}
                  onClick={() => console.log('Post clicked')}
                />
              </ContributionGrid>
            </div>
          }
        />
      </div>
    </div>
  );
}
