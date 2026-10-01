/**
 * Forum — production's `@/crd/components/forum/*`.
 *
 * CRD ships the whole surface: `ForumLayout` (banner row + category rail +
 * main column), `ForumBanner`, `ForumCategoryNav`, `ForumDiscussionListHeader`
 * (count, initiate, search, sort), `ForumDiscussionList` / `…ListItem`,
 * `ForumEmptyState`, `ForumDiscussionDetail` and
 * `ForumInitiateDiscussionDialog`. Its layout grid is the same one the
 * prototype had hand-written.
 *
 * What stays here: the mock discussions, the nested reply thread (CRD's detail
 * takes a `commentsSlot`, so the thread is the consumer's), and the create form
 * body (the dialog is a shell around `children`).
 *
 * Labels come from CRD's own `crd-forum` namespace rather than being retyped.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  HelpCircle,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Rocket,
  Send,
  Settings,
  Users,
} from 'lucide-react';
import { ForumBanner } from '@/crd/components/forum/ForumBanner';
import { ForumCategoryNav } from '@/crd/components/forum/ForumCategoryNav';
import { ForumDiscussionDetail } from '@/crd/components/forum/ForumDiscussionDetail';
import { ForumDiscussionList } from '@/crd/components/forum/ForumDiscussionList';
import { ForumDiscussionListHeader } from '@/crd/components/forum/ForumDiscussionListHeader';
import { ForumEmptyState } from '@/crd/components/forum/ForumEmptyState';
import { ForumInitiateDiscussionDialog } from '@/crd/components/forum/ForumInitiateDiscussionDialog';
import { ForumLayout } from '@/crd/components/forum/ForumLayout';
import type { ForumSortOrder } from '@/crd/components/forum/forumTypes';
import { MarkdownContent } from '@/crd/components/common/MarkdownContent';
import { Avatar, AvatarFallback, AvatarImage } from '@/crd/primitives/avatar';
import { Button } from '@/crd/primitives/button';
import { Input } from '@/crd/primitives/input';
import { Textarea } from '@/crd/primitives/textarea';
import { cn } from '@/crd/lib/utils';
import { CommentsPanel } from '@/app/components/comment/CommentsPanel';
import { toDiscussionDetail, toDiscussionListItem } from '@/app/mappers/forum';

interface ForumDiscussion {
  id: string;
  title: string;
  emoji: string;
  author: { name: string; avatarUrl: string };
  date: string;
  commentCount: number;
  category: string;
  content?: string;
}

interface ForumReply {
  id: string;
  author: { name: string; avatarUrl: string };
  date: string;
  content: string;
  replies?: ForumReply[];
}

const CATEGORY_ICONS = {
  all: MessageSquare,
  releases: Rocket,
  platform: Settings,
  community: Users,
  challenges: Building2,
  help: HelpCircle,
  other: MoreHorizontal,
} as const;

const CATEGORY_LABELS: Record<keyof typeof CATEGORY_ICONS, string> = {
  all: 'Show All',
  releases: 'Releases',
  platform: 'Platform Functionalities',
  community: 'Community Building',
  challenges: 'Working Challenge Centric',
  help: 'Need Help?',
  other: 'Other',
};

const AVATARS = {
  simone: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
  francisco: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
  denise: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
  mayke: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
  mirko: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
  galin: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
  piet: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
  erick: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80"
};

const DISCUSSIONS: ForumDiscussion[] = [
  {
    id: "1",
    title: "Polls, Group Chats and more!",
    emoji: "🎉",
    author: { name: "Simone Rietmeijer", avatarUrl: AVATARS.simone },
    date: "Tue, 24/06/2025",
    commentCount: 0,
    category: "releases",
    content: `We've got some nice updates to share! Here's what's new:

**🗳 Polls: Collect Opinions in Your Space**
We're excited to introduce **Polls** — a new way to gather feedback and spark discussions right where you post!
- **How to Use:** When creating a post, select Poll from the additional content options.
- **Customize Your Poll:** Adjust settings like anonymous voting, minimum/maximum option selections, and allowing users to add their own options.

**💬 Group Chats (Beta)**
As promised in our last update, **group chats** are now live!
- **How to Start:** When initiating a new chat, simply add multiple participants to create a group conversation.
- **Note:** Chat remains in beta — your feedback is very welcome as we continue to improve it.

**📝 Post Truncation**
We've added more control over post display in your Spaces. Subspace admins can now set a default display mode (expanded or collapsed) for the descriptions of all posts in a Subspace via **Layout Settings**.
- **By Default,** all posts in existing Spaces remain expanded. Newly created Spaces have the posts collapsed.
- **Additional content** like whiteboards and the media gallery are not collapsed.

**📅 Calendar Integration: Add Events to Your Personal Calendar**
You can now easily add events to your personal calendar!
- **Single Events:** Look for the download button in each event to add it to your calendar.
- **All Events:** Use the download button in the events overview to add all events at once.

**📂 Subspace Ordering: Customize Your Subspace List**
Space admins now have more control over how subspaces are organized:
- **Choose Ordering:** Go to Space Settings > Subspaces to select between alphabetical or custom ordering.
- **Drag & Drop:** If you choose custom ordering, simply drag and drop subspaces to your preferred arrangement.
- **Pin to Top:** Admins can also pin important subspaces to the top of the list for quick access.`
  },
  {
    id: "2",
    title: "Introducing Chat, Whiteboards for Guests & More!",
    emoji: "🎨",
    author: { name: "Simone Rietmeijer", avatarUrl: AVATARS.simone },
    date: "Fri, 13/02/2026",
    commentCount: 1,
    category: "releases",
    content: `We're thrilled to share an exciting set of updates that expand how you can collaborate on Alkemio!

**💬 Chat is here!**
You can now chat directly with other members on the platform. Start one-on-one conversations or create group chats to discuss ideas in real time.
- **Find it:** Click the chat icon in the top navigation bar to get started.
- **Notifications:** You'll receive a notification whenever someone sends you a new message.

**🎨 Whiteboards for Guests**
Guests can now view and interact with whiteboards shared in public Spaces. This makes it easier to collaborate with external stakeholders without requiring them to become full members.

**🔔 Improved Notification Settings**
We've redesigned the notification settings page to give you more granular control over what you receive:
- **Per-Space controls:** Mute specific Spaces while staying active in others.
- **Digest mode:** Get a daily or weekly summary instead of individual notifications.

**Looking for more details?** Check out our full release notes on the two main repositories for deeper insights:
- **Client Updates:** GitHub - Client Releases
- **Server Updates:** GitHub - Server Releases`
  },
  {
    id: "3",
    title: "Product Update: Notifications, Video calling and Memori!",
    emoji: "📣",
    author: { name: "Mayke Ruiterman", avatarUrl: AVATARS.mayke },
    date: "Thu, 27/1/2025",
    commentCount: 0,
    category: "releases",
    content: `Hello everyone! We have three major features to share with you this month.

**🔔 Revamped Notifications**
Our notification system has been completely rebuilt. You'll now receive timely, relevant updates about activity in your Spaces:
- New posts and replies in Spaces you follow
- Mentions of your name in discussions
- Updates to Subspaces you're a member of
- Invitation responses and membership changes

**📹 Video Calling (Beta)**
You can now start video calls directly within a Space! Look for the video icon in the Space header to initiate a call with members currently online.
- **Up to 8 participants** in the beta phase
- **Screen sharing** for presentations and demos
- **No additional software** required — works right in the browser

**🧠 Memori: AI-Powered Space Summaries**
Memori is our new AI assistant that helps you stay up to date. It generates concise summaries of recent activity in your Spaces, so you never miss important updates even when you've been away.
- **Weekly digests** delivered to your inbox
- **On-demand summaries** accessible from the Space header`
  },
  {
    id: "4",
    title: "Table",
    emoji: "❓",
    author: { name: "Galin Berytin", avatarUrl: AVATARS.galin },
    date: "Sat, 09/11/2025",
    commentCount: 3,
    category: "help",
    content: `Hi everyone,

I'm trying to insert a table into a post in my Space but I can't seem to figure out how to do it. The rich text editor shows a table icon in the toolbar, but when I click it nothing happens.

Has anyone managed to create a table in a post? Am I missing something?

Thanks in advance for any help!`
  },
  {
    id: "5",
    title: "Introducing Space Templates!",
    emoji: "✨",
    author: { name: "Denise Larssen", avatarUrl: AVATARS.denise },
    date: "Wed, 23/07/2025",
    commentCount: 0,
    category: "releases",
    content: `We're excited to announce **Space Templates** — a brand new way to get started faster on Alkemio!

**What are Space Templates?**
Templates are pre-configured Space setups that give you a head start. Each template comes with:
- A suggested set of Subspaces
- Pre-written descriptions and prompts
- Recommended Innovation Flow stages
- Example posts to guide first-time contributors

**Available Templates:**
- **Brainstorm** — Ideal for open idea generation with your community
- **Design Sprint** — A 5-day structured innovation process
- **Research Project** — Organize literature reviews, data collection, and findings
- **Community of Practice** — Build a knowledge-sharing community around a topic
- **Event Planning** — Coordinate speakers, logistics, and participant engagement

**How to use them:**
When creating a new Space, you'll now see a "Start from Template" option. Choose a template, customize it to your needs, and you're ready to go!

We'd love to hear your feedback — and if you have ideas for new templates, let us know!`
  },
  {
    id: "6",
    title: "Release update: From Collaboration tools to our new Post!",
    emoji: "🚀",
    author: { name: "Simone Rietmeijer", avatarUrl: AVATARS.simone },
    date: "Fri, 04/07/2025",
    commentCount: 1,
    category: "releases",
    content: `Hi everyone! This release brings a major overhaul to how content works on Alkemio.

**📝 The New Post Experience**
We've consolidated all our collaboration tools into a single, unified **Post** format. Posts now support:
- **Rich text** with formatting, headings, and links
- **Embedded whiteboards** for visual collaboration
- **File attachments** (documents, images, spreadsheets)
- **Polls** for quick decision-making
- **Collections** to gather related links or resources

**Why the change?**
Previously, Spaces had separate areas for discussions, whiteboards, and documents. This created fragmentation — important context was spread across multiple places. Now, everything lives together in Posts, making it much easier to keep conversations and content connected.

**What happened to existing content?**
All your existing discussions, whiteboards, and documents have been migrated into Posts automatically. Nothing was lost — they just live in a more organized home now.

**What's Next?**
We're working on Post templates, advanced search within Posts, and better notification controls for specific Post types.`
  },
  {
    id: "7",
    title: "Monthly Platform Updates — June 2025 🏖️",
    emoji: "📰",
    author: { name: "Simone Rietmeijer", avatarUrl: AVATARS.simone },
    date: "Thu, 03/07/2025",
    commentCount: 0,
    category: "releases",
    content: `Here's your monthly roundup of what happened on the platform in June!

**📊 Platform Stats — June 2025**
- 12 new Spaces created
- 340+ new posts across all Spaces
- 89 new members joined the platform
- 15 Innovation Flows completed

**🐛 Bug Fixes**
- Fixed an issue where notifications weren't sent for @mentions in comments
- Resolved a display bug with long Space names in the sidebar
- Fixed image upload failing for files over 5MB
- Corrected timezone display in event calendars

**🔧 Small Improvements**
- Faster page load times (average 20% improvement)
- Better mobile layout for the Knowledge Base tab
- Improved accessibility for screen readers on card components
- "Copy link" button now available on all posts

Have a great summer everyone! ☀️`
  },
  {
    id: "8",
    title: "Latest Updates: What's New on Alkemio?",
    emoji: "🎯",
    author: { name: "Simone Rietmeijer", avatarUrl: AVATARS.simone },
    date: "Fri, 23/05/2025",
    commentCount: 0,
    category: "platform",
    content: `A quick overview of what's been happening on the platform lately!

**🏠 Refreshed Dashboard**
Your personal dashboard now shows a combined activity feed from all your Spaces. You can filter by Space, by role, or see only your own activity.

**🔖 Bookmarks**
You can now bookmark any post to save it for later. Access your bookmarks from the sidebar under "Saved Items."

**👥 Improved Member Profiles**
Member profile pages now show:
- A bio and social links
- Spaces they're active in (with permission)
- Their recent contributions across the platform

**📱 Mobile Improvements**
The mobile experience continues to improve — the navigation menu is now more responsive, and posts render better on smaller screens.`
  },
  {
    id: "9",
    title: "Release Notes — Customize your Space tabs, dedicated Knowledge Base for your VC, enhanced Search, and much more!",
    emoji: "📋",
    author: { name: "Simone Rietmeijer", avatarUrl: AVATARS.simone },
    date: "Tue, 09/04/2025",
    commentCount: 0,
    category: "releases",
    content: `Lots of goodness in this release! Here's the full breakdown:

**🗂 Customizable Space Tabs**
Space admins can now choose which tabs to show and in what order. Go to Space Settings → Layout to:
- Hide tabs you don't need (e.g., hide Knowledge Base if you don't use it)
- Rename tabs to better fit your community's language
- Reorder tabs to prioritize what matters most

**🤖 Dedicated Knowledge Base for Virtual Contributors**
Virtual Contributors now have their own Knowledge Base section where they store and organize information. This means your VC can reference curated documents when answering questions.

**🔍 Enhanced Search**
Search has been significantly improved:
- **Full-text search** across all posts, documents, and whiteboards
- **Filters** by Space, author, date range, and content type
- **Instant results** as you type with highlighted matches
- **Search within a Space** — scope results to a single Space

**📋 Other Improvements**
- Drag-and-drop file upload in posts
- Improved loading performance for large Spaces
- Better error messages when something goes wrong
- Updated email templates for invitations`
  },
  {
    id: "10",
    title: "In the latest release: VirtualContributor™ Store, Subspace Templates, and more!",
    emoji: "🏪",
    author: { name: "Francisco R.", avatarUrl: AVATARS.francisco },
    date: "Fri, 29/12/2024",
    commentCount: 0,
    category: "releases",
    content: `The final release of 2024 is here with some exciting additions!

**🏪 VirtualContributor™ Store**
Browse and install pre-built Virtual Contributors from our new store. Each VC comes with a specific expertise area:
- **The Facilitator** — Helps guide discussions and summarize outcomes
- **The Researcher** — Finds and synthesizes relevant information
- **The Methodologist** — Suggests collaboration methods and frameworks
- **The Translator** — Makes content accessible in multiple languages

**📐 Subspace Templates**
Just like Space Templates, you can now create Subspaces from templates. This makes it faster to set up recurring structures — for example, creating a new "Sprint" Subspace every two weeks.

**🎨 Visual Refresh**
We've updated the platform's visual design with:
- Softer color palette and improved contrast
- New icons throughout the interface
- Better spacing and typography for readability
- Dark mode improvements`
  },
  {
    id: "11",
    title: "Refreshed Homepage, Subspace Events at Space Level, and more!",
    emoji: "🏠",
    author: { name: "Francisco R.", avatarUrl: AVATARS.francisco },
    date: "Thu, 06/12/2024",
    commentCount: 1,
    category: "releases",
    content: `Here's what's new this month:

**🏠 Refreshed Homepage**
The platform homepage has been redesigned to better showcase active Spaces and recent activity. New visitors will see featured Spaces, trending discussions, and an improved onboarding flow.

**📅 Subspace Events Visible at Space Level**
Events created in Subspaces now bubble up to the parent Space's calendar view. This gives Space admins a complete picture of all upcoming activities without needing to navigate into each Subspace.

**📊 Activity Analytics (Beta)**
Space admins can now access basic analytics:
- Member engagement over time
- Most active contributors
- Popular posts and discussions
- Growth trends

**🔗 Improved Link Previews**
When you paste a URL into a post, Alkemio now generates a rich preview card showing the page title, description, and thumbnail image.`
  },
  {
    id: "12",
    title: "External AI Service Integration, Direct Invitations, and more.",
    emoji: "🤖",
    author: { name: "Francisco R.", avatarUrl: AVATARS.francisco },
    date: "Fri, 07/11/2024",
    commentCount: 0,
    category: "platform",
    content: `We've been working on some powerful integrations and workflow improvements.

**🤖 External AI Service Integration**
Space admins can now connect external AI services to their Virtual Contributors. This means you can bring your own AI models (OpenAI, Anthropic, or custom) to power your VC's responses. Configuration is available in Space Settings → AI Integration.

**✉️ Direct Invitations**
Inviting new members is now much simpler:
- **Email invitations** — Send invites directly by email without the recipient needing an account first
- **Bulk invitations** — Upload a CSV to invite many people at once
- **Custom messages** — Add a personal note to each invitation
- **Tracking** — See which invitations are pending, accepted, or expired

**🔐 Improved Security**
- Two-factor authentication (2FA) is now available for all accounts
- Session management: see and terminate active sessions
- Audit log for Space admin actions`
  },
  {
    id: "13",
    title: "In the latest release: Mermio, Account Enhancements, Tutorials, and more.",
    emoji: "🧜",
    author: { name: "Francisco R.", avatarUrl: AVATARS.francisco },
    date: "Thu, 19/09/2024",
    commentCount: 0,
    category: "releases",
    content: `September brings some exciting additions to the platform!

**🧜 Meet Mermio**
Mermio is our new onboarding assistant that guides new users through their first steps on Alkemio. It provides personalized suggestions based on your interests and helps you find relevant Spaces to join.

**👤 Account Enhancements**
- **Social links** — Add your LinkedIn, Twitter, and website to your profile
- **Timezone settings** — Events and timestamps now respect your timezone
- **Language preferences** — Choose your preferred language for the interface
- **Export data** — Download all your contributions in a portable format

**📖 Interactive Tutorials**
New step-by-step tutorials are now available for:
- Creating your first Space
- Setting up an Innovation Flow
- Inviting and managing members
- Configuring a Virtual Contributor

Access them anytime from the "Help" menu in the top navigation.`
  },
  {
    id: "14",
    title: "VirtualContributors® are available!",
    emoji: "🤖",
    author: { name: "Francisco R.", avatarUrl: AVATARS.francisco },
    date: "Tue, 17/09/2024",
    commentCount: 0,
    category: "releases",
    content: `We are thrilled to announce that **VirtualContributors®** are officially available on Alkemio!

**What is a VirtualContributor?**
A VirtualContributor (VC) is an AI-powered member of your Space that can participate in discussions, answer questions, and help facilitate collaboration. Think of it as a knowledgeable team member that's always available.

**What can a VC do?**
- Answer questions based on your Space's Knowledge Base
- Summarize long discussions into key takeaways
- Suggest relevant resources when members ask for help
- Generate meeting agendas and action items
- Help onboard new members by explaining Space context

**How to add a VC to your Space:**
- Go to Space Settings → Members → Virtual Contributors
- Click "Add Virtual Contributor"
- Choose a personality and expertise area
- Configure its Knowledge Base sources
- The VC will start participating in discussions automatically

**Feedback welcome!**
This is our first release of VCs and we'd love to hear how you use them and what improvements you'd like to see.`
  },
  {
    id: "15",
    title: "🔍 Search results for Collaboration Tools!",
    emoji: "🔍",
    author: { name: "Donna Dublon", avatarUrl: AVATARS.denise },
    date: "Mon, 14/06/2024",
    commentCount: 0,
    category: "platform",
    content: `Hey all! I was testing out the search functionality and wanted to share some tips for finding collaboration tools on the platform.

**How to find tools:**
- Use the search bar in the top navigation
- Type keywords like "whiteboard", "poll", or "document"
- Results are grouped by type: Posts, Spaces, Members, and Resources

**Pro tip:** You can use filters to narrow results by Space, date, or content type. This is especially useful if you're looking for a specific whiteboard you saw a few weeks ago.

**What's searchable:**
- Post titles and content
- Whiteboard titles
- Document names and content
- Member names and bios
- Space names and descriptions

Hope this helps! Let me know if you have questions about finding things on the platform.`
  },
  {
    id: "16",
    title: "The Innovation Library just got more powerful!",
    emoji: "📚",
    author: { name: "Donna Dublon", avatarUrl: AVATARS.denise },
    date: "Mon, 24/06/2024",
    commentCount: 0,
    category: "platform",
    content: `Great news for everyone who uses the Innovation Library!

We've made several enhancements to make it more useful:

**📚 Expanded Content**
- 50+ new innovation methods and frameworks added
- Each method now includes real-world case studies
- Downloadable templates for workshops and sessions

**🔍 Better Discovery**
- Filter by category: Ideation, Validation, Implementation, Evaluation
- Filter by group size: Solo, Small team, Large group
- Filter by duration: Quick (15min), Medium (1hr), Extended (half-day+)
- Search by keyword across all methods

**⭐ Community Ratings**
- Rate methods you've tried (1-5 stars)
- See which methods are most popular in your community
- Read tips and experiences from other facilitators

Check it out at Templates → Innovation Library!`
  },
  {
    id: "17",
    title: "Introducing Subspace Invitations! 🎉",
    emoji: "💌",
    author: { name: "Simone Rietmeijer", avatarUrl: AVATARS.simone },
    date: "Thu, 30/05/2024",
    commentCount: 0,
    category: "platform",
    content: `You can now invite members directly to specific Subspaces!

**Previously:** Members had to join the parent Space first, then navigate to find the Subspace they needed.

**Now:** You can send a direct invitation link to a Subspace. When the recipient clicks it, they'll be guided through joining both the Space and Subspace in one smooth flow.

**How to use it:**
- Navigate to the Subspace you want to invite people to
- Click the "Invite" button in the members section
- Enter email addresses or copy the invitation link
- Recipients will receive a personalized invitation

**Permission handling:**
- If the invitee isn't a Space member yet, they'll be added to both
- If they're already a Space member, they'll just be added to the Subspace
- Admins can set whether Subspace invitations require Space-level approval

This should make it much easier to bring the right people into the right conversations!`
  },
  {
    id: "18",
    title: "Introducing Subspaces: A Fresh Approach to Collaboration",
    emoji: "🌿",
    author: { name: "Simone Rietmeijer", avatarUrl: AVATARS.simone },
    date: "Fri, 10/05/2024",
    commentCount: 0,
    category: "platform",
    content: `We're introducing **Subspaces** — a fundamental new way to organize work within your Spaces!

**What are Subspaces?**
Subspaces are focused areas within a Space. Think of a Space as a building, and Subspaces as the rooms inside it. Each room can have its own purpose, members, and content.

**Why Subspaces?**
As communities grow, a single flat discussion feed becomes hard to navigate. Subspaces let you:
- Organize content by topic, team, or project phase
- Control access — not everyone needs to see everything
- Reduce noise — members only get notifications for Subspaces they've joined
- Create focused workstreams within a larger community

**Examples:**
- A city innovation Space with Subspaces for Energy, Mobility, and Housing
- A company Space with Subspaces per project team
- A research Space with Subspaces for Literature Review, Data Collection, and Findings

**Getting started:**
Space admins can create Subspaces from the "Subspaces" tab. Each Subspace has its own feed, Knowledge Base, and member list.`
  },
  {
    id: "19",
    title: "Enhanced Search Functionality",
    emoji: "🔎",
    author: { name: "Simone Rietmeijer", avatarUrl: AVATARS.simone },
    date: "Fri, 12/04/2024",
    commentCount: 0,
    category: "platform",
    content: `Search on Alkemio just got a major upgrade! Here's what's new:

**⚡ Instant Results**
Results now appear as you type — no need to press Enter. You'll see suggestions grouped by category (Spaces, Posts, Members, Resources).

**🎯 Scoped Search**
You can now search within a specific Space by using the search bar on any Space page. Results will only include content from that Space and its Subspaces.

**📌 Recent Searches**
Your last 5 searches are saved for quick access. Click the search bar to see them.

**🏷️ Filters**
After searching, use filters to narrow results:
- Content type (Posts, Documents, Whiteboards, Members)
- Date range
- Space
- Author

We hope this makes finding things on the platform much easier. Let us know how it works for you!`
  },
  {
    id: "20",
    title: "Enhancements to the Innovation Flow: Smoother Experience and Default Selection ✨",
    emoji: "⚡",
    author: { name: "Simone Rietmeijer", avatarUrl: AVATARS.simone },
    date: "Fri, 12/04/2024",
    commentCount: 0,
    category: "platform",
    content: `We've made several improvements to how Innovation Flows work on the platform.

**🎯 Default Flow Selection**
When creating a new Space, you're now presented with recommended Innovation Flow templates based on your Space type. No more starting from a blank canvas.

**🔄 Smoother Transitions**
Moving posts between flow stages is now smoother with:
- Drag-and-drop between columns (Kanban view)
- Bulk move — select multiple posts and move them together
- Stage completion indicators showing progress

**📊 Flow Analytics**
New dashboard showing:
- How long posts spend in each stage
- Bottlenecks (stages where posts get stuck)
- Completion rates over time
- Most active contributors per stage

**🎨 Visual Customization**
You can now customize flow stage colors and icons to match your process branding.`
  },
  {
    id: "21",
    title: "Alkemio Product Update: November — March",
    emoji: "📰",
    author: { name: "Simone Rietmeijer", avatarUrl: AVATARS.simone },
    date: "Tue, 26/03/2024",
    commentCount: 0,
    category: "releases",
    content: `It's been a busy few months! Here's a summary of everything that shipped between November and March:

**November**
- Launched platform-wide search
- Added member directory with filtering
- Improved Space creation wizard

**December**
- Released Knowledge Base feature
- Added file upload support (PDF, DOCX, XLSX)
- Holiday season: reduced notifications by default

**January**
- New onboarding flow for first-time users
- Improved email invitation system
- Bug fixes for mobile browsers

**February**
- Launched Innovation Flow v2 with Kanban view
- Added role-based permissions (Admin, Lead, Member)
- Accessibility improvements (WCAG 2.1 AA compliance)

**March**
- Released Subspaces (see separate announcement)
- Added event scheduling within Spaces
- Performance improvements (40% faster page loads)

Thank you all for your feedback during this period — many of these features were directly inspired by your suggestions!`
  },
  {
    id: "22",
    title: "Introducing My Dashboard!",
    emoji: "💡",
    author: { name: "Simone Rietmeijer", avatarUrl: AVATARS.simone },
    date: "Fri, 09/02/2024",
    commentCount: 0,
    category: "platform",
    content: `We're excited to introduce **My Dashboard** — your personal home base on Alkemio!

**What is My Dashboard?**
It's the first thing you see when you log in. It provides a personalized overview of:
- **Recent Spaces** — Quick access to Spaces you visit most
- **Activity Feed** — Latest updates from all your Spaces in one place
- **Your Activity** — Track your own contributions and interactions
- **Quick Actions** — Create a Space, browse templates, manage invitations

**Customization:**
You can personalize your dashboard by:
- Pinning your favorite Spaces to the top
- Choosing which activity types to show (posts, comments, members joining, etc.)
- Setting your preferred time range for the activity feed

**Why a dashboard?**
As you join more Spaces, it becomes harder to keep track of everything. The dashboard brings it all together so you never miss important updates.

We'll continue improving the dashboard based on your feedback!`
  },
  {
    id: "23",
    title: "Feature Request: Use multiple Innovation Flow Items at the same time",
    emoji: "💡",
    author: { name: "Mirko de Boer", avatarUrl: AVATARS.mirko },
    date: "Tue, 21/11/2023",
    commentCount: 0,
    category: "platform",
    content: `Hi team,

I have a feature request: it would be really helpful to be able to assign a post to **multiple Innovation Flow stages** at the same time.

**Use case:** In our Space, some ideas are being validated while simultaneously being prototyped. Right now we have to pick one stage, which doesn't reflect the actual status.

**Proposed solution:**
Allow posts to be tagged with multiple stages, perhaps with a primary stage (for Kanban placement) and secondary stages (for tracking).

Anyone else running into this? Would love to hear how others handle multi-track innovation processes.`
  },
  {
    id: "24",
    title: "Automatic alkemio emails",
    emoji: "📧",
    author: { name: "Mirko de Boer", avatarUrl: AVATARS.mirko },
    date: "Tue, 14/11/2023",
    commentCount: 3,
    category: "help",
    content: `Quick question: I'm getting a lot of automated emails from Alkemio (notifications about posts, comments, new members, etc.) and I'd like to reduce the frequency.

Is there a way to:
- Switch to a daily or weekly digest instead of real-time emails?
- Turn off email notifications for specific Spaces while keeping them for others?
- Only get emails for @mentions and direct messages?

I've looked in my account settings but couldn't find granular email controls. Any help appreciated!`
  },
  {
    id: "25",
    title: "Some weird issues with hyperlinking",
    emoji: "🔗",
    author: { name: "Mirko de Boer", avatarUrl: AVATARS.mirko },
    date: "Tue, 14/11/2023",
    commentCount: 2,
    category: "help",
    content: `Has anyone else noticed issues with hyperlinks in posts?

I'm experiencing two problems:
- When I paste a URL, sometimes the link preview doesn't generate
- Links that include parentheses (like Wikipedia URLs) get cut off at the first ")"

I'm using Chrome on macOS. The issue seems to happen specifically with longer URLs or URLs with special characters.

Is this a known bug? Any workarounds?`
  },
  {
    id: "26",
    title: "How to create a new challenge ?",
    emoji: "❓",
    author: { name: "Erick Ntambo", avatarUrl: AVATARS.erick },
    date: "Wed, 28/10/2023",
    commentCount: 1,
    category: "help",
    content: `Hello everyone!

I'm new to Alkemio and I'd like to create a challenge for my community. I've seen other Spaces that have challenges set up, but I can't figure out how to create one myself.

Could someone walk me through the steps? Specifically:
- Where do I go to create a challenge?
- What information do I need to fill in?
- Can I set a deadline or timeline?
- How do I invite people to participate?

Thanks for any help — I'm excited to get started!`
  },
  {
    id: "27",
    title: "Why should I use Alkemio instead of other platforms?",
    emoji: "❓",
    author: { name: "Mayke Ragin", avatarUrl: AVATARS.mayke },
    date: "Tue, 04/04/2023",
    commentCount: 1,
    category: "help",
    content: `I'm evaluating collaboration platforms for our organization and I'd like to understand what makes Alkemio different from tools like Slack, Microsoft Teams, or Miro.

**What I'm looking for:**
- A platform for multi-stakeholder innovation projects
- Structured collaboration (not just chat)
- A way to track progress through innovation stages
- Community building features

**My concerns:**
- Do we really need another platform?
- How does Alkemio complement existing tools?
- What's the learning curve?

Would love to hear from people who've been using Alkemio — what's the main value you get from it?`
  },
  {
    id: "28",
    title: "Dream big, start small, but how?",
    emoji: "💭",
    author: { name: "Piet Sjoerdsma", avatarUrl: AVATARS.piet },
    date: "Fri, 31/03/2023",
    commentCount: 2,
    category: "community",
    content: `I often hear the advice "dream big, start small" when it comes to community building and innovation. But in practice, I find it hard to know where to start.

**My situation:**
I want to build a community around sustainable urban development in my city. I have a big vision (transform how our city approaches green infrastructure) but limited resources to start with.

**Questions for the community:**
- How did you get your first 10 members engaged?
- What's a good "small start" that shows value quickly?
- How do you maintain momentum when progress is slow?
- Any tips for getting institutional buy-in early on?

I'd love to learn from others who've been through this journey!`
  },
  {
    id: "29",
    title: "Say hi! 👋",
    emoji: "👋",
    author: { name: "Piet Sjoerdsma", avatarUrl: AVATARS.piet },
    date: "Fri, 31/03/2023",
    commentCount: 8,
    category: "community",
    content: `Welcome to the Alkemio Forum! 🌟

This is a space for the Alkemio community to connect, share ideas, and support each other. Whether you're a long-time user or just getting started, we'd love to hear from you!

**Introduce yourself:**
- What's your name?
- What brings you to Alkemio?
- What topic or challenge are you most passionate about?
- What do you hope to get out of this community?

I'll start: I'm Piet, and I'm passionate about using technology to bring people together for meaningful collaboration. I've been using Alkemio to connect sustainability practitioners across the Netherlands.

Looking forward to meeting you all! 🙌`
  },
  {
    id: "30",
    title: "What are the community building activities you would recommend?",
    emoji: "❓",
    author: { name: "Mayke Ragin", avatarUrl: AVATARS.mayke },
    date: "Fri, 31/03/2023",
    commentCount: 0,
    category: "community",
    content: `Hi everyone!

I'm a facilitator for a new Space and I'm looking for ideas on how to build engagement in the early days. The Space currently has about 15 members, but most are passive.

**What I've tried:**
- Welcome posts when new members join
- Weekly discussion prompts
- Sharing relevant articles

**What I'm looking for:**
- Activities that encourage members to contribute (not just read)
- Ice-breaker formats that work online
- Ways to create a sense of belonging and shared purpose
- Tips for going from lurkers to active participants

What has worked for you? Any creative approaches welcome!`
  },
  {
    id: "31",
    title: "Who is the owner of a challenge?",
    emoji: "❓",
    author: { name: "Mayke Ragin", avatarUrl: AVATARS.mayke },
    date: "Fri, 31/03/2023",
    commentCount: 0,
    category: "challenges",
    content: `I'm trying to understand the governance model for challenges on Alkemio.

**My questions:**
- Who "owns" a challenge? Is it the Space admin, or can anyone create one?
- Can ownership be transferred?
- What's the difference between a challenge owner and a facilitator?
- Can a challenge have multiple owners or is it always one person/organization?

In our organization we want to set up challenges that are owned by different departments. Would appreciate clarity on how this works.`
  },
  {
    id: "32",
    title: "What is the difference between alkemio and alkemiofoundation?",
    emoji: "❓",
    author: { name: "Mayke Ragin", avatarUrl: AVATARS.mayke },
    date: "Fri, 31/03/2023",
    commentCount: 0,
    category: "help",
    content: `I've seen references to both "Alkemio" and "Alkemio Foundation" and I'm not sure what the difference is.

- Is the Foundation the organization that builds the platform?
- Is "Alkemio" just the product name?
- Are there different entities involved?
- Is the platform open source?

Just trying to understand the relationship between the two. Thanks!`
  },
  {
    id: "33",
    title: "Why is Alkemio a foundation?",
    emoji: "❓",
    author: { name: "Mayke Ragin", avatarUrl: AVATARS.mayke },
    date: "Fri, 31/03/2023",
    commentCount: 0,
    category: "help",
    content: `I noticed that Alkemio is structured as a foundation rather than a company. I'm curious about the reasoning behind this choice.

- What are the benefits of being a foundation vs. a commercial company?
- How does this affect the platform's development priorities?
- Does it mean the platform will always be free/affordable?
- How is the foundation funded?

I think it's great that it's a foundation — just curious about the strategic thinking behind it.`
  },
  {
    id: "34",
    title: "What does it mean to work challenge centric?",
    emoji: "❓",
    author: { name: "Mayke Ragin", avatarUrl: AVATARS.mayke },
    date: "Fri, 30/03/2023",
    commentCount: 0,
    category: "challenges",
    content: `I keep hearing the term "challenge-centric" in the context of Alkemio, but I'd like a clearer understanding of what it means in practice.

**My understanding so far:**
It seems like the idea is that collaboration should be organized around specific challenges or problems to solve, rather than around teams or topics.

**Questions:**
- How is a "challenge" different from a "project"?
- What makes challenge-centric collaboration more effective?
- Are there examples of organizations that work this way successfully?
- How do you define a good challenge? Is there a template or framework?

Would love to hear concrete examples from people who've adopted this approach!`
  },
  {
    id: "35",
    title: "Which tool is it used to collaborate visually?",
    emoji: "❓",
    author: { name: "Mayke Ragin", avatarUrl: AVATARS.mayke },
    date: "Fri, 30/03/2023",
    commentCount: 1,
    category: "platform",
    content: `Hi! I'd like to do some visual collaboration with my Space members — things like brainstorming with sticky notes, creating mind maps, or sketching out ideas together.

Does Alkemio have a built-in tool for this, or do I need to use an external tool like Miro or FigJam?

If there is a built-in option, how do I access it? And can multiple people work on the same canvas at the same time?`
  },
  {
    id: "36",
    title: "Which collaboration tools do you offer?",
    emoji: "❓",
    author: { name: "Mayke Ragin", avatarUrl: AVATARS.mayke },
    date: "Fri, 30/03/2023",
    commentCount: 0,
    category: "platform",
    content: `I'm trying to get an overview of all the collaboration tools available on Alkemio. Could someone provide a comprehensive list?

Specifically, I'd like to know:
- What tools are available for real-time collaboration?
- What tools for async collaboration?
- Are there integrations with external tools?
- What's on the roadmap?

I'm preparing a presentation for my organization about why we should use Alkemio, and having a clear feature overview would really help!`
  },
  {
    id: "37",
    title: "Tips to start engaging your community on Alkemio?",
    emoji: "💡",
    author: { name: "Denise Larssen", avatarUrl: AVATARS.denise },
    date: "Thu, 30/03/2023",
    commentCount: 0,
    category: "community",
    content: `Hey everyone! I just set up a new Space for our local sustainability network and I want to make sure we get off to a strong start.

**Here are some tips I've gathered:**
- Start with a small, committed core group (5-10 people) before opening up
- Post the first few pieces of content yourself to set the tone
- Ask open-ended questions that invite responses
- Tag specific members when you think they'd have relevant input
- Celebrate contributions publicly (thank people, highlight great posts)
- Set a regular rhythm (e.g., "Monday challenge", "Friday reflection")

**What I'm still figuring out:**
- How often should facilitators post? Daily? Weekly?
- When do you open up a Space to a wider audience?
- How do you handle silence / low engagement in the early days?

Would love your additions to this list!`
  },
  {
    id: "38",
    title: "How to get started as an individual user on the platform?",
    emoji: "❓",
    author: { name: "Denise Larssen", avatarUrl: AVATARS.denise },
    date: "Wed, 29/03/2023",
    commentCount: 0,
    category: "help",
    content: `Welcome to new users! Here's a quick start guide for getting the most out of Alkemio as an individual:

**First steps:**
- Complete your profile (add a photo, bio, and interests)
- Browse the "Explore Spaces" page to find communities that match your interests
- Join 2-3 Spaces to start — don't overwhelm yourself!
- Read recent posts to understand the community culture
- Introduce yourself in a welcome thread if there is one

**Getting involved:**
- Comment on posts that interest you
- Share relevant resources or articles
- Respond to questions where you have expertise
- Create your own posts when you have ideas or questions

**Platform navigation:**
- Use the **Dashboard** for an overview of activity across your Spaces
- Use **Search** (Ctrl+K) to find anything quickly
- Check **Notifications** regularly for replies and mentions
- Visit your **Profile Settings** to configure notification preferences

If you have questions, this Forum is the place to ask. Welcome aboard!`
  },
];

const SAMPLE_REPLIES: ForumReply[] = [
  {
    id: "r1",
    author: { name: "Mirko de Boer", avatarUrl: AVATARS.mirko },
    date: "Wed, 25/06/2025",
    content: "Great update! Really excited about the polls feature. Can we set a time limit on polls?",
    replies: [
      {
        id: "r1-1",
        author: { name: "Simone Rietmeijer", avatarUrl: AVATARS.simone },
        date: "Wed, 25/06/2025",
        content: "Hi Mirko! Not yet, but that's on the roadmap. For now you can manually close a poll by editing the post."
      },
    ]
  },
  {
    id: "r2",
    author: { name: "Denise Larssen", avatarUrl: AVATARS.denise },
    date: "Thu, 26/06/2025",
    content: "The calendar integration is a game changer for our team. Works great with Google Calendar!",
    replies: []
  },
  {
    id: "r3",
    author: { name: "Galin Berytin", avatarUrl: AVATARS.galin },
    date: "Fri, 27/06/2025",
    content: "Quick question — is the drag & drop for subspace ordering available on mobile too?",
    replies: [
      {
        id: "r3-1",
        author: { name: "Simone Rietmeijer", avatarUrl: AVATARS.simone },
        date: "Fri, 27/06/2025",
        content: "Not yet on mobile — for now it's desktop only. We're looking into touch-friendly reordering for a future release."
      },
      {
        id: "r3-2",
        author: { name: "Galin Berytin", avatarUrl: AVATARS.galin },
        date: "Fri, 27/06/2025",
        content: "Makes sense, thanks for the quick reply!"
      },
    ]
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function ForumReplyItem({ reply, depth = 0 }: { reply: ForumReply; depth?: number }) {
  const [showReplyInput, setShowReplyInput] = useState(false);

  return (
    <div>
      <div
        className={cn("flex gap-4 py-4", depth > 0 && "ml-14")}
      >
        <Avatar className="w-10 h-10 shrink-0 mt-0.5">
          <AvatarImage src={reply.author.avatarUrl} alt={reply.author.name} />
          <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-card-title" style={{ color: "var(--foreground)" }}>
              {reply.author.name}
            </span>
            <span className="text-caption" style={{ color: "var(--muted-foreground)" }}>
              {reply.date}
            </span>
          </div>
          <p className="text-body" style={{ color: "var(--foreground)" }}>
            {reply.content}
          </p>
          <div className="flex items-center gap-4 pt-0.5">
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-muted-foreground hover:text-primary transition-colors text-caption font-medium"
            >
              Reply
            </button>
            <button
              className="text-muted-foreground hover:text-primary transition-colors text-caption font-medium"
            >
              Delete
            </button>
          </div>
          {showReplyInput && (
            <div className="flex items-center gap-2 pt-2">
              <Input
                placeholder="Write a reply..."
                className="h-8 text-body"
              />
              <Button size="sm" variant="default" className="h-8 px-3">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
      {reply.replies?.map((nested) => (
        <ForumReplyItem key={nested.id} reply={nested} depth={depth + 1} />
      ))}
    </div>
  );
}


export default function ForumPage() {
  const { t } = useTranslation('crd-forum');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<ForumSortOrder>('newest');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');

  const selected = DISCUSSIONS.find(d => d.id === selectedId) ?? null;

  const visible = DISCUSSIONS.filter(d => {
    const matchesCategory = activeCategory === 'all' || d.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q || d.title.toLowerCase().includes(q) || d.author.name.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const items = visible.map(d =>
    toDiscussionListItem(d, t('list.itemAriaLabel', { count: d.commentCount, title: d.title, author: d.author.name, date: d.date }))
  );

  return (
    <>
      <ForumLayout
        bannerNode={
          <ForumBanner
            titleNode={t('banner.title')}
            subtitleNode={t('banner.subtitle')}
            iconNode={<MessageSquare aria-hidden="true" className="size-8" />}
          />
        }
        sidebarNode={
          <ForumCategoryNav
            entries={(Object.keys(CATEGORY_ICONS) as (keyof typeof CATEGORY_ICONS)[]).map(slug => {
              const Icon = CATEGORY_ICONS[slug];
              return {
                slug,
                label: CATEGORY_LABELS[slug],
                iconNode: <Icon aria-hidden="true" className="size-4" />,
              };
            })}
            activeSlug={activeCategory}
            onCategoryChange={slug => {
              setActiveCategory(slug);
              setSelectedId(null);
            }}
            sectionLabel={t('categories.sectionLabel')}
            selectAriaLabel={t('categories.selectAriaLabel')}
          />
        }
        mainNode={
          selected ? (
            <ForumDiscussionDetail
              data={toDiscussionDetail(
                selected,
                selected.content ? <MarkdownContent content={selected.content} /> : null
              )}
              backHref="/forum"
              backLabel={t('detail.back', { defaultValue: 'See all discussions' })}
              onBack={() => setSelectedId(null)}
              shareLabel={t('detail.share', { defaultValue: 'Share' })}
              editLabel={t('detail.edit', { defaultValue: 'Edit' })}
              deleteLabel={t('detail.delete', { defaultValue: 'Delete' })}
              // Production's comment system, same as every other comment
              // surface. See `comment/CommentsPanel`.
              commentsSlot={<CommentsPanel threadId={`forum-${selected.id}`} />}
            />
          ) : (
            <>
              <ForumDiscussionListHeader
                countLabel={t('list.headerCount', { count: items.length })}
                initiateSlot={
                  <Button size="sm" className="gap-1.5" onClick={() => setShowCreateDialog(true)}>
                    <Plus className="size-4" aria-hidden="true" />
                    {t('list.initiate')}
                  </Button>
                }
                searchValue={searchQuery}
                searchPlaceholder={t('list.searchPlaceholder')}
                searchAriaLabel={t('list.searchAriaLabel')}
                onSearchChange={setSearchQuery}
                sortValue={sortOrder}
                sortAriaLabel={t('list.sortAriaLabel', { defaultValue: 'Sort discussions' })}
                sortOptions={[
                  { value: 'newest', label: t('list.sortNewest', { defaultValue: 'Newest' }) },
                  { value: 'oldest', label: t('list.sortOldest', { defaultValue: 'Oldest' }) },
                ]}
                onSortChange={setSortOrder}
              />

              <ForumDiscussionList
                items={
                  sortOrder === 'oldest'
                    ? [...items].sort((a, b) => a.timestamp - b.timestamp)
                    : [...items].sort((a, b) => b.timestamp - a.timestamp)
                }
                metaLineFor={item =>
                  t('list.metaLine', {
                    count: item.commentCount,
                    author: item.author.displayName,
                    date: item.formattedDate,
                    defaultValue: `${item.author.displayName} · ${item.formattedDate}`,
                  })
                }
                emptySlot={
                  <ForumEmptyState
                    title={t('list.emptyTitle', { defaultValue: 'No discussions found' })}
                    subtitle={t('list.emptySubtitle', {
                      defaultValue: 'Try adjusting your search or category filter',
                    })}
                    iconNode={<MessageSquare aria-hidden="true" className="size-10" />}
                  />
                }
                onActivate={setSelectedId}
                className="mt-4"
              />
            </>
          )
        }
      />

      <ForumInitiateDiscussionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        mode="initiate"
        title={t('initiate.title', { defaultValue: 'Create Discussion' })}
        submitLabel={t('initiate.submit', { defaultValue: 'Create' })}
        cancelLabel={t('initiate.cancel', { defaultValue: 'Cancel' })}
        submitDisabled={!draftTitle.trim()}
        busy={false}
        onSubmit={() => {
          setShowCreateDialog(false);
          setDraftTitle('');
          setDraftContent('');
        }}
      >
        <div className="space-y-4">
          <Input
            placeholder="Title"
            value={draftTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraftTitle(e.target.value)}
          />
          <Textarea
            placeholder="What would you like to discuss?"
            className="min-h-40"
            value={draftContent}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDraftContent(e.target.value)}
          />
        </div>
      </ForumInitiateDiscussionDialog>
    </>
  );
}
