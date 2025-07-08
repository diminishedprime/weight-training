"use client";

/**
 * Keys for all localStorage state in the app.
 * Use these to avoid accidental key collisions.
 */
export const LocalStorageKeys = {
  AddBarbellTotalWeight: "addBarbell_totalWeight",
  AddBarbellWeightUnit: "addBarbell_weightUnit",
  AddBarbellReps: "addBarbell_reps",
  AddBarbellEffort: "addBarbell_effort",
  AddBarbellWarmup: "addBarbell_warmup",
  AddBarbellCompletionStatus: "addBarbell_completionStatus",
  AddBarbellNotes: "addBarbell_notes",
  // Add more keys here as needed for other forms/components
} as const;

import React from "react";

/**
 * useLocalStorageState
 * A hook that mimics useState, but persists its value in localStorage.
 * @param key The localStorage key to use.
 * @param initialValue The initial value or a function returning it.
 */
/**
 * useLocalStorageState
 * A hook that mimics useState, but persists its value in localStorage.
 *
 * NOTE: Access to window/localStorage must be guarded to avoid SSR errors in Next.js.
 * Even in a client component, the initial render may run on the server, where window is undefined.
 * See: https://nextjs.org/docs/messages/react-hydration-error
 */
export function useLocalStorageState<T>(
  key: string,
  initialValue: T | (() => T),
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const getInitial = React.useCallback(() => {
    // Guard for SSR: window is undefined on the server
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        try {
          return JSON.parse(stored) as T;
        } catch {
          // fallback to initialValue if parse fails
        }
      }
    }
    return typeof initialValue === "function"
      ? (initialValue as () => T)()
      : initialValue;
  }, [key, initialValue]);

  const [state, setState] = React.useState<T>(getInitial);

  React.useEffect(() => {
    // Only run on client
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState];
}
