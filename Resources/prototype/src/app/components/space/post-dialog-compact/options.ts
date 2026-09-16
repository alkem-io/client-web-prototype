/**
 * options — the registries behind the Create Post dialog.
 *
 * Every option carries one plain sentence, the way the space settings pages
 * pair a control with a line of human explanation. The sentence is rendered on
 * the surface — in the caption under whichever row the option belongs to —
 * never hidden in a tooltip you have to hunt for.
 *
 * `settings: "dialog"` marks the types whose configuration is a form rather
 * than content. Those never expand inline; they open a stacked settings dialog,
 * which is what kept the old dialog one screen tall.
 */
import {
  BarChart3,
  Ban,
  CheckSquare,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  Image,
  LayoutGrid,
  Link2,
  Megaphone,
  PenLine,
  Presentation,
  StickyNote,
  Users,
  type LucideIcon,
} from "lucide-react";

export type AttachmentType =
  | "none"
  | "whiteboard"
  | "memo"
  | "document"
  | "image"
  | "poll"
  | "cta"
  | "contributors"
  | "subspaces";

export type CollectionType =
  | "none"
  | "links"
  | "posts"
  | "tasks"
  | "memos"
  | "whiteboards"
  | "form";

export interface OptionDef<T extends string> {
  id: T;
  label: string;
  /** One plain sentence, shown on the surface — never only in a tooltip. */
  description: string;
  icon: LucideIcon;
  /** Where this option's configuration lives once it is picked. */
  settings: "none" | "inline" | "dialog";
  disabled?: boolean;
  disabledReason?: string;
}

/**
 * Body attachments — "Additional content" in the old dialog. Ordered by how
 * often authors reach for them, with `none` first so the default reads as a
 * deliberate choice rather than an empty state.
 */
export const ATTACHMENT_OPTIONS: OptionDef<AttachmentType>[] = [
  {
    id: "none",
    label: "None",
    description: "Just your words — nothing else in the body",
    icon: Ban,
    settings: "none",
  },
  {
    id: "whiteboard",
    label: "Whiteboard",
    description: "A canvas people can sketch on together",
    icon: Presentation,
    settings: "inline",
  },
  {
    id: "memo",
    label: "Memo",
    description: "A longer note that lives inside the post",
    icon: StickyNote,
    settings: "inline",
  },
  {
    id: "document",
    label: "Document",
    description: "Write a document, or upload one you have",
    icon: FileSpreadsheet,
    settings: "inline",
  },
  {
    id: "image",
    label: "Media",
    description: "Show pictures under your description",
    icon: Image,
    settings: "inline",
  },
  {
    id: "poll",
    label: "Poll",
    description: "Ask a question and let people vote",
    icon: BarChart3,
    settings: "dialog",
  },
  {
    id: "cta",
    label: "Action",
    description: "A button that takes people somewhere",
    icon: Megaphone,
    settings: "dialog",
  },
  {
    id: "contributors",
    label: "Contributors",
    description: "Introduce the people involved",
    icon: Users,
    settings: "dialog",
  },
  {
    id: "subspaces",
    label: "Subspaces",
    description: "Point to subspaces worth visiting",
    icon: LayoutGrid,
    settings: "dialog",
  },
];

/**
 * Response types — "Add a Collection" in the old dialog. Every one of them is
 * configured in the stacked Collection Settings dialog, so this row never
 * changes the height of the main dialog.
 */
export const COLLECTION_OPTIONS: OptionDef<CollectionType>[] = [
  {
    id: "none",
    label: "None",
    description: "Nothing to add — people can still comment",
    icon: Ban,
    settings: "none",
  },
  {
    id: "links",
    label: "Links & Files",
    description: "People add links and files",
    icon: Link2,
    settings: "dialog",
  },
  {
    id: "posts",
    label: "Posts",
    description: "People write short posts back",
    icon: FileText,
    settings: "dialog",
  },
  {
    id: "tasks",
    label: "Tasks",
    description: "People add tasks to a shared board",
    icon: CheckSquare,
    settings: "dialog",
  },
  {
    id: "memos",
    label: "Memos",
    description: "People write longer notes back",
    icon: PenLine,
    settings: "dialog",
  },
  {
    id: "whiteboards",
    label: "Whiteboards",
    description: "People add their own whiteboards",
    icon: Presentation,
    settings: "dialog",
  },
  {
    id: "form",
    label: "Form",
    description: "People answer the questions you set",
    icon: ClipboardList,
    settings: "dialog",
  },
];

/**
 * Comments is a yes/no, so it is a switch row in the composer rather than a
 * pair of options — the same idiom the settings pages use for every binary.
 */
export type CommentsMode = "off" | "on";

export const attachmentOption = (id: AttachmentType) =>
  ATTACHMENT_OPTIONS.find(o => o.id === id)!;

export const collectionOption = (id: CollectionType) =>
  COLLECTION_OPTIONS.find(o => o.id === id)!;
