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
): [T[], React.Dispatch<React.SetStateAction<T[]>>] => {
  const storageKey = useMemo(() => `${key}${qualifier}`, [key, qualifier]);

  const [storedArray, setStoredArray] = useState<StoredArray<T>>(() => {
    const stringValue = window.localStorage.getItem(storageKey);
    if (stringValue === null) {
      return { value: initialValue, unset: true };
    }
    try {
      return JSON.parse(stringValue);
    } catch (e) {
      console.error(`The value stored for: ${storageKey} could not be parsed.`);
      return { value: initialValue, unset: true };
    }
  });

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
