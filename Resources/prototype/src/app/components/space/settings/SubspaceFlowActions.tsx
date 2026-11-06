import { PanelLeft, Replace, Upload } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  loadSubspaceSidebarWidgets,
  normalizeConfig,
  saveSubspaceSidebarWidgets,
  SUBSPACE_WIDGET_DEFS,
} from '@/app/components/space/SidebarWidgets';
import { GatedAction } from '@/crd/components/common/GatedAction';
import {
  type ApplyFlowOptions,
  CrdApplySpaceTemplateDialog,
} from '@/crd/components/space/innovationFlow/CrdApplySpaceTemplateDialog';
import { PhaseLayoutDialog } from '@/crd/components/space/settings/PhaseLayoutDialog';
import {
  type LayoutPoolColumn,
  SIDEBAR_WIDGET_IDS_BY_LEVEL,
  type SidebarWidgetId,
} from '@/crd/components/space/settings/SpaceSettingsLayoutView.types';
import { Button } from '@/crd/primitives/button';
import { demoDelay, useDemoState } from './demoState';
import { DemoTemplatePicker } from './DemoTemplatePicker';
import { fromProductionWidgets, type LayoutBoard, toProductionWidgets } from './SpaceLayoutTab';
import { TemplateEditorDialog } from './TemplateEditorDialog';
import { flowToTemplateContent } from './subspaceDemoData';
import { type DemoTemplate, useDemoTemplates } from './templatesDemo';

/**
 * Our subspace widgets and the production widget each corresponds to. As on the
 * space Layout tab, `tags` is missing from production's list because its Search
 * widget includes tag chips, so Search here switches on both of ours.
 */
const WIDGET_TO_PRODUCTION: Record<string, SidebarWidgetId> = {
  intent: 'intent',
  post: 'createPost',
  inviteUser: 'addUser',
  createSubspace: 'createSubspace',
  search: 'search',
  tags: 'search',
  subspaceLinks: 'subspaceLinks',
  community: 'community',
  events: 'events',
  index: 'index',
};

const storedWidgets = () => toProductionWidgets(loadSubspaceSidebarWidgets(), WIDGET_TO_PRODUCTION);

const postCount = (columns: LayoutPoolColumn[]) => columns.reduce((total, column) => total + column.callouts.length, 0);

/** Builds the new flow from a template, keeping or dropping the current posts as the admin chose. */
const applyTemplate = (columns: LayoutPoolColumn[], template: DemoTemplate, options: ApplyFlowOptions) => {
  if (template.content.type !== 'space' || template.content.phases.length === 0) return columns;
  const { phases, starterCallouts } = template.content;
  const stamp = Date.now();
  const next: LayoutPoolColumn[] = phases.map((phase, index) => ({
    id: `phase-${stamp}-${index}`,
    title: phase.name,
    description: phase.description ?? '',
    isCurrentPhase: index === 0,
    isHidden: false,
    isDeletable: true,
    layout: { descriptionCollapsed: false, showPublishDetails: true, sidebar: [] },
    defaultCalloutTemplate: null,
    callouts: [],
  }));
  const place = (phaseName: string | undefined, callout: LayoutPoolColumn['callouts'][number]) => {
    const target = next.find(column => column.title === phaseName) ?? next[0];
    target.callouts.push({ ...callout, flowStateTagsetId: target.id });
  };
  // Production's dialog promises that existing posts are grouped under the first phase.
  if (!options.deleteExistingCallouts) {
    columns.forEach(column => column.callouts.forEach(callout => place(undefined, callout)));
  }
  if (options.addCallouts) {
    starterCallouts.forEach((callout, index) =>
      place(callout.flowStateName, {
        id: `post-${stamp}-${index}`,
        title: callout.name,
        description: callout.description ?? '',
        flowStateTagsetId: '',
        profileUrl: `#post-${stamp}-${index}`,
      })
    );
  }
  return next;
};

/**
 * The header actions of a subspace's Layout tab: production's Customize Sidebar
 * and Replace flow, and our Save Flow as Template. A subspace has one sidebar for
 * all its phases, saved straight away, independently of the unsaved-changes bar.
 */
export function SubspaceFlowActions({ board, scope }: { board: LayoutBoard; scope: string }) {
  const { t } = useTranslation('crd-spaceSettings');
  const { columns, hasUnsavedChanges, replaceColumns, setReplacing } = board;
  const [, setTemplates] = useDemoTemplates();
  const [sidebar, setSidebar] = useDemoState<SidebarWidgetId[]>(`${scope}:sidebar`, storedWidgets);
  const [sidebarOpenCount, setSidebarOpenCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [chosenTemplate, setChosenTemplate] = useState<DemoTemplate | null>(null);
  const [savingAsTemplate, setSavingAsTemplate] = useState<number | null>(null);

  const saveSidebar = async (next: SidebarWidgetId[]) => {
    setSidebar(next);
    saveSubspaceSidebarWidgets(fromProductionWidgets(next, WIDGET_TO_PRODUCTION, SUBSPACE_WIDGET_DEFS));
  };

  const confirmReplace = async (options: ApplyFlowOptions) => {
    if (!chosenTemplate) return;
    const template = chosenTemplate;
    setChosenTemplate(null);
    setReplacing(true);
    await demoDelay(800);
    replaceColumns(applyTemplate(columns, template, options));
    // Production's dialog warns that a template brings its own sidebar. Ours carry none,
    // so the default sidebar comes back.
    const defaults = toProductionWidgets(normalizeConfig(null, SUBSPACE_WIDGET_DEFS), WIDGET_TO_PRODUCTION);
    void saveSidebar(defaults);
    setReplacing(false);
  };

  return (
    <>
      <Button type="button" variant="outline" size="sm" className="gap-2 shrink-0" onClick={() => setSavingAsTemplate(Date.now())}>
        <Upload aria-hidden="true" className="size-4" />
        Save Flow as Template
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2 shrink-0"
        onClick={() => {
          setSidebarOpenCount(count => count + 1);
          setSidebarOpen(true);
        }}
      >
        <PanelLeft aria-hidden="true" className="size-4" />
        {t('layout.customizeSidebar.button')}
      </Button>
      <GatedAction disabledReason={hasUnsavedChanges ? t('saveBar.lockedReason') : undefined}>
        <Button type="button" variant="outline" size="sm" className="gap-2 shrink-0" onClick={() => setPickerOpen(true)}>
          <Replace aria-hidden="true" className="size-4" />
          {t('layout.replaceFlow.button')}
        </Button>
      </GatedAction>

      <PhaseLayoutDialog
        key={sidebarOpenCount}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        phaseName=""
        values={{ descriptionCollapsed: false, showPublishDetails: true, sidebar }}
        onSave={values => saveSidebar(values.sidebar)}
        sidebarOnly={true}
        availableWidgets={SIDEBAR_WIDGET_IDS_BY_LEVEL.L1}
        subspace={true}
      />

      {/* Mounted on opening, so it offers a flow that was only just saved as a template. */}
      {pickerOpen && (
        <DemoTemplatePicker
          open={true}
          onClose={() => setPickerOpen(false)}
          allowedTypes={['space']}
          onSelect={setChosenTemplate}
        />
      )}
      <CrdApplySpaceTemplateDialog
        open={chosenTemplate !== null}
        onClose={() => setChosenTemplate(null)}
        onConfirm={options => void confirmReplace(options)}
        existingCalloutsCount={postCount(columns)}
        showSidebarNote={true}
      />

      {savingAsTemplate !== null && (
        <TemplateEditorDialog
          key={savingAsTemplate}
          intent="create"
          type="space"
          template={{
            card: { id: '', type: 'space', name: '', description: '', tags: [], color: '' },
            content: flowToTemplateContent(columns),
          }}
          onCancel={() => setSavingAsTemplate(null)}
          onSubmit={template => {
            setTemplates(previous => [...previous, template]);
            setSavingAsTemplate(null);
            toast.success('Saved to the top-level space’s templates.');
          }}
        />
      )}
    </>
  );
}
