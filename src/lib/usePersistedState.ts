"use client";
import { useEffect, useState } from "react";

/**
 * Same state you'd get from useState, but backed by localStorage so it
 * survives page refreshes — used for admin modules that don't have a real
 * backend yet (see super_admin). Starts at `defaultValue` on every render
 * (SSR-safe, no hydration mismatch) and syncs in the stored value right
 * after mount via `hydrated`, matching the uiPrefs/prefsLoaded pattern
 * already used elsewhere in this app.
 */
export function usePersistedState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  // Read once, right after mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {
      // corrupted/unavailable storage — fall back to defaultValue, already set
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Write on every change, but only once hydration has read the stored
  // value first — otherwise this would fire during the same initial commit
  // and clobber storage with `defaultValue` before the read above lands.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full/unavailable — persistence is best-effort, not critical
    }
  }, [key, value, hydrated]);

  return [value, setValue];
}

/** Clears a persisted key, letting the next mount fall back to its default. */
export function clearPersistedState(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
