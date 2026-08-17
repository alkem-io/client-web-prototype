import { useState } from "react";
import { Key, Shield, Eye, EyeOff, Trash2, Plus } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { SettingsSection } from "@/app/components/shared/SettingsSection";
import { toast } from "sonner";

export function UserSettingsSecurity() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChangePassword = () => {
    if (!password || !confirmPassword) return;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully");
    }, 800);
  };

  // Mock passkeys
  const passkeys = [
    { id: "1", name: "MacBook Pro Touch ID", createdAt: "2024-12-15" },
    { id: "2", name: "iPhone Face ID", createdAt: "2025-01-20" },
  ];

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <SettingsSection title="Change Password" icon={<Key className="w-4 h-4" />} iconColor="amber">
        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-body-emphasis block mb-1.5">New Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-body-emphasis block mb-1.5">Confirm New Password</label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={!password || !confirmPassword || isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? "Saving…" : "Update Password"}
          </Button>
        </div>
      </SettingsSection>

      {/* Passkeys & WebAuthn */}
      <SettingsSection title="Passkeys & WebAuthn" icon={<Shield className="w-4 h-4" />} iconColor="purple">
        <div className="space-y-3">
          {passkeys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-muted/20"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Key className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-body-emphasis truncate">{key.name}</p>
                  <p className="text-caption text-muted-foreground">Added {key.createdAt}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Passkey
          </Button>
        </div>
      </SettingsSection>
    </div>
  );
}
