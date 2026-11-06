import { useCallback, useMemo, useRef, useState } from 'react';

/**
 * Demo state for the settings tabs. There is no server in the prototype, so a
 * tab's "saved" data lives in this in-memory store: it survives switching tabs
 * and is reset by a page reload.
 */
const store = new Map<string, unknown>();

type Updater<T> = T | ((previous: T) => T);

export function useDemoState<T>(key: string, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(() =>
    store.has(key) ? (store.get(key) as T) : typeof initial === 'function' ? (initial as () => T)() : initial
  );
  const valueRef = useRef(value);
  const set = useCallback(
    (next: Updater<T>) => {
      const resolved = typeof next === 'function' ? (next as (previous: T) => T)(valueRef.current) : next;
      valueRef.current = resolved;
      store.set(key, resolved);
      setValue(resolved);
    },
    [key]
  );
  return [value, set] as const;
}

/** Runs a demo action after a short delay, so busy states show as they would against a server. */
export const demoDelay = (ms = 500) => new Promise<void>(resolve => setTimeout(resolve, ms));

export type DemoForm<T> = {
  value: T;
  saved: T;
  /** Number of top-level fields that differ from the saved value. */
  count: number;
  saving: boolean;
  set: (next: Updater<T>) => void;
  patch: (patch: Partial<T>) => void;
  save: () => Promise<void>;
  discard: () => void;
};

/** A form buffered against its saved value, for tabs saved through the unsaved-changes bar. */
export function useDemoForm<T extends object>(
  key: string,
  initial: T | (() => T),
  onPersist?: (next: T, previous: T) => void
): DemoForm<T> {
  const [saved, setSaved] = useDemoState<T>(key, initial);
  const [value, setValue] = useState<T>(saved);
  const [saving, setSaving] = useState(false);
  const valueRef = useRef(value);
  valueRef.current = value;

  const count = useMemo(() => {
    const keys = new Set([...Object.keys(value), ...Object.keys(saved)]) as Set<keyof T>;
    return [...keys].filter(k => JSON.stringify(value[k]) !== JSON.stringify(saved[k])).length;
  }, [value, saved]);

  const set = useCallback((next: Updater<T>) => {
    setValue(previous => (typeof next === 'function' ? (next as (p: T) => T)(previous) : next));
  }, []);
  const patch = useCallback((changes: Partial<T>) => setValue(previous => ({ ...previous, ...changes })), []);

  const save = useCallback(async () => {
    setSaving(true);
    await demoDelay();
    onPersist?.(valueRef.current, saved);
    setSaved(valueRef.current);
    setSaving(false);
  }, [onPersist, saved, setSaved]);

  const discard = useCallback(() => setValue(saved), [saved]);

  return { value, saved, count, saving, set, patch, save, discard };
}

/** Markdown image upload for the demo: the picked file is shown from a local address. */
export const demoMarkdownUpload = {
  onImageUpload: async (file: File) => URL.createObjectURL(file),
};

export const fileToDataUrl = (file: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
