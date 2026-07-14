import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Lock, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { MembershipItem } from "@/app/components/memberships/membershipData";

interface ShowMoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: "lead" | "host" | null;
  spaces: MembershipItem[];
}

export function ShowMoreModal({
  open,
  onOpenChange,
  category,
  spaces,
}: ShowMoreModalProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const titles = {
    lead: "Spaces I Lead & Administer",
    host: "Spaces I Host",
  };

  const filteredSpaces = useMemo(() => {
    return spaces.filter(space =>
      space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (space.tagline || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [spaces, searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {category ? titles[category] : ""}
          </DialogTitle>
        </DialogHeader>

        {/* Search and filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search your spaces..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ALL ROLES</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="host">Host</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Spaces list */}
        <div className="flex-1 overflow-y-auto space-y-1 mt-4">
          {filteredSpaces.length > 0 ? (
            filteredSpaces.map((space) => (
              <div
                key={space.id}
                onClick={() => {
                  navigate(`/space/${space.slug}`);
                  onOpenChange(false);
                }}
                className="p-3 rounded-md cursor-pointer hover:bg-accent transition-colors flex items-start gap-3 group"
              >
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-lg shrink-0 overflow-hidden mt-0.5 relative"
                  style={{
                    border: "1px solid var(--border)",
                    background: space.color,
                  }}
                >
                  {space.image ? (
                    <img
                      src={space.image}
                      alt={space.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                      {space.initials}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium truncate">
                      {space.name}
                    </h3>
                    {space.isPrivate && (
                      <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    )}
                  </div>
                  {space.tagline && (
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {space.tagline}
                    </p>
                  )}
                </div>

                {/* Subspace count (if any) */}
                {space.parentId === undefined && (
                  <div className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                    2 subspaces
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No spaces found
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
