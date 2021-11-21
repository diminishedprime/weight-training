import { useCallback, useEffect, useMemo, useState } from 'react';

export enum NumberKey {
  Reps = '/number/reps/',
}

interface StoredNumber {
  value: number;
  key?: string;
  unset: boolean;
}

const usePersistentNumber = (
  key: NumberKey,
  initialValue: number,
  qualifier: string,
): [number, React.Dispatch<React.SetStateAction<number>>] => {
  const storageKey = useMemo(() => `${key}${qualifier}`, [key, qualifier]);

  const [storedNumber, setStoredNumber] = useState<StoredNumber>(() => {
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

  const setNumber: React.Dispatch<React.SetStateAction<number>> = useCallback(
    (v) => {
      setStoredNumber((old) => {
        let updatedNum = old.value;
        if (typeof v === 'function') {
          updatedNum = v(updatedNum);
        } else {
          updatedNum = v;
        }
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({
            value: updatedNum,
            unset: false,
            key: storageKey,
          }),
        );
        return { ...old, value: updatedNum };
      });
    },
    [storageKey],
  );

  return useMemo(
    () => [storedNumber.value, setNumber],
    [storedNumber, setNumber],
  );
};

export default usePersistentNumber;
