import type { FormEvent } from "react";
import { useState } from "react";
import { flushSync } from "react-dom";
import { useDemoState } from "@/app/components/shared/useDemoState";
import {
  type ConnectedAccountsFlowMessage,
  type ConnectedAccountsProviderRow,
  ConnectedAccountsView,
} from "@/crd/components/user/settings/ConnectedAccountsView";

type Provider = { id: string; name: string; connected: boolean };

const SEED_PROVIDERS: Provider[] = [
  { id: "google", name: "Google", connected: true },
  { id: "microsoft", name: "Microsoft", connected: false },
  { id: "linkedin", name: "LinkedIn", connected: false },
];

const toRow = ({ id, name, connected }: Provider): ConnectedAccountsProviderRow => ({
  providerId: id,
  displayName: name,
  state: connected ? "connected" : "not-connected",
  action: {
    kind: connected ? "unlink" : "link",
    // Never actually sent: see `onSubmitCapture` and `onProviderActionSubmit` below.
    formAction: window.location.pathname,
    method: "GET",
    csrf: { name: "demo", value: "demo" },
    submitName: connected ? "unlink" : "link",
    submitValue: id,
  },
});

/**
 * Production's Connected Accounts view against local demo providers.
 *
 * In production each row is a real form that sends the browser to the sign-in service.
 * Here there is no such service, and a page reload would also clear the in-memory demo
 * state (the Cleverbase link among it), so both ways out are caught:
 * - Connect: the submit is stopped on its way down to the row.
 * - Disconnect: after its confirmation the view calls `onProviderActionSubmit` and then
 *   submits the row's form directly, an event nothing can catch. Removing the row's
 *   form during that callback leaves the view nothing to submit.
 */
export function DemoConnectedAccounts() {
  const [providers, setProviders] = useDemoState("user.connectedAccounts", SEED_PROVIDERS);
  const [messages, setMessages] = useState<ConnectedAccountsFlowMessage[]>([]);
  const [unmounting, setUnmounting] = useState<string | null>(null);

  const setConnected = (id: string, connected: boolean) => {
    const name = providers.find((provider) => provider.id === id)?.name ?? "";
    setProviders(providers.map((provider) => (provider.id === id ? { ...provider, connected } : provider)));
    setMessages([{ id: Date.now(), type: "success", text: `${name} ${connected ? "connected" : "disconnected"}` }]);
  };

  const onSubmitCapture = (event: FormEvent<HTMLDivElement>) => {
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    if (submitter?.name !== "link") return;
    event.preventDefault();
    event.stopPropagation();
    setConnected(submitter.value, true);
  };

  const rows = providers.map(toRow).map((row) =>
    row.providerId === unmounting ? { ...row, action: null } : row
  );

  return (
    <div onSubmitCapture={onSubmitCapture}>
      <ConnectedAccountsView
        status="ready"
        onRetry={() => {}}
        providers={rows}
        credentials={[
          { kind: "password", present: true, manageHref: "#password" },
          { kind: "passkey", present: true, manageHref: "#passkeys" },
        ]}
        messages={messages}
        onProviderActionSubmit={(row) => {
          flushSync(() => setUnmounting(row.providerId));
          setUnmounting(null);
          setConnected(row.providerId, false);
        }}
      />
    </div>
  );
}
