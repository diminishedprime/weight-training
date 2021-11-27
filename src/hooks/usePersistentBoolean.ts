import { useCallback, useEffect, useMemo, useState } from 'react';

export enum BooleanKey {
  Warmup = '/boolean/warmup/',
  ShowAddCustom = '/boolean/add-custom/',
  ShowAdd5x5 = '/boolean/add-5-x-5/',
  ShowAdd3x3 = '/boolean/add-3-x-3/',
}

interface StoredBoolean {
  value: boolean;
  key?: string;
  unset: boolean;
}

const usePersistentBoolean = (
  key: BooleanKey,
  initialValue: boolean,
  qualifier: string,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const storageKey = useMemo(() => `${key}${qualifier}`, [key, qualifier]);

  const [storedBoolean, setStoredBoolean] = useState<StoredBoolean>(() => {
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

  const setNumber: React.Dispatch<React.SetStateAction<boolean>> = useCallback(
    (v) => {
      setStoredBoolean((old) => {
        let updatedBoolean = old.value;
        if (typeof v === 'function') {
          updatedBoolean = v(updatedBoolean);
        } else {
          updatedBoolean = v;
        }
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({
            value: updatedBoolean,
            unset: false,
            key: storageKey,
          }),
        );
        return { ...old, value: updatedBoolean };
      });
    },
    [storageKey],
  );

  return useMemo(
    () => [storedBoolean.value, setNumber],
    [storedBoolean, setNumber],
  );
};

export default usePersistentBoolean;
