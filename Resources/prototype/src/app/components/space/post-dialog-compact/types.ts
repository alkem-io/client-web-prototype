/**
 * types — the configuration each option carries.
 *
 * Every shape here is edited in a stacked settings dialog, never in the main
 * dialog. Keeping them as plain data (rather than a dozen useState calls in the
 * composer) is what lets the settings dialogs be transactional: they edit a
 * draft copy and only hand it back on Save, so Back really does discard.
 */
import type { TaskColumnDef } from "@/app/components/contribution/TaskBoard";
import type {
  CalloutFormAnswerType,
  CalloutFormChoiceOption,
  CalloutFormResponseVisibility,
} from "@/app/components/callout/calloutFormTypes";

export const uid = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export interface LinkRow {
  title: string;
  url: string;
  description: string;
}

/** A question row while it's being authored — `sortOrder` is the array index. */
export interface DraftFormQuestion {
  id: string;
  question: string;
  explanation: string;
  answerType: CalloutFormAnswerType;
  options: CalloutFormChoiceOption[];
}

export const createDraftOption = (): CalloutFormChoiceOption => ({
  id: uid("opt"),
  label: "",
});

export const createDraftQuestion = (): DraftFormQuestion => ({
  id: uid("q"),
  question: "",
  explanation: "",
  // Short answer is the cheapest thing to answer, so it's the default —
  // the author opts into more effort rather than out of it.
  answerType: "short",
  options: [],
});

/**
 * One config object covers every collection type. The settings dialog shows the
 * slice that applies; the rest survives a type switch, so changing your mind
 * about Posts → Memos and back doesn't lose the defaults you wrote.
 */
export interface CollectionConfig {
  defaultTitle: string;
  defaultTags: string;
  defaultDescription: string;
  membersCanAdd: boolean;
  adminsCanAdd: boolean;
  commentsPerItem: boolean;
  /** Posts and Whiteboards start from a template. */
  template: string;
  taskColumns: TaskColumnDef[];
  links: LinkRow[];
  questions: DraftFormQuestion[];
  formVisibility: CalloutFormResponseVisibility;
  formAllowMultiple: boolean;
}

export const defaultCollectionConfig = (): CollectionConfig => ({
  defaultTitle: "",
  defaultTags: "",
  defaultDescription: "",
  membersCanAdd: true,
  adminsCanAdd: true,
  commentsPerItem: true,
  template: "",
  taskColumns: [
    { id: "todo", label: "To Do", color: "#6b7280" },
    { id: "in-progress", label: "In Progress", color: "#2563eb" },
    { id: "done", label: "Done", color: "#16a34a" },
  ],
  links: [{ title: "", url: "", description: "" }],
  questions: [createDraftQuestion()],
  formVisibility: "admins",
  formAllowMultiple: false,
});

export interface PollConfig {
  question: string;
  options: string[];
  multipleChoice: boolean;
}

export interface CtaConfig {
  label: string;
  url: string;
}

export type ContributorKind = "people" | "organizations" | "virtualContributors";

export interface ContributorsConfig {
  manual: boolean;
  kinds: ContributorKind[];
  defaultKind: ContributorKind;
  display: "list" | "map";
}

export interface SubspacesConfig {
  manual: boolean;
}

/** Attachment configuration, keyed by the attachment type that owns it. */
export interface AttachmentConfig {
  poll: PollConfig;
  cta: CtaConfig;
  contributors: ContributorsConfig;
  subspaces: SubspacesConfig;
}

export const defaultAttachmentConfig = (): AttachmentConfig => ({
  poll: { question: "", options: ["", ""], multipleChoice: false },
  cta: { label: "", url: "" },
  contributors: {
    manual: false,
    kinds: ["people", "organizations", "virtualContributors"],
    defaultKind: "people",
    display: "list",
  },
  subspaces: { manual: true },
});

export const POST_TEMPLATES = [
  "Blank Post",
  "Discussion Prompt",
  "Research Question",
  "Weekly Update",
  "Feedback Request",
];

export const WHITEBOARD_TEMPLATES = [
  "Blank Canvas",
  "Business Model Canvas",
  "Lean Canvas",
  "SWOT Analysis",
  "Mind Map",
  "Stakeholder Map",
];
