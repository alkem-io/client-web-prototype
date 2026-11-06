import { Info, Layers, LayoutGrid, Megaphone, Settings as SettingsIcon, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams } from "react-router";
import { SpaceAboutTab } from "@/app/components/space/settings/SpaceAboutTab";
import { SubspaceSettingsLayout } from "@/app/components/space/SubspaceSettingsLayout";
import { SubspaceSettingsCommunity } from "@/app/components/space/SubspaceSettingsCommunity";
import { SubspaceSettingsUpdates } from "@/app/components/space/SubspaceSettingsUpdates";
import { SubspaceSettingsSubspaces } from "@/app/components/space/SubspaceSettingsSubspaces";
import { SubspaceSettingsSettings } from "@/app/components/space/SubspaceSettingsSettings";
import {
  buildNestedSubspaces,
  buildSubspaceAbout,
  buildSubspacePhases,
  DEMO_SUBSPACE_COMMUNITY,
  DEMO_SUBSPACE_UPDATES,
  getSubspaceProfile,
  type SubspaceProfile,
} from "@/app/components/space/settings/subspaceDemoData";
import { SpaceSettingsHeader } from "@/crd/components/space/settings/SpaceSettingsHeader";
import {
  type SpaceSettingsTabDescriptor,
  SpaceSettingsTabStrip,
} from "@/crd/components/space/settings/SpaceSettingsTabStrip";
import { SpaceShell } from "@/crd/layouts/SpaceShell";

/** Production's tabs for a subspace, in its order: no Templates, Storage or Account. */
const TABS = [
  { id: "about", icon: Info },
  { id: "layout", icon: LayoutGrid },
  { id: "community", icon: Users },
  { id: "updates", icon: Megaphone },
  { id: "subspaces", icon: Layers },
  { id: "settings", icon: SettingsIcon },
] as const;

type TabId = (typeof TABS)[number]["id"];

const isTabId = (value: string | undefined): value is TabId => TABS.some((tab) => tab.id === value);

function renderTab(tab: TabId, profile: SubspaceProfile, base: string, parentHref: string) {
  // Each subspace keeps its own demo data.
  const scope = `subspace:${base}`;
  switch (tab) {
    case "about":
      return <SpaceAboutTab level="L1" scope={scope} initial={() => buildSubspaceAbout(profile)} href={base} />;
    case "layout":
      return <SubspaceSettingsLayout />;
    case "community":
      return <SubspaceSettingsCommunity />;
    case "updates":
      return <SubspaceSettingsUpdates />;
    case "subspaces":
      return <SubspaceSettingsSubspaces />;
    case "settings":
      return <SubspaceSettingsSettings subspaceName={profile.title} />;
  }
}

/** Subspace settings, in production's shell: its header, its tab strip and its tab order. */
export default function SubspaceSettingsPage() {
  const { spaceSlug = "", subspaceSlug = "", tab } = useParams<{
    spaceSlug: string;
    subspaceSlug: string;
    tab: string;
  }>();
  const navigate = useNavigate();
  const { t } = useTranslation("crd-spaceSettings");
  const profile = getSubspaceProfile(subspaceSlug);
  const base = `/space/${spaceSlug}/subspaces/${subspaceSlug}`;

  if (!isTabId(tab)) {
    return <Navigate to={`${base}/settings/about`} replace />;
  }

  const tabs: ReadonlyArray<SpaceSettingsTabDescriptor<TabId>> = TABS.map(({ id, icon }) => ({
    id,
    icon,
    label: t(`tabs.${id}`),
  }));

  return (
    <SpaceShell
      header={
        <SpaceSettingsHeader
          title={profile.title}
          titleHref={base}
          tagline={profile.description}
          visual={{ src: profile.avatarImage, initials: profile.initials }}
        />
      }
      tabs={
        <SpaceSettingsTabStrip
          activeTab={tab}
          onTabChange={(next) => navigate(`${base}/settings/${next}`)}
          tabs={tabs}
        />
      }
    >
      {/* Extra room at the bottom keeps the unsaved-changes bar off the last control. */}
      <div className="flex flex-col gap-4 pt-2 pb-24">{renderTab(tab, profile, base, `/space/${spaceSlug}`)}</div>
    </SpaceShell>
  );
}
