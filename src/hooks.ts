"use client";

import { RDispatch } from "@/common-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSessionStorage } from "usehooks-ts";

export const useRequiredLabel = (labelText: string, isRequired: boolean) => {
  return React.useMemo(() => {
    return `${labelText}${isRequired ? " (required)" : ""}`;
  }, [labelText, isRequired]);
};

export const useModifiableLabel = (labelText: string, isModified: boolean) => {
  return React.useMemo(() => {
    return `${labelText}${isModified ? " *" : ""}`;
  }, [labelText, isModified]);
};

export const useRequiredModifiableLabel = (
  labelText: string,
  isRequired: boolean,
  isModified: boolean,
) => {
  return useModifiableLabel(
    useRequiredLabel(labelText, isRequired),
    isModified,
  );
};

export const useResolvableWeight = (
  actual: number | undefined,
  setActual: RDispatch<number | undefined>,
  target: number,
  targetToActual: (target: number) => number,
) => {
  const [resolved, setResolved] = useState(actual ?? targetToActual(target));

  useEffect(() => {
    if (actual === undefined) {
      setActual((_) => resolved);
    }
  }, [resolved, actual, setActual]);

  const setWeight: RDispatch<number> = useCallback(
    (f) => {
      if (typeof f === "function") {
        const nu = f(resolved);
        setResolved((_) => nu);
        // This feels like a hack, but it seems to be necessary.
        setActual((old) => (old ? f(old) : nu));
      } else {
        setResolved(f);
        setActual(f);
      }
    },
    [resolved, setActual],
  );

  return [resolved, setWeight] as const;
};

// This uses sessionStorage because we _don't_ want this data to persist
// indefinitely. If you want data to persist indefinitely, use the database, ya
// goof.
export const usePersistentNumber = (
  initialValue: number,
  path: string,
  key: string,
) => {
  const storageKey = useMemo(() => `${path}///${key}`, [path, key]);
  return useSessionStorage(storageKey, initialValue, {
    initializeWithValue: false, // Set to false for SSR compatibility
  });
};

export const usePersistentBoolean = (
  initialValue: boolean,
  path: string,
  key: string,
) => {
  const storageKey = useMemo(() => `${path}///${key}`, [path, key]);
  return useSessionStorage(storageKey, initialValue, {
    initializeWithValue: false, // Set to false for SSR compatibility
  });
};
