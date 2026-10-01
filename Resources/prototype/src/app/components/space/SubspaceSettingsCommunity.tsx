import { useState } from "react";
import { InviteVCDialog } from "@/app/components/vc/InviteVCDialog";
import {
 Search,
 Filter,
 MoreHorizontal,
 Check,
 X,
 ChevronDown,
 ChevronUp,
 Plus,
 FileText,
 Shield,
 Building,
 Bot,
 Users,
 Clock,
 Mail,
 Trash2,
 UserPlus,
 ChevronLeft,
 ChevronRight,
 ArrowUpDown,
 ArrowUp,
 ArrowDown,
 Send
} from "lucide-react";
import { Button } from "@/crd/primitives/button";
import { IconButton } from "@/crd/primitives/icon-button";
import { Input } from "@/crd/primitives/input";
import { Badge } from "@/crd/primitives/badge";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow
} from "@/crd/primitives/table";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
 DropdownMenuSeparator
} from "@/crd/primitives/dropdown-menu";
import {
 Collapsible,
 CollapsibleContent,
 CollapsibleTrigger
} from "@/crd/primitives/collapsible";
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogDescription,
 DialogFooter
} from "@/crd/primitives/dialog";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue
} from "@/crd/primitives/select";
import { Textarea } from "@/crd/primitives/textarea";
import { Separator } from "@/crd/primitives/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/crd/primitives/avatar";
import { cn } from "@/crd/lib/utils";

type MemberRole = "Lead" | "Admin" | "Member";
type MemberStatus = "Active" | "Pending" | "Invited";

interface Member {
 id: string;
 name: string;
 email: string;
 role: MemberRole;
 status: MemberStatus;
 avatar: string | null;
 initials: string;
 date: string;
}

const MOCK_MEMBERS: Member[] = [
 {
 id: "1",
 name: "Elena Martinez",
 email: "elena@alkemio.org",
 role: "Lead",
 status: "Active",
 avatar: "https://images.unsplash.com/photo-1623853589874-864b1dd4d922?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
 initials: "EM",
 date: "2023-10-15"
 },
 {
 id: "2",
 name: "Sarah Chen",
 email: "sarah.chen@example.com",
 role: "Admin",
 status: "Active",
 avatar: "https://images.unsplash.com/photo-1757347398206-7425300ef990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
 initials: "SC",
 date: "2023-11-02"
 },
 {
 id: "3",
 name: "David Kim",
 email: "dkim@design.co",
 role: "Member",
 status: "Active",
 avatar: null,
 initials: "DK",
 date: "2024-01-05"
 },
 {
 id: "4",
 name: "Maya Ross",
 email: "maya.r@example.com",
 role: "Member",
 status: "Active",
 avatar: null,
 initials: "MR",
 date: "2023-12-10"
 },
 {
 id: "5",
 name: "Robert Fox",
 email: "robert.fox@example.com",
 role: "Member",
 status: "Active",
 avatar: null,
 initials: "RF",
 date: "2024-01-12"
 },
 {
 id: "6",
 name: "Michael Chen",
 email: "m.chen@university.edu",
 role: "Member",
 status: "Pending",
 avatar: null,
 initials: "MC",
 date: "2024-02-20"
 },
 {
 id: "7",
 name: "Jessica Alverez",
 email: "jess.alverez@studio.com",
 role: "Member",
 status: "Invited",
 avatar: null,
 initials: "JA",
 date: "2024-02-21"
 },
 ...Array.from({ length: 8 }).map((_, i) => ({
 id: `m${i + 8}`,
 name: ["James Wilson", "Emma Thompson", "Lucas Oliveira", "Sophia Li", "Oliver Smith", "Ava Patel", "William Chen", "Isabella Garcia"][i] || `Member ${i + 8}`,
 email: `member${i + 8}@example.com`,
 date: "2024-02-15",
 status: "Active" as MemberStatus,
 role: (i < 1 ? "Lead" : "Member") as MemberRole,
 avatar: null,
 initials: ["JW", "ET", "LO", "SL", "OS", "AP", "WC", "IG"][i] || `M${i + 8}`
 })),
];

interface Organization {
 id: string;
 name: string;
 logo: string;
 memberCount: number;
}

const MOCK_ORGS: Organization[] = [
 { id: "org1", name: "Partner Org", logo: "PO", memberCount: 5 },
];

type OrgInviteStatus = 'pending' | 'accepted';
type OrgInviteRole = 'Member' | 'Lead' | 'Admin';

interface OrgInvitation {
 id: string;
 name: string;
 logo: string;
 memberCount: number;
 invitedDate: string;
 status: OrgInviteStatus;
 role: OrgInviteRole;
 message?: string;
}

const INITIAL_ORG_INVITATIONS: OrgInvitation[] = [
 { id: 'inv1', name: 'Green Future Labs', logo: 'GF', memberCount: 8, invitedDate: '2024-02-18', status: 'pending', role: 'Member' },
];

const SEARCHABLE_ORGS = [
 { id: 's1', name: 'TU Delft', logo: 'TD', memberCount: 120 },
 { id: 's2', name: 'Climate Lab', logo: 'CL', memberCount: 34 },
 { id: 's3', name: 'Urban Futures', logo: 'UF', memberCount: 18 },
 { id: 's4', name: 'Digital Commons', logo: 'DC', memberCount: 55 },
 { id: 's5', name: 'Nexus Ventures', logo: 'NV', memberCount: 9 },
];

interface VirtualContributor {
 id: string;
 name: string;
 status: "Active" | "Inactive";
}

const MOCK_VCS: VirtualContributor[] = [
 { id: "vc1", name: "Summarizer Bot", status: "Active" },
];

function StatusBadge({ status }: { status: MemberStatus }) {
 switch (status) {
 case "Pending":
 return <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Pending</Badge>;
 case "Invited":
 return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Invited</Badge>;
 case "Active":
 return <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">Active</Badge>;
 default:
 return <Badge variant="outline">{status}</Badge>;
 }
}

function SectionHeader({
 icon: Icon,
 title,
 description,
 isOpen,
 onToggle
}: {
 icon: React.ElementType;
 title: string;
 description: string;
 isOpen: boolean;
 onToggle: () => void;
}) {
 return (
 <div className="flex items-start gap-4 cursor-pointer group" onClick={onToggle}>
 <div className="mt-1 p-2 bg-muted rounded-md group-hover:bg-muted/80 transition-colors">
 <Icon className="w-5 h-5 text-muted-foreground" />
 </div>
 <div className="flex-1">
 <div className="flex items-center justify-between">
 <h3 className="text-subheader font-semibold flex items-center gap-2">{title}</h3>
 <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
 {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
 </Button>
 </div>
 <p className="text-body text-muted-foreground mt-1 pr-8">{description}</p>
 </div>
 </div>
 );
}

function InviteOrgDialog({
 open,
 onOpenChange,
 onInvite,
 alreadyInvited
}: {
 open: boolean;
 onOpenChange: (v: boolean) => void;
 onInvite: (org: typeof SEARCHABLE_ORGS[0], role: OrgInviteRole, message: string) => void;
 alreadyInvited: string[];
}) {
 const [query, setQuery] = useState('');
 const [selected, setSelected] = useState<typeof SEARCHABLE_ORGS[0] | null>(null);
 const [role, setRole] = useState<OrgInviteRole>('Member');
 const [message, setMessage] = useState('');

 const filtered = SEARCHABLE_ORGS.filter(
 (o) =>
 !alreadyInvited.includes(o.id) &&
 o.name.toLowerCase().includes(query.toLowerCase())
 );

 const reset = () => { setQuery(''); setSelected(null); setRole('Member'); setMessage(''); };
 const handleOpenChange = (v: boolean) => { if (!v) reset(); onOpenChange(v); };

 return (
 <Dialog open={open} onOpenChange={handleOpenChange}>
 <DialogContent className="max-w-md">
 <DialogHeader>
 <DialogTitle>Invite Organisation</DialogTitle>
 <DialogDescription>
 {selected
 ? `Configure the invitation for ${selected.name}.`
 : 'Search for an organisation to invite to this subspace.'}
 </DialogDescription>
 </DialogHeader>

 {!selected && (
 <>
 <div className="relative">
 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
 <Input autoFocus placeholder="Search organisations…" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
 </div>
 <div className="space-y-1 max-h-64 overflow-y-auto">
 {filtered.length === 0 && (
 <p className="text-body text-muted-foreground text-center py-4">No organisations found.</p>
 )}
 {filtered.map((org) => (
 <div key={org.id} className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelected(org)}>
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 bg-muted rounded-md flex items-center justify-center font-bold text-muted-foreground text-caption">{org.logo}</div>
 <div>
 <div className="text-body-emphasis">{org.name}</div>
 <div className="text-caption text-muted-foreground">{org.memberCount} members</div>
 </div>
 </div>
 <Button size="sm" variant="ghost" tabIndex={-1}>Select →</Button>
 </div>
 ))}
 </div>
 </>
 )}

 {selected && (
 <>
 <div className="flex items-center gap-3 p-3 bg-muted/30 border rounded-md">
 <div className="w-9 h-9 bg-muted rounded-md flex items-center justify-center font-bold text-muted-foreground text-caption shrink-0">{selected.logo}</div>
 <div className="flex-1 min-w-0">
 <div className="text-body-emphasis">{selected.name}</div>
 <div className="text-caption text-muted-foreground">{selected.memberCount} members</div>
 </div>
 <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => setSelected(null)}>Change</Button>
 </div>

 <Separator />

 <div className="space-y-2">
 <label className="text-body-emphasis">Invite as</label>
 <Select value={role} onValueChange={(v) => setRole(v as OrgInviteRole)}>
 <SelectTrigger><SelectValue /></SelectTrigger>
 <SelectContent>
 <SelectItem value="Member">Member</SelectItem>
 <SelectItem value="Lead">Lead</SelectItem>
 <SelectItem value="Admin">Admin</SelectItem>
 </SelectContent>
 </Select>
 </div>

 <div className="space-y-2">
 <label className="text-body-emphasis">
 Message <span className="text-caption text-muted-foreground font-normal">(optional)</span>
 </label>
 <Textarea placeholder="Add a personal note to the invitation…" className="resize-none" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
 </div>

 <DialogFooter>
 <Button variant="outline" onClick={() => setSelected(null)}>Back</Button>
 <Button className="gap-1.5" onClick={() => { onInvite(selected, role, message); handleOpenChange(false); }}>
 <Send className="w-3.5 h-3.5" /> Send Invitation
 </Button>
 </DialogFooter>
 </>
 )}
 </DialogContent>
 </Dialog>
 );
}

export function SubspaceSettingsCommunity() {
 const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
 const [orgInvitations, setOrgInvitations] = useState<OrgInvitation[]>(INITIAL_ORG_INVITATIONS);
 const [inviteOrgOpen, setInviteOrgOpen] = useState(false);
 const [search, setSearch] = useState("");
 const [filter, setFilter] = useState<"All" | "Active" | "Pending" | "Invited">("All");
 const [page, setPage] = useState(1);
 const pageSize = 10;
 const [inviteVCOpen, setInviteVCOpen] = useState(false);
 const [sortConfig, setSortConfig] = useState<{ key: keyof Member | null; direction: "asc" | "desc" }>({
 key: null,
 direction: "asc"
 });
 const [openSections, setOpenSections] = useState<Record<string, boolean>>({
 form: false,
 guidelines: false,
 orgs: false,
 vcs: false
 });

 const toggleSection = (section: string) => {
 setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
 };

 const handleInviteOrg = (org: typeof SEARCHABLE_ORGS[0], role: OrgInviteRole, message: string) => {
 setOrgInvitations((prev) => [
 ...prev,
 {
 id: `inv-${org.id}`,
 name: org.name,
 logo: org.logo,
 memberCount: org.memberCount,
 invitedDate: new Date().toISOString().slice(0, 10),
 status: 'pending' as OrgInviteStatus,
 role,
 message: message || undefined
 },
 ]);
 };

 const revokeOrgInvite = (id: string) => {
 setOrgInvitations((prev) => prev.filter((i) => i.id !== id));
 };

 const alreadyInvitedSourceIds = orgInvitations.map((i) =>
 i.id.startsWith('inv-') ? i.id.slice(4) : i.id
 );

 const handleSort = (key: keyof Member) => {
 setSortConfig((current) => ({
 key,
 direction: current.key === key && current.direction === "asc" ? "desc" : "asc"
 }));
 };

 const filteredMembers = members
 .filter((m) => {
 const matchSearch =
 m.name.toLowerCase().includes(search.toLowerCase()) ||
 m.email.toLowerCase().includes(search.toLowerCase());
 const matchFilter = filter === "All" || m.status === filter;
 return matchSearch && matchFilter;
 })
 .sort((a, b) => {
 if (sortConfig.key) {
 const aValue = a[sortConfig.key];
 const bValue = b[sortConfig.key];
 if (aValue === null && bValue === null) return 0;
 if (aValue === null) return 1;
 if (bValue === null) return -1;
 if (aValue! < bValue!) return sortConfig.direction === "asc" ? -1 : 1;
 if (aValue! > bValue!) return sortConfig.direction === "asc" ? 1 : -1;
 return 0;
 }
 // Default: Pending > Invited > Active
 if (a.status === b.status) return 0;
 if (a.status === "Pending") return -1;
 if (b.status === "Pending") return 1;
 if (a.status === "Invited") return -1;
 if (b.status === "Invited") return 1;
 return 0;
 });

 const totalPages = Math.ceil(filteredMembers.length / pageSize);
 const paginatedMembers = filteredMembers.slice((page - 1) * pageSize, page * pageSize);

 const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 setSearch(e.target.value);
 setPage(1);
 };

 const handleFilterChange = (newFilter: typeof filter) => {
 setFilter(newFilter);
 setPage(1);
 };

 const handleRemove = (id: string) => {
 setMembers(members.filter((m) => m.id !== id));
 };

 return (
 <div className="space-y-8 animate-in fade-in duration-500">
 {/* Header */}
 <div>
 <h2 className="text-page-title">Community</h2>
 <p className="text-muted-foreground mt-2">
 Manage your subspace members, review applications, and configure community settings.
 </p>
 </div>

 <Separator />

 {/* Summary Cards */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 {[
 { label: "Total Members", value: members.filter((m) => m.status === "Active").length, icon: Users },
 { label: "Leads", value: members.filter((m) => m.role === "Lead").length, icon: Shield },
 { label: "Pending", value: members.filter((m) => m.status === "Pending").length, icon: Clock },
 { label: "Invited", value: members.filter((m) => m.status === "Invited").length, icon: Mail },
 ].map((stat) => (
 <div
 key={stat.label}
 className="rounded-lg p-4 space-y-1"
 style={{ background: "var(--muted)", border: "1px solid var(--border)" }}
 >
 <div className="flex items-center gap-2 text-muted-foreground">
 <stat.icon className="w-4 h-4" />
 <span className="text-caption font-medium">{stat.label}</span>
 </div>
 <p className="text-page-title">{stat.value}</p>
 </div>
 ))}
 </div>

 {/* Members Table Section */}
 <div className="space-y-4">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <h3 className="text-subsection-title flex items-center gap-2">
 Subspace Members
 <Badge variant="secondary" className="rounded-full px-2 py-0.5 ml-2">
 {filteredMembers.length}
 </Badge>
 </h3>

 <div className="flex items-center gap-2 flex-wrap">
 <div className="relative">
 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
 <Input
 placeholder="Search members..."
 className="pl-9 h-9 w-[200px]"
 value={search}
 onChange={handleSearchChange}
 />
 </div>

 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="outline" size="sm" className="h-9 gap-2">
 <Filter className="w-4 h-4" />
 Filter: {filter}
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end">
 <DropdownMenuItem onClick={() => handleFilterChange("All")}>
 All Members
 {filter === "All" && <Check className="w-4 h-4 ml-auto" />}
 </DropdownMenuItem>
 <DropdownMenuItem onClick={() => handleFilterChange("Active")}>
 Active Only
 {filter === "Active" && <Check className="w-4 h-4 ml-auto" />}
 </DropdownMenuItem>
 <DropdownMenuItem onClick={() => handleFilterChange("Pending")}>
 Pending
 {filter === "Pending" && <Check className="w-4 h-4 ml-auto" />}
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>

 <Button size="sm" className="h-9 gap-2">
 <UserPlus className="w-4 h-4" />
 Invite
 </Button>
 </div>
 </div>

 <div className="border rounded-lg overflow-hidden bg-card">
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead className="w-[300px]">
 <Button
 variant="ghost"
 className="p-0 hover:bg-transparent font-medium text-muted-foreground h-auto"
 onClick={() => handleSort("name")}
 >
 Name
 {sortConfig.key === "name" ? (
 sortConfig.direction === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
 ) : (
 <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
 )}
 </Button>
 </TableHead>
 <TableHead>
 <Button
 variant="ghost"
 className="p-0 hover:bg-transparent font-medium text-muted-foreground h-auto"
 onClick={() => handleSort("role")}
 >
 Role
 {sortConfig.key === "role" ? (
 sortConfig.direction === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
 ) : (
 <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
 )}
 </Button>
 </TableHead>
 <TableHead>
 <Button
 variant="ghost"
 className="p-0 hover:bg-transparent font-medium text-muted-foreground h-auto"
 onClick={() => handleSort("date")}
 >
 Joined
 {sortConfig.key === "date" ? (
 sortConfig.direction === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
 ) : (
 <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
 )}
 </Button>
 </TableHead>
 <TableHead>
 <Button
 variant="ghost"
 className="p-0 hover:bg-transparent font-medium text-muted-foreground h-auto"
 onClick={() => handleSort("status")}
 >
 Status
 {sortConfig.key === "status" ? (
 sortConfig.direction === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
 ) : (
 <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
 )}
 </Button>
 </TableHead>
 <TableHead className="text-right">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {filteredMembers.length === 0 ? (
 <TableRow>
 <TableCell colSpan={5} className="h-24 text-center">
 <div className="flex flex-col items-center justify-center text-muted-foreground">
 <Users className="w-8 h-8 mb-2 opacity-20" />
 <p>No members found matching your criteria.</p>
 <Button
 variant="link"
 size="sm"
 className="mt-1"
 onClick={() => { setFilter("All"); setSearch(""); }}
 >
 Clear filters
 </Button>
 </div>
 </TableCell>
 </TableRow>
 ) : (
 paginatedMembers.map((member, index) => (
 <TableRow key={member.id} className={cn(index % 2 === 0 ? "bg-background" : "bg-muted/30", "hover:bg-accent/50 transition-colors")}>
 <TableCell>
 <div className="flex items-center gap-3">
 <Avatar className="w-8 h-8 border border-border">
 {member.avatar && <AvatarImage src={member.avatar} />}
 <AvatarFallback className="text-caption">{member.initials}</AvatarFallback>
 </Avatar>
 <div>
 <div className="text-body-emphasis">{member.name}</div>
 <div className="text-caption text-muted-foreground">{member.email}</div>
 </div>
 </div>
 </TableCell>
 <TableCell>
 <span className="text-body-emphasis text-foreground">{member.role}</span>
 </TableCell>
 <TableCell className="text-muted-foreground text-body">
 {new Date(member.date).toLocaleDateString()}
 </TableCell>
 <TableCell>
 <StatusBadge status={member.status} />
 </TableCell>
 <TableCell className="text-right">
 <div className="flex items-center justify-end gap-2">
 {member.status === "Pending" && (
 <>
 <Button
 size="sm"
 variant="outline"
 className="h-8 w-8 p-0 text-primary border-primary/20 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
 title="Approve Request"
 >
 <Check className="h-4 w-4" />
 </Button>
 <Button
 size="sm"
 variant="outline"
 className="h-8 w-8 p-0 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
 title="Reject Request"
 >
 <X className="h-4 w-4" />
 </Button>
 </>
 )}
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
 <MoreHorizontal className="w-4 h-4" />
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end">
 <DropdownMenuItem>View Profile</DropdownMenuItem>
 <DropdownMenuItem>Change Role</DropdownMenuItem>
 {member.status === "Pending" && (
 <>
 <DropdownMenuSeparator />
 <DropdownMenuItem className="text-success font-medium">Approve Request</DropdownMenuItem>
 <DropdownMenuItem className="text-destructive">Reject Request</DropdownMenuItem>
 </>
 )}
 {member.status === "Invited" && (
 <>
 <DropdownMenuSeparator />
 <DropdownMenuItem>Resend Invitation</DropdownMenuItem>
 <DropdownMenuItem className="text-destructive">Revoke Invitation</DropdownMenuItem>
 </>
 )}
 <DropdownMenuSeparator />
 <DropdownMenuItem className="text-destructive" onClick={() => handleRemove(member.id)}>
 Remove from Subspace
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 </div>
 </TableCell>
 </TableRow>
 ))
 )}
 </TableBody>
 </Table>
 </div>

 {/* Pagination */}
 {filteredMembers.length > pageSize && (
 <div className="flex items-center justify-between py-2">
 <div className="text-body text-muted-foreground">
 Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{" "}
 <span className="font-medium">{Math.min(page * pageSize, filteredMembers.length)}</span>{" "}
 of <span className="font-medium">{filteredMembers.length}</span> members
 </div>
 <div className="flex items-center space-x-2">
 <Button
 variant="outline"
 size="sm"
 onClick={() => setPage((p) => Math.max(1, p - 1))}
 disabled={page === 1}
 className="h-8 w-8 p-0"
 >
 <ChevronLeft className="h-4 w-4" />
 </Button>
 <div className="text-body-emphasis">
 Page {page} of {totalPages}
 </div>
 <Button
 variant="outline"
 size="sm"
 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
 disabled={page === totalPages}
 className="h-8 w-8 p-0"
 >
 <ChevronRight className="h-4 w-4" />
 </Button>
 </div>
 </div>
 )}
 </div>

 <Separator />

 {/* Application Form */}
 <Collapsible
 open={openSections.form}
 onOpenChange={() => toggleSection("form")}
 className="bg-card border rounded-lg p-6"
 >
 <CollapsibleTrigger asChild>
 <div>
 <SectionHeader
 icon={FileText}
 title="Application Form"
 description="Customize the questions users must answer when applying to join this subspace."
 isOpen={openSections.form}
 onToggle={() => toggleSection("form")}
 />
 </div>
 </CollapsibleTrigger>
 <CollapsibleContent className="mt-6 pl-[52px]">
 <div className="bg-muted/30 rounded-lg p-4 border border-border space-y-3">
 <div className="flex items-center justify-between p-3 bg-background border rounded-md">
 <div className="flex items-center gap-3">
 <div className="bg-primary/10 p-2 rounded text-primary">
 <span className="text-caption font-bold">Q1</span>
 </div>
 <span className="text-body-emphasis">Why do you want to join this subspace?</span>
 </div>
 <Badge variant="secondary">Required</Badge>
 </div>
 </div>
 <div className="mt-4">
 <Button variant="outline" size="sm">Edit Application Form</Button>
 <p className="text-caption text-muted-foreground mt-2">
 This form is shown to users when they apply to join.
 </p>
 </div>
 </CollapsibleContent>
 </Collapsible>

 {/* Community Guidelines */}
 <Collapsible
 open={openSections.guidelines}
 onOpenChange={() => toggleSection("guidelines")}
 className="bg-card border rounded-lg p-6"
 >
 <CollapsibleTrigger asChild>
 <div>
 <SectionHeader
 icon={Shield}
 title="Community Guidelines"
 description="Establish rules and expectations for member behavior."
 isOpen={openSections.guidelines}
 onToggle={() => toggleSection("guidelines")}
 />
 </div>
 </CollapsibleTrigger>
 <CollapsibleContent className="mt-6 pl-[52px]">
 <div className="bg-muted/30 rounded-lg p-4 border border-border">
 <p className="text-body text-muted-foreground italic">
 "Be respectful, share openly, and contribute constructively..."
 </p>
 </div>
 <div className="mt-4">
 <Button variant="outline" size="sm">Edit Guidelines</Button>
 <p className="text-caption text-muted-foreground mt-2">
 Displayed to new members upon joining.
 </p>
 </div>
 </CollapsibleContent>
 </Collapsible>

 {/* Member Organizations */}
 <Collapsible
 open={openSections.orgs}
 onOpenChange={() => toggleSection("orgs")}
 className="bg-card border rounded-lg p-6"
 >
 <CollapsibleTrigger asChild>
 <div>
 <SectionHeader
 icon={Building}
 title="Member Organisations"
 description="Allow members from specific organisations to join automatically."
 isOpen={openSections.orgs}
 onToggle={() => toggleSection("orgs")}
 />
 </div>
 </CollapsibleTrigger>
 <CollapsibleContent className="mt-6 pl-[52px]">
 <div className="space-y-3">
 {MOCK_ORGS.map((org) => (
 <div key={org.id} className="flex items-center justify-between p-3 bg-background border rounded-md">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center font-bold text-muted-foreground">
 {org.logo}
 </div>
 <div>
 <div className="text-body-emphasis">{org.name}</div>
 <div className="text-caption text-muted-foreground">{org.memberCount} members in subspace</div>
 </div>
 </div>
 <IconButton variant="ghost" tooltipLabel="Remove" className="text-muted-foreground hover:text-destructive">
 <X className="w-4 h-4" />
 </IconButton>
 </div>
 ))}

 {/* Pending invitations */}
 {orgInvitations.filter(i => i.status === 'pending').length > 0 && (
 <div className="pt-1">
 <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground mb-2">Pending Invitations</p>
 <div className="space-y-2">
 {orgInvitations.filter(i => i.status === 'pending').map(inv => (
 <div key={inv.id} className="flex items-center justify-between p-3 bg-amber-500/5 border border-amber-500/20 rounded-md">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center font-bold text-muted-foreground">
 {inv.logo}
 </div>
 <div>
 <div className="text-body-emphasis">{inv.name}</div>
 <div className="text-caption text-muted-foreground">{inv.memberCount} members</div>
 </div>
 <Badge variant="outline" className="ml-2 bg-amber-500/10 text-amber-600 border-amber-500/20 text-badge">
 <Mail className="w-3 h-3 mr-1" /> Invited
 </Badge> <Badge variant="outline" className="bg-muted text-muted-foreground text-badge">
 {inv.role}
 </Badge> </div>
 <Button
 size="sm"
 variant="ghost"
 className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
 onClick={() => revokeOrgInvite(inv.id)}
 >
 <X className="w-3.5 h-3.5" /> Revoke
 </Button>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 <div className="mt-4 flex items-center gap-2">
 <Button variant="outline" size="sm" className="gap-2">
 <Plus className="w-4 h-4" /> Add Organisation
 </Button>
 <Button variant="outline" size="sm" className="gap-2" onClick={() => setInviteOrgOpen(true)}>
 <Send className="w-3.5 h-3.5" /> Invite Organisation
 </Button>
 </div>
 <p className="text-caption text-muted-foreground mt-2">
 Users from these organisations can join without admin approval.
 </p>
 </CollapsibleContent>
 </Collapsible>

 {/* Virtual Contributors */}
 <Collapsible
 open={openSections.vcs}
 onOpenChange={() => toggleSection("vcs")}
 className="bg-card border rounded-lg p-6"
 >
 <CollapsibleTrigger asChild>
 <div>
 <SectionHeader
 icon={Bot}
 title="Virtual Contributors"
 description="Manage AI agents and bots participating in this subspace."
 isOpen={openSections.vcs}
 onToggle={() => toggleSection("vcs")}
 />
 </div>
 </CollapsibleTrigger>
 <CollapsibleContent className="mt-6 pl-[52px]">
 <div className="space-y-3">
 {MOCK_VCS.map((vc) => (
 <div key={vc.id} className="flex items-center justify-between p-3 bg-background border rounded-md">
 <div className="flex items-center gap-3">
 <div
 className="w-10 h-10 rounded-md flex items-center justify-center"
 style={{
 background: "color-mix(in srgb, var(--primary) 10%, transparent)",
 color: "var(--primary)"
 }}
 >
 <Bot className="w-5 h-5" />
 </div>
 <div>
 <div className="text-body-emphasis">{vc.name}</div>
 <div className="flex items-center gap-2 mt-0.5">
 <span
 className={cn(
 "w-1.5 h-1.5 rounded-full",
 vc.status === "Active" ? "bg-primary" : "bg-muted-foreground/30"
 )}
 />
 <span className="text-caption text-muted-foreground">{vc.status}</span>
 </div>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <Button variant="ghost" size="sm">Edit</Button>
 <IconButton variant="ghost" tooltipLabel="Delete" className="text-muted-foreground hover:text-destructive">
 <Trash2 className="w-4 h-4" />
 </IconButton>
 </div>
 </div>
 ))}
 </div>
 <div className="mt-4">
 <Button variant="outline" size="sm" className="gap-2" onClick={() => setInviteVCOpen(true)}>
 <Plus className="w-4 h-4" /> Add Virtual Contributor
 </Button>
 </div>
 </CollapsibleContent>
 </Collapsible>

 <InviteVCDialog
 open={inviteVCOpen}
 onOpenChange={setInviteVCOpen}
 existingVCIds={MOCK_VCS.map(vc => vc.id)}
 onInvite={(vc, message) => {
 // In a real app, this would send an invitation to the backend
 console.log(`Invited ${vc.name} with message: ${message}`);
 }}
 />

 <InviteOrgDialog
 open={inviteOrgOpen}
 onOpenChange={setInviteOrgOpen}
 onInvite={handleInviteOrg}
 alreadyInvited={alreadyInvitedSourceIds}
 />
 </div>
 );
}
