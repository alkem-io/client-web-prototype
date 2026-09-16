/**
 * AttachmentSettingsDialog — configuration for the body attachments whose
 * settings are a *form* rather than content.
 *
 * The rule this design applies: if picking the option gives you something to
 * write (a memo, an image, a document), you author it inline in the composer,
 * because that content is the post. If picking it gives you something to
 * configure (a poll, a call-to-action, a contributor or subspace query), the
 * form opens here. The old dialog held that line and stayed one screen tall;
 * the current one expands every panel inline and runs past 2000px.
 *
 * Transactional like CollectionSettingsDialog: Back discards, Save commits.
 */
import { useEffect, useState } from "react";
import {
  Bot,
  Building2,
  Calendar,
  ChevronLeft,
  CirclePlus,
  Eye,
  HelpCircle,
  LayoutGrid,
  List,
  ListChecks,
  MousePointerClick,
  Mail,
  Map as MapIcon,
  PenLine,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
  Zap,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Switch } from "@/app/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { attachmentOption } from "./options";
import { CHIP_REST, type OptionColor } from "./optionStyles";
import type { AttachmentConfig, ContributorKind } from "./types";

export type ConfigurableAttachment = "poll" | "cta" | "contributors" | "subspaces";

interface AttachmentSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: ConfigurableAttachment;
  value: AttachmentConfig;
  onSave: (next: AttachmentConfig) => void;
  /** Space or subspace root, used to build the predefined CTA targets. */
  basePath: string;
}

/** A small multi-select row — same tile language as OptionTiles, pill-sized. */
function PillToggle({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-2 text-control transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {Icon && <Icon className="size-4" />}
      {children}
    </button>
  );
}

/** Same group header as the collection dialog — tinted chip, plain words. */
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
    <section className="space-y-3">
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
      {children}
    </section>
  );
}

export function AttachmentSettingsDialog({
  open,
  onOpenChange,
  type,
  value,
  onSave,
  basePath,
}: AttachmentSettingsDialogProps) {
  const option = attachmentOption(type);
  const [draft, setDraft] = useState<AttachmentConfig>(value);
  const [actionPickerOpen, setActionPickerOpen] = useState(false);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  // Simulated space settings — in production these come from space config, and
  // they decide which predefined CTA targets are offered at all.
  const spaceSettings = {
    membershipPolicy: "application" as const,
    memberCreatePosts: false,
    memberCreateSubspaces: true,
    subspaceEvents: true,
  };

  const predefinedActions = [
    {
      id: "join",
      category: "Membership",
      label:
        spaceSettings.membershipPolicy === "application"
          ? "Apply to join this space"
          : "Join this space",
      displayName:
        spaceSettings.membershipPolicy === "application" ? "Apply to join" : "Join this space",
      icon: UserPlus,
      url: `${basePath}/join`,
      disabled: false,
      disabledReason: undefined as string | undefined,
    },
    {
      id: "create-post",
      category: "Contribute",
      label: "Create a post",
      displayName: "Share something",
      icon: PenLine,
      url: `${basePath}/new-post`,
      disabled: !spaceSettings.memberCreatePosts,
      disabledReason: "Members are not allowed to create posts in this space",
    },
    {
      id: "create-subspace",
      category: "Contribute",
      label: "Create a subspace",
      displayName: "Start a subspace",
      icon: CirclePlus,
      url: `${basePath}/new-subspace`,
      disabled: !spaceSettings.memberCreateSubspaces,
      disabledReason: "Members are not allowed to create subspaces in this space",
    },
    {
      id: "add-event",
      category: "Contribute",
      label: "Add an event",
      displayName: "Add an event",
      icon: Calendar,
      url: `${basePath}/new-event`,
      disabled: !spaceSettings.subspaceEvents,
      disabledReason: "Events are disabled for this space",
    },
    {
      id: "contact-leads",
      category: "Connect",
      label: "Contact the leads",
      displayName: "Get in touch",
      icon: Mail,
      url: `${basePath}/contact-leads`,
      disabled: false,
      disabledReason: undefined,
    },
  ];

  const contributorKinds: { id: ContributorKind; label: string; icon: React.ElementType }[] = [
    { id: "people", label: "People", icon: Users },
    { id: "organizations", label: "Organizations", icon: Building2 },
    { id: "virtualContributors", label: "Virtual Contributors", icon: Bot },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
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
            <DialogTitle className="text-subsection-title">Set up the {option.label.toLowerCase()}</DialogTitle>
            {option.description && <DialogDescription className="text-body">{option.description}</DialogDescription>}
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {/* ─── Poll ─── */}
          {type === "poll" && (
            <>
              <Section icon={HelpCircle} color="green" title="What are you asking?">
                <Input
                  value={draft.poll.question}
                  onChange={e =>
                    setDraft({ ...draft, poll: { ...draft.poll, question: e.target.value } })
                  }
                  placeholder="What should we decide together?"
                />
              </Section>

              <Section icon={ListChecks} color="green" title="What can people pick?">
                <div className="space-y-2">
                  {draft.poll.options.map((pollOption, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span
                        className="size-4 shrink-0 rounded-full border border-muted-foreground/40"
                        aria-hidden="true"
                      />
                      <Input
                        value={pollOption}
                        onChange={e => {
                          const next = [...draft.poll.options];
                          next[index] = e.target.value;
                          setDraft({ ...draft, poll: { ...draft.poll, options: next } });
                        }}
                        placeholder={`Option ${index + 1}`}
                      />
                      <IconButton
                        variant="ghost"
                        tooltipLabel="Remove option"
                        disabled={draft.poll.options.length <= 2}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() =>
                          setDraft({
                            ...draft,
                            poll: {
                              ...draft.poll,
                              options: draft.poll.options.filter((_, i) => i !== index),
                            },
                          })
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
                      setDraft({
                        ...draft,
                        poll: { ...draft.poll, options: [...draft.poll.options, ""] },
                      })
                    }
                  >
                    <Plus className="size-3.5" /> Add option
                  </Button>
                </div>
              </Section>

              <div className="flex items-center justify-between gap-6">
                <Label htmlFor="poll-multiple" className="text-body-emphasis">
                  Let people pick more than one
                </Label>
                <Switch
                  id="poll-multiple"
                  checked={draft.poll.multipleChoice}
                  onCheckedChange={next =>
                    setDraft({ ...draft, poll: { ...draft.poll, multipleChoice: next } })
                  }
                />
              </div>
            </>
          )}

          {/* ─── Call to action ─── */}
          {type === "cta" && (
            <>
              <Section icon={MousePointerClick} color="orange" title="The button">
                <div className="space-y-1.5">
                  <Label htmlFor="cta-label" className="text-body-emphasis">
                    Label
                  </Label>
                  <Input
                    id="cta-label"
                    value={draft.cta.label}
                    onChange={e =>
                      setDraft({ ...draft, cta: { ...draft.cta, label: e.target.value } })
                    }
                    placeholder="Button text"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cta-url" className="text-body-emphasis">
                    Target
                  </Label>
                  <div className="flex gap-1.5">
                    <Input
                      id="cta-url"
                      value={draft.cta.url}
                      onChange={e =>
                        setDraft({ ...draft, cta: { ...draft.cta, url: e.target.value } })
                      }
                      placeholder="https://"
                      className="flex-1"
                    />
                    <Popover open={actionPickerOpen} onOpenChange={setActionPickerOpen}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="icon" aria-label="Choose a space action">
                              <Zap className="size-4" />
                            </Button>
                          </PopoverTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Choose a space action</p>
                        </TooltipContent>
                      </Tooltip>
                      <PopoverContent align="end" side="bottom" sideOffset={8} className="w-72 p-0">
                        <div className="border-b px-3 py-2">
                          <p className="text-body-emphasis">Space actions</p>
                          <p className="text-caption text-muted-foreground">
                            Point it at something in this space
                          </p>
                        </div>
                        <div className="max-h-64 overflow-y-auto py-1">
                          {["Membership", "Contribute", "Connect"].map(category => (
                            <div key={category}>
                              <p className="px-3 pb-1 pt-2 text-badge uppercase text-muted-foreground/70">
                                {category}
                              </p>
                              {predefinedActions
                                .filter(action => action.category === category)
                                .map(action => (
                                  <Tooltip key={action.id}>
                                    <TooltipTrigger asChild>
                                      <button
                                        type="button"
                                        disabled={action.disabled}
                                        onClick={() => {
                                          setDraft({
                                            ...draft,
                                            cta: { label: action.displayName, url: action.url },
                                          });
                                          setActionPickerOpen(false);
                                        }}
                                        className={cn(
                                          "flex w-full items-center gap-2.5 px-3 py-2 text-left text-control transition-colors",
                                          action.disabled
                                            ? "cursor-not-allowed opacity-40"
                                            : "cursor-pointer hover:bg-muted",
                                        )}
                                      >
                                        <action.icon className="size-4 shrink-0" />
                                        <span className="truncate">{action.label}</span>
                                      </button>
                                    </TooltipTrigger>
                                    {action.disabled && action.disabledReason && (
                                      <TooltipContent side="left">
                                        <p>{action.disabledReason}</p>
                                      </TooltipContent>
                                    )}
                                  </Tooltip>
                                ))}
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </Section>

              <Section icon={Eye} color="neutral" title="How it will look">
                <div className="flex items-center justify-center rounded-lg border bg-muted/30 p-6">
                  <Button className="pointer-events-none">
                    {draft.cta.label || "Button text"}
                  </Button>
                </div>
              </Section>
            </>
          )}

          {/* ─── Contributors ─── */}
          {type === "contributors" && (
            <>
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-0.5">
                  <Label htmlFor="contributors-manual" className="text-body-emphasis">
                    Choose them myself
                  </Label>
                  <p className="text-caption text-muted-foreground">
                    Leave it off and the list keeps itself up to date as the community grows.
                  </p>
                </div>
                <Switch
                  id="contributors-manual"
                  checked={draft.contributors.manual}
                  onCheckedChange={next =>
                    setDraft({ ...draft, contributors: { ...draft.contributors, manual: next } })
                  }
                />
              </div>

              {draft.contributors.manual ? (
                <Section icon={Users} color="blue" title="Who to show">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search for someone…" className="pl-9" />
                  </div>
                </Section>
              ) : (
                <>
                  <Section icon={Users} color="blue" title="Who to include" help="At least one — people, organizations, or virtual contributors.">
                    <div className="flex flex-wrap gap-2">
                      {contributorKinds.map(kind => {
                        const active = draft.contributors.kinds.includes(kind.id);
                        return (
                          <PillToggle
                            key={kind.id}
                            active={active}
                            icon={kind.icon}
                            onClick={() => {
                              const kinds = active
                                ? draft.contributors.kinds.filter(k => k !== kind.id)
                                : [...draft.contributors.kinds, kind.id];
                              if (kinds.length === 0) return;
                              setDraft({
                                ...draft,
                                contributors: {
                                  ...draft.contributors,
                                  kinds,
                                  defaultKind: kinds.includes(draft.contributors.defaultKind)
                                    ? draft.contributors.defaultKind
                                    : kinds[0],
                                },
                              });
                            }}
                          >
                            {kind.label}
                          </PillToggle>
                        );
                      })}
                    </div>
                  </Section>

                  <Section icon={List} color="blue" title="Shown first">
                    <div className="flex flex-wrap gap-2">
                      {contributorKinds
                        .filter(kind => draft.contributors.kinds.includes(kind.id))
                        .map(kind => (
                          <PillToggle
                            key={kind.id}
                            active={draft.contributors.defaultKind === kind.id}
                            onClick={() =>
                              setDraft({
                                ...draft,
                                contributors: { ...draft.contributors, defaultKind: kind.id },
                              })
                            }
                          >
                            {kind.label}
                          </PillToggle>
                        ))}
                    </div>
                  </Section>
                </>
              )}

              <Section icon={LayoutGrid} color="blue" title="How to show them">
                <div className="flex gap-2">
                  {[
                    { id: "list" as const, label: "List", icon: List },
                    { id: "map" as const, label: "Map", icon: MapIcon },
                  ].map(display => (
                    <PillToggle
                      key={display.id}
                      active={draft.contributors.display === display.id}
                      icon={display.icon}
                      onClick={() =>
                        setDraft({
                          ...draft,
                          contributors: { ...draft.contributors, display: display.id },
                        })
                      }
                    >
                      {display.label}
                    </PillToggle>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* ─── Subspaces ─── */}
          {type === "subspaces" && (
            <>
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-0.5">
                  <Label htmlFor="subspaces-manual" className="text-body-emphasis">
                    Choose them myself
                  </Label>
                  <p className="text-caption text-muted-foreground">
                    Leave it off to show every subspace, updating itself.
                  </p>
                </div>
                <Switch
                  id="subspaces-manual"
                  checked={draft.subspaces.manual}
                  onCheckedChange={next => setDraft({ ...draft, subspaces: { manual: next } })}
                />
              </div>

              {draft.subspaces.manual && (
                <Section icon={LayoutGrid} color="purple" title="Which subspaces">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search for a subspace…" className="pl-9" />
                  </div>
                </Section>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t bg-muted/10 px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 px-2"
            onClick={() => onOpenChange(false)}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
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
