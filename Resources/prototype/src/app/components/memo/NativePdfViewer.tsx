/**
 * NativePdfViewer — a faithful stand-in for the browser's built-in PDF viewer.
 *
 * The embed cannot be replaced: the signing dialog shows the real PDF through
 * the browser, toolbar and all. Drawing a clean custom page here would make the
 * redesign look better than it can ever be, so this mock keeps the dark chrome,
 * the thumbnail rail and the zoom control exactly where Chrome puts them.
 *
 * What the redesign *can* change is everything around it — and the one thing
 * inside it that follows from size. At the old dialog's 715×480 the page
 * defaulted to 52% and the toolbar was the widest thing on screen; given a
 * frame this size the same viewer opens near 100% and the toolbar becomes
 * incidental. That is the whole argument for making the dialog bigger, so the
 * mock takes `zoom` as a prop and the exploration page shows both.
 */
import {
  ChevronsUpDown,
  Download,
  Menu,
  Minus,
  MoreVertical,
  PenLine,
  Plus,
  Printer,
  Redo2,
  RotateCw,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NativePdfViewerProps {
  fileName?: string;
  /**
   * The memo being rendered. The snapshot has to show the document you are
   * actually signing — a preview of different text is worse than no preview.
   * Falls back to the sample memo when omitted.
   */
  markdown?: string;
  /** What the browser's zoom control reads — 52% in the dialog we are replacing. */
  zoom?: number;
  /** Hide the thumbnail rail, as the browser does below ~700px of width. */
  showThumbnails?: boolean;
  className?: string;
}

/** The memo from the screenshots — the fallback when no document is supplied. */
const SAMPLE_MEMO = [
  "**Once in a generation, sometimes once in a lifetime, a singular event blindsides the entire planet. 25 years on, does the memory of the Nine-Eleven attacks against New York's Twin Towers, the Pentagon and in Pennsylvania fade into history or is it still as raw and vivid as on that sunny September morning?**",
  "Back then, the world was still processing the end of the Cold War. Western spies who'd learned Russian suddenly had to take Arabic lessons, the element of surprise compounded by the shock of non-state actors killing thousands on U.S. soil. Each big anniversary since has been a marker of its own time.",
].join("\n\n");

/**
 * Markdown flattened to the handful of shapes a printed page needs. The real
 * conversion is a separate piece of work with styling faults of its own; this
 * only has to be honest about *which document* is on the page.
 */
function toPrintedLines(markdown: string): { text: string; kind: "h1" | "h2" | "li" | "p" | "strong" }[] {
  return markdown
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      if (line.startsWith("## ")) return { text: line.slice(3), kind: "h2" as const };
      if (line.startsWith("# ")) return { text: line.slice(2), kind: "h1" as const };
      if (/^[-*]\s/.test(line)) return { text: line.replace(/^[-*]\s/, "• "), kind: "li" as const };
      if (/^\d+\.\s/.test(line)) return { text: line, kind: "li" as const };
      // A whole paragraph in bold is a lead paragraph, and the sample memo opens
      // with one — worth keeping, since the fidelity of the "today" dialog is
      // the point of that reproduction.
      if (/^\*\*.*\*\*$/.test(line)) {
        return { text: line.slice(2, -2), kind: "strong" as const };
      }
      return { text: line.replace(/[*_`]/g, ""), kind: "p" as const };
    });
}

export function NativePdfViewer({
  fileName = "snapshot.pdf",
  markdown,
  zoom = 100,
  showThumbnails = true,
  className,
}: NativePdfViewerProps) {
  // The page renders at the zoom the browser reports, so the 52% case looks
  // exactly as cramped here as it does in the screenshot.
  const scale = zoom / 100;
  const lines = toPrintedLines(markdown ?? SAMPLE_MEMO);

  return (
    <div className={cn("flex flex-col overflow-hidden bg-[#525659]", className)}>
      {/* Browser chrome — not ours, and deliberately drawn as such. */}
      <div className="flex h-11 shrink-0 items-center gap-1 bg-[#323639] px-2 text-white/85">
        <Menu className="mx-1 size-4 shrink-0" />
        <span className="mr-2 truncate text-caption text-white/90">{fileName}</span>
        <div className="flex items-center gap-1">
          <span className="rounded-sm bg-white/10 px-2 py-0.5 text-caption tabular-nums">1</span>
          <span className="text-caption text-white/50">/ 1</span>
        </div>
        <div className="mx-2 h-5 w-px bg-white/15" />
        <Minus className="size-4 shrink-0" />
        <span className="rounded-sm bg-white/10 px-2 py-0.5 text-caption tabular-nums">{zoom}%</span>
        <Plus className="size-4 shrink-0" />
        <div className="mx-2 h-5 w-px bg-white/15" />
        <ChevronsUpDown className="size-4 shrink-0" />
        <RotateCw className="ml-2 size-4 shrink-0" />
        <div className="mx-2 h-5 w-px bg-white/15" />
        <PenLine className="size-4 shrink-0" />
        <Undo2 className="ml-2 size-4 shrink-0 text-white/40" />
        <Redo2 className="ml-1 size-4 shrink-0 text-white/40" />
        <div className="ml-auto flex items-center gap-3">
          <Download className="size-4 shrink-0" />
          <Printer className="size-4 shrink-0" />
          <MoreVertical className="size-4 shrink-0" />
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {showThumbnails && (
          <div className="hidden w-[180px] shrink-0 flex-col items-center gap-2 overflow-hidden bg-[#232628] py-5 lg:flex">
            <div className="w-[106px] rounded-sm border-2 border-[#4f8cf5] bg-white p-[6px]">
              <div className="space-y-[3px]">
                {[96, 88, 92, 70, 0, 94, 86, 62].map((w, i) => (
                  <div
                    key={i}
                    className={cn("h-[2px] rounded-full", w === 0 ? "bg-transparent" : "bg-neutral-300")}
                    style={{ width: `${w || 10}%` }}
                  />
                ))}
              </div>
              <div className="h-[104px]" />
            </div>
            <span className="text-caption text-white/70">1</span>
          </div>
        )}

        {/* The page itself. */}
        <div className="flex min-w-0 flex-1 justify-center overflow-hidden py-4">
          <div
            className="h-fit origin-top bg-white shadow-lg"
            style={{
              width: 612,
              height: 792,
              transform: `scale(${scale})`,
            }}
          >
            <div className="px-16 pb-14 pt-16">
              {lines.map((line, i) => (
                <p
                  key={i}
                  className={cn(
                    "text-neutral-900",
                    line.kind === "h1" && "mb-3 mt-5 text-[15px] font-bold leading-tight first:mt-0",
                    line.kind === "h2" && "mb-2 mt-4 text-[12px] font-bold leading-tight first:mt-0",
                    line.kind === "li" && "mb-1 pl-4 text-[11px] leading-[1.45]",
                    line.kind === "p" && "mb-3 text-[11px] leading-[1.45]",
                    line.kind === "strong" && "mb-3 text-[11px] font-bold leading-[1.45]",
                  )}
                >
                  {line.text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
