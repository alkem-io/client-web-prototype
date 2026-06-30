import { ProductionPostCard, type PostCardData } from '@/app/components/space/ProductionPostCard';
import { ContributionGrid } from '@/app/components/contribution/ContributionGrid';
import { ContributionWhiteboardCard } from '@/app/components/contribution/ContributionWhiteboardCard';
import { ContributionPostCard } from '@/app/components/contribution/ContributionPostCard';
import { ContributionMemoCard } from '@/app/components/contribution/ContributionMemoCard';

// Import whiteboard images
import wb1 from '@/app/assets/wb1.png';
import wb2 from '@/app/assets/wb2.png';
import wb3 from '@/app/assets/wb3.png';
import wb4 from '@/app/assets/wb4.png';

/**
 * Comprehensive demonstration of all post types from production.
 * Shows: text, whiteboard, memo, media gallery, document, call-to-action, poll
 * Plus all "call for" variants (call for posts, call for whiteboards, etc.)
 */
export function AllPostTypesPage() {
  const posts: PostCardData[] = [
    // 1. TEXT POST WITH DESCRIPTION
    {
      id: '1',
      type: 'text',
      title: 'Project Update: Q3 Roadmap',
      snippet: `We're excited to share our Q3 priorities focusing on performance improvements and user experience enhancements. The team has been working hard on...

Key areas:
- Infrastructure optimization
- New dashboard features
- Mobile app improvements
- Security enhancements

Let's discuss in the comments!`,
      timestamp: '2 hours ago',
      author: {
        name: 'Sarah Chen',
        role: 'Product Lead',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64',
      },
      tags: ['product', 'roadmap', 'q3-2026'],
      references: [
        { id: '1', name: 'Q3 Roadmap Document', uri: '#', description: 'Full roadmap details' },
        { id: '2', name: 'design-system.figma.com', uri: '#' },
      ],
      commentCount: 12,
    },

    // 2. WHITEBOARD POST
    {
      id: '2',
      type: 'whiteboard',
      title: 'System Architecture Redesign',
      snippet: 'Brainstorming session on the new microservices architecture for better scalability and maintainability.',
      timestamp: '1 day ago',
      author: {
        name: 'Alex Rodriguez',
        role: 'Tech Lead',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64',
      },
      framingImageUrl: wb1,
      tags: ['architecture', 'infrastructure'],
      commentCount: 8,
    },

    // 3. MEMO POST
    {
      id: '3',
      type: 'memo',
      title: 'Team Meeting Notes - Strategy Session',
      snippet: 'Weekly strategy meeting notes and action items',
      timestamp: '3 hours ago',
      author: {
        name: 'Jordan Smith',
        role: 'Manager',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64',
      },
      framingMemoMarkdown: `- Discussed Q4 goals and metrics
- Reviewed team performance
- Identified blockers and solutions
- Next meeting: Friday 2pm

Action items:
1. Sarah - prepare presentation
2. Alex - review architecture doc
3. Jordan - schedule stakeholder call`,
      tags: ['meeting', 'notes'],
      commentCount: 5,
    },

    // 4. DRAFT POST
    {
      id: '4',
      type: 'text',
      title: 'Draft: Company Culture Guide (In Progress)',
      snippet: 'Working on our new company culture documentation. Still gathering feedback from the team...',
      timestamp: '6 hours ago',
      author: {
        name: 'Emma Wilson',
        role: 'HR Lead',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64',
      },
      isDraft: true,
      commentCount: 3,
    },

    // 5. CALL FOR WHITEBOARDS
    {
      id: '5',
      type: 'whiteboard',
      title: 'Call for Ideas: New Feature Concepts',
      snippet: 'We want your creative ideas for new features! Please sketch out your concepts - all ideas welcome.',
      timestamp: '4 days ago',
      author: {
        name: 'Michael Park',
        role: 'Product Manager',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64',
      },
      tags: ['features', 'brainstorm', 'open-call'],
      commentCount: 24,
    },

    // 6. CALL FOR POSTS (STORIES/EXPERIENCES)
    {
      id: '6',
      type: 'text',
      title: 'Share Your Success Stories',
      snippet: 'We want to hear from you! Share how you\'ve achieved your goals, overcame challenges, or had breakthrough moments. Your stories inspire the team.',
      timestamp: '1 day ago',
      author: {
        name: 'Lisa Chen',
        role: 'Culture Advocate',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64',
      },
      tags: ['culture', 'stories', 'community'],
      commentCount: 18,
    },

    // 7. CALL FOR MEMOS/DOCUMENTATION
    {
      id: '7',
      type: 'memo',
      title: 'Help us Document Best Practices',
      snippet: 'We\'re building a knowledge base. Please contribute memos with your best practices, tips, and lessons learned.',
      timestamp: '2 days ago',
      author: {
        name: 'David Kumar',
        role: 'Knowledge Manager',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64',
      },
      tags: ['documentation', 'knowledge', 'contribute'],
      commentCount: 7,
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-page-title font-bold mb-2">All Post Types</h1>
        <p className="text-body text-muted-foreground">
          Complete reference showing all post type variants from production
        </p>
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <ProductionPostCard
            key={post.id}
            post={post}
            onClick={() => console.log('Post clicked:', post.id)}
          />
        ))}
      </div>

      {/* EXAMPLE: Post with Responses */}
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-subsection-title font-bold mb-4">Post with Contributions</h2>
        <ProductionPostCard
          post={{
            id: 'with-responses',
            type: 'whiteboard',
            title: 'Call for Ideas: Community Solar Projects',
            snippet: 'We need innovative concepts for integrating solar into existing municipal infrastructure. Please sketch out your ideas for public buildings, parking lots, and open spaces.',
            timestamp: '3 hours ago',
            author: {
              name: 'Alex Contributor',
              role: 'Energy Lead',
              avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64',
            },
            tags: ['solar', 'infrastructure', 'call-for-ideas'],
            commentCount: 8,
          }}
          contributionsPreview={
            <div className="mt-6 space-y-3">
              <h3 className="text-label font-semibold text-muted-foreground mt-4">WHITEBOARDS</h3>
              <div className="flex gap-3 flex-wrap">
                <button className="px-4 py-2 rounded-full border border-foreground/40 bg-transparent text-foreground text-sm font-medium">
                  WHITEBOARDS
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-caption font-medium">4 Contributions</span>
                <button className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded hover:bg-primary/90">
                  + ADD WHITEBOARDS
                </button>
              </div>

              <ContributionGrid totalCount={4}>
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
                  author="Marc Johnson"
                  previewUrl={wb4}
                />
              </ContributionGrid>
            </div>
          }
        />
      </div>
    </div>
  );
}
