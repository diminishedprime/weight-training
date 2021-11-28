import { useCallback, useEffect, useMemo, useState } from 'react';

export enum ObjectKey {
  SetsByRepsData = '/sets-by-reps/data/',
  ActiveBarExercise = '/exercise/active-bar-exercise/',
}

interface StoredObject<T> {
  value: T;
  key?: string;
  unset: boolean;
}

const usePersistentObject = <T>(
  key: ObjectKey,
  initialValue: T,
  qualifier: string,
  xform?: (o: Record<string, any>) => T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  if (typeof window === 'undefined') {
    return useState<T>(initialValue);
  }
  const storageKey = useMemo(() => `${key}${qualifier}`, [key, qualifier]);

  const transform = useMemo(() => {
    if (xform === undefined) {
      return (a: Record<string, any>) => a as unknown as T;
    }
    return xform;
  }, [xform]);

  const fromLocalStorage = useCallback((): StoredObject<T> => {
    const stringValue = window.localStorage.getItem(storageKey);
    if (stringValue === null) {
      return {
        value: transform(initialValue),
        unset: true,
      };
    }
    try {
      const parsed: StoredObject<T> = JSON.parse(stringValue);
      return { ...parsed, value: transform(parsed.value) };
    } catch (e) {
      console.error(`The value stored for: ${storageKey} could not be parsed.`);
      return { value: transform(initialValue), unset: true };
    }
  }, [transform, storageKey, initialValue]);

  const [storedObject, setStoredObject] =
    useState<StoredObject<T>>(fromLocalStorage);

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

  const setObject: React.Dispatch<React.SetStateAction<T>> = useCallback(
    (v) => {
      setStoredObject((old) => {
        let updatedObject = old.value;
        if (v instanceof Function) {
          updatedObject = v(updatedObject);
        } else {
          updatedObject = v;
        }
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({
            value: updatedObject,
            unset: false,
            key: storageKey,
          }),
        );
        return { ...old, value: updatedObject };
      });
    },
    [storageKey],
  );

  return useMemo(
    () => [storedObject.value, setObject],
    [storedObject, setObject],
  );
};

export default usePersistentObject;
