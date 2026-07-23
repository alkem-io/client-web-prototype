import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Search, ChevronLeft, Bot, ExternalLink, Loader2, MapPin, Brain } from "lucide-react";
import { VirtualContributor, MOCK_VC_LIBRARY } from "./VirtualContributor";
import { VCLibraryCard } from "./VCLibraryCard";
import { TransparencyCard } from "./TransparencyCard";
import { FunctionalityCard } from "./FunctionalityCard";
import { toast } from "sonner";

type InviteVCView = "library" | "preview" | "invite";

interface InviteVCDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingVCIds?: string[];
  onInvite?: (vc: VirtualContributor, message: string) => void;
}

export function InviteVCDialog({
  open,
  onOpenChange,
  existingVCIds = [],
  onInvite,
}: InviteVCDialogProps) {
  const [currentView, setCurrentView] = useState<InviteVCView>("library");
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVC, setSelectedVC] = useState<VirtualContributor | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredVCs = MOCK_VC_LIBRARY.filter((vc) => {
    if (existingVCIds.includes(vc.id)) return false;
    const query = searchQuery.toLowerCase();
    return (
      vc.name.toLowerCase().includes(query) ||
      vc.description.toLowerCase().includes(query) ||
      vc.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const selectVC = (vc: VirtualContributor) => {
    setSelectedVC(vc);
    setDirection("forward");
    setCurrentView("preview");
  };

  const goToInvite = () => {
    setDirection("forward");
    setCurrentView("invite");
  };

  const goBack = () => {
    setDirection("back");
    if (currentView === "preview") {
      setCurrentView("library");
    } else if (currentView === "invite") {
      setCurrentView("preview");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setCurrentView("library");
      setDirection("forward");
      setSearchQuery("");
      setSelectedVC(null);
      setWelcomeMessage("");
      setIsSubmitting(false);
    }, 200);
  };

  const handleSendInvitation = async () => {
    if (!selectedVC) return;
    
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    toast.success(`${selectedVC.name} invited successfully!`);
    onInvite?.(selectedVC, welcomeMessage);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {currentView === "library" && "Add Virtual Contributor"}
            {currentView === "preview" && "Review Virtual Contributor"}
            {currentView === "invite" && "Send Invitation"}
          </DialogTitle>
        </DialogHeader>

        {/* Library View */}
        {currentView === "library" && (
          <div
            className={`space-y-4 animate-in fade-in ${
              direction === "forward"
                ? "slide-in-from-right-4"
                : "slide-in-from-left-4"
            }`}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {filteredVCs.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto py-2">
                {filteredVCs.map((vc) => (
                  <VCLibraryCard
                    key={vc.id}
                    vc={vc}
                    onSelect={() => selectVC(vc)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No Virtual Contributors found</p>
                <p className="text-caption text-muted-foreground mt-1">
                  Try a different search term
                </p>
              </div>
            )}
          </div>
        )}

        {/* Preview View */}
        {currentView === "preview" && selectedVC && (
          <div
            className={`space-y-4 animate-in fade-in max-h-96 overflow-y-auto ${
              direction === "forward"
                ? "slide-in-from-right-4"
                : "slide-in-from-left-4"
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Avatar className="w-12 h-12 shrink-0">
                  <AvatarImage src={selectedVC.avatarUrl} alt={selectedVC.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Bot className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-subsection-title font-semibold">{selectedVC.name}</h3>
                  <p className="text-caption text-muted-foreground mt-1">
                    {selectedVC.description}
                  </p>
                  {selectedVC.examplePrompts && selectedVC.examplePrompts.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {selectedVC.examplePrompts.map((prompt, idx) => (
                        <p key={idx} className="text-caption italic text-muted-foreground">
                          "{prompt}"
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <Link to={`/vc/${selectedVC.slug}`} className="shrink-0">
                <Button variant="link" size="sm" className="gap-1 h-auto p-0">
                  View full profile
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </Link>
            </div>

            {/* Host */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Avatar className="w-8 h-8">
                <AvatarImage src={selectedVC.host.avatarUrl} alt={selectedVC.host.name} />
                <AvatarFallback className="text-xs">{selectedVC.host.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-caption font-medium text-foreground">Hosted by</p>
                <p className="text-caption text-muted-foreground">{selectedVC.host.name}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {selectedVC.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-caption">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              <FunctionalityCard
                icon={<Bot className="w-5 h-5 text-muted-foreground" />}
                title="Functional Capabilities"
                items={selectedVC.functionality.capabilities}
              />
              <FunctionalityCard
                icon={<Bot className="w-5 h-5 text-muted-foreground" />}
                title="Data Access"
                items={selectedVC.functionality.dataAccess}
              />
              <TransparencyCard
                icon={<Brain className="w-5 h-5 text-muted-foreground" />}
                title="Open Model"
                description="Is this an open-source AI model?"
                value={selectedVC.aiEngine.openModel}
              />
              <TransparencyCard
                icon={<MapPin className="w-5 h-5 text-muted-foreground" />}
                title="Physical Location"
                description="Where data is processed"
                textValue={selectedVC.aiEngine.physicalLocation}
              />
            </div>
          </div>
        )}

        {/* Invite View */}
        {currentView === "invite" && selectedVC && (
          <div
            className={`space-y-4 animate-in fade-in ${
              direction === "forward"
                ? "slide-in-from-right-4"
                : "slide-in-from-left-4"
            }`}
          >
            {/* VC Header */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedVC.avatarUrl} alt={selectedVC.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  <Bot className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-caption font-medium text-muted-foreground">Inviting</p>
                <p className="text-body font-semibold text-foreground">{selectedVC.name}</p>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="space-y-2">
              <label className="text-subsection-title font-medium">Welcome Message</label>
              <Textarea
                placeholder="Write a welcome message for this Virtual Contributor (optional)"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                className="min-h-24"
              />
              <p className="text-caption text-muted-foreground">
                This message will be displayed to the Virtual Contributor when they join.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <DialogFooter className="flex items-center justify-between gap-2 pt-4">
          <div className="flex gap-2">
            {currentView !== "library" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="gap-1 px-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            {currentView === "preview" && (
              <Button size="sm" onClick={goToInvite}>
                Invite this VC →
              </Button>
            )}
            {currentView === "invite" && (
              <Button
                size="sm"
                onClick={handleSendInvitation}
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Send Invitation
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
