import { useState } from "react";
import { demoDelay, useDemoState } from "@/app/components/shared/useDemoState";
import type { McpApiKeyRevealData, McpApiKeyRowData } from "@/crd/components/user/settings/McpApiKeys.types";
import { McpApiKeyCreateDialog } from "@/crd/components/user/settings/McpApiKeyCreateDialog";
import { McpApiKeyRevealPanel } from "@/crd/components/user/settings/McpApiKeyRevealPanel";
import { McpApiKeysCard } from "@/crd/components/user/settings/McpApiKeysCard";

const SEED_KEYS: McpApiKeyRowData[] = [
  {
    id: "key-laptop",
    name: "Claude on my laptop",
    operations: ["read", "tools"],
    createdDate: new Date("2026-09-14"),
    expiresAt: new Date("2027-09-14"),
    lastUsedAt: new Date("2026-11-02"),
    lastUsedFromIp: "203.0.113.24",
    status: "active",
  },
  {
    id: "key-old",
    name: "Old reporting script",
    operations: ["read"],
    createdDate: new Date("2025-11-01"),
    expiresAt: new Date("2026-05-01"),
    lastUsedAt: undefined,
    lastUsedFromIp: undefined,
    status: "expired",
  },
];

/** Production's API keys card and its dialogs, working against local demo keys. */
export function DemoApiKeys() {
  const [keys, setKeys] = useDemoState("user.apiKeys", SEED_KEYS);
  const [revokingId, setRevokingId] = useState<string | undefined>();
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [reveal, setReveal] = useState<McpApiKeyRevealData | undefined>();

  return (
    <>
      <McpApiKeysCard
        loading={false}
        keys={keys}
        revokingId={revokingId}
        interruptedRevealKeyId={undefined}
        onCreate={() => setCreateOpen(true)}
        onRevoke={(key, options) => {
          setRevokingId(key.id);
          demoDelay(() => {
            setKeys((previous) =>
              previous.map((other) => (other.id === key.id ? { ...other, status: "revoked" as const } : other))
            );
            setRevokingId(undefined);
            if (options?.recreate) setCreateOpen(true);
          });
        }}
      />
      <McpApiKeyCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        submitting={creating}
        onCreate={({ name, operations, expiresAt }) => {
          setCreating(true);
          demoDelay(() => {
            const key: McpApiKeyRowData = {
              id: `key-${Date.now()}`,
              name,
              operations,
              createdDate: new Date(),
              expiresAt,
              lastUsedAt: undefined,
              lastUsedFromIp: undefined,
              status: "active",
            };
            setKeys((previous) => [key, ...previous]);
            setCreating(false);
            setCreateOpen(false);
            setReveal({ apiKey: `alk_demo_${Math.random().toString(36).slice(2, 18)}`, key });
          });
        }}
      />
      <McpApiKeyRevealPanel
        open={Boolean(reveal)}
        data={reveal}
        baseAddress={window.location.origin}
        onClose={() => setReveal(undefined)}
      />
    </>
  );
}
