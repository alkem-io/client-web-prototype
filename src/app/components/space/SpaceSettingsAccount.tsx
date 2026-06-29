import { useState } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  Shield,
  CreditCard,
  AlertTriangle,
  Activity,
  Building,
  Trash2,
  Link
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { toast } from "sonner";
import { SettingsSection } from "@/app/components/shared/SettingsSection";

export function SpaceSettingsAccount() {
  const [copied, setCopied] = useState(false);
  const spaceUrl = "https://alkem.io/green-energy";

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(spaceUrl);
      setCopied(true);
      toast.success("URL copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* ── URL ── */}
      <SettingsSection
        title="Space URL"
        icon={<Link className="w-4 h-4" />}
        iconColor="blue"
        collapsible={false}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              value={spaceUrl}
              readOnly
              className="bg-muted/20 font-mono text-body"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyUrl}
              className="shrink-0"
              title="Copy URL"
            >
              {copied ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-caption text-muted-foreground">
            Contact Alkemio to change this URL.
          </p>
        </div>
      </SettingsSection>

      {/* ── License ── */}
      <SettingsSection
        title="License"
        icon={<CreditCard className="w-4 h-4" />}
        iconColor="purple"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-3 py-1 font-semibold text-primary bg-primary/10">
              Plus Plan
            </Badge>
          </div>
          <ul className="space-y-2 text-body">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success shrink-0" />
              <span>Up to 50 active members</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success shrink-0" />
              <span>Advanced whiteboard tools</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success shrink-0" />
              <span>5GB Storage per space</span>
            </li>
          </ul>
          <div className="flex items-center gap-3 pt-2">
            <Button variant="outline" size="sm" className="gap-1.5" asChild>
              <a href="#">
                Change License
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
            <a href="#" className="text-caption text-muted-foreground hover:text-primary underline underline-offset-4">
              Learn more about plans
            </a>
          </div>
        </div>
      </SettingsSection>

      {/* ── Visibility Status ── */}
      <SettingsSection
        title="Visibility Status"
        icon={<Activity className="w-4 h-4" />}
        iconColor="green"
        collapsible={false}
      >
        <div className="flex items-center gap-2">
          <span className="text-body">This Space is currently</span>
          <Badge className="bg-primary/15 text-primary hover:bg-primary/25 border-primary/20">
            Active
          </Badge>
        </div>
        <p className="text-caption text-muted-foreground mt-2">
          For status changes, contact the Alkemio team.
        </p>
      </SettingsSection>

      {/* ── Host Information ── */}
      <SettingsSection
        title="Host"
        icon={<Shield className="w-4 h-4" />}
        iconColor="orange"
      >
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 border">
            <AvatarImage
              src="https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100"
              alt="Alkemio Innovation"
            />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <p className="text-card-title">Alkemio Innovation</p>
            <div className="flex items-center gap-1.5 text-body text-muted-foreground">
              <Building className="w-3.5 h-3.5" />
              <span>Organization</span>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* ── Danger Zone ── */}
      <SettingsSection
        title="Danger Zone"
        icon={<AlertTriangle className="w-4 h-4" />}
        iconColor="rose"
        defaultOpen={false}
        className="border-destructive/40"
      >
        <div className="space-y-3">
          <p className="text-body text-muted-foreground">
            Permanently delete this space and all its content. This action cannot be undone.
          </p>
          <Button variant="destructive" size="sm" className="gap-2">
            <Trash2 className="w-4 h-4" />
            Delete Space
          </Button>
        </div>
      </SettingsSection>

      {/* ── Support Footer ── */}
      <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-muted/30 border border-dashed text-center space-y-3">
        <p className="text-body text-muted-foreground">
          Need help with any of these settings?
        </p>
        <Button variant="default" size="sm" className="gap-2">
          Contact Alkemio Support
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
