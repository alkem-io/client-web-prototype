import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { MarkdownEditor } from "@/app/components/ui/markdown-editor";
import {
  X, ImageIcon, ChevronLeft, Sparkles, Palette, Users, Globe, Lock,
  UserPlus, BookOpen, Target, Lightbulb, UsersRound, Search,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/app/components/ui/utils";

/* ═══════════════════════════════════════════════════════════════════════════════
   Welcome to your Space — Post-creation setup dialog
   ═══════════════════════════════════════════════════════════════════════════════ */

interface WelcomeSpaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceName?: string;
}

export function WelcomeSpaceDialog({
  open,
  onOpenChange,
  spaceName = "your space",
}: WelcomeSpaceDialogProps) {
  const [currentStep, setCurrentStep] = useState<number>(-1); // -1 = welcome screen
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  // Branding
  const [avatar, setAvatar] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");

  // Purpose
  const [why, setWhy] = useState("");
  const [who, setWho] = useState("");

  // Access
  const [visibility, setVisibility] = useState("public");
  const [membershipMode, setMembershipMode] = useState("open");

  const steps = [
    { label: "Branding", icon: Palette },
    { label: "Purpose", icon: Target },
    { label: "Access", icon: Users },
  ];

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSkipAll = () => {
    onOpenChange(false);
  };

  const handleStart = () => {
    setDirection("forward");
    setCurrentStep(0);
  };

  const goForward = () => {
    if (currentStep < steps.length - 1) {
      setDirection("forward");
      setCurrentStep(currentStep + 1);
    } else {
      // Done — close
      onOpenChange(false);
    }
  };

  const goBack = () => {
    setDirection("back");
    if (currentStep === 0) {
      setCurrentStep(-1);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl max-h-[85vh] p-0 gap-0 flex flex-col overflow-hidden [&>*]:min-w-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 pr-12 border-b">
          <DialogTitle className="text-section-title flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {currentStep === -1 ? `Welcome to ${spaceName}!` : `Set up ${spaceName}`}
          </DialogTitle>
          {currentStep >= 0 && (
            <div className="flex items-center gap-1 mt-3">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 h-1.5 rounded-full transition-all duration-300",
                    i === currentStep
                      ? "bg-primary"
                      : i < currentStep
                      ? "bg-primary/40"
                      : "bg-muted"
                  )}
                />
              ))}
            </div>
          )}
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div
            className={cn(
              "transition-all duration-300 ease-in-out px-6 py-5",
              direction === "forward" ? "animate-in slide-in-from-right-4 fade-in" : "animate-in slide-in-from-left-4 fade-in"
            )}
            key={currentStep}
          >
            {currentStep === -1 && (
              <WelcomeScreen spaceName={spaceName} onJumpToStep={(step) => { setDirection("forward"); setCurrentStep(step); }} />
            )}
            {currentStep === 0 && (
              <SetupBranding
                avatar={avatar} setAvatar={setAvatar}
                banner={banner} setBanner={setBanner}
                tags={tags} setTags={setTags}
                currentTag={currentTag} setCurrentTag={setCurrentTag}
                handleTagKeyDown={handleTagKeyDown}
              />
            )}
            {currentStep === 1 && (
              <SetupPurpose why={why} setWhy={setWhy} who={who} setWho={setWho} />
            )}
            {currentStep === 2 && (
              <SetupAccess
                visibility={visibility} setVisibility={setVisibility}
                membershipMode={membershipMode} setMembershipMode={setMembershipMode}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t bg-muted/20">
          <div className="flex items-center justify-between w-full">
            <div>
              {currentStep >= 0 && (
                <Button variant="ghost" size="sm" className="gap-1 px-2" onClick={goBack}>
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={handleSkipAll}>
                {currentStep === -1 ? "Skip, I'll do it later" : "Skip remaining"}
              </Button>
              {currentStep === -1 && (
                <Button onClick={handleStart}>
                  Let's set it up →
                </Button>
              )}
              {currentStep >= 0 && currentStep < steps.length - 1 && (
                <Button onClick={goForward}>
                  Next →
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button onClick={goForward}>
                  Done ✓
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Welcome Screen
   ═══════════════════════════════════════════════════════════════════════════════ */

function WelcomeScreen({ spaceName, onJumpToStep }: { spaceName: string; onJumpToStep: (step: number) => void }) {
  return (
    <div className="flex flex-col items-center text-center gap-5 py-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">Your space is ready!</h3>
        <p className="text-body text-muted-foreground mt-2">
          Would you like to personalize it now? You can add branding, describe its purpose, and set up access controls.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full text-left">
        <button
          onClick={() => onJumpToStep(0)}
          className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border hover:bg-muted/50 hover:border-primary/30 transition-colors cursor-pointer text-left"
        >
          <Palette className="w-5 h-5 text-violet-500" />
          <div>
            <p className="text-body-emphasis">Branding</p>
            <p className="text-caption text-muted-foreground">Avatar, banner & tags</p>
          </div>
        </button>
        <button
          onClick={() => onJumpToStep(1)}
          className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border hover:bg-muted/50 hover:border-primary/30 transition-colors cursor-pointer text-left"
        >
          <Target className="w-5 h-5 text-amber-500" />
          <div>
            <p className="text-body-emphasis">Purpose</p>
            <p className="text-caption text-muted-foreground">Why this space exists & who it's for</p>
          </div>
        </button>
        <button
          onClick={() => onJumpToStep(2)}
          className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border hover:bg-muted/50 hover:border-primary/30 transition-colors cursor-pointer text-left"
        >
          <Users className="w-5 h-5 text-emerald-500" />
          <div>
            <p className="text-body-emphasis">Access</p>
            <p className="text-caption text-muted-foreground">Visibility & how people join</p>
          </div>
        </button>
      </div>
      <p className="text-caption text-muted-foreground">
        All of this can be changed anytime in Space Settings.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Setup: Branding
   ═══════════════════════════════════════════════════════════════════════════════ */

function SetupBranding({
  avatar, setAvatar,
  banner, setBanner,
  tags, setTags,
  currentTag, setCurrentTag,
  handleTagKeyDown,
}: {
  avatar: string | null; setAvatar: (v: string | null) => void;
  banner: string | null; setBanner: (v: string | null) => void;
  tags: string[]; setTags: (v: string[]) => void;
  currentTag: string; setCurrentTag: (v: string) => void;
  handleTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Make it visually yours</h3>
        <p className="text-caption text-muted-foreground mt-1">All optional — you can add these later in settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
        {/* Avatar */}
        <div
          className={cn(
            "relative rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-3 min-h-[160px] cursor-pointer transition-all duration-200 group",
            avatar
              ? "border-primary/30 bg-primary/5"
              : "border-muted-foreground/20 hover:border-primary/40 hover:bg-accent/50"
          )}
          onClick={() => setAvatar(avatar ? null : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop")}
        >
          {avatar ? (
            <>
              <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-xl object-cover ring-2 ring-primary/20" />
              <p className="text-caption text-primary font-medium">Click to change</p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
              <ImageIcon className="w-8 h-8" />
              <p className="text-body-emphasis">Avatar</p>
              <p className="text-caption">200 × 200px</p>
            </div>
          )}
        </div>

        {/* Banner */}
        <div
          className={cn(
            "relative rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-3 min-h-[160px] cursor-pointer transition-all duration-200 group",
            banner
              ? "border-primary/30 bg-primary/5"
              : "border-muted-foreground/20 hover:border-primary/40 hover:bg-accent/50"
          )}
          onClick={() => setBanner(banner ? null : "https://images.unsplash.com/photo-1548728560-b6adb671a69f?w=400&h=200&fit=crop")}
        >
          {banner ? (
            <>
              <img src={banner} alt="Banner" className="max-h-16 rounded-lg object-cover ring-1 ring-primary/20" />
              <p className="text-caption text-primary font-medium">Click to change</p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
              <ImageIcon className="w-8 h-8" />
              <p className="text-body-emphasis">Banner</p>
              <p className="text-caption">1920 × 400px</p>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1 py-1.5 px-3">
                {tag}
                <button onClick={() => setTags(tags.filter((t) => t !== tag))} className="hover:text-destructive ml-1">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <Input
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="Add tags — type and press Enter"
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Setup: Purpose
   ═══════════════════════════════════════════════════════════════════════════════ */

function SetupPurpose({
  why, setWhy,
  who, setWho,
}: {
  why: string; setWhy: (v: string) => void;
  who: string; setWho: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">What's the purpose?</h3>
        <p className="text-caption text-muted-foreground mt-1">Help people understand why this space exists.</p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-body-emphasis">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          Why does this space exist?
        </div>
        <MarkdownEditor
          value={why}
          onChange={setWhy}
          placeholder="e.g. We believe collaboration is key to solving climate challenges..."
          minHeight="80px"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-body-emphasis">
          <UsersRound className="w-4 h-4 text-blue-500" />
          Who is this for?
        </div>
        <MarkdownEditor
          value={who}
          onChange={setWho}
          placeholder="e.g. Engineers, designers, and researchers passionate about sustainability..."
          minHeight="80px"
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Setup: Access
   ═══════════════════════════════════════════════════════════════════════════════ */

function SetupAccess({
  visibility, setVisibility,
  membershipMode, setMembershipMode,
}: {
  visibility: string; setVisibility: (v: string) => void;
  membershipMode: string; setMembershipMode: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Who can see and join?</h3>
        <p className="text-caption text-muted-foreground mt-1">You can change this anytime in settings.</p>
      </div>

      {/* Visibility */}
      <RadioGroup value={visibility} onValueChange={setVisibility} className="grid grid-cols-2 gap-3">
        <label
          className={cn(
            "flex flex-col items-center gap-3 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center",
            visibility === "public"
              ? "border-primary bg-primary/5"
              : "border-muted hover:border-muted-foreground/30"
          )}
        >
          <Globe className={cn("w-6 h-6", visibility === "public" ? "text-primary" : "text-muted-foreground")} />
          <div>
            <p className="text-body-emphasis">Public</p>
            <p className="text-caption text-muted-foreground">Anyone can discover and view</p>
          </div>
          <RadioGroupItem value="public" className="sr-only" />
        </label>
        <label
          className={cn(
            "flex flex-col items-center gap-3 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center",
            visibility === "private"
              ? "border-primary bg-primary/5"
              : "border-muted hover:border-muted-foreground/30"
          )}
        >
          <Lock className={cn("w-6 h-6", visibility === "private" ? "text-primary" : "text-muted-foreground")} />
          <div>
            <p className="text-body-emphasis">Private</p>
            <p className="text-caption text-muted-foreground">Only members can see</p>
          </div>
          <RadioGroupItem value="private" className="sr-only" />
        </label>
      </RadioGroup>

      {/* Membership Mode */}
      <div className="flex flex-col gap-2">
        <p className="text-body-emphasis">How can people join?</p>
        <RadioGroup value={membershipMode} onValueChange={setMembershipMode} className="flex flex-col gap-2">
          <label
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
              membershipMode === "open" ? "border-primary bg-primary/5" : "hover:border-muted-foreground/30"
            )}
          >
            <RadioGroupItem value="open" />
            <span className="text-body-emphasis">Open</span>
            <span className="text-caption text-muted-foreground">— anyone can join</span>
          </label>
          <label
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
              membershipMode === "application" ? "border-primary bg-primary/5" : "hover:border-muted-foreground/30"
            )}
          >
            <RadioGroupItem value="application" />
            <span className="text-body-emphasis">By application</span>
            <span className="text-caption text-muted-foreground">— you approve each request</span>
          </label>
          <label
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
              membershipMode === "invite" ? "border-primary bg-primary/5" : "hover:border-muted-foreground/30"
            )}
          >
            <RadioGroupItem value="invite" />
            <span className="text-body-emphasis">Invite only</span>
            <span className="text-caption text-muted-foreground">— personal invitation needed</span>
          </label>
        </RadioGroup>
      </div>
    </div>
  );
}
