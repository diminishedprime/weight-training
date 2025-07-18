"use client";

import React from "react";
import { Chip, FormControl, FormLabel, Stack } from "@mui/material";
import { Set as ImmutableSet } from "immutable";

export interface SelectAvailableDumbbellsProps {
  initiallyAvailableDumbbells: number[];
  initiallySelectedDumbbells: number[] | null;
  unit: WeightUnit;
  label?: string;
  modified?: boolean;
  required?: boolean;
  onSelectedDumbbellsChange: (dumbbells: number[]) => void;
}
import { weightUnitUIString } from "@/uiStrings";
import { WeightUnit } from "@/common-types";
import { useRequiredModifiableLabel } from "@/hooks";

const useSelectAvailableDumbbellsAPI = (
  props: SelectAvailableDumbbellsProps
) => {
  const {
    initiallySelectedDumbbells,
    onSelectedDumbbellsChange,
    modified,
    required,
    label,
    initiallyAvailableDumbbells,
    unit,
  } = props;

  // TODO: eventually, we'll want the user to be able to provide custom sized dumbbells, and when we do, we'll use the set.
  const [localAvailableDumbbells] = React.useState(
    ImmutableSet(initiallyAvailableDumbbells)
  );

  const [localSelectedDumbbells, setLocalSelectedDumbbells] = React.useState(
    () => ImmutableSet(initiallySelectedDumbbells ?? [])
  );

  const isSelected = React.useCallback(
    (weight: number) => localSelectedDumbbells.has(weight),
    [localSelectedDumbbells]
  );

  const onChipClick = React.useCallback(
    (weight: number) => {
      const updated = localSelectedDumbbells.has(weight)
        ? localSelectedDumbbells.remove(weight)
        : localSelectedDumbbells.add(weight);
      setLocalSelectedDumbbells(updated);
      onSelectedDumbbellsChange(updated.toArray().sort((a, b) => b - a));
    },
    [localSelectedDumbbells, onSelectedDumbbellsChange]
  );

  const selectAll = React.useCallback(() => {
    setLocalSelectedDumbbells(localAvailableDumbbells);
    onSelectedDumbbellsChange(
      localAvailableDumbbells.toArray().sort((a, b) => b - a)
    );
  }, [localAvailableDumbbells, onSelectedDumbbellsChange]);

  const selectNone = React.useCallback(() => {
    setLocalSelectedDumbbells((a) => a.clear());
    onSelectedDumbbellsChange([]);
  }, [onSelectedDumbbellsChange]);

  const allSelected = React.useMemo(
    () =>
      localAvailableDumbbells.size > 0 &&
      localAvailableDumbbells.isSubset(localSelectedDumbbells),
    [localAvailableDumbbells, localSelectedDumbbells]
  );

  const noneSelected = React.useMemo(
    () => localAvailableDumbbells.size > 0 && localSelectedDumbbells.isEmpty(),
    [localAvailableDumbbells, localSelectedDumbbells]
  );

  const localLabel = useRequiredModifiableLabel(
    label ?? "Available Dumbbells",
    !!required,
    !!modified
  );

  return {
    isSelected,
    onChipClick,
    label: localLabel,
    selectAll,
    selectNone,
    allSelected,
    noneSelected,
    unit,
  };
};

const SelectAvailableDumbbells: React.FC<SelectAvailableDumbbellsProps> = (
  props
) => {
  const api = useSelectAvailableDumbbellsAPI(props);

  return (
    <FormControl>
      <FormLabel>
        <Stack direction="row" alignItems="center" gap={1}>
          <span>{api.label}</span>
          <Chip
            label="All"
            size="small"
            color="primary"
            variant="outlined"
            onClick={api.selectAll}
            data-testid="select-all-dumbbells"
            disabled={api.allSelected}
          />
          <Chip
            label="None"
            size="small"
            color="primary"
            variant="outlined"
            onClick={api.selectNone}
            data-testid="select-none-dumbbells"
            disabled={api.noneSelected}
          />
        </Stack>
      </FormLabel>
      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
        {props.initiallyAvailableDumbbells.map((weight) => {
          const selected = api.isSelected(weight);
          return (
            <Chip
              key={weight}
              label={`${weight} ${weightUnitUIString(api.unit)}`}
              color={selected ? "primary" : "default"}
              variant={selected ? "filled" : "outlined"}
              clickable
              onClick={() => api.onChipClick(weight)}
              aria-label={`${weight} ${api.unit} dumbbell`}
              data-testid={`dumbbell-${weight}-${api.unit}`}
              size="small"
            />
          );
        })}
      </Stack>
    </FormControl>
  );
};

export default SelectAvailableDumbbells;
