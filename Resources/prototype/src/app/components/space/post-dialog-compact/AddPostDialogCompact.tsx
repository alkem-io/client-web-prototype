/**
 * AddPostDialogCompact — the Create Post dialog, cut along the lines of the
 * pre-redesign posting dialog and dressed in the space settings pages' voice.
 *
 * Two influences, doing two different jobs.
 *
 * The old dialog decides the *structure*: it opened at one screen, kept single
 * choices as radio groups with an explicit None, and pushed every configuration
 * form into a stacked dialog with its own Back / Save. Picking a response type
 * cost the composer no height at all, which is why it never felt like a wall.
 *
 * The space settings pages decide the *tone*: a tinted icon chip, a plain-word
 * heading and one sentence per group — and, crucially, options that explain
 * themselves on the surface rather than behind a tooltip. "Tasks" tells a
 * first-time author nothing; "People add tasks to a shared board" tells them
 * everything.
 *
 * The writing area deliberately keeps no section chrome. Settings vocabulary
 * belongs on settings; the top of a composer is a canvas, and framing it as
 * another configuration group would re-introduce exactly the technical feeling
 * this pass is removing.
 *
 * Behaviour parity with `AddPostModal` is intentional: every attachment type
 * and response type the current dialog offers is offered here too. This is a
 * layout, disclosure and tone argument, not a feature-reduction argument.
 */
import { useRef, useState } from "react";
import { useParams } from "react-router";
import {
  Hash,
  Image as ImageIcon,
  Lightbulb,
  Link2,
  MessageSquare,
  MessagesSquare,
  Pencil,
  Plus,
  Settings2,
  Sparkles,
  Trash2,
  Upload
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/crd/primitives/dialog";
import { Button } from "@/crd/primitives/button";
import { IconButton } from "@/crd/primitives/icon-button";
import { Input } from "@/crd/primitives/input";
import { Label } from "@/crd/primitives/label";
import { MarkdownEditor } from "@/crd/forms/markdown/MarkdownEditor";
import { Separator } from "@/crd/primitives/separator";
import { Switch } from "@/crd/primitives/switch";
import { SettingsSection } from "@/app/components/shared/SettingsSection";
import { TooltipProvider } from "@/crd/primitives/tooltip";
import { cn } from "@/crd/lib/utils";
import { OptionTiles } from "./OptionTiles";
import {
  ATTACHMENT_OPTIONS,
  COLLECTION_OPTIONS,
  attachmentOption,
  collectionOption,
  type AttachmentType,
  type CollectionType,
  type CommentsMode,
  type OptionDef
} from "./options";
import {
  AttachmentSettingsDialog,
  type ConfigurableAttachment
} from "./AttachmentSettingsDialog";
import { CollectionSettingsDialog } from "./CollectionSettingsDialog";
import {
  defaultAttachmentConfig,
  defaultCollectionConfig,
  type AttachmentConfig,
  type CollectionConfig,
  type LinkRow
} from "./types";

/** Stand-in for a real whiteboard thumbnail, as elsewhere in the prototype. */
const WHITEBOARD_PREVIEW =
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1080";

interface AddPostDialogCompactProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPostDialogCompact({ open, onOpenChange }: AddPostDialogCompactProps) {
  const { spaceSlug = "design-workshop", subspaceSlug } = useParams<{
    spaceSlug: string;
    subspaceSlug?: string;
  }>();
  const basePath = subspaceSlug
    ? `/space/${spaceSlug}/subspaces/${subspaceSlug}`
    : `/space/${spaceSlug}`;

  /* ─── The post itself ─── */
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [references, setReferences] = useState<LinkRow[]>([]);

  /* ─── Body attachment ─── */
  const [attachment, setAttachment] = useState<AttachmentType>("none");
  const [attachmentConfig, setAttachmentConfig] = useState<AttachmentConfig>(
    defaultAttachmentConfig,
  );
  const [memoText, setMemoText] = useState("");
  const [attachmentSettingsFor, setAttachmentSettingsFor] =
    useState<ConfigurableAttachment | null>(null);
  /** Whichever tile the pointer or keyboard is on — drives the caption line. */
  const [hoveredAttachment, setHoveredAttachment] =
    useState<OptionDef<AttachmentType> | null>(null);

  /* ─── Response options ─── */
  const [responsesOpen, setResponsesOpen] = useState(false);
  const responsesRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState<CommentsMode>("on");
  const [collection, setCollection] = useState<CollectionType>("none");
  const [collectionConfig, setCollectionConfig] = useState<CollectionConfig>(
    defaultCollectionConfig,
  );
  const [collectionSettingsOpen, setCollectionSettingsOpen] = useState(false);
  const [hoveredCollection, setHoveredCollection] = useState<OptionDef<CollectionType> | null>(
    null,
  );

  const canPost = title.trim().length > 0;
  const hasContent =
    canPost || description.trim().length > 0 || attachment !== "none" || references.length > 0;

  /* Plain-language state, printed in the collapsed section's own description
     slot — folding something away should never cost the author the knowledge of
     what they set. */
  const responsesSummary =
    collection === "none"
      ? comments === "on"
        ? "People can comment. Nothing to contribute yet."
        : "Read-only — no comments, nothing to contribute."
      : `${comments === "on" ? "Comments on" : "No comments"} · people can add ${collectionOption(
          collection,
        ).label.toLowerCase()}`;

  const attachmentSummary = (): string => {
    switch (attachment) {
      case "whiteboard":
        return "Blank canvas — anyone who can see the post can open it";
      case "memo":
        return memoText.trim() ? "Rich text" : "Nothing written yet";
      case "document":
        return "Nothing uploaded yet";
      case "image":
        return "No pictures yet";
      case "poll": {
        const filled = attachmentConfig.poll.options.filter(o => o.trim()).length;
        return attachmentConfig.poll.question.trim()
          ? `${attachmentConfig.poll.question} — ${filled} options`
          : "Not set up yet";
      }
      case "cta":
        return attachmentConfig.cta.label
          ? `“${attachmentConfig.cta.label}” → ${attachmentConfig.cta.url || "no target"}`
          : "Not set up yet";
      case "contributors":
        return attachmentConfig.contributors.manual
          ? "Hand-picked contributors"
          : `${attachmentConfig.contributors.kinds.length} types · ${attachmentConfig.contributors.display} view`;
      case "subspaces":
        return attachmentConfig.subspaces.manual ? "Hand-picked subspaces" : "All subspaces";
      default:
        return "";
    }
  };

  const selectedAttachment = attachment === "none" ? null : attachmentOption(attachment);
  const attachmentOpensDialog = selectedAttachment?.settings === "dialog";
  /* Both captions follow the pointer and fall back to the current choice. */
  const attachmentCaption = (hoveredAttachment ?? attachmentOption(attachment)).description;
  const collectionCaption = (hoveredCollection ?? collectionOption(collection)).description;

  return (
    <TooltipProvider delayDuration={300}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* DialogContent renders its own close X at top-4 right-4 — the header
            reserves pr-12 for it instead of adding a second one. */}
        <DialogContent className="flex max-h-[90vh] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
          {/* ─── Header ─── */}
          <div className="flex items-center justify-between gap-3 border-b px-6 py-4 pr-12">
            <DialogTitle className="text-subsection-title">Create Post</DialogTitle>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Lightbulb className="size-4" />
              Find Template
            </Button>
          </div>
          <DialogDescription className="sr-only">
            Write a post. Body content and response options are optional.
          </DialogDescription>

          {/* ─── Body ─── */}
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            {/* The canvas — no section chrome, no boxes around the words. Three
                framed fields stacked up read as a form to fill in; a title line,
                an editor and a quiet tag row read as somewhere to write. The
                required title keeps its affordance through the hairline that
                lights up on focus and the Post button that stays disabled. */}
            <div className="space-y-3">
              <input
                id="post-title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Give your post a title"
                aria-label="Title"
                className={cn(
                  "w-full border-0 border-b bg-transparent px-1 pb-2 text-section-title outline-none transition-colors",
                  "placeholder:text-muted-foreground/50 focus:border-primary/40",
                  title ? "border-border" : "border-transparent",
                )}
              />

              <MarkdownEditor
                value={description}
                onChange={setDescription}
                placeholder="Say what's on your mind…"
                className="min-h-[140px]"
              />

              <div className="flex items-center gap-2 px-1">
                <Hash className="size-3.5 shrink-0 text-muted-foreground" />
                <input
                  id="post-tags"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="Add tags"
                  aria-label="Tags"
                  className="flex-1 bg-transparent text-body outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* ─── Attachment, when one is chosen ───
                Sits above the picker, the way the old dialog put the whiteboard
                preview between the description and the "Additional content"
                row: the thing you added belongs with the post, not with the
                control that added it. */}
            {selectedAttachment && (
              <section className="overflow-hidden rounded-xl border bg-card">
                <div className="flex items-center justify-between gap-3 border-b bg-muted/30 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                      <selectedAttachment.icon className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-body-emphasis">{selectedAttachment.label}</p>
                      <p className="truncate text-caption text-muted-foreground">
                        {attachmentSummary()}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {attachment === "whiteboard" && (
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Pencil className="size-3.5" />
                        Edit
                      </Button>
                    )}
                    {attachmentOpensDialog && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() =>
                          setAttachmentSettingsFor(attachment as ConfigurableAttachment)
                        }
                      >
                        <Settings2 className="size-3.5" />
                        Set it up
                      </Button>
                    )}
                    <IconButton
                      variant="ghost"
                      tooltipLabel={`Remove ${selectedAttachment.label.toLowerCase()}`}
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setAttachment("none")}
                    >
                      <Trash2 className="size-4" />
                    </IconButton>
                  </div>
                </div>

                <div className="p-4">
                  {/* Content you author lives inline; configuration lives in the
                      settings dialog. That split is the whole disclosure rule. */}
                  {attachment === "whiteboard" && (
                    <img
                      src={WHITEBOARD_PREVIEW}
                      alt="Whiteboard preview"
                      className="h-48 w-full rounded-lg border object-cover"
                    />
                  )}

                  {attachment === "memo" && (
                    <MarkdownEditor
                      value={memoText}
                      onChange={setMemoText}
                      placeholder="Write your memo…"
                      className="min-h-[120px]"
                    />
                  )}

                  {attachment === "image" && (
                    <div className="space-y-3">
                      <div className="cursor-pointer rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/20 p-6 text-center transition-colors hover:border-primary/40 hover:bg-primary/5">
                        <ImageIcon className="mx-auto mb-2 size-6 text-muted-foreground/50" />
                        <p className="text-body text-muted-foreground">
                          Drop a picture here, or click to browse
                        </p>
                        <p className="mt-1 text-caption text-muted-foreground/70">
                          PNG, JPG or GIF, up to 10 MB
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                        <Plus className="size-3.5" /> Add another picture
                      </Button>
                    </div>
                  )}

                  {attachment === "document" && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        {[
                          { label: "Document", icon: "📄" },
                          { label: "Spreadsheet", icon: "📊" },
                          { label: "Presentation", icon: "📑" },
                        ].map(doc => (
                          <button
                            key={doc.label}
                            className="flex flex-1 flex-col items-center gap-1.5 rounded-xl border bg-muted/20 p-3 transition-colors hover:bg-muted/50"
                          >
                            <span className="text-section-title">{doc.icon}</span>
                            <span className="text-caption text-muted-foreground">{doc.label}</span>
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <Separator className="flex-1" />
                        <span className="text-caption text-muted-foreground">or</span>
                        <Separator className="flex-1" />
                      </div>
                      <div className="cursor-pointer rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/20 p-5 text-center transition-colors hover:border-primary/40 hover:bg-primary/5">
                        <Upload className="mx-auto mb-1.5 size-5 text-muted-foreground/50" />
                        <p className="text-body text-muted-foreground">
                          Drop a file here, or click to upload
                        </p>
                        <p className="mt-1 text-caption text-muted-foreground/70">
                          .docx, .xlsx, .pptx or .pdf, up to 25 MB
                        </p>
                      </div>
                    </div>
                  )}

                  {attachment === "poll" && (
                    <div className="space-y-2">
                      <p className="text-body-emphasis">
                        {attachmentConfig.poll.question || "Your question goes here"}
                      </p>
                      {attachmentConfig.poll.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2"
                        >
                          <span
                            className="size-4 shrink-0 rounded-full border border-muted-foreground/40"
                            aria-hidden="true"
                          />
                          <span className="text-body text-muted-foreground">
                            {option || `Option ${index + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {attachment === "cta" && (
                    <div className="flex items-center justify-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/20 p-6">
                      <Button className="pointer-events-none">
                        {attachmentConfig.cta.label || "Button text"}
                      </Button>
                    </div>
                  )}

                  {(attachment === "contributors" || attachment === "subspaces") && (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex h-20 items-center justify-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/20 text-caption text-muted-foreground"
                        >
                          {attachment === "contributors" ? "Contributor" : "Subspace"}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ─── Add something to it ─── */}
            <SettingsSection
              title="Add something to it"
              description="A whiteboard to sketch on, a poll to settle something, pictures to show it."
              icon={<Sparkles className="size-4" />}
              iconColor="purple"
              collapsible={false}
              className="[&>button]:py-4"
            >
              <div className="space-y-1">
                <OptionTiles
                  label="Add something to the post"
                  options={ATTACHMENT_OPTIONS}
                  value={attachment}
                  onChange={next => {
                    setAttachment(next);
                    // Configuration-first types open their form straight away —
                    // picking "Poll" and then hunting for where to type the
                    // question is the failure mode a preview card alone invites.
                    const option = attachmentOption(next);
                    if (option.settings === "dialog") {
                      setAttachmentSettingsFor(next as ConfigurableAttachment);
                    }
                  }}
                  onPreview={setHoveredAttachment}
                  columns="grid-cols-5 md:grid-cols-9"
                />
                {/* Fixed slot, so the caption changing never nudges the layout. */}
                <p className="min-h-5 text-center text-caption text-muted-foreground">
                  {attachmentCaption}
                </p>
              </div>
            </SettingsSection>

            {/* ─── References — quiet until asked for, as before ─── */}
            <div className="space-y-3">
              {references.map((reference, index) => (
                <div key={index} className="space-y-2 rounded-xl border bg-muted/20 p-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={reference.title}
                          onChange={e => {
                            const next = [...references];
                            next[index] = { ...next[index], title: e.target.value };
                            setReferences(next);
                          }}
                          placeholder="What is it called?"
                          className="flex-1 bg-background"
                        />
                        <div className="relative flex-1">
                          <Link2 className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            value={reference.url}
                            onChange={e => {
                              const next = [...references];
                              next[index] = { ...next[index], url: e.target.value };
                              setReferences(next);
                            }}
                            placeholder="https://…"
                            className="bg-background pl-8"
                          />
                        </div>
                      </div>
                      <Input
                        value={reference.description}
                        onChange={e => {
                          const next = [...references];
                          next[index] = { ...next[index], description: e.target.value };
                          setReferences(next);
                        }}
                        placeholder="Why is it worth a look? (optional)"
                        className="bg-background"
                      />
                    </div>
                    <IconButton
                      variant="ghost"
                      tooltipLabel="Remove reference"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => setReferences(references.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="size-4" />
                    </IconButton>
                  </div>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 px-2 text-muted-foreground"
                onClick={() =>
                  setReferences([...references, { title: "", url: "", description: "" }])
                }
              >
                <Plus className="size-4" />
                Link to something else
              </Button>
            </div>

            {/* ─── How people can respond — collapsed by default ───
                The section's own description slot carries the live summary, so
                the fold states what is inside it. */}
            <div ref={responsesRef}>
              <SettingsSection
                title="How people can respond"
                description={responsesSummary}
                icon={<MessagesSquare className="size-4" />}
                iconColor="green"
                className="[&>button]:py-4"
                open={responsesOpen}
                onOpenChange={next => {
                  setResponsesOpen(next);
                  // Expanding below the fold and leaving the author where they
                  // were is how a collapsed section earns a reputation for doing
                  // nothing. Bring what it opened into view.
                  if (next) {
                    window.setTimeout(
                      () =>
                        responsesRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "end"
                        }),
                      260,
                    );
                  }
                }}
              >
                {/* One column, one control. Two side-by-side pickers made the
                    author read across a split for a decision that is really one
                    sentence: what can people add, and can they comment. */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-body-emphasis">What people can add</p>
                    <OptionTiles
                      label="What people can add"
                      options={COLLECTION_OPTIONS}
                      value={collection}
                      onChange={next => {
                        setCollection(next);
                        // Same rule as attachments: a type whose settings are a
                        // form opens that form, rather than leaving the author
                        // to find a button they have not looked at yet.
                        if (next !== "none") setCollectionSettingsOpen(true);
                      }}
                      onPreview={setHoveredCollection}
                      columns="grid-cols-4 md:grid-cols-7"
                    />
                    <p className="min-h-5 text-center text-caption text-muted-foreground">
                      {collectionCaption}
                    </p>
                  </div>

                  {collection !== "none" && (
                    <div className="flex items-start justify-between gap-3 rounded-lg border bg-muted/20 p-3">
                      <div className="flex items-start gap-3">
                        <Settings2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <div className="space-y-0.5">
                          <p className="text-body-emphasis">Set up the collection</p>
                          <p className="text-caption text-muted-foreground">
                            Starting text, who can add, and who can comment on each item.
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 gap-1.5"
                        onClick={() => setCollectionSettingsOpen(true)}
                      >
                        <Settings2 className="size-3.5" />
                        Set it up
                      </Button>
                    </div>
                  )}

                  {/* Comments is a yes/no, and the settings pages express those
                      as a switch row — not as two cards competing for a click. */}
                  <div className="flex items-start justify-between gap-3 rounded-lg border bg-muted/20 p-3">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <Label htmlFor="post-comments" className="cursor-pointer text-body-emphasis">
                          People can comment on this post
                        </Label>
                        <p className="text-caption text-muted-foreground">
                          Replies appear in a thread underneath it.
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="post-comments"
                      checked={comments === "on"}
                      onCheckedChange={next => setComments(next ? "on" : "off")}
                    />
                  </div>
                </div>
              </SettingsSection>
            </div>
          </div>

          {/* ─── Footer ─── */}
          <div className="flex items-center justify-between gap-3 border-t bg-muted/10 px-6 py-4">
            <p className="text-caption text-muted-foreground">You can edit this later.</p>
            <div className="flex items-center gap-2">
              {/* The old dialog only offered "Save as draft" once there was
                  something to save — an empty draft is not a thing anyone wants. */}
              {hasContent && (
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  Save as Draft
                </Button>
              )}
              <Button className="px-8" disabled={!canPost} onClick={() => onOpenChange(false)}>
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Stacked settings dialogs ─── */}
      {collection !== "none" && (
        <CollectionSettingsDialog
          open={collectionSettingsOpen}
          onOpenChange={setCollectionSettingsOpen}
          type={collection}
          value={collectionConfig}
          onSave={setCollectionConfig}
        />
      )}

      {attachmentSettingsFor && (
        <AttachmentSettingsDialog
          open={attachmentSettingsFor !== null}
          onOpenChange={next => !next && setAttachmentSettingsFor(null)}
          type={attachmentSettingsFor}
          value={attachmentConfig}
          onSave={setAttachmentConfig}
          basePath={basePath}
        />
      )}
    </TooltipProvider>
  );
}
