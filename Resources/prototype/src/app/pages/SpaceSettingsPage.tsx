import {
  Bookmark,
  HardDrive,
  Info,
  Layers,
  LayoutGrid,
  Megaphone,
  Settings as SettingsIcon,
  UserCircle,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams } from "react-router";
import { SpaceSettingsAbout } from "@/app/components/space/SpaceSettingsAbout";
import { SpaceSettingsLayout } from "@/app/components/space/SpaceSettingsLayout";
import { SpaceSettingsCommunity } from "@/app/components/space/SpaceSettingsCommunity";
import { SpaceSettingsUpdates } from "@/app/components/space/SpaceSettingsUpdates";
import { SpaceSettingsSubspaces } from "@/app/components/space/SpaceSettingsSubspaces";
import { SpaceSettingsTemplates } from "@/app/components/space/SpaceSettingsTemplates";
import { SpaceSettingsStorage } from "@/app/components/space/SpaceSettingsStorage";
import { SpaceSettingsTab } from "@/app/components/space/settings/SpaceSettingsTab";
import { SpaceAccountTab } from "@/app/components/space/settings/SpaceAccountTab";
import { SpaceSettingsHeader } from "@/crd/components/space/settings/SpaceSettingsHeader";
import {
  type SpaceSettingsTabDescriptor,
  SpaceSettingsTabStrip,
} from "@/crd/components/space/settings/SpaceSettingsTabStrip";
import { SpaceShell } from "@/crd/layouts/SpaceShell";
import { getInitials } from "@/crd/lib/getInitials";

interface SpaceData {
  name: string;
  bannerImage: string;
  description: string;
}

const SPACE_DATA: Record<string, SpaceData> = {
  "green-energy": { name: "Green Energy Space", bannerImage: "https://images.unsplash.com/photo-1690191863988-f685cddde463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBjaGFsbGVuZ2UlMjBjcmVhdGl2ZSUyMHdvcmtzaG9wJTIwdGVhbSUyMGNvbGxhYm9yYXRpb24lMjBpbm5vdmF0aW9uJTIwc3ByaW50JTIwZGVzaWduJTIwc3ByaW50fGVufDF8fHx8MTc2OTA5NDMxMHww&ixlib=rb-4.1.0&q=80&w=400", description: "Accelerating the transition to sustainable energy systems worldwide." },
  "sustainability-lab": { name: "Sustainability Lab", bannerImage: "https://images.unsplash.com/photo-1623652554515-91c833e3080e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsYWJvcmF0aW9uJTIwdGVhbXdvcmslMjBpbm5vdmF0aW9uJTIwZGVzaWduJTIwdGhpbmtpbmclMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NjkwODc1ODd8MA&ixlib=rb-4.1.0&q=80&w=400", description: "Experimenting with innovative approaches to environmental sustainability." },
  "urban-mobility": { name: "Urban Mobility Lab", bannerImage: "https://images.unsplash.com/photo-1735639013995-086e648eaa38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFpbnN0b3JtaW5nJTIwY3JlYXRpdmUlMjB3b3Jrc2hvcCUyMHRlYW18ZW58MXx8fHwxNzY5MDg3NTg3fDA&ixlib=rb-4.1.0&q=80&w=400", description: "Reimagining city transportation for better accessibility and lower emissions." },
  "community-garden": { name: "Community Garden", bannerImage: "https://images.unsplash.com/photo-1768659347532-74d3b1efb0ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBtZWV0aW5nJTIwY29sbGFib3JhdGlvbiUyMHRlYW18ZW58MXx8fHwxNzY5MDg3NTg3fDA&ixlib=rb-4.1.0&q=80&w=400", description: "Growing food and community connections in urban neighborhoods." },
  "innovation-lab": { name: "Innovation Lab", bannerImage: "https://images.unsplash.com/photo-1676276376052-dc9c9c0b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbm5vdmF0aW9uJTIwbGFiJTIwdGVhbXdvcmslMjBtb2Rlcm4lMjBvZmZpY2V8ZW58MXx8fHwxNzY5MDg3NTg2fDA&ixlib=rb-4.1.0&q=80&w=400", description: "A collaborative space for breakthrough ideas and rapid experimentation." },
};

function getSpaceData(slug: string): SpaceData {
  return (
    SPACE_DATA[slug] || {
      name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      bannerImage: "",
      description: "A collaborative space for innovation.",
    }
  );
}

/** Production's tab order. */
const TABS = [
  { id: "about", icon: Info },
  { id: "layout", icon: LayoutGrid },
  { id: "community", icon: Users },
  { id: "updates", icon: Megaphone },
  { id: "subspaces", icon: Layers },
  { id: "templates", icon: Bookmark },
  { id: "storage", icon: HardDrive },
  { id: "settings", icon: SettingsIcon },
  { id: "account", icon: UserCircle },
] as const;

type TabId = (typeof TABS)[number]["id"];

const isTabId = (value: string | undefined): value is TabId => TABS.some((tab) => tab.id === value);

function renderTab(tab: TabId) {
  switch (tab) {
    case "about":
      return <SpaceSettingsAbout />;
    case "layout":
      return <SpaceSettingsLayout />;
    case "community":
      return <SpaceSettingsCommunity />;
    case "updates":
      return <SpaceSettingsUpdates />;
    case "subspaces":
      return <SpaceSettingsSubspaces />;
    case "templates":
      return <SpaceSettingsTemplates />;
    case "storage":
      return <SpaceSettingsStorage />;
    case "settings":
      return <SpaceSettingsTab />;
    case "account":
      return <SpaceAccountTab />;
  }
}

/** Space settings, in production's shell: its header, its tab strip and its tab order. */
export function SpaceSettingsPage() {
  const { spaceSlug = "", tab } = useParams<{ spaceSlug: string; tab: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation("crd-spaceSettings");
  const space = getSpaceData(spaceSlug);

  if (!isTabId(tab)) {
    return <Navigate to={`/space/${spaceSlug}/settings/about`} replace />;
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
          title={space.name}
          titleHref={`/space/${spaceSlug}`}
          tagline={space.description}
          visual={{ src: space.bannerImage || undefined, initials: getInitials(space.name) }}
        />
      }
      tabs={
        <SpaceSettingsTabStrip
          activeTab={tab}
          onTabChange={(next) => navigate(`/space/${spaceSlug}/settings/${next}`)}
          tabs={tabs}
        />
      }
    >
      {/* Extra room at the bottom keeps the unsaved-changes bar off the last control. */}
      <div className="flex flex-col gap-4 pt-2 pb-24">{renderTab(tab)}</div>
    </SpaceShell>
  );
}
