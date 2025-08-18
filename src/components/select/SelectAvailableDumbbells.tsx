"use client";

import { RDispatch } from "@/common-types";
import { Chip, Stack } from "@mui/material";
import { Set as ImmutableSet } from "immutable";
import React, { useMemo } from "react";

export interface SelectAvailableDumbbellsProps {
  availableDumbbells: number[];
  selectedDumbbells: number[] | null;
  setSelectedDumbbells: RDispatch<number[] | null>;
}

const SelectAvailableDumbbells: React.FC<SelectAvailableDumbbellsProps> = (
  props,
) => {
  const api = useSelectAvailableDumbbellsAPI(props);

  return (
    <Stack>
      <Stack direction="row" alignItems="center">
        <Chip
          label="All"
          size="small"
          color="primary"
          variant="outlined"
          onClick={api.selectAll}
          data-testid="select-all-dumbbells"
        />
        <Chip
          label="None"
          size="small"
          color="primary"
          variant="outlined"
          onClick={api.selectNone}
          data-testid="select-none-dumbbells"
        />
      </Stack>
      <Stack direction="row" flexWrap="wrap">
        {props.availableDumbbells.map((weight) => {
          const selected = api.isSelected(weight);
          return (
            <Chip
              key={weight}
              label={weight}
              color={selected ? "primary" : "default"}
              variant={selected ? "filled" : "outlined"}
              clickable
              onClick={() => api.onChipClick(weight)}
              size="small"
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

export default SelectAvailableDumbbells;

const useSelectAvailableDumbbellsAPI = (
  props: SelectAvailableDumbbellsProps,
) => {
  const { selectedDumbbells, setSelectedDumbbells, availableDumbbells } = props;

  const selectedDumbbellsSet = useMemo(
    () => ImmutableSet(selectedDumbbells ?? []),
    [selectedDumbbells],
  );

  const isSelected = React.useCallback(
    (weight: number) => selectedDumbbellsSet.has(weight),
    [selectedDumbbellsSet],
  );

  const onChipClick = React.useCallback(
    (weight: number) => {
      const updated = selectedDumbbellsSet.has(weight)
        ? selectedDumbbellsSet.remove(weight)
        : selectedDumbbellsSet.add(weight);
      setSelectedDumbbells((_) => updated.toArray().sort((a, b) => a - b));
    },
    [selectedDumbbellsSet, setSelectedDumbbells],
  );

  const selectAll = React.useCallback(() => {
    setSelectedDumbbells((_) => availableDumbbells.sort((a, b) => a - b));
  }, [availableDumbbells, setSelectedDumbbells]);

  const selectNone = React.useCallback(() => {
    setSelectedDumbbells((_) => []);
  }, [setSelectedDumbbells]);

  return {
    isSelected,
    onChipClick,
    selectAll,
    selectNone,
  };
};
