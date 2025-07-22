"use client";

import { WeightUnit } from "@/common-types";
import { useRequiredModifiableLabel } from "@/hooks";
import { weightUnitUIString } from "@/uiStrings";
import {
  FormControl,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Set as ImmutableSet } from "immutable";
import React from "react";

export interface SelectPlatesProps {
  availablePlates: number[];
  initialSelectedPlates: number[] | null;
  unit: WeightUnit;
  label?: string;
  modified?: boolean;
  required?: boolean;
  onSelectedPlatesChange: (plates: number[]) => void;
}

const useSelectPlatesAPI = (props: SelectPlatesProps) => {
  const {
    initialSelectedPlates,
    onSelectedPlatesChange,
    modified,
    required,
    label,
    unit,
    availablePlates,
  } = props;

  // TODO: eventually, we'll want the user to be able to provide custom plates
  // and once that happens, we'll use the set.
  const [localAvailablePlates] = React.useState(availablePlates);

  const [selectedSet, setSelectedSet] = React.useState(() =>
    ImmutableSet(initialSelectedPlates ?? []),
  );

  const localLabel = useRequiredModifiableLabel(
    label ?? `Available Plates ${weightUnitUIString(unit).toUpperCase()}`,
    !!required,
    !!modified,
  );

  const localOnChange = React.useCallback(
    (plates: number[]) => {
      setSelectedSet(ImmutableSet(plates));
      onSelectedPlatesChange(plates);
    },
    [onSelectedPlatesChange],
  );

  const localSelectedPlates = React.useMemo(
    () => selectedSet.toArray().sort((a, b) => b - a),
    [selectedSet],
  );

  return {
    selectedPlates: localSelectedPlates,
    onSelectedPlatesChange: localOnChange,
    label: localLabel,
    availablePlates: localAvailablePlates,
  };
};

const SelectPlates: React.FC<SelectPlatesProps> = (props) => {
  const api = useSelectPlatesAPI(props);

  return (
    <FormControl>
      <FormLabel>{api.label}</FormLabel>
      <ToggleButtonGroup
        color="primary"
        value={api.selectedPlates}
        onChange={(_e, val) => api.onSelectedPlatesChange(val)}
        size="small"
        aria-label="Available Plates"
      >
        {api.availablePlates.map((plate) => (
          <ToggleButton
            key={plate}
            value={plate}
            aria-label={`${plate} lb plate`}
            size="small"
          >
            {plate}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </FormControl>
  );
};

export default SelectPlates;
