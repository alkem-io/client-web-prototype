import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import {
  ALL_CONTAINER_IDS,
  ALL_ITEM_IDS,
  CONTAINER_ACTIVITY,
  CONTAINER_CHILDREN,
  CONTAINER_ITEMS,
  ITEM_ACTIVITY,
  defaultBaseline,
  descendantContainers,
  type ContainerId,
  type ItemId,
} from "@/app/data/activity-data";

const ENABLED_KEY = "alkemio-activity-enabled";
const VISITS_KEY = "alkemio-activity-visits";
const SEEN_KEY = "alkemio-activity-seen";
const BASELINE_KEY = "alkemio-activity-baseline";

type Visits = Record<ContainerId, string>;

interface ReadState {
  visits: Visits;
  seen: string[];
}

interface ActivityIndicatorsValue {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  /** True when the container, or any container beneath it, has unvisited activity. */
  hasContainerActivity: (id: ContainerId) => boolean;
  hasItemActivity: (id: ItemId) => boolean;
  visitContainer: (id: ContainerId) => void;
  markItemSeen: (id: ItemId) => void;
  /** Omit `scope` to clear everything. Returns the state needed to undo. */
  markAllRead: (scope?: ContainerId) => { cleared: number; undo: () => void };
  resetAll: () => void;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

const ActivityIndicatorsContext = createContext<ActivityIndicatorsValue>({
  enabled: true,
  setEnabled: () => {},
  hasContainerActivity: () => false,
  hasItemActivity: () => false,
  visitContainer: () => {},
  markItemSeen: () => {},
  markAllRead: () => ({ cleared: 0, undo: () => {} }),
  resetAll: () => {},
});

export function ActivityIndicatorsProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabledState] = useState(
    () => localStorage.getItem(ENABLED_KEY) !== "false"
  );
  const [state, setState] = useState<ReadState>(() => ({
    visits: readJson<Visits>(VISITS_KEY, {}),
    seen: readJson<string[]>(SEEN_KEY, []),
  }));
  const [baseline] = useState(() => {
    const stored = localStorage.getItem(BASELINE_KEY);
    if (stored) return stored;
    const fresh = defaultBaseline();
    localStorage.setItem(BASELINE_KEY, fresh);
    return fresh;
  });

  const persist = useCallback((next: ReadState) => {
    localStorage.setItem(VISITS_KEY, JSON.stringify(next.visits));
    localStorage.setItem(SEEN_KEY, JSON.stringify(next.seen));
    return next;
  }, []);

  // Mirrors `state` so mark-all-as-read can read, count and snapshot synchronously
  // rather than doing that work inside a state updater (which StrictMode double-invokes).
  const stateRef = useRef(state);
  const commit = useCallback(
    (next: ReadState) => {
      stateRef.current = next;
      setState(persist(next));
    },
    [persist]
  );

  const setEnabled = useCallback((value: boolean) => {
    localStorage.setItem(ENABLED_KEY, String(value));
    setEnabledState(value);
  }, []);

  const seenSet = useMemo(() => new Set(state.seen), [state.seen]);

  const hasOwnActivity = useCallback(
    (id: ContainerId) => {
      const activityAt = CONTAINER_ACTIVITY[id];
      if (!activityAt) return false;
      return activityAt > (state.visits[id] ?? baseline);
    },
    [state.visits, baseline]
  );

  const hasContainerActivity = useCallback(
    (id: ContainerId): boolean => {
      if (!enabled) return false;
      if (hasOwnActivity(id)) return true;
      // Only child containers roll up. Item dots deliberately do not.
      return (CONTAINER_CHILDREN[id] ?? []).some(hasContainerActivity);
    },
    [enabled, hasOwnActivity]
  );

  const hasItemActivity = useCallback(
    (id: ItemId) => {
      if (!enabled) return false;
      const createdAt = ITEM_ACTIVITY[id];
      if (!createdAt) return false;
      return createdAt > baseline && !seenSet.has(id);
    },
    [enabled, baseline, seenSet]
  );

  const visitContainer = useCallback(
    (id: ContainerId) => {
      const prev = stateRef.current;
      const activityAt = CONTAINER_ACTIVITY[id];
      if (!activityAt || !(activityAt > (prev.visits[id] ?? baseline))) return;
      commit({ ...prev, visits: { ...prev.visits, [id]: new Date().toISOString() } });
    },
    [baseline, commit]
  );

  const markItemSeen = useCallback(
    (id: ItemId) => {
      const prev = stateRef.current;
      if (prev.seen.includes(id)) return;
      commit({ ...prev, seen: [...prev.seen, id] });
    },
    [commit]
  );

  const markAllRead = useCallback(
    (scope?: ContainerId) => {
      const prev = stateRef.current;
      const containers = scope ? descendantContainers(scope) : ALL_CONTAINER_IDS;
      const items = scope
        ? containers.flatMap((id) => CONTAINER_ITEMS[id] ?? [])
        : ALL_ITEM_IDS;

      const now = new Date().toISOString();
      const visits = { ...prev.visits };
      const seen = new Set(prev.seen);
      let cleared = 0;

      containers.forEach((id) => {
        const activityAt = CONTAINER_ACTIVITY[id];
        if (activityAt && activityAt > (visits[id] ?? baseline)) {
          visits[id] = now;
          cleared += 1;
        }
      });
      items.forEach((id) => {
        const createdAt = ITEM_ACTIVITY[id];
        if (createdAt && createdAt > baseline && !seen.has(id)) {
          seen.add(id);
          cleared += 1;
        }
      });

      if (cleared > 0) commit({ visits, seen: Array.from(seen) });

      return { cleared, undo: () => commit(prev) };
    },
    [baseline, commit]
  );

  const resetAll = useCallback(() => {
    commit({ visits: {}, seen: [] });
  }, [commit]);

  const value = useMemo(
    () => ({
      enabled,
      setEnabled,
      hasContainerActivity,
      hasItemActivity,
      visitContainer,
      markItemSeen,
      markAllRead,
      resetAll,
    }),
    [
      enabled,
      setEnabled,
      hasContainerActivity,
      hasItemActivity,
      visitContainer,
      markItemSeen,
      markAllRead,
      resetAll,
    ]
  );

  return (
    <ActivityIndicatorsContext.Provider value={value}>
      {children}
    </ActivityIndicatorsContext.Provider>
  );
}

export function useActivityIndicators() {
  return useContext(ActivityIndicatorsContext);
}
