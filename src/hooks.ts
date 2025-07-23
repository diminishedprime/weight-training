import React from "react";

const useRequiredLabel = (labelText: string, isRequired: boolean) => {
  return React.useMemo(() => {
    return `${labelText}${isRequired ? " (required)" : ""}`;
  }, [labelText, isRequired]);
};

const useModifiableLabel = (labelText: string, isModified: boolean) => {
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

export const useNumberInput = (initialNumber: number | null) => {
  const [localStringNumber, setLocalStringNumber] = React.useState(
    initialNumber?.toString() ?? "",
  );
  const [localNumber, setLocalNumber] = React.useState<number | null>(
    localStringNumber ? Number(localStringNumber) : null,
  );

  const setString = React.useCallback(
    (stringNumber: string) => {
      setLocalStringNumber(stringNumber);
      const parsedNumber = Number(stringNumber);
      if (!isNaN(parsedNumber)) {
        setLocalNumber(parsedNumber);
      }
    },
    [setLocalStringNumber, setLocalNumber],
  );
  return [localStringNumber, localNumber, setString] as const;
};
