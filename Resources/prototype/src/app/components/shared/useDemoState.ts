import { useCallback, useState } from "react";

/**
 * Demo state for the settings tabs. Production keeps this on the server; here it
 * lives in memory, so a change survives moving between tabs and is gone on reload.
 */
const store = new Map<string, unknown>();

export function useDemoState<T>(key: string, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    if (store.has(key)) return store.get(key) as T;
    const first = typeof initial === "function" ? (initial as () => T)() : initial;
    store.set(key, first);
    return first;
  });

  const update = useCallback(
    (next: T | ((previous: T) => T)) => {
      const resolved =
        typeof next === "function" ? (next as (previous: T) => T)(store.get(key) as T) : next;
      store.set(key, resolved);
      setValue(resolved);
    },
    [key]
  );

  return [value, update] as const;
}

/** Stands in for a server round trip, so saving states are visible. */
export function demoDelay(run: () => void, ms = 500) {
  window.setTimeout(run, ms);
}

/** The translator with runtime-built keys, which the typed `t` does not accept. */
export type LooseT = (key: string, options?: Record<string, unknown>) => string;
