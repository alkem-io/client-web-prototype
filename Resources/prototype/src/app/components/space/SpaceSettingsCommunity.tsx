import { useState } from "react";
import {
 Search,
 MoreHorizontal,
 Check,
 X,
 Plus,
 FileText,
 Shield,
 Building,
 Bot,
 Users,
 Clock,
 Trash2,
 ExternalLink,
 UserPlus,
 ChevronLeft,
 ChevronRight,
 Eye,
 ArrowUpDown,
 ClipboardList,
 MessageSquare,
 UserCheck
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { IconButton } from "@/app/components/ui/icon-button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow
} from "@/app/components/ui/table";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
 DropdownMenuSeparator
} from "@/app/components/ui/dropdown-menu";
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogDescription,
} from "@/app/components/ui/dialog";
import { Separator } from "@/app/components/ui/separator";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { SettingsSection } from "@/app/components/shared/SettingsSection";
import { VCHoverCard } from "@/app/components/user/VCHoverCard";
import { Link } from "react-router";

// --- Mock Data ---

type MemberStatus = 'Active' | 'Pending' | 'Invited' | 'Accepted';
type MemberRole = 'Host' | 'Admin' | 'Lead' | 'Member';
type JoinMethod = 'invited' | 'applied' | 'direct';

interface ApplicationAnswer {
 question: string;
 answer: string;
}

interface CommunityMember {
 id: string;
 name: string;
 email: string;
 date: string;
 status: MemberStatus;
 role: MemberRole;
 avatar: string | null;
 initials: string;
 joinMethod?: JoinMethod;
 invitedBy?: string;
 applicationMessage?: string;
 applicationFormAnswers?: ApplicationAnswer[];
}

const MOCK_MEMBERS: CommunityMember[] = [
 {
 id: 'u1', name: "Elena Martinez", email: "elena@alkemio.org", date: "2023-10-15",
 status: "Active", role: "Host",
 avatar: "https://images.unsplash.com/photo-1623853589874-864b1dd4d922?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
 initials: "EM",
 joinMethod: 'invited', invitedBy: 'Platform Admin',
 },
 {
 id: 'u2', name: "Sarah Chen", email: "sarah.chen@example.com", date: "2023-11-02",
 status: "Active", role: "Admin",
 avatar: "https://images.unsplash.com/photo-1757347398206-7425300ef990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
 initials: "SC",
 joinMethod: 'direct',
 },
 {
 id: 'u3', name: "Maya Ross", email: "maya.r@example.com", date: "2023-12-10",
 status: "Active", role: "Lead",
 avatar: "https://images.unsplash.com/photo-1589332911105-a6b59f2e4c4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
 initials: "MR",
 joinMethod: 'applied',
 applicationFormAnswers: [
 { question: "Why do you want to join this space?", answer: "I've been following Alkemio's work on innovation ecosystems for two years and believe my experience in sustainable tech can add real value to the discussions here." },
 { question: "Link to your portfolio or LinkedIn profile", answer: "https://linkedin.com/in/mayaross" },
 ],
 },
 {
 id: 'u4', name: "David Kim", email: "dkim@design.co", date: "2024-01-05",
 status: "Active", role: "Member",
 avatar: "https://images.unsplash.com/photo-1651634099348-e4c38cfaa6d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
 initials: "DK",
 joinMethod: 'invited', invitedBy: 'Elena Martinez',
 },
 {
 id: 'u5', name: "Robert Fox", email: "robert.fox@example.com", date: "2024-01-12",
 status: "Active", role: "Member",
 avatar: "https://images.unsplash.com/photo-1651097681268-851acda33b18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
 initials: "RF",
 joinMethod: 'applied',
 applicationMessage: "Hi, I'm a product designer with 8 years in civic tech. I'd love to contribute to the UX challenges this space is tackling — happy to share my portfolio on request.",
 },
 {
 id: 'p1', name: "Michael Chen", email: "m.chen@university.edu", date: "2024-02-20",
 status: "Pending", role: "Member", avatar: null, initials: "MC",
 joinMethod: 'applied',
 applicationFormAnswers: [
 { question: "Why do you want to join this space?", answer: "As a researcher in urban mobility at TU Delft, this space aligns directly with my work on smart city adoption frameworks. I'd love to connect with practitioners here." },
 { question: "Link to your portfolio or LinkedIn profile", answer: "https://linkedin.com/in/michaelchen-research" },
 ],
 },
 {
 id: 'p2', name: "Jessica Alverez", email: "jess.alverez@studio.com", date: "2024-02-21",
 status: "Pending", role: "Member", avatar: null, initials: "JA",
 joinMethod: 'applied',
 applicationMessage: "I run a design studio focused on social impact projects and would love to bring that perspective to this community. Looking forward to collaborating!",
 },
 {
 // Accepted = admin approved the application; membership is being finalised.
 // Delete is intentionally unavailable at this stage.
 id: 'a1', name: "Lisa Park", email: "lisa.park@venture.io", date: "2024-02-22",
 status: "Accepted", role: "Member", avatar: null, initials: "LP",
 joinMethod: 'applied',
 applicationFormAnswers: [
 { question: "Why do you want to join this space?", answer: "I work in venture capital focused on climate tech. This space looks like the right community to explore collaborative funding models with practitioners." },
 { question: "Link to your portfolio or LinkedIn profile", answer: "https://linkedin.com/in/lisapark-vc" },
 ],
 },
 {
 id: 'i1', name: "Thomas Wright", email: "tom.wright@construction.com", date: "2024-02-18",
 status: "Invited", role: "Member", avatar: null, initials: "TW",
 joinMethod: 'invited', invitedBy: 'Elena Martinez',
 },
 {
 id: 'i2', name: "Emily Zhang", email: "emily.z@tech.io", date: "2024-02-19",
 status: "Invited", role: "Lead", avatar: null, initials: "EZ",
 joinMethod: 'invited', invitedBy: 'Sarah Chen',
 },
 ...Array.from({ length: 20 }).map((_, i) => ({
 id: `m${i + 6}`,
 name: [
 "James Wilson", "Emma Thompson", "Lucas Oliveira", "Sophia Li", "Oliver Smith",
 "Ava Patel", "William Chen", "Isabella Garcia", "Henry Wilson", "Mia Kim",
 "Alexander Wright", "Charlotte Davis", "Daniel Lee", "Amelia White", "Matthew Clark",
 "Harper Lewis", "Joseph Hall", "Evelyn Young", "Samuel Allen", "Abigail King"
 ][i] || `Member ${i + 6}`,
 email: `member${i + 6}@example.com`,
 date: "2024-02-15",
 status: "Active" as MemberStatus,
 role: (i < 3 ? "Lead" : "Member") as MemberRole,
 avatar: null,
 initials: [
 "JW", "ET", "LO", "SL", "OS", "AP", "WC", "IG", "HW", "MK",
 "AW", "CD", "DL", "AW", "MC", "HL", "JH", "EY", "SA", "AK"
 ][i] || `M${i + 6}`,
 joinMethod: 'direct' as JoinMethod,
 }))
];

interface Organization {
 id: string;
 name: string;
 logo: string;
 memberCount: number;
}

const MOCK_ORGS: Organization[] = [
 { id: 'org1', name: 'Acme Corp', logo: 'AC', memberCount: 15 },
 { id: 'org2', name: 'Global Tech', logo: 'GT', memberCount: 42 },
];

interface VirtualContributor {
 id: string;
 name: string;
 avatarUrl?: string | null;
 initials?: string;
 description?: string;
 tags?: string[];
 hostName?: string;
}

const MOCK_VCS: VirtualContributor[] = [
 {
 id: 'vc1',
 name: 'Summarizer Bot',
 avatarUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80',
 initials: 'SB',
 description: 'Automatically summarizes long discussions and documents',
 tags: ['Automation', 'Documentation', 'AI'],
 hostName: 'Sarah Chen',
 },
 {
 id: 'vc2',
 name: 'Translation Assistant',
 avatarUrl: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80',
 initials: 'TA',
 description: 'Translates content to 50+ languages in real-time',
 tags: ['Translation', 'Multilingual', 'Communication'],
 hostName: 'Elena Martinez',
 },
];

// --- Membership Details Dialog ---

function MembershipDetailsDialog({
 member,
 open,
 onOpenChange,
}: {
 member: CommunityMember | null;
 open: boolean;
 onOpenChange: (open: boolean) => void;
}) {
 if (!member) return null;
 const joinedDate = new Date(member.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
 return (
 <Dialog open={open} onOpenChange={onOpenChange}>
 <DialogContent className="max-w-lg">
 <DialogHeader>
 <DialogTitle>Membership Details</DialogTitle>
 <DialogDescription>How {member.name} joined this space</DialogDescription>
 </DialogHeader>

 <div className="space-y-4 pt-1">
 {/* Member summary */}
 <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
 <Avatar className="w-10 h-10 border">
 {member.avatar && <AvatarImage src={member.avatar} />}
 <AvatarFallback className="text-sm font-semibold">{member.initials}</AvatarFallback>
 </Avatar>
 <div>
 <div className="font-medium text-sm">{member.name}</div>
 <div className="text-xs text-muted-foreground">{member.email}</div>
 </div>
 <Badge
 variant="outline"
 className={cn(
 "ml-auto shrink-0",
 member.status === 'Active' && "bg-green-500/10 text-green-600 border-green-500/20",
 member.status === 'Pending' && "bg-amber-500/10 text-amber-600 border-amber-500/20",
 member.status === 'Invited' && "bg-primary/10 text-primary border-primary/20",
 member.status === 'Accepted' && "bg-green-500/10 text-green-600 border-green-500/20",
 )}
 >
 {member.status}
 </Badge>
 </div>

 {/* How they joined */}
 <div className="space-y-2">
 <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">How they joined</p>
 {member.joinMethod === 'invited' ? (
 <div className="flex items-start gap-2.5 text-sm">
 <UserPlus className="w-4 h-4 mt-0.5 text-primary shrink-0" />
 <span>
 Invited by <span className="font-medium">{member.invitedBy ?? 'an admin'}</span> on {joinedDate}
 </span>
 </div>
 ) : member.joinMethod === 'applied' ? (
 <div className="flex items-start gap-2.5 text-sm">
 <ClipboardList className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
 <span>Submitted an application on {joinedDate}</span>
 </div>
 ) : (
 <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
 <UserCheck className="w-4 h-4 mt-0.5 shrink-0" />
 <span>Added directly as a member on {joinedDate}</span>
 </div>
 )}
 </div>

 {/* Application form answers */}
 {member.applicationFormAnswers && member.applicationFormAnswers.length > 0 && (
 <>
 <Separator />
 <div className="space-y-3">
 <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Application Form</p>
 {member.applicationFormAnswers.map((qa, i) => (
 <div key={i} className="space-y-1">
 <p className="text-xs font-medium text-muted-foreground">{qa.question}</p>
 <p className="text-sm bg-muted/40 rounded-md px-3 py-2 border leading-relaxed">{qa.answer}</p>
 </div>
 ))}
 </div>
 </>
 )}

 {/* Free-text message */}
 {member.applicationMessage && (
 <>
 <Separator />
 <div className="space-y-2">
 <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message</p>
 <div className="flex items-start gap-2.5">
 <MessageSquare className="w-4 h-4 mt-2.5 text-muted-foreground shrink-0" />
 <p className="text-sm bg-muted/40 rounded-md px-3 py-2 border flex-1 leading-relaxed">{member.applicationMessage}</p>
 </div>
 </div>
 </>
 )}

 {/* No details */}
 {!member.applicationFormAnswers && !member.applicationMessage && member.joinMethod === 'direct' && (
 <p className="text-sm text-muted-foreground text-center py-2">No additional details available.</p>
 )}
 </div>
 </DialogContent>
 </Dialog>
 );
}

// --- Component ---

export function SpaceSettingsCommunity() {
 const [members, setMembers] = useState<CommunityMember[]>(MOCK_MEMBERS);
 const [searchQuery, setSearchQuery] = useState('');
 const [page, setPage] = useState(1);
 const [pendingSort, setPendingSort] = useState<{ key: 'name' | 'date' | 'status'; dir: 'asc' | 'desc' }>({ key: 'date', dir: 'desc' });
 const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
 const [detailsOpen, setDetailsOpen] = useState(false);
 const pageSize = 10;

 const openDetails = (member: CommunityMember) => {
 setSelectedMember(member);
 setDetailsOpen(true);
 };

 const pendingMembers = members.filter(m => m.status === 'Pending' || m.status === 'Invited' || m.status === 'Accepted')
 .sort((a, b) => {
 const { key, dir } = pendingSort;
 const aVal = key === 'date' ? new Date(a.date).getTime() : a[key].toLowerCase();
 const bVal = key === 'date' ? new Date(b.date).getTime() : b[key].toLowerCase();
 if (aVal < bVal) return dir === 'asc' ? -1 : 1;
 if (aVal > bVal) return dir === 'asc' ? 1 : -1;
 return 0;
 });
 const confirmedMembers = members.filter(m => m.status === 'Active');

 const filteredMembers = confirmedMembers.filter(member => {
 const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
 member.email.toLowerCase().includes(searchQuery.toLowerCase());
 return matchesSearch;
 });

 const totalPages = Math.ceil(filteredMembers.length / pageSize);
 const paginatedMembers = filteredMembers.slice((page - 1) * pageSize, page * pageSize);

 const handleRemove = (id: string) => {
 setMembers(members.filter(m => m.id !== id));
 };

 const togglePendingSort = (key: 'name' | 'date' | 'status') => {
 setPendingSort(prev => ({
 key,
 dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc'
 }));
 };

 return (
 <>
 <div className="space-y-5 animate-in fade-in duration-500">
 {/* ── Pending Memberships ── */}
 <SettingsSection
 title="Pending Memberships"
 icon={<Clock className="w-4 h-4" />}
 iconColor="amber"
 >
 {pendingMembers.length > 0 ? (
 <div className="border rounded-lg overflow-hidden">
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead className="w-[240px]">
 <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => togglePendingSort('name')}>
 Name <ArrowUpDown className="w-3 h-3" />
 </button>
 </TableHead>
 <TableHead>Email</TableHead>
 <TableHead>
 <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => togglePendingSort('date')}>
 Date <ArrowUpDown className="w-3 h-3" />
 </button>
 </TableHead>
 <TableHead>
 <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => togglePendingSort('status')}>
 Status <ArrowUpDown className="w-3 h-3" />
 </button>
 </TableHead>
 <TableHead className="w-[140px] text-right">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {pendingMembers.map((member) => (
 <TableRow key={member.id}>
 <TableCell>
 <div className="flex items-center gap-3">
 <Avatar className="w-8 h-8 border">
 {member.avatar && <AvatarImage src={member.avatar} />}
 <AvatarFallback className="text-caption">{member.initials}</AvatarFallback>
 </Avatar>
 <span className="text-body-emphasis">{member.name}</span>
 </div>
 </TableCell>
 <TableCell className="text-body text-muted-foreground">{member.email}</TableCell>
 <TableCell className="text-body text-muted-foreground">
 {new Date(member.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
 </TableCell>
 <TableCell>
 <Badge
 variant="outline"
 className={cn(
 "text-badge",
 member.status === 'Pending' && "bg-amber-500/10 text-amber-600 border-amber-500/20",
 member.status === 'Invited' && "bg-primary/10 text-primary border-primary/20",
 member.status === 'Accepted' && "bg-green-500/10 text-green-600 border-green-500/20",
 )}
 >
 {member.status === 'Pending' ? 'Application Received' : member.status === 'Accepted' ? 'Accepted – Processing' : 'Invited'}
 </Badge>
 </TableCell>
 <TableCell className="text-right">
 <div className="flex items-center justify-end gap-1">
 {member.status === 'Pending' && (
 <>
 <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-primary" title="Approve application">
 <Check className="h-3.5 w-3.5" />
 </Button>
 <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-destructive" title="Reject application">
 <X className="h-3.5 w-3.5" />
 </Button>
 </>
 )}
 <IconButton variant="ghost" tooltipLabel="View details" onClick={() => openDetails(member)}>
 <Eye className="w-3.5 h-3.5" />
 </IconButton>
 {member.status === 'Accepted' ? (
 <IconButton
 variant="ghost"
 tooltipLabel="Delete unavailable — membership already accepted"
 className="text-muted-foreground opacity-40 cursor-not-allowed"
 disabled
 >
 <Trash2 className="w-3.5 h-3.5" />
 </IconButton>
 ) : (
 <IconButton
 variant="ghost"
 tooltipLabel={member.status === 'Invited' ? 'Revoke invitation' : 'Delete application'}
 className="text-destructive"
 onClick={() => handleRemove(member.id)}
 >
 <Trash2 className="w-3.5 h-3.5" />
 </IconButton>
 )}
 </div>
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </div>
 ) : (
 <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground text-body">
 No pending memberships.
 </div>
 )}
 </SettingsSection>

 {/* ── Members ── */}
 <SettingsSection
 title="Members"
 icon={<Users className="w-4 h-4" />}
 iconColor="blue"
 >
 <div className="space-y-4">
 {/* Search + Invite */}
 <div className="flex items-center gap-2">
 <div className="relative flex-1">
 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
 <Input
 placeholder="Search members..."
 className="pl-9 h-9"
 value={searchQuery}
 onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
 />
 </div>
 <Button size="sm" className="h-9 gap-2">
 <UserPlus className="w-4 h-4" /> Invite
 </Button>
 </div>

 {/* Table */}
 <div className="border rounded-lg overflow-hidden">
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead className="w-[300px]">Name</TableHead>
 <TableHead>Role</TableHead>
 <TableHead>Joined</TableHead>
 <TableHead className="w-[80px] text-right">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {paginatedMembers.length === 0 ? (
 <TableRow>
 <TableCell colSpan={4} className="h-24 text-center">
 <div className="flex flex-col items-center text-muted-foreground">
 <Users className="w-8 h-8 mb-2 opacity-20" />
 <p>No members found.</p>
 <Button variant="link" size="sm" onClick={() => setSearchQuery('')}>Clear search</Button>
 </div>
 </TableCell>
 </TableRow>
 ) : (
 paginatedMembers.map((member) => (
 <TableRow key={member.id}>
 <TableCell>
 <div className="flex items-center gap-3">
 <Avatar className="w-8 h-8 border">
 {member.avatar && <AvatarImage src={member.avatar} />}
 <AvatarFallback className="text-caption">{member.initials}</AvatarFallback>
 </Avatar>
 <div>
 <div className="text-body-emphasis">{member.name}</div>
 <div className="text-caption text-muted-foreground truncate">{member.email}</div>
 </div>
 </div>
 </TableCell>
 <TableCell className="text-body">{member.role}</TableCell>
 <TableCell className="text-body text-muted-foreground">
 {new Date(member.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
 </TableCell>
 <TableCell className="text-right">
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <IconButton variant="ghost" tooltipLabel="More options" className="p-0">
 <MoreHorizontal className="w-4 h-4" />
 </IconButton>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end">
 <DropdownMenuItem>View Profile</DropdownMenuItem>
 <DropdownMenuItem onClick={() => openDetails(member)}>
 <Eye className="w-4 h-4 mr-2" /> Membership Details
 </DropdownMenuItem>
 <DropdownMenuItem>Change Role</DropdownMenuItem>
 <DropdownMenuSeparator />
 <DropdownMenuItem className="text-destructive" onClick={() => handleRemove(member.id)}>
 <Trash2 className="w-4 h-4 mr-2" /> Remove from Space
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 </TableCell>
 </TableRow>
 ))
 )}
 </TableBody>
 </Table>
 </div>

 {/* Pagination */}
 {filteredMembers.length > pageSize && (
 <div className="flex items-center justify-between">
 <p className="text-caption text-muted-foreground">
 {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredMembers.length)} of {filteredMembers.length}
 </p>
 <div className="flex items-center gap-1">
 <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
 <ChevronLeft className="h-4 w-4" />
 </Button>
 <span className="text-caption px-2">Page {page} of {totalPages}</span>
 <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
 <ChevronRight className="h-4 w-4" />
 </Button>
 </div>
 </div>
 )}
 </div>
 </SettingsSection>

 {/* ── Application Form ── */}
 <SettingsSection
 title="Application Form"
 icon={<FileText className="w-4 h-4" />}
 iconColor="purple"
 defaultOpen={false}
 >
 <div className="space-y-3">
 <div className="flex items-center justify-between p-3 bg-muted/30 border rounded-md">
 <div className="flex items-center gap-3">
 <div className="bg-primary/10 px-2 py-1 rounded text-primary text-caption font-bold">Q1</div>
 <span className="text-body">Why do you want to join this space?</span>
 </div>
 <Badge variant="secondary">Required</Badge>
 </div>
 <div className="flex items-center justify-between p-3 bg-muted/30 border rounded-md">
 <div className="flex items-center gap-3">
 <div className="bg-primary/10 px-2 py-1 rounded text-primary text-caption font-bold">Q2</div>
 <span className="text-body">Link to your portfolio or LinkedIn profile</span>
 </div>
 <Badge variant="outline">Optional</Badge>
 </div>
 <Button variant="outline" size="sm" className="gap-2 mt-2">
 <ExternalLink className="w-4 h-4" /> Edit Application Form
 </Button>
 </div>
 </SettingsSection>

 {/* ── Community Guidelines ── */}
 <SettingsSection
 title="Community Guidelines"
 icon={<Shield className="w-4 h-4" />}
 iconColor="green"
 defaultOpen={false}
 >
 <div className="space-y-3">
 <div className="bg-muted/30 rounded-lg p-4 border">
 <p className="text-body text-muted-foreground italic">
 "Be respectful, share openly, and contribute constructively..."
 </p>
 </div>
 <Button variant="outline" size="sm">Edit Guidelines</Button>
 </div>
 </SettingsSection>

 {/* ── Member Organizations ── */}
 <SettingsSection
 title="Member Organizations"
 icon={<Building className="w-4 h-4" />}
 iconColor="orange"
 defaultOpen={false}
 >
 <div className="space-y-3">
 {MOCK_ORGS.map(org => (
 <div key={org.id} className="flex items-center justify-between p-3 bg-muted/30 border rounded-md">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 bg-muted rounded-md flex items-center justify-center font-bold text-muted-foreground text-caption">
 {org.logo}
 </div>
 <div>
 <div className="text-body-emphasis">{org.name}</div>
 <div className="text-caption text-muted-foreground">{org.memberCount} members</div>
 </div>
 </div>
 <IconButton variant="ghost" tooltipLabel="Remove" className="text-muted-foreground hover:text-destructive">
 <X className="w-4 h-4" />
 </IconButton>
 </div>
 ))}
 <Button variant="outline" size="sm" className="gap-2">
 <Plus className="w-4 h-4" /> Add Organization
 </Button>
 </div>
 </SettingsSection>

 {/* ── Virtual Contributors ── */}
 <SettingsSection
 title="Virtual Contributors"
 icon={<Bot className="w-4 h-4" />}
 iconColor="rose"
 defaultOpen={false}
 >
 <div className="space-y-3">
 {MOCK_VCS.map(vc => (
 <div key={vc.id} className="flex items-center justify-between p-3 bg-muted/30 border rounded-md hover:bg-muted/50 transition-colors">
 <VCHoverCard
 vc={{
 name: vc.name,
 avatarUrl: vc.avatarUrl,
 initials: vc.initials,
 description: vc.description,
 tags: vc.tags,
 profileUrl: `/vc/${vc.name.toLowerCase().replace(/\s+/g, '-')}`,
 }}
 >
 <Link
 to={`/vc/${vc.name.toLowerCase().replace(/\s+/g, '-')}`}
 className="flex items-center gap-3 flex-1 focus:outline-none"
 >
 <Avatar className="w-9 h-9">
 {vc.avatarUrl && <AvatarImage src={vc.avatarUrl} alt={vc.name} />}
 <AvatarFallback className="text-caption font-bold bg-primary/10 text-primary">
 {vc.initials || vc.name.substring(0, 2).toUpperCase()}
 </AvatarFallback>
 </Avatar>
 <span className="text-body-emphasis hover:text-primary transition-colors">{vc.name}</span>
 </Link>
 </VCHoverCard>
 <IconButton
 variant="ghost"
 tooltipLabel="Delete"
 className="h-8 w-8 text-muted-foreground hover:text-destructive"
 onClick={(e: any) => {
 e.preventDefault();
 e.stopPropagation();
 }}
 >
 <Trash2 className="w-4 h-4" />
 </IconButton>
 </div>
 ))}
 <Button variant="outline" size="sm" className="gap-2">
 <Plus className="w-4 h-4" /> Add Virtual Contributor
 </Button>
 </div>
 </SettingsSection>
 </div>

 {/* ── Membership Details Dialog ── */}
 <MembershipDetailsDialog
 member={selectedMember}
 open={detailsOpen}
 onOpenChange={setDetailsOpen}
 />
 </>
 );
}
