import { useRequiredModifiableLabel } from "@/hooks";
import { isEqual } from "lodash";
import { useMemo, useState } from "react";

export type PreferenceValueAPI<T> = ReturnType<typeof usePreferenceValue<T>>;

const usePreferenceValue = <T>(
  baseLabel: string,
  initialValue: T | null,
  serverValue: T | null,
  initialRequired: boolean,
) => {
  const [value, setValue] = useState(initialValue);
  const [required, setRequired] = useState(initialRequired);

  const modified = useMemo(
    () => !isEqual(value, serverValue),
    [value, serverValue],
  );

  const label = useRequiredModifiableLabel(baseLabel, required, modified);

  return {
    value,
    setValue,
    required,
    setRequired,
    modified,
    label,
    serverValue,
  };
};

export default usePreferenceValue;
