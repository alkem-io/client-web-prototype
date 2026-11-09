import { DigitalSigningSettingsSection } from "@/ahead/DigitalSigningSettingsSection";
import { UserSecurityTabView } from "@/crd/components/user/settings/UserSecurityTabView";
import { DemoApiKeys } from "./DemoApiKeys";
import { DemoConnectedAccounts } from "./DemoConnectedAccounts";
import { DemoPasskeys, DemoPasswordForm } from "./DemoSecurityForms";

export function UserSecurityTab() {
  return (
    <div className="space-y-6">
      <UserSecurityTabView
        state={{ kind: "ready", hasPassword: true, hasWebauthn: true }}
        passwordForm={<DemoPasswordForm />}
        webauthnForm={<DemoPasskeys />}
        mcpApiKeysCard={<DemoApiKeys />}
        connectedAccountsSection={<DemoConnectedAccounts />}
      />
      <DigitalSigningSettingsSection />
    </div>
  );
}
