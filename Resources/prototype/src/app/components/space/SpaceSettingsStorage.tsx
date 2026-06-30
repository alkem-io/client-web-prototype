import { useState } from "react";
import {
  Folder,
  File,
  FileImage,
  FileText,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Trash2,
  HardDrive,
  Database,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { IconButton } from "@/app/components/ui/icon-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { cn } from "@/lib/utils";
import { SettingsSection } from "@/app/components/shared/SettingsSection";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DocumentNode {
  id: string;
  name: string;
  type: "folder" | "file";
  size?: number; // bytes
  uploader?: string;
  uploadDate?: string;
  mimeType?: string;
  url?: string;
  children?: DocumentNode[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_TREE: DocumentNode[] = [
  {
    id: "f1",
    name: "Home",
    type: "folder",
    children: [
      {
        id: "d1",
        name: "welcome-banner.png",
        type: "file",
        size: 245000,
        mimeType: "image/png",
        uploader: "Elena Martinez",
        uploadDate: "2024-01-15",
        url: "#",
      },
      {
        id: "d2",
        name: "project-kickoff.pdf",
        type: "file",
        size: 1200000,
        mimeType: "application/pdf",
        uploader: "Sarah Chen",
        uploadDate: "2024-01-20",
        url: "#",
      },
    ],
  },
  {
    id: "f2",
    name: "Community",
    type: "folder",
    children: [
      {
        id: "d3",
        name: "member-handbook.pdf",
        type: "file",
        size: 890000,
        mimeType: "application/pdf",
        uploader: "Elena Martinez",
        uploadDate: "2024-02-01",
        url: "#",
      },
    ],
  },
  {
    id: "f3",
    name: "Knowledge",
    type: "folder",
    children: [
      {
        id: "d4",
        name: "research-findings.docx",
        type: "file",
        size: 456000,
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        uploader: "Marcus Johnson",
        uploadDate: "2024-02-10",
        url: "#",
      },
      {
        id: "d5",
        name: "infographic-energy.svg",
        type: "file",
        size: 78000,
        mimeType: "image/svg+xml",
        uploader: "Elena Martinez",
        uploadDate: "2024-02-12",
        url: "#",
      },
      {
        id: "d6",
        name: "workshop-recording.mp4",
        type: "file",
        size: 52400000,
        mimeType: "video/mp4",
        uploader: "Sarah Chen",
        uploadDate: "2024-02-14",
        url: "#",
      },
    ],
  },
  {
    id: "f4",
    name: "Subspaces",
    type: "folder",
    children: [],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function getFileIcon(mimeType?: string) {
  if (!mimeType) return File;
  if (mimeType.startsWith("image/")) return FileImage;
  if (mimeType.includes("pdf") || mimeType.includes("document") || mimeType.includes("text")) return FileText;
  return File;
}

interface FlatRow {
  node: DocumentNode;
  depth: number;
  isExpanded?: boolean;
  hasChildren?: boolean;
}

function flattenTree(tree: DocumentNode[], expandedIds: Set<string>, depth = 0): FlatRow[] {
  const rows: FlatRow[] = [];
  for (const node of tree) {
    const isFolder = node.type === "folder";
    const isExpanded = expandedIds.has(node.id);
    rows.push({
      node,
      depth,
      isExpanded: isFolder ? isExpanded : undefined,
      hasChildren: isFolder && (node.children?.length ?? 0) > 0,
    });
    if (isFolder && isExpanded && node.children) {
      rows.push(...flattenTree(node.children, expandedIds, depth + 1));
    }
  }
  return rows;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SpaceSettingsStorage() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["f1", "f3"]));
  const [pendingDelete, setPendingDelete] = useState<DocumentNode | null>(null);
  const [tree, setTree] = useState(MOCK_TREE);

  const toggleFolder = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = () => {
    if (!pendingDelete) return;
    const removeNode = (nodes: DocumentNode[]): DocumentNode[] =>
      nodes
        .filter((n) => n.id !== pendingDelete.id)
        .map((n) => (n.children ? { ...n, children: removeNode(n.children) } : n));
    setTree(removeNode(tree));
    setPendingDelete(null);
  };

  const flatRows = flattenTree(tree, expandedIds);

  // Calculate total storage
  const totalBytes = flatRows
    .filter((r) => r.node.type === "file" && r.node.size)
    .reduce((sum, r) => sum + (r.node.size ?? 0), 0);

  return (
    <div className="space-y-5">
      {/* ── Storage Overview ── */}
      <SettingsSection
        title="Storage Overview"
        icon={<Database className="w-4 h-4" />}
        iconColor="blue"
        collapsible={false}
      >
        <div className="flex items-center gap-6 text-body text-muted-foreground">
          <span>{flatRows.filter(r => r.node.type === 'file').length} files</span>
          <span>{flatRows.filter(r => r.node.type === 'folder').length} folders</span>
        </div>
      </SettingsSection>

      {/* ── Documents ── */}
      <SettingsSection
        title="Documents"
        icon={<HardDrive className="w-4 h-4" />}
        iconColor="purple"
      >
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[40%]">Name</TableHead>
              <TableHead className="w-[12%]">Size</TableHead>
              <TableHead className="w-[20%]">Uploaded by</TableHead>
              <TableHead className="w-[15%]">Date</TableHead>
              <TableHead className="w-[13%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flatRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <HardDrive className="w-8 h-8 opacity-40" />
                    <p className="text-body">No files uploaded yet.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              flatRows.map((row) => {
                const { node, depth, isExpanded, hasChildren } = row;
                const isFolder = node.type === "folder";
                const FileIcon = isFolder ? Folder : getFileIcon(node.mimeType);

                return (
                  <TableRow
                    key={node.id}
                    className={cn(
                      "group",
                      isFolder && "bg-muted/20 hover:bg-muted/40",
                      !isFolder && "hover:bg-accent/50"
                    )}
                  >
                    {/* Name */}
                    <TableCell>
                      <div
                        className="flex items-center gap-2"
                        style={{ paddingLeft: `${depth * 20}px` }}
                      >
                        {isFolder ? (
                          <button
                            onClick={() => toggleFolder(node.id)}
                            className="flex items-center gap-1.5 text-foreground hover:text-primary transition-colors"
                          >
                            {hasChildren ? (
                              isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              )
                            ) : (
                              <span className="w-4" />
                            )}
                            <Folder className="w-4 h-4 text-primary/70" />
                            <span className="font-medium text-body">{node.name}</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 pl-4">
                            <FileIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-body">{node.name}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Size */}
                    <TableCell className="text-body text-muted-foreground">
                      {node.size ? formatBytes(node.size) : "—"}
                    </TableCell>

                    {/* Uploader */}
                    <TableCell className="text-body text-muted-foreground">
                      {node.uploader ?? "—"}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-body text-muted-foreground">
                      {node.uploadDate
                        ? new Date(node.uploadDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      {!isFolder && (
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconButton
                            variant="ghost"
                            tooltipLabel="Open"
                            className="w-7 h-7"
                            onClick={() => window.open(node.url, "_blank")}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </IconButton>
                          <IconButton
                            variant="ghost"
                            tooltipLabel="Delete"
                            className="w-7 h-7 text-destructive hover:text-destructive"
                            onClick={() => setPendingDelete(node)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </IconButton>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      </SettingsSection>

      {/* Delete confirmation dialog */}
      <Dialog open={!!pendingDelete} onOpenChange={() => setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete file</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{pendingDelete?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}