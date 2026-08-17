import { useState } from "react";
import {
  Search,
  UserPlus,
  Mail,
  Send,
  Clock,
  Users,
  Check,
  X,
  MoreHorizontal,
  ArrowUpDown,
  Pencil,
  Shield,
  ToggleLeft,
  Plus,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { IconButton } from "@/app/components/ui/icon-button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Switch } from "@/app/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/app/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { SettingsSection } from "@/app/components/shared/SettingsSection";
import { cn } from "@/lib/utils";

// --- Types ---
type OrgRole = "Associate" | "Admin" | "Owner";

interface OrgMember {
  id: string;
  name: string;
  email: string;
  location: string;
  role: OrgRole;
  avatar: string | null;
  initials: string;
}

interface PendingApplication {
  id: string;
  name: string;
  email: string;
  date: string;
  avatar: string | null;
  initials: string;
}

// --- Mock Data ---
const MOCK_MEMBERS: OrgMember[] = [
  { id: "u1", name: "Neil Smyth", email: "neil@alkemio.org", location: "Leidschendam, NL", role: "Owner", avatar: "https://images.unsplash.com/photo-1651097681268-851acda33b18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256", initials: "NS" },
  { id: "u2", name: "Robin Z. Tharakan", email: "robin@alkemio.org", location: "Den Haag, NL", role: "Admin", avatar: "https://images.unsplash.com/photo-1651634099348-e4c38cfaa6d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256", initials: "RT" },
  { id: "u3", name: "Denise Larsson", email: "denise@alkem.io", location: "Amsterdam, NL", role: "Admin", avatar: "https://images.unsplash.com/photo-1757347398206-7425300ef990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256", initials: "DL" },
  { id: "u4", name: "Maloe van den Hoogen", email: "maloe@alkem.io", location: "Amsterdam, NL", role: "Associate", avatar: "https://images.unsplash.com/photo-1623853589874-864b1dd4d922?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256", initials: "MH" },
  { id: "u5", name: "Support Alkemio", email: "support+1@alkem.io", location: "Den Haag, NL", role: "Associate", avatar: null, initials: "SA" },
  { id: "u6", name: "Jeroen Nijkamp", email: "jeroen@alkem.io", location: "Escamp, NL", role: "Associate", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", initials: "JN" },
  { id: "u7", name: "Rekencoördinator School A", email: "support+13@alkem.io", location: "Utrecht, NL", role: "Associate", avatar: null, initials: "RE" },
];

const MOCK_PENDING: PendingApplication[] = [
  { id: "p1", name: "Michael Chen", email: "m.chen@university.edu", date: "2024-02-20", avatar: null, initials: "MC" },
  { id: "p2", name: "Jessica Alverez", email: "jess.alverez@studio.com", date: "2024-02-21", avatar: null, initials: "JA" },
];

// --- Component ---
export function OrgSettingsAssociates() {
  const [members, setMembers] = useState<OrgMember[]>(MOCK_MEMBERS);
  const [pending, setPending] = useState<PendingApplication[]>(MOCK_PENDING);
  const [searchQuery, setSearchQuery] = useState("");
  const [domainAutoAdd, setDomainAutoAdd] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editMemberId, setEditMemberId] = useState<string | null>(null);

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleApprove = (id: string) => {
    const app = pending.find((p) => p.id === id);
    if (app) {
      setMembers([...members, { id: app.id, name: app.name, email: app.email, location: "", role: "Associate", avatar: app.avatar, initials: app.initials }]);
      setPending(pending.filter((p) => p.id !== id));
    }
  };

  const handleReject = (id: string) => {
    setPending(pending.filter((p) => p.id !== id));
  };

  const handleRoleChange = (id: string, newRole: OrgRole) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, role: newRole } : m)));
    setEditMemberId(null);
  };

  const roleColor = (role: OrgRole) => {
    switch (role) {
      case "Owner": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Admin": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Associate": return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* ── Invitations ── */}
      <SettingsSection
        title="Invite associates to join this organization"
        icon={<UserPlus className="w-4 h-4" />}
        iconColor="blue"
      >
        <div className="space-y-5">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setInviteDialogOpen(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite people
            </Button>
          </div>

          {/* Domain auto-add switch */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-lg border bg-muted/20">
            <div>
              <p className="text-body-emphasis">Allow users matching the organisation's domain to join</p>
              <p className="text-caption text-muted-foreground">When enabled, users whose email domain matches this organisation can self-join without an invitation.</p>
            </div>
            <Switch checked={domainAutoAdd} onCheckedChange={setDomainAutoAdd} />
          </div>
        </div>
      </SettingsSection>

      {/* ── Pending Applications ── */}
      <SettingsSection
        title="Pending Applications"
        icon={<Clock className="w-4 h-4" />}
        iconColor="amber"
      >
        {pending.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[240px]">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 border">
                          {app.avatar ? (
                            <AvatarImage src={app.avatar} alt={app.name} />
                          ) : null}
                          <AvatarFallback className="text-xs">{app.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-body-emphasis">{app.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-body text-muted-foreground">{app.email}</TableCell>
                    <TableCell className="text-body text-muted-foreground">{app.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton
                          icon={<Check className="w-4 h-4" />}
                          label="Approve"
                          variant="ghost"
                          className="text-emerald-600 hover:bg-emerald-50"
                          onClick={() => handleApprove(app.id)}
                        />
                        <IconButton
                          icon={<X className="w-4 h-4" />}
                          label="Reject"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleReject(app.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-body text-muted-foreground py-4">No pending applications.</p>
        )}
      </SettingsSection>

      {/* ── Associates ── */}
      <SettingsSection
        title="Associates"
        icon={<Users className="w-4 h-4" />}
        iconColor="purple"
        description="Manage who is associated with this organisation. Removing an associate revokes their organisation role."
      >
        <div className="space-y-4">
          {/* Search + Invite */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search associates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Members table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[260px]">Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 border">
                          {member.avatar ? (
                            <AvatarImage src={member.avatar} alt={member.name} />
                          ) : null}
                          <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-body-emphasis">{member.name}</p>
                          <p className="text-caption text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-body text-muted-foreground">{member.location}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", roleColor(member.role))}>
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <IconButton
                            icon={<MoreHorizontal className="w-4 h-4" />}
                            label="Actions"
                            variant="ghost"
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditMemberId(member.id)}>
                            <Pencil className="w-4 h-4 mr-2" /> Change Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <X className="w-4 h-4 mr-2" /> Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SettingsSection>

      {/* ── Invite Dialog ── */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-[36rem]">
          <DialogHeader>
            <DialogTitle className="text-lg">Invite others to join "Sandbox Organization"</DialogTitle>
            <DialogDescription>
              Search for people below or directly add their email address
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            {/* Search / email input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Username or email…" className="pl-10 h-10" />
            </div>

            {/* Invitation message */}
            <div>
              <label className="text-body-emphasis block mb-2">Invitation message</label>
              <textarea
                className="w-full min-h-[120px] rounded-lg border border-input bg-background px-4 py-3 text-body ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                defaultValue="Hi, I would like to invite you to Sandbox Organization. Have a look at the organization or click the button below to accept or decline the invitation."
              />
            </div>

            {/* Disclaimer + Role selector on same row */}
            <div className="flex items-center justify-between gap-6">
              <p className="text-caption text-muted-foreground leading-snug">
                Keep in mind that your personal email address will be visible to anyone you invite.
              </p>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-body text-muted-foreground whitespace-nowrap">Invite to be a:</span>
                <select className="h-10 rounded-md border border-input bg-background px-4 pr-9 text-body uppercase appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_10px_center] bg-no-repeat">
                  <option value="Associate">Associate</option>
                  <option value="Admin">Admin</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>
            </div>

            {/* Send button */}
            <div className="flex justify-end pt-1">
              <Button onClick={() => setInviteDialogOpen(false)} className="uppercase tracking-wide">
                <Send className="w-4 h-4 mr-2" /> Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Change Role Dialog ── */}
      <Dialog open={!!editMemberId} onOpenChange={() => setEditMemberId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>
              Select a new role for {members.find((m) => m.id === editMemberId)?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-4">
            {(["Associate", "Admin", "Owner"] as OrgRole[]).map((role) => (
              <Button
                key={role}
                variant="outline"
                className={cn(
                  "justify-start",
                  members.find((m) => m.id === editMemberId)?.role === role && "border-primary bg-primary/5"
                )}
                onClick={() => editMemberId && handleRoleChange(editMemberId, role)}
              >
                <Shield className="w-4 h-4 mr-2" />
                {role}
                {role === "Owner" && <span className="ml-auto text-caption text-muted-foreground">Full control</span>}
                {role === "Admin" && <span className="ml-auto text-caption text-muted-foreground">Manage settings</span>}
                {role === "Associate" && <span className="ml-auto text-caption text-muted-foreground">Basic member</span>}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
