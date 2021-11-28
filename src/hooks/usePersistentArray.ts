import { useCallback, useEffect, useMemo, useState } from 'react';

export enum ArrayKey {
  Plates = '/array/plates/',
}

interface StoredArray<T> {
  value: T[];
  key?: string;
  unset: boolean;
}

const usePersistentArray = <T>(
  key: ArrayKey,
  initialValue: T[],
  qualifier: string,
  xform?: (o: Record<string, any>) => T,
): [T[], React.Dispatch<React.SetStateAction<T[]>>] => {
  if (typeof window === 'undefined') {
    return useState<T[]>(initialValue);
  }

  const storageKey = useMemo(() => `${key}${qualifier}`, [key, qualifier]);

  const transform = useMemo(() => {
    if (xform === undefined) {
      return (a: Record<string, any>) => a as unknown as T;
    }
    return xform;
  }, [xform]);

  const fromLocalStorage = useCallback((): StoredArray<T> => {
    const stringValue = window.localStorage.getItem(storageKey);
    if (stringValue === null) {
      return {
        value: initialValue.map(transform),
        unset: true,
      };
    }
    try {
      const parsed: StoredArray<T> = JSON.parse(stringValue);
      return { ...parsed, value: parsed.value.map(transform) };
    } catch (e) {
      console.error(`The value stored for: ${storageKey} could not be parsed.`);
      return { value: initialValue.map(transform), unset: true };
    }
  }, [transform, storageKey, initialValue]);

  const [storedArray, setStoredArray] =
    useState<StoredArray<T>>(fromLocalStorage);

  // Always try to initialize into localstorage
  useEffect(() => {
    const stringValue = window.localStorage.getItem(storageKey);
    if (stringValue === null) {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          value: initialValue,
          unset: false,
          key: storageKey,
        }),
      );
    }
  }, [storageKey, initialValue]);

  const setArray: React.Dispatch<React.SetStateAction<T[]>> = useCallback(
    (v) => {
      setStoredArray((old) => {
        let updatedArray = old.value;
        if (typeof v === 'function') {
          updatedArray = v(updatedArray);
        } else {
          updatedArray = v;
        }
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({
            value: updatedArray,
            unset: false,
            key: storageKey,
          }),
        );
        return { ...old, value: updatedArray };
      });
    },
    [storageKey],
  );

  return useMemo(() => [storedArray.value, setArray], [storedArray, setArray]);
};

export default usePersistentArray;
