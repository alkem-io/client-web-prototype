export interface VirtualContributor {
  id: string;
  slug: string;
  name: string;
  avatarUrl: string;
  description: string;
  tags: string[];
  host: {
    name: string;
    avatarUrl: string;
    slug: string;
  };
  functionality: {
    capabilities: { label: string; enabled: boolean }[];
    dataAccess: { label: string; enabled: boolean }[];
  };
  aiEngine: {
    name: string;
    openModel: boolean;
    dataUsedForTraining: boolean;
    knowledgeRestriction: boolean;
    webAccess: boolean;
    physicalLocation: string;
  };
  examplePrompts?: string[];
}

export const MOCK_VC_LIBRARY: VirtualContributor[] = [
  {
    id: "vc-softmann",
    slug: "softmann",
    name: "Softmann",
    avatarUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80",
    description: "A secret UX helper tool",
    tags: ["UX", "UI", "Design Research"],
    host: {
      name: "Jeroen Nijkamp",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      slug: "jnijkamp",
    },
    functionality: {
      capabilities: [
        { label: "Answer questions in comments", enabled: true },
        { label: "Create new posts", enabled: false },
        { label: "Invite other contributors", enabled: false },
      ],
      dataAccess: [
        { label: "About page", enabled: true },
        { label: "Posts & Contributions", enabled: false },
        { label: "Subspaces", enabled: false },
      ],
    },
    aiEngine: {
      name: "Alkemio AI",
      openModel: true,
      dataUsedForTraining: false,
      knowledgeRestriction: true,
      webAccess: false,
      physicalLocation: "Sweden, EU",
    },
    examplePrompts: [
      "What are the key UX principles for this design?",
      "How can we improve the user experience here?",
    ],
  },
  {
    id: "vc-analyst",
    slug: "data-analyst",
    name: "Data Analyst",
    avatarUrl: "https://images.unsplash.com/photo-1633356122544-f134324331cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80",
    description: "Analyzes data and trends",
    tags: ["Analytics", "Data Science", "Reporting"],
    host: {
      name: "Sarah Chen",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      slug: "schen",
    },
    functionality: {
      capabilities: [
        { label: "Analyze data", enabled: true },
        { label: "Generate reports", enabled: true },
        { label: "Create visualizations", enabled: false },
      ],
      dataAccess: [
        { label: "Statistics", enabled: true },
        { label: "Metrics", enabled: true },
        { label: "Private data", enabled: false },
      ],
    },
    aiEngine: {
      name: "Claude AI",
      openModel: false,
      dataUsedForTraining: false,
      knowledgeRestriction: true,
      webAccess: false,
      physicalLocation: "Canada, NA",
    },
  },
  {
    id: "vc-writer",
    slug: "content-writer",
    name: "Content Writer",
    avatarUrl: "https://images.unsplash.com/photo-1620706857297-8f5621a3dba5?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80",
    description: "Helps with content creation and editing",
    tags: ["Content", "Writing", "Editing"],
    host: {
      name: "Alex Rodriguez",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      slug: "arodriguez",
    },
    functionality: {
      capabilities: [
        { label: "Draft content", enabled: true },
        { label: "Edit existing content", enabled: true },
        { label: "Moderate discussions", enabled: false },
      ],
      dataAccess: [
        { label: "Published content", enabled: true },
        { label: "Drafts", enabled: true },
        { label: "Member data", enabled: false },
      ],
    },
    aiEngine: {
      name: "GPT-4",
      openModel: false,
      dataUsedForTraining: true,
      knowledgeRestriction: false,
      webAccess: true,
      physicalLocation: "USA, NA",
    },
  },
];
