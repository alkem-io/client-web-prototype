import { Eye, EyeOff, Key, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDemoState } from "@/app/components/shared/useDemoState";
import { Button } from "@/crd/primitives/button";
import { Input } from "@/crd/primitives/input";

/**
 * Production fills these two slots of the Security tab with forms from its sign-in
 * service, which the prototype does not have. These stand in for them.
 */
function PasswordField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label className="text-body-emphasis block mb-1.5">
        {label}
        <div className="relative mt-1.5">
          <Input
            type={visible ? "text" : "password"}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="pr-10"
          />
          <button
            type="button"
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </label>
    </div>
  );
}

export function DemoPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [saving, setSaving] = useState(false);

  const save = () => {
    if (password !== confirmation) {
      toast.error("Passwords do not match");
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setPassword("");
      setConfirmation("");
      toast.success("Password updated successfully");
    }, 800);
  };

  return (
    <div className="space-y-4 max-w-md">
      <PasswordField
        label="New Password"
        placeholder="Enter new password"
        value={password}
        onChange={setPassword}
      />
      <PasswordField
        label="Confirm New Password"
        placeholder="Confirm new password"
        value={confirmation}
        onChange={setConfirmation}
      />
      <Button onClick={save} disabled={!password || !confirmation || saving} className="w-full sm:w-auto">
        {saving ? "Saving…" : "Update Password"}
      </Button>
    </div>
  );
}

const SEED_PASSKEYS = [
  { id: "1", name: "MacBook Pro Touch ID", createdAt: "2024-12-15" },
  { id: "2", name: "iPhone Face ID", createdAt: "2025-01-20" },
];

export function DemoPasskeys() {
  const [passkeys, setPasskeys] = useDemoState("user.passkeys", SEED_PASSKEYS);

  return (
    <div className="space-y-3">
      {passkeys.map((key) => (
        <div key={key.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-muted/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-8 rounded-md bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Key className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-body-emphasis truncate">{key.name}</p>
              <p className="text-caption text-muted-foreground">Added {key.createdAt}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Remove ${key.name}`}
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => setPasskeys(passkeys.filter((other) => other.id !== key.id))}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          setPasskeys([
            ...passkeys,
            { id: String(Date.now()), name: "This device", createdAt: new Date().toISOString().slice(0, 10) },
          ])
        }
      >
        <Plus className="size-4 mr-1.5" />
        Add Passkey
      </Button>
    </div>
  );
}
