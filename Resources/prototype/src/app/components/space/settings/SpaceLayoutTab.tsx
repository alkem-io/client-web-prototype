import { useMemo, useState, type ReactNode } from 'react';
import { PanelLeftClose } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import {
  loadSpaceSidebarWidgets,
  saveSpaceSidebarWidgets,
  SPACE_WIDGET_DEFS,
  type SidebarWidgetConfig,
} from '@/app/components/space/SidebarWidgets';
import { SettingsSection } from '@/crd/components/common/SettingsSection';
import { SpaceSettingsLayoutView } from '@/crd/components/space/settings/SpaceSettingsLayoutView';
import type {
  ColumnMenuActions,
  LayoutColumnId,
  LayoutPoolColumn,
  LayoutReorderTarget,
  LayoutSaveBarState,
  PhaseLayoutInput,
  SidebarWidgetId,
} from '@/crd/components/space/settings/SpaceSettingsLayoutView.types';
import { Switch } from '@/crd/primitives/switch';
import { demoMarkdownUpload, useDemoForm } from './demoState';
import { DemoTemplatePicker } from './DemoTemplatePicker';
import { TabSaveBar } from './TabSaveBar';

const COLLAPSE_POSTS_KEY = 'alkemio-collapse-posts';
const SIDEBAR_DEFAULT_KEY = 'alkemio-sidebar-default';

/**
 * Our sidebar widgets and the production widget each corresponds to. `tags` is
 * missing on purpose: production bundles tag chips into its Search widget, so
 * Search here switches on both of ours. Production's other widgets (updates,
 * contact leads, community, activity, guidelines, virtual contributors, apply
 * button) have no counterpart in our sidebar. Its editor still offers them, and
 * it has no prop to stop that here, so choosing them changes nothing for members.
 */
const WIDGET_TO_PRODUCTION: Record<string, SidebarWidgetId> = {
  about: 'about',
  intent: 'intent',
  post: 'createPost',
  addUser: 'addUser',
  createSubspace: 'createSubspace',
  search: 'search',
  tags: 'search',
  subspaceLinks: 'subspaceLinks',
  events: 'events',
  index: 'index',
};

export const toProductionWidgets = (config: SidebarWidgetConfig): SidebarWidgetId[] => [
  ...new Set(config.order.filter(key => config.enabled[key] && WIDGET_TO_PRODUCTION[key]).map(key => WIDGET_TO_PRODUCTION[key])),
];

export const fromProductionWidgets = (sidebar: SidebarWidgetId[]): SidebarWidgetConfig => {
  const chosen = sidebar.flatMap(id =>
    Object.keys(WIDGET_TO_PRODUCTION).filter(key => WIDGET_TO_PRODUCTION[key] === id)
  );
  const allKeys = SPACE_WIDGET_DEFS.map(def => def.key);
  return {
    order: [...chosen, ...allKeys.filter(key => !chosen.includes(key))],
    enabled: Object.fromEntries(allKeys.map(key => [key, chosen.includes(key)])),
  };
};

const BUILT_IN_TABS: Array<{ id: string; title: string; description: string; posts: string[] }> = [
  {
    id: 'home',
    title: 'Home',
    description: 'The main landing page for your space, showcasing highlights and pinned content.',
    posts: ['Welcome to the Sandbox', 'Backlog of Insanity', 'Project Kickoff Notes'],
  },
  {
    id: 'community',
    title: 'Community',
    description: 'Member directory and profiles associated with this space.',
    posts: ['Softmann Radio #1', 'Supreme Funk Playlist', 'Cosmic Bangherz'],
  },
  {
    id: 'subspaces',
    title: 'Subspaces',
    description: 'Child spaces and projects organized under this parent space.',
    posts: [],
  },
  {
    id: 'knowledge',
    title: 'Knowledge',
    description: 'Wiki, documentation, and shared resources for members.',
    posts: ['Design Research Knowledge'],
  },
];

const readCollapsePosts = () => {
  try {
    return localStorage.getItem(COLLAPSE_POSTS_KEY) === 'true';
  } catch {
    return false;
  }
};

const buildDemoColumns = (): LayoutPoolColumn[] => {
  const widgets = loadSpaceSidebarWidgets();
  const descriptionCollapsed = readCollapsePosts();
  return BUILT_IN_TABS.map((tab, index) => ({
    id: tab.id,
    title: tab.title,
    description: tab.description,
    isCurrentPhase: index === 0,
    isHidden: false,
    // Production protects the four built-in tabs of a top-level space from deletion.
    isDeletable: false,
    layout: { descriptionCollapsed, showPublishDetails: true, sidebar: toProductionWidgets(widgets[tab.id]) },
    defaultCalloutTemplate: null,
    callouts: tab.posts.map((title, postIndex) => ({
      id: `${tab.id}-${postIndex}`,
      title,
      description: '',
      flowStateTagsetId: tab.id,
      profileUrl: `#${tab.id}-${postIndex}`,
    })),
  }));
};

type LayoutValues = { columns: LayoutPoolColumn[]; startCollapsed: boolean };

const readStartCollapsed = () => {
  try {
    return localStorage.getItem(SIDEBAR_DEFAULT_KEY) === 'railed';
  } catch {
    return false;
  }
};

const moveCallout = (columns: LayoutPoolColumn[], calloutId: string, target: LayoutReorderTarget) => {
  const callout = columns.flatMap(column => column.callouts).find(item => item.id === calloutId);
  if (!callout) return columns;
  return columns.map(column => {
    const rest = column.callouts.filter(item => item.id !== calloutId);
    if (column.id !== target.columnId) return { ...column, callouts: rest };
    const index = Math.min(target.index, rest.length);
    return { ...column, callouts: [...rest.slice(0, index), callout, ...rest.slice(index)] };
  });
};

type SpaceLayoutTabProps = {
  level?: 'L0' | 'L1' | 'L2';
  scope?: string;
  initialColumns?: () => LayoutPoolColumn[];
  /** Top-level spaces write widget choices to the store their sidebar reads. Subspaces pass their own. */
  onWidgetsChange?: (columnId: LayoutColumnId, sidebar: SidebarWidgetId[]) => void;
  /** "Start collapsed" is a top-level space setting. */
  showSidebarDefault?: boolean;
  headerActionsSlot?: ReactNode;
};

const saveSpaceWidgets = (columnId: LayoutColumnId, sidebar: SidebarWidgetId[]) => {
  // Tabs added here have no page on the member side, so there is nothing to tell.
  if (!BUILT_IN_TABS.some(tab => tab.id === columnId)) return;
  saveSpaceSidebarWidgets({ ...loadSpaceSidebarWidgets(), [columnId]: fromProductionWidgets(sidebar) });
};

/**
 * Layout tab: production's board and per-tab editor, with our "start collapsed"
 * choice beneath it. As in production, moving posts is saved from the
 * unsaved-changes bar; everything in a tab's menu saves straight away.
 */
export function SpaceLayoutTab({
  level = 'L0',
  scope = 'space',
  initialColumns = buildDemoColumns,
  onWidgetsChange = saveSpaceWidgets,
  showSidebarDefault = level === 'L0',
  headerActionsSlot,
}: SpaceLayoutTabProps) {
  const navigate = useNavigate();
  const { spaceSlug = '' } = useParams<{ spaceSlug: string }>();
  const form = useDemoForm<LayoutValues>(
    `${scope}:layout`,
    () => ({ columns: initialColumns(), startCollapsed: readStartCollapsed() }),
    next => {
      if (!showSidebarDefault) return;
      try {
        localStorage.setItem(SIDEBAR_DEFAULT_KEY, next.startCollapsed ? 'railed' : 'expanded');
      } catch {
        /* storage unavailable: the prototype keeps the in-memory state */
      }
    }
  );
  const [templatePickerFor, setTemplatePickerFor] = useState<LayoutColumnId | null>(null);
  const { columns, startCollapsed } = form.value;

  const hasBoardChanges = useMemo(
    () => JSON.stringify(columns) !== JSON.stringify(form.saved.columns),
    [columns, form.saved.columns]
  );

  const updateColumn = (id: LayoutColumnId, patch: Partial<LayoutPoolColumn>) =>
    form.applyNow(previous => ({
      ...previous,
      columns: previous.columns.map(column => (column.id === id ? { ...column, ...patch } : column)),
    }));

  const saveLayout = async (id: LayoutColumnId, layout: PhaseLayoutInput) => {
    // Our feeds read one collapse setting for the whole space, not one per tab, so
    // every tab shows the same value rather than claiming something members won't see.
    form.applyNow(previous => ({
      ...previous,
      columns: previous.columns.map(column => {
        const shared = column.layout && { ...column.layout, descriptionCollapsed: layout.descriptionCollapsed };
        return column.id === id ? { ...column, layout } : { ...column, layout: shared };
      }),
    }));
    if (level === 'L0') {
      try {
        localStorage.setItem(COLLAPSE_POSTS_KEY, String(layout.descriptionCollapsed));
      } catch {
        /* storage unavailable: the prototype keeps the in-memory state */
      }
    }
    onWidgetsChange(id, layout.sidebar);
  };

  const columnMenuActions: ColumnMenuActions = {
    onChangeActivePhase: id =>
      form.applyNow(previous => ({
        ...previous,
        columns: previous.columns.map(column => ({ ...column, isCurrentPhase: column.id === id })),
      })),
    onSetAsDefaultCalloutTemplate: (id, templateId) => {
      if (templateId === null) updateColumn(id, { defaultCalloutTemplate: null });
    },
    onOpenDefaultCalloutTemplatePicker: setTemplatePickerFor,
    onSaveColumnDetails: async (id, title, description) => updateColumn(id, { title, description }),
    onSaveLayout: saveLayout,
    onDeletePhase: async id =>
      form.applyNow(previous => {
        const remaining = previous.columns.filter(column => column.id !== id);
        const orphans = previous.columns.find(column => column.id === id)?.callouts ?? [];
        return {
          ...previous,
          // Posts on a deleted tab move to the first tab rather than disappearing.
          columns: remaining.map((column, index) =>
            index === 0 ? { ...column, callouts: [...column.callouts, ...orphans] } : column
          ),
        };
      }),
    onToggleVisibility: async (id, isHidden) => updateColumn(id, { isHidden }),
  };

  const saveBar: LayoutSaveBarState = form.saving
    ? { kind: 'saving' }
    : form.count > 0
      ? { kind: 'dirty', canSave: true }
      : { kind: 'clean' };

  return (
    <>
      <SpaceSettingsLayoutView
        level={level}
        canManageTabs={true}
        entityNoun={level === 'L0' ? 'tab' : 'phase'}
        columns={columns}
        saveBar={saveBar}
        hasUnsavedChanges={hasBoardChanges}
        onReorder={(id, target) =>
          form.set(previous => ({ ...previous, columns: moveCallout(previous.columns, id, target) }))
        }
        onReorderColumns={ids =>
          form.set(previous => ({
            ...previous,
            columns: ids.flatMap(id => previous.columns.filter(column => column.id === id)),
          }))
        }
        onMoveToColumn={(id, target) =>
          form.set(previous => ({
            ...previous,
            columns: moveCallout(previous.columns, id, { columnId: target, index: Number.MAX_SAFE_INTEGER }),
          }))
        }
        onViewPost={() => navigate(`/space/${spaceSlug}`)}
        columnMenuActions={columnMenuActions}
        onCreatePhase={async ({ displayName, description }) =>
          form.applyNow(previous => ({
            ...previous,
            columns: [
              ...previous.columns,
              {
                id: `tab-${Date.now()}`,
                title: displayName,
                description,
                isCurrentPhase: false,
                isHidden: false,
                isDeletable: true,
                layout: {
                  descriptionCollapsed: readCollapsePosts(),
                  showPublishDetails: true,
                  sidebar: previous.columns[0]?.layout?.sidebar ?? [],
                },
                defaultCalloutTemplate: null,
                callouts: [],
              },
            ],
          }))
        }
        maximumNumberOfStates={8}
        headerActionsSlot={headerActionsSlot}
        {...demoMarkdownUpload}
      />

      {showSidebarDefault && (
        <SettingsSection
          className="mt-6"
          title="Sidebar"
          icon={<PanelLeftClose className="size-4" />}
          iconColor="purple"
          collapsible={false}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <label htmlFor="sidebar-start-collapsed" className="text-body-emphasis cursor-pointer">
                Start collapsed
              </label>
              <p className="text-caption text-muted-foreground">
                Members can always open and close the sidebar. This sets what they see on their first visit.
              </p>
            </div>
            <Switch
              id="sidebar-start-collapsed"
              checked={startCollapsed}
              onCheckedChange={next => form.patch({ startCollapsed: next })}
            />
          </div>
        </SettingsSection>
      )}

      <TabSaveBar count={form.count} saving={form.saving} save={form.save} discard={form.discard} />

      <DemoTemplatePicker
        scope={scope}
        open={templatePickerFor !== null}
        onClose={() => setTemplatePickerFor(null)}
        allowedTypes={['callout']}
        selectedId={columns.find(column => column.id === templatePickerFor)?.defaultCalloutTemplate?.id}
        onSelect={template => {
          if (templatePickerFor) {
            updateColumn(templatePickerFor, {
              defaultCalloutTemplate: template && { id: template.card.id, displayName: template.card.name },
            });
          }
        }}
      />
    </>
  );
}
