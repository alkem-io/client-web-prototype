import { ArrowRight, ExternalLink, Play } from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { DatabankBlock, DatabankInitiative, DatabankLead, DatabankSection } from '@/app/data/databank-data';
import { cn } from '@/crd/lib/utils';
import { Button } from '@/crd/primitives/button';
import { DatabankChip } from './DatabankChip';

/** Lines each Wat / Waarom / Wie section shows before it is cut off. */
const LINES = 5;
/** Links shown before "+ N meer referenties". */
const LINKS_PREVIEW = 2;

export type InitiativeCardLabels = {
  readMore: string;
  showLess: string;
  enter: string;
  enterAria: (name: string) => string;
  references: string;
  moreReferences: (hidden: number) => string;
  lessReferences: string;
  allLabelsAria: (total: number, name: string) => string;
  sectionAria: (action: string, section: string, name: string) => string;
};

const DUTCH_LABELS: InitiativeCardLabels = {
  readMore: 'Lees meer',
  showLess: 'Toon minder',
  enter: 'Betreden',
  enterAria: name => `Betreed subspace ${name}`,
  references: 'Referenties',
  moreReferences: hidden => `+ ${hidden} meer referenties`,
  lessReferences: 'Toon minder referenties',
  allLabelsAria: (total, name) => `Toon alle ${total} labels van ${name}`,
  sectionAria: (action, section, name) => `${action}: ${section} van ${name}`,
};

export const ENGLISH_CARD_LABELS: InitiativeCardLabels = {
  readMore: 'Read more',
  showLess: 'Show less',
  enter: 'Enter',
  enterAria: name => `Enter subspace ${name}`,
  references: 'References',
  moreReferences: hidden => `+ ${hidden} more references`,
  lessReferences: 'Show fewer references',
  allLabelsAria: (total, name) => `Show all ${total} labels of ${name}`,
  sectionAria: (action, section, name) => `${action}: ${section} of ${name}`,
};

type InitiativeCardProps = {
  initiative: DatabankInitiative;
  /** Without these, tags and classifications are plain labels rather than filters. */
  isActive?: (group: string, value: string) => boolean;
  onToggleFilter?: (group: string, value: string) => void;
  labels?: InitiativeCardLabels;
};

type Layout = {
  /** Extra pixels (whole lines) each section may grow past LINES. */
  gives: Record<string, number>;
  /** Sections still cut off after growing — these get a "Lees meer". */
  overflow: Record<string, boolean>;
  /** Whole lines a cut-off section shows before its "…". */
  lines: Record<string, number>;
  /** Whether all classification rows fit without making the left column the taller one. */
  labelsFit: boolean;
};


const external ={ target: '_blank', rel: 'noopener noreferrer' } as const;

/**
 * One initiative in the Databank: a left column (image, title, tagline, tags,
 * classifications, lead, "Betreden") and a right column (Wat / Waarom /
 * Wie, Referenties). Stacks into one column only at phone widths, below `@lg`.
 *
 * Height matching: each section starts clamped to LINES lines. When the left
 * column is taller than the right, the sections grow in whole lines, top to
 * bottom, into that spare height, so the two columns end up about equal. When
 * the classification rows are what makes the left column taller, they condense
 * to the first value and any values selected as filters, plus a "+ N labels"
 * pill for the rest.
 */
export function InitiativeCard({ initiative, isActive, onToggleFilter, labels = DUTCH_LABELS }: InitiativeCardProps) {
  const { name, sections, classifications, links } = initiative;
  const linkProps = initiative.url.startsWith('/') ? {} : external;
  const leads = [initiative.lead, ...(initiative.otherLeads ?? [])];

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [labelsOpen, setLabelsOpen] = useState(false);
  const [linksOpen, setLinksOpen] = useState(false);
  const [layout, setLayout] = useState<Layout>({ gives: {}, overflow: {}, lines: {}, labelsFit: true });

  const leftColRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const rightInnerRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const labelsMirrorRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // The ResizeObserver callback outlives renders; read the latest state through refs.
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const openRef = useRef(openSections);
  openRef.current = openSections;

  const measure = useCallback(() => {
    const leftCol = leftColRef.current;
    const top = topRef.current;
    const foot = footRef.current;
    const rightCol = rightColRef.current;
    const rightInner = rightInnerRef.current;
    if (!leftCol || !top || !foot || !rightCol || !rightInner) return;

    const prev = layoutRef.current;
    // Stacked (narrow card): the right column sits below the left one, so
    // there is nothing to balance.
    const stacked = rightCol.offsetTop > leftCol.offsetTop + 1;

    let currentGive = 0;
    const clamped: { title: string; lineHeight: number; need: number; hasVideo: boolean }[] = [];
    for (const s of sections) {
      const el = sectionRefs.current[s.title];
      if (!el || openRef.current[s.title]) continue;
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 22;
      currentGive += prev.gives[s.title] ?? 0;
      clamped.push({
        title: s.title,
        lineHeight,
        need: Math.max(0, el.scrollHeight - lineHeight * LINES),
        hasVideo: s.blocks.some(b => b.kind === 'video'),
      });
    }

    // Right column height as if every section were at exactly LINES.
    const rightBase = rightInner.offsetHeight - currentGive;
    const leftHeight = top.offsetHeight + foot.offsetHeight;
    let room = stacked ? 0 : Math.max(0, leftHeight - rightBase);

    const gives: Record<string, number> = {};
    const overflow: Record<string, boolean> = {};
    const lines: Record<string, number> = {};
    for (const c of clamped) {
      let give = Math.min(c.need, Math.floor(room / c.lineHeight) * c.lineHeight);
      if (c.need - give < 1) give = c.need;
      give = Math.max(0, Math.min(give, room));
      // Less than a line hidden (paragraph gaps): show it rather than offer
      // a "Lees meer" that reveals nothing.
      if (c.need - give < c.lineHeight * 0.75) give = c.need;
      room = Math.max(0, room - give);
      gives[c.title] = give;
      // A section holding a video is never "complete" while collapsed: the
      // video only shows once it is opened.
      overflow[c.title] = c.need - give > 1 || c.hasVideo;
      lines[c.title] = LINES + Math.round(give / c.lineHeight);
    }

    const labels = labelsRef.current;
    const mirror = labelsMirrorRef.current;
    const labelsFit =
      stacked || !labels || !mirror
        ? true
        : leftHeight - labels.offsetHeight + mirror.offsetHeight <= rightBase + 4;

    const changed =
      labelsFit !== prev.labelsFit ||
      clamped.some(
        c =>
          Math.abs((prev.gives[c.title] ?? 0) - gives[c.title]) > 0.5 ||
          !!prev.overflow[c.title] !== overflow[c.title]
      );
    if (changed) setLayout({ gives, overflow, lines, labelsFit });
  }, [sections]);

  const measureRef = useRef(measure);
  measureRef.current = measure;

  useLayoutEffect(() => {
    measure();
    // `layout.labelsFit`: condensing the labels shortens the left column, so
    // the section growth has to be worked out again against the new height.
  }, [measure, openSections, labelsOpen, linksOpen, layout.labelsFit]);

  useEffect(() => {
    const observer = new ResizeObserver(() => measureRef.current());
    for (const el of [topRef.current, footRef.current, rightInnerRef.current, labelsMirrorRef.current]) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const totalLabels = classifications.reduce((n, c) => n + c.values.length, 0);
  const condensed = !labelsOpen && !layout.labelsFit && totalLabels > 1;
  const labelRows = condensed
    ? classifications
        .map((c, rowIndex) => ({
          label: c.label,
          values: c.values.filter((v, i) => (rowIndex === 0 && i === 0) || isActive?.(c.label, v)),
        }))
        .filter(row => row.values.length > 0)
    : classifications;
  const hiddenLabels = totalLabels - labelRows.reduce((n, row) => n + row.values.length, 0);

  const chip = (group: string, value: string, variant: 'outline' | 'filled') =>
    onToggleFilter ? (
      <DatabankChip
        key={value}
        variant={variant}
        pressed={isActive?.(group, value)}
        onClick={() => onToggleFilter(group, value)}
      >
        {value}
      </DatabankChip>
    ) : (
      <span
        key={value}
        className={cn(
          'inline-flex min-h-7 max-w-full items-center rounded-full border px-3 py-1 text-caption font-medium',
          variant === 'filled'
            ? 'border-secondary bg-secondary text-secondary-foreground'
            : 'border-border bg-card text-foreground'
        )}
      >
        {value}
      </span>
    );

  const shownLinks = linksOpen ? links : links.slice(0, LINKS_PREVIEW);

  return (
    <article
      aria-label={name}
      className="@container overflow-hidden rounded-xl border border-border bg-background"
    >
      <div className="flex flex-col @lg:flex-row">
        {/* ── Left column ── */}
        <div
          ref={leftColRef}
          className="flex min-w-0 flex-col @lg:min-w-52 @lg:max-w-85 @lg:shrink-0 @lg:grow @lg:basis-56 @2xl:min-w-65 @2xl:basis-70"
        >
          <div ref={topRef}>
            {initiative.imageUrl && (
              <img src={initiative.imageUrl} alt="" className="block aspect-video w-full object-cover" />
            )}
            <div className="flex flex-col gap-2.5 px-4 pt-4 pb-3">
              <h3 className="text-subsection-title text-foreground">
                <a
                  href={initiative.url}
                  {...linkProps}
                  className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {name}
                </a>
              </h3>
              <p className="text-body text-muted-foreground">{initiative.tagline}</p>

              {initiative.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {initiative.tags.map(tag => chip('Tags', tag, 'outline'))}
                </div>
              )}

              {classifications.length > 0 && (
                <div className="relative">
                  <div ref={labelsRef} className="flex flex-col gap-2.5">
                    {labelRows.map(row => (
                      <ClassificationRow key={row.label} label={row.label}>
                        {row.values.map(v => chip(row.label, v, 'filled'))}
                      </ClassificationRow>
                    ))}
                    {hiddenLabels > 0 && (
                      <DatabankChip
                        variant="more"
                        aria-expanded={false}
                        aria-label={labels.allLabelsAria(totalLabels, name)}
                        onClick={() => setLabelsOpen(true)}
                      >
                        + {hiddenLabels} labels
                      </DatabankChip>
                    )}
                  </div>

                  {/* Hidden copy with every row, measured to decide whether they fit. */}
                  <div
                    ref={labelsMirrorRef}
                    inert
                    aria-hidden="true"
                    className="pointer-events-none invisible absolute inset-x-0 top-0 flex flex-col gap-2.5"
                  >
                    {classifications.map(row => (
                      <ClassificationRow key={row.label} label={row.label}>
                        {row.values.map(v => (
                          <DatabankChip key={v} variant="filled" tabIndex={-1}>
                            {v}
                          </DatabankChip>
                        ))}
                      </ClassificationRow>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div ref={footRef} className="mt-auto px-4 pt-3 pb-4">
            <div className="flex flex-col gap-3 border-t border-border pt-3">
              <p className="text-caption font-medium text-muted-foreground">Lead</p>
              {leads.map(lead => (
                <LeadRow key={lead.name} lead={lead} />
              ))}
              <Button asChild={true} size="lg" className="h-11 w-full">
                <a href={initiative.url} {...linkProps} aria-label={labels.enterAria(name)}>
                  {labels.enter}
                  <ArrowRight aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div
          ref={rightColRef}
          className="min-w-0 border-t border-border bg-card @lg:grow-999 @lg:basis-95 @lg:border-t-0 @lg:border-l"
        >
          <div ref={rightInnerRef} className="flex flex-col gap-3.5 px-5 py-4">
            {sections.map(section => (
              <CardSection
                key={section.title}
                cardId={initiative.id}
                cardName={name}
                labels={labels}
                section={section}
                open={!!openSections[section.title]}
                give={layout.gives[section.title] ?? 0}
                cutOff={!!layout.overflow[section.title]}
                lines={layout.lines[section.title] ?? LINES}
                contentRef={el => {
                  sectionRefs.current[section.title] = el;
                }}
                onToggle={() => setOpenSections(prev => ({ ...prev, [section.title]: !prev[section.title] }))}
              />
            ))}

            {links.length > 0 && (
              <section aria-labelledby={`${initiative.id}-links`} className="flex flex-col gap-1.5">
                <h4 id={`${initiative.id}-links`} className="text-card-title uppercase tracking-wide text-foreground">
                  {labels.references}
                </h4>
                <ul className="flex flex-col gap-1">
                  {shownLinks.map(link => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        {...external}
                        className="inline-flex gap-1.5 rounded-sm text-body text-foreground underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <ExternalLink className="mt-1 size-3.5 shrink-0" aria-hidden="true" />
                        <span>{link.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                {links.length > LINKS_PREVIEW && (
                  <button
                    type="button"
                    aria-expanded={linksOpen}
                    onClick={() => setLinksOpen(o => !o)}
                    className="-ml-2 min-h-8 self-start rounded-md px-2 text-left text-body-emphasis text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {linksOpen ? labels.lessReferences : labels.moreReferences(links.length - LINKS_PREVIEW)}
                  </button>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function LeadRow({ lead }: { lead: DatabankLead }) {
  return (
    <div className="flex items-center gap-2.5">
      {lead.logoUrl ? (
        <img
          src={lead.logoUrl}
          alt=""
          className="size-9 shrink-0 rounded-md border border-border bg-card object-contain"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-md text-caption font-medium text-white"
          style={{ backgroundColor: lead.color }}
        >
          {lead.initials}
        </span>
      )}
      <span className="text-card-title text-foreground">{lead.name}</span>
    </div>
  );
}

function ClassificationRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-caption font-semibold text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

type CardSectionProps = {
  cardId: string;
  cardName: string;
  labels: InitiativeCardLabels;
  section: DatabankSection;
  open: boolean;
  give: number;
  cutOff: boolean;
  lines: number;
  contentRef: (el: HTMLDivElement | null) => void;
  onToggle: () => void;
};

function CardSection({ cardId, cardName, labels, section, open, give, cutOff, lines, contentRef, onToggle }: CardSectionProps) {
  // The video only shows once the section is opened.
  const blocks = open ? section.blocks : section.blocks.filter(b => b.kind !== 'video');
  if (blocks.length === 0) return null;

  const headingId = `${cardId}-${section.title}`;
  const contentId = `${headingId}-content`;
  const action = open ? labels.showLess : labels.readMore;

  return (
    <section aria-labelledby={headingId} className={cn('flex flex-col gap-1.5', (open || cutOff) && 'not-last:-mb-6')}>
      <h4 id={headingId} className="text-card-title uppercase tracking-wide text-foreground">
        {section.title}
      </h4>
      <div
        id={contentId}
        ref={contentRef}
        className="space-y-1.5 overflow-hidden text-body text-foreground"
        // A cut-off section is clamped by whole lines and ends in "…". One that
        // grew to fit is capped by height (`lh` = this box's own line height).
        style={
          open
            ? undefined
            : cutOff
              ? { display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: lines }
              : { maxHeight: `calc(${LINES}lh + ${give}px)` }
        }
      >
        {blocks.map((block, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static mock content, order never changes
          <Block key={i} block={block} />
        ))}
      </div>
      {/* The pill reaches into the empty space beside the next section's heading,
          and stays above it so all of it can be clicked. */}
      {(open || cutOff) && (
        <DatabankChip
          variant="more"
          aria-expanded={open}
          aria-controls={contentId}
          aria-label={labels.sectionAria(action, section.title, cardName)}
          onClick={onToggle}
          className="relative z-10 -mt-0.5 self-end"
        >
          {action}
        </DatabankChip>
      )}
    </section>
  );
}

function Block({ block }: { block: DatabankBlock }) {
  switch (block.kind) {
    case 'paragraph':
      return <p className="whitespace-pre-line">{block.text}</p>;
    case 'labelValue':
      return (
        <p>
          <strong className="font-semibold">{block.label}</strong> {block.text}
        </p>
      );
    case 'subheading':
      return <p className="mt-1.5 font-semibold">{block.text}</p>;
    case 'list':
      return (
        <ul className="list-disc pl-5">
          {block.items.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'video':
      return (
        <figure className="relative aspect-video w-full max-w-xl overflow-hidden rounded-lg bg-muted">
          <img
            src={block.thumbnailUrl}
            alt={`YouTube-video: ${block.title}`}
            className="block size-full object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 m-auto flex h-11 w-16 items-center justify-center rounded-xl bg-foreground/80 text-background"
          >
            <Play className="size-5 fill-current" />
          </span>
        </figure>
      );
  }
}
