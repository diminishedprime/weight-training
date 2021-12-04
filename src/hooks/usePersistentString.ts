import { useCallback } from 'react';
import usePersistentObject, { StorageKey } from '@/hooks/usePersistentObject';

const usePersistantString = (
  key: StorageKey,
  initialValue: string,
  qualifier: string,
) => {
  const [o, setO] = usePersistentObject(
    key,
    { value: initialValue },
    qualifier,
  );

  const setString: React.Dispatch<React.SetStateAction<string>> = useCallback(
    (f) => {
      setO((old) => {
        let nu;
        if (f instanceof Function) {
          nu = f(old.value);
        } else {
          nu = f;
        }
        return { ...old, value: nu };
      });
    },
    [setO],
  );

  return [o.value, setString] as const;
};

export default usePersistantString;
