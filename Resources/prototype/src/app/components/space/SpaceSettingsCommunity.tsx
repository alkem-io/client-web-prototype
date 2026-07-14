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
 ArrowUpDown
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
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { SettingsSection } from "@/app/components/shared/SettingsSection";
import { VCHoverCard } from "@/app/components/user/VCHoverCard";
import { Link } from "react-router";

// --- Mock Data ---

type MemberStatus = 'Active' | 'Pending' | 'Invited';
type MemberRole = 'Host' | 'Admin' | 'Lead' | 'Member';

interface CommunityMember {
 id: string;
 name: string;
 email: string;
 date: string;
 status: MemberStatus;
 role: MemberRole;
 avatar: string | null;
 initials: string;
}

const MOCK_MEMBERS: CommunityMember[] = [
 {
 id: 'u1', name: "Elena Martinez", email: "elena@alkemio.org", date: "2023-10-15",
 status: "Active", role: "Host",
 avatar: "https://images.unsplash.com/photo-1623853589874-864b1dd4d922?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
 initials: "EM"
 },
 {
 id: 'u2', name: "Sarah Chen", email: "sarah.chen@example.com", date: "2023-11-02",
 status: "Active", role: "Admin",
 avatar: "https://images.unsplash.com/photo-1757347398206-7425300ef990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
 initials: "SC"
 },
 {
 id: 'u3', name: "Maya Ross", email: "maya.r@example.com", date: "2023-12-10",
 status: "Active", role: "Lead",
 avatar: "https://images.unsplash.com/photo-1589332911105-a6b59f2e4c4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
 initials: "MR"
 },
 {
 id: 'u4', name: "David Kim", email: "dkim@design.co", date: "2024-01-05",
 status: "Active", role: "Member",
 avatar: "https://images.unsplash.com/photo-1651634099348-e4c38cfaa6d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
 initials: "DK"
 },
 {
 id: 'u5', name: "Robert Fox", email: "robert.fox@example.com", date: "2024-01-12",
 status: "Active", role: "Member",
 avatar: "https://images.unsplash.com/photo-1651097681268-851acda33b18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
 initials: "RF"
 },
 {
 id: 'p1', name: "Michael Chen", email: "m.chen@university.edu", date: "2024-02-20",
 status: "Pending", role: "Member", avatar: null, initials: "MC"
 },
 {
 id: 'p2', name: "Jessica Alverez", email: "jess.alverez@studio.com", date: "2024-02-21",
 status: "Pending", role: "Member", avatar: null, initials: "JA"
 },
 {
 id: 'i1', name: "Thomas Wright", email: "tom.wright@construction.com", date: "2024-02-18",
 status: "Invited", role: "Member", avatar: null, initials: "TW"
 },
 {
 id: 'i2', name: "Emily Zhang", email: "emily.z@tech.io", date: "2024-02-19",
 status: "Invited", role: "Lead", avatar: null, initials: "EZ"
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

// --- Component ---

export function SpaceSettingsCommunity() {
 const [members, setMembers] = useState<CommunityMember[]>(MOCK_MEMBERS);
 const [searchQuery, setSearchQuery] = useState('');
 const [page, setPage] = useState(1);
 const [pendingSort, setPendingSort] = useState<{ key: 'name' | 'date' | 'status'; dir: 'asc' | 'desc' }>({ key: 'date', dir: 'desc' });
 const pageSize = 10;

 const pendingMembers = members.filter(m => m.status === 'Pending' || m.status === 'Invited')
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
 member.status === 'Invited' && "bg-primary/10 text-primary border-primary/20"
 )}
 >
 {member.status === 'Pending' ? 'Application Received' : 'Invited'}
 </Badge>
 </TableCell>
 <TableCell className="text-right">
 <div className="flex items-center justify-end gap-1">
 {member.status === 'Pending' && (
 <>
 <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-primary" title="Approve">
 <Check className="h-3.5 w-3.5" />
 </Button>
 <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-destructive" title="Reject">
 <X className="h-3.5 w-3.5" />
 </Button>
 </>
 )}
 <IconButton variant="ghost" tooltipLabel="View" >
 <Eye className="w-3.5 h-3.5" />
 </IconButton>
 <IconButton variant="ghost" tooltipLabel="Delete" className="text-destructive" onClick={() => handleRemove(member.id)}>
 <Trash2 className="w-3.5 h-3.5" />
 </IconButton>
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
 );
}
