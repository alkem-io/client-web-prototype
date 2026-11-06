import { DemoAccountTab } from "@/app/components/shared/DemoAccountTab";
import { DEMO_ORG_ACCOUNT, getDemoOrg } from "./demoOrg";

export function OrgAccountTab({ orgSlug }: { orgSlug: string }) {
  return (
    <DemoAccountTab
      scope="org"
      stateKey={`org.${orgSlug}.account`}
      seed={DEMO_ORG_ACCOUNT}
      accountName={getDemoOrg(orgSlug).displayName}
    />
  );
}
