/**
 * GemeenteDelers → "Databank praktijkvoorbeelden" tab.
 *
 * A space tab that lists the space's subspaces as rich initiative cards, with
 * faceted filtering on tags and classifications in the sidebar. Built from the
 * hi-fi mockup "Versie 4: Lees meer als pill".
 *
 * Production's pieces are used for everything that already exists: the page
 * layout (`SpaceShell`), banner + title (`SpaceHeader`), the tab row
 * (`SpaceNavigationTabs`), the welcome card with leads (`InfoBlock`), the
 * search box (`SearchField`) and the buttons. New here: the facet panel and the
 * initiative card, in `@/app/components/databank/`.
 *
 * Layout differs from the other space tabs on purpose: the sidebar sits inside
 * the page body (2 of 10 columns) rather than in the shell's sidebar column, so
 * that below 1024px it stacks above the results instead of disappearing.
 */
import { Activity, Info, Share2, Workflow } from 'lucide-react';
import { useNavigate } from 'react-router';
import { DatabankFilterPanel } from '@/app/components/databank/DatabankFilterPanel';
import { DatabankResults } from '@/app/components/databank/DatabankResults';
import { useDatabankFilters } from '@/app/components/databank/useDatabankFilters';
import { DATABANK_INITIATIVES, DATABANK_SPACE } from '@/app/data/databank-data';
import { SpaceHeader } from '@/crd/components/space/SpaceHeader';
import { SpaceNavigationTabs } from '@/crd/components/space/SpaceNavigationTabs';
import { InfoBlock } from '@/crd/components/space/sidebar/InfoBlock';
import { SpaceShell } from '@/crd/layouts/SpaceShell';
import { IconButton } from '@/crd/primitives/icon-button';

export const DATABANK_SPACE_PATH = '/space/gemeentedelers';
export const DATABANK_PATH = `${DATABANK_SPACE_PATH}/databank-praktijkvoorbeelden`;

const TABS = [
  { label: 'Alles over GemeenteDelers', href: DATABANK_SPACE_PATH },
  { label: 'Databank praktijkvoorbeelden', href: DATABANK_PATH },
];

/** Same treatment as production's `HeaderActionIcons` (28px, soft gray fill). */
const ACTION_ICON_CLASSES = 'size-7 bg-foreground/8 text-muted-foreground';

const ACTIONS = [
  { label: 'Over deze space', icon: Info },
  { label: 'Activiteit', icon: Activity },
  { label: 'Innovation flow', icon: Workflow },
  { label: 'Delen', icon: Share2 },
];

export default function DatabankPage() {
  const navigate = useNavigate();
  const filters = useDatabankFilters(DATABANK_INITIATIVES);

  const actionIcons = (
    <div className="flex shrink-0 items-center gap-0.5">
      {ACTIONS.map(({ label, icon: Icon }) => (
        <IconButton key={label} variant="ghost" className={ACTION_ICON_CLASSES} tooltipLabel={label}>
          <Icon className="size-3.5" aria-hidden="true" />
        </IconButton>
      ))}
    </div>
  );

  return (
    <SpaceShell
      header={
        <SpaceHeader
          title={DATABANK_SPACE.title}
          tagline={DATABANK_SPACE.tagline}
          bannerUrl={DATABANK_SPACE.bannerUrl}
          bannerAlt={DATABANK_SPACE.bannerAlt}
          bannerAspectRatio={6}
          actions={{ showInfo: true, showActivity: true, showShare: true }}
          overlayHeader={true}
        />
      }
      tabs={
        <SpaceNavigationTabs
          tabs={TABS.map((tab, index) => ({ label: tab.label, index, href: tab.href }))}
          activeIndex={1}
          onTabChange={index => navigate(TABS[index].href)}
          action={actionIcons}
        />
      }
    >
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-10">
        <aside aria-label="Space-info en filters" className="flex flex-col gap-4 lg:col-span-2">
          <InfoBlock description={DATABANK_SPACE.welcome} leads={DATABANK_SPACE.leads} />
          <DatabankFilterPanel filters={filters} />
        </aside>
        <div className="min-w-0 lg:col-span-8">
          <DatabankResults filters={filters} total={DATABANK_INITIATIVES.length} />
        </div>
      </div>
    </SpaceShell>
  );
}
