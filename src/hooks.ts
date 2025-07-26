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
