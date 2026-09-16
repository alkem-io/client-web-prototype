/**
 * CollectionSettingsDialog — everything you can configure about a response
 * type, in a dialog stacked on top of the composer.
 *
 * This is the move the old dialog made and the current one dropped: choosing a
 * response type in the composer costs zero vertical space, because the settings
 * that follow from that choice open here instead of expanding in place. The
 * form builder is the clearest case — inline it is the single tallest thing in
 * the current dialog, and it is only relevant to authors who picked Form.
 *
 * Transactional on purpose (Back discards, Save commits), matching the old
 * dialog's BACK / SAVE pair. That is the one place this design departs from the
 * live-apply convention used by the small gear panels elsewhere: this dialog
 * can hold a whole questionnaire, and abandoning a half-written one should not
 * leave it behind.
 */
import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Columns3,
  Inbox,
  LayoutTemplate,
  Link2,
  ListChecks,
  MessageSquare,
  Paperclip,
  Plus,
  Shield,
  Trash2,
  Type,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { IconButton } from "@/app/components/ui/icon-button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { MarkdownEditor } from "@/app/components/ui/markdown-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch";
import { Textarea } from "@/app/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  ANSWER_TYPE_DESCRIPTORS,
  ANSWER_TYPE_ORDER,
  type CalloutFormAnswerType,
} from "@/app/components/callout/calloutFormTypes";
import { collectionOption, type CollectionType } from "./options";
import { CHIP_REST, type OptionColor } from "./optionStyles";
import {
  createDraftOption,
  createDraftQuestion,
  POST_TEMPLATES,
  WHITEBOARD_TEMPLATES,
  uid,
  type CollectionConfig,
} from "./types";

interface CollectionSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: Exclude<CollectionType, "none">;
  value: CollectionConfig;
  onSave: (next: CollectionConfig) => void;
}

/**
 * Section — the settings pages' group header, sized for a dialog: tinted icon
 * chip, plain-word title, one sentence. An uppercase micro-label would be
 * shorter and colder, which is the trade this pass is deliberately reversing.
 */
function Section({
  icon: Icon,
  color = "primary",
  title,
  help,
  children,
}: {
  icon: React.ElementType;
  color?: OptionColor;
  title: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2.5">
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-xl",
            CHIP_REST[color],
          )}
        >
          <Icon className="size-4" />
        </span>
        <div className="space-y-0.5">
          <h3 className="text-body-emphasis">{title}</h3>
          {help && <p className="text-caption text-muted-foreground">{help}</p>}
        </div>
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function SwitchRow({
  icon: Icon,
  label,
  help,
  checked,
  onCheckedChange,
}: {
  icon: React.ElementType;
  label: string;
  help?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const id = label.replace(/\s+/g, "-").toLowerCase();
  // Same soft row the space settings pages use for their permission toggles:
  // a card of its own, so a switch never floats loose against the background.
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border bg-muted/20 p-3">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div className="space-y-0.5">
          <Label htmlFor={id} className="cursor-pointer text-body-emphasis">
            {label}
          </Label>
          {help && <p className="text-caption leading-snug text-muted-foreground">{help}</p>}
        </div>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export function CollectionSettingsDialog({
  open,
  onOpenChange,
  type,
  value,
  onSave,
}: CollectionSettingsDialogProps) {
  const option = collectionOption(type);
  const [draft, setDraft] = useState<CollectionConfig>(value);

  // Re-seed from the committed value every time the dialog opens, so a previous
  // Back doesn't leave stale edits sitting in the draft.
  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const patch = (next: Partial<CollectionConfig>) =>
    setDraft(prev => ({ ...prev, ...next }));

  const templates =
    type === "posts" ? POST_TEMPLATES : type === "whiteboards" ? WHITEBOARD_TEMPLATES : null;

  const showDefaultText = type === "posts" || type === "memos" || type === "tasks";
  const showDefaultTitle = showDefaultText || type === "whiteboards";

  /* ─── form question helpers ─── */
  const updateQuestion = (id: string, next: Partial<CollectionConfig["questions"][number]>) =>
    patch({ questions: draft.questions.map(q => (q.id === id ? { ...q, ...next } : q)) });

  const moveQuestion = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= draft.questions.length) return;
    const next = [...draft.questions];
    [next[index], next[target]] = [next[target], next[index]];
    patch({ questions: next });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* DialogContent renders its own close X at top-4 right-4 — the header
          keeps pr-12 clear for it rather than adding a second one. */}
      <DialogContent className="flex max-h-[85vh] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <div className="flex items-start gap-3 border-b px-6 py-4 pr-12">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl",
              CHIP_REST.primary,
            )}
          >
            <option.icon className="size-5" />
          </span>
          <div className="space-y-0.5">
            <DialogTitle className="text-subsection-title">Set up the collection</DialogTitle>
            {option.description && (
              <DialogDescription className="text-body">
                {option.label} — {option.description.toLowerCase()}
              </DialogDescription>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {/* ─── Template (Posts & Whiteboards) ─── */}
          {templates && (
            <Section
              icon={LayoutTemplate}
              color="purple"
              title="Start from a template"
              help="Every response begins with this. People can still change it."
            >
              <Select
                value={draft.template || "none"}
                onValueChange={next => patch({ template: next === "none" ? "" : next })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {templates.map(template => (
                    <SelectItem key={template} value={template}>
                      {template}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Section>
          )}

          {/* ─── Default text ─── */}
          {showDefaultTitle && (
            <Section
              icon={Type}
              color="blue"
              title="Starting text"
              help="Fill each response in advance — the question you would like people to answer, for instance."
            >
              <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="space-y-1.5">
                  <Label htmlFor="collection-default-title" className="text-body-emphasis">
                    Default title
                  </Label>
                  <Input
                    id="collection-default-title"
                    value={draft.defaultTitle}
                    onChange={e => patch({ defaultTitle: e.target.value })}
                    placeholder="Title"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="collection-default-tags" className="text-body-emphasis">
                    Tags
                  </Label>
                  <Input
                    id="collection-default-tags"
                    value={draft.defaultTags}
                    onChange={e => patch({ defaultTags: e.target.value })}
                    placeholder="Comma separated"
                  />
                </div>
              </div>

              {showDefaultText && (
                <div className="space-y-1.5">
                  <Label className="text-body-emphasis">Default description</Label>
                  <MarkdownEditor
                    value={draft.defaultDescription}
                    onChange={next => patch({ defaultDescription: next })}
                    placeholder="Default description"
                    minHeight="120px"
                  />
                </div>
              )}
            </Section>
          )}

          {/* ─── Links: pre-populate ─── */}
          {type === "links" && (
            <Section
              icon={Link2}
              color="blue"
              title="Start it off"
              help="Add a few links yourself so the collection doesn't open empty."
            >
              <div className="space-y-3">
                {draft.links.map((row, index) => (
                  <div key={index} className="space-y-2 rounded-lg border bg-muted/30 p-3">
                    <div className="flex items-center gap-2">
                      <Input
                        value={row.title}
                        onChange={e => {
                          const next = [...draft.links];
                          next[index] = { ...next[index], title: e.target.value };
                          patch({ links: next });
                        }}
                        placeholder="Title"
                        className="flex-[2] bg-background"
                      />
                      <div className="relative flex-[3]">
                        <Input
                          value={row.url}
                          onChange={e => {
                            const next = [...draft.links];
                            next[index] = { ...next[index], url: e.target.value };
                            patch({ links: next });
                          }}
                          placeholder="https://…"
                          className="bg-background pr-8"
                        />
                        <Paperclip className="absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                      </div>
                      <IconButton
                        variant="ghost"
                        tooltipLabel="Remove link"
                        disabled={draft.links.length === 1}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => patch({ links: draft.links.filter((_, i) => i !== index) })}
                      >
                        <Trash2 className="size-4" />
                      </IconButton>
                    </div>
                    <Input
                      value={row.description}
                      onChange={e => {
                        const next = [...draft.links];
                        next[index] = { ...next[index], description: e.target.value };
                        patch({ links: next });
                      }}
                      placeholder="Short description (optional)"
                      className="bg-background"
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() =>
                    patch({ links: [...draft.links, { title: "", url: "", description: "" }] })
                  }
                >
                  <Plus className="size-3.5" /> Add another link
                </Button>
              </div>
            </Section>
          )}

          {/* ─── Tasks: board columns ─── */}
          {type === "tasks" && (
            <Section
              icon={Columns3}
              color="green"
              title="Board columns"
              help="The columns people move their tasks between."
            >
              <div className="space-y-2">
                {draft.taskColumns.map((column, index) => (
                  <div key={column.id} className="flex items-center gap-2">
                    <input
                      type="color"
                      aria-label={`${column.label} colour`}
                      value={column.color ?? "#6b7280"}
                      onChange={e => {
                        const next = [...draft.taskColumns];
                        next[index] = { ...next[index], color: e.target.value };
                        patch({ taskColumns: next });
                      }}
                      className="size-9 shrink-0 cursor-pointer rounded-md border border-border bg-background p-1"
                    />
                    <Input
                      value={column.label}
                      onChange={e => {
                        const next = [...draft.taskColumns];
                        next[index] = { ...next[index], label: e.target.value };
                        patch({ taskColumns: next });
                      }}
                      placeholder="Column name"
                    />
                    <IconButton
                      variant="ghost"
                      tooltipLabel="Remove column"
                      disabled={draft.taskColumns.length <= 2}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() =>
                        patch({ taskColumns: draft.taskColumns.filter((_, i) => i !== index) })
                      }
                    >
                      <Trash2 className="size-4" />
                    </IconButton>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() =>
                    patch({
                      taskColumns: [
                        ...draft.taskColumns,
                        { id: uid("col"), label: "", color: "#6b7280" },
                      ],
                    })
                  }
                >
                  <Plus className="size-3.5" /> Add column
                </Button>
              </div>
            </Section>
          )}

          {/* ─── Form: questions ─── */}
          {type === "form" && (
            <>
              {/* The questionnaire builder is the single tallest thing the old
                  inline panel had to carry. Here it costs the composer nothing. */}
              <Section
                icon={ListChecks}
                color="orange"
                title="Questions"
                help="People answer these in the order you set here."
              >
                <div className="space-y-3">
                  {draft.questions.map((question, index) => (
                    <div key={question.id} className="space-y-3 rounded-lg border bg-muted/30 p-3">
                      <div className="flex items-start gap-2">
                        <span className="mt-2.5 w-4 shrink-0 text-caption tabular-nums text-muted-foreground">
                          {index + 1}.
                        </span>
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="flex items-start gap-2">
                            <Input
                              value={question.question}
                              onChange={e => updateQuestion(question.id, { question: e.target.value })}
                              placeholder="Ask a question"
                              className="min-w-0 flex-1 bg-background"
                            />
                            <Select
                              value={question.answerType}
                              onValueChange={next =>
                                updateQuestion(question.id, {
                                  answerType: next as CalloutFormAnswerType,
                                  // Seed two blanks the first time a question becomes a
                                  // choice, so the author has somewhere to type.
                                  options:
                                    next === "choice" && question.options.length === 0
                                      ? [createDraftOption(), createDraftOption()]
                                      : question.options,
                                })
                              }
                            >
                              <SelectTrigger className="w-[172px] shrink-0 bg-background">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ANSWER_TYPE_ORDER.map(answerType => {
                                  const descriptor = ANSWER_TYPE_DESCRIPTORS[answerType];
                                  const TypeIcon = descriptor.icon;
                                  return (
                                    <SelectItem key={answerType} value={answerType}>
                                      <span className="flex items-center gap-2">
                                        <TypeIcon className="size-4 text-muted-foreground" />
                                        {descriptor.label}
                                      </span>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                          <Textarea
                            value={question.explanation}
                            onChange={e =>
                              updateQuestion(question.id, { explanation: e.target.value })
                            }
                            placeholder="Add an explanation (optional)"
                            className="h-14 min-h-0 bg-background text-body"
                          />
                        </div>
                      </div>

                      {/* Answer preview — what the respondent will see. */}
                      <div className="pl-6">
                        {question.answerType === "choice" ? (
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={option.id} className="flex items-center gap-2">
                                <span
                                  className="size-4 shrink-0 rounded-full border border-muted-foreground/40"
                                  aria-hidden="true"
                                />
                                <Input
                                  value={option.label}
                                  onChange={e =>
                                    updateQuestion(question.id, {
                                      options: question.options.map(o =>
                                        o.id === option.id ? { ...o, label: e.target.value } : o,
                                      ),
                                    })
                                  }
                                  placeholder={`Option ${optionIndex + 1}`}
                                  className="min-w-0 flex-1 bg-background"
                                />
                                <IconButton
                                  variant="ghost"
                                  tooltipLabel="Remove option"
                                  disabled={question.options.length <= 2}
                                  onClick={() =>
                                    updateQuestion(question.id, {
                                      options: question.options.filter(o => o.id !== option.id),
                                    })
                                  }
                                >
                                  <X className="size-4" />
                                </IconButton>
                              </div>
                            ))}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 text-caption text-muted-foreground"
                              onClick={() =>
                                updateQuestion(question.id, {
                                  options: [...question.options, createDraftOption()],
                                })
                              }
                            >
                              <Plus className="size-3.5" /> Add option
                            </Button>
                          </div>
                        ) : (
                          <div
                            className={cn(
                              "flex items-center rounded-md border border-dashed border-border/70 bg-background/60 px-3",
                              question.answerType === "long" ? "h-14" : "h-9",
                            )}
                          >
                            <span className="text-caption text-muted-foreground">
                              {ANSWER_TYPE_DESCRIPTORS[question.answerType].description}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-0.5 pl-6">
                        <div className="ml-auto flex items-center gap-0.5">
                          <IconButton
                            variant="ghost"
                            tooltipLabel="Move up"
                            disabled={index === 0}
                            onClick={() => moveQuestion(index, -1)}
                          >
                            <ChevronUp className="size-4" />
                          </IconButton>
                          <IconButton
                            variant="ghost"
                            tooltipLabel="Move down"
                            disabled={index === draft.questions.length - 1}
                            onClick={() => moveQuestion(index, 1)}
                          >
                            <ChevronDown className="size-4" />
                          </IconButton>
                          <IconButton
                            variant="ghost"
                            tooltipLabel="Delete question"
                            disabled={draft.questions.length === 1}
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              patch({ questions: draft.questions.filter(q => q.id !== question.id) })
                            }
                          >
                            <Trash2 className="size-4" />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => patch({ questions: [...draft.questions, createDraftQuestion()] })}
                  >
                    <Plus className="size-3.5" /> Add question
                  </Button>
                </div>
              </Section>

              <Section icon={Inbox} color="amber" title="The answers you get back">
                <SwitchRow
                  icon={Users}
                  label="Let people answer more than once"
                  help="Useful for logs and check-ins; off for one-per-person surveys."
                  checked={draft.formAllowMultiple}
                  onCheckedChange={next => patch({ formAllowMultiple: next })}
                />
                <SwitchRow
                  icon={Shield}
                  label="Only admins can read the answers"
                  help="Leave this on and nobody but the admins sees what people wrote."
                  checked={draft.formVisibility === "admins"}
                  onCheckedChange={next =>
                    patch({ formVisibility: next ? "admins" : "spaceMembers" })
                  }
                />
              </Section>
            </>
          )}

          {/* ─── Who can contribute ─── */}
          <Section icon={Users} color="green" title="Who can contribute">
            <SwitchRow
              icon={Users}
              label="Members can add to it"
              help="Anyone who has joined this space can contribute."
              checked={draft.membersCanAdd}
              onCheckedChange={next => patch({ membersCanAdd: next })}
            />
            <SwitchRow
              icon={Shield}
              label="Admins can add to it"
              help="Space admins can contribute too."
              checked={draft.adminsCanAdd}
              onCheckedChange={next => patch({ adminsCanAdd: next })}
            />
            {type !== "form" && (
              <SwitchRow
                icon={MessageSquare}
                label="People can comment on each item"
                help="Every contribution gets its own comment thread."
                checked={draft.commentsPerItem}
                onCheckedChange={next => patch({ commentsPerItem: next })}
              />
            )}
          </Section>
        </div>

        <div className="flex items-center justify-between gap-2 border-t bg-muted/10 px-6 py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 px-2"
                onClick={() => onOpenChange(false)}
              >
                <ChevronLeft className="size-4" />
                Back
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Go back without keeping these settings</p>
            </TooltipContent>
          </Tooltip>
          <Button
            onClick={() => {
              onSave(draft);
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
