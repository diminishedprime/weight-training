"use client";

import { RDispatch } from "@/common-types";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";

export interface SelectPlatesProps {
  availablePlates: number[];
  selectedPlates: number[] | null;
  setSelectedPlates: RDispatch<number[] | null>;
}

const SelectPlates: React.FC<SelectPlatesProps> = (props) => {
  const api = useSelectPlatesAPI(props);

  return (
    <ToggleButtonGroup
      color="secondary"
      value={props.selectedPlates ?? []}
      onChange={(_e, val) => api.onChange(val)}
      size="small"
      aria-label="Available Plates"
    >
      {props.availablePlates.map((plate) => (
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
  );
};

export default SelectPlates;

const useSelectPlatesAPI = (props: SelectPlatesProps) => {
  const { setSelectedPlates } = props;

  const onChange = React.useCallback(
    (plates: number[]) => {
      setSelectedPlates((_) => plates.sort((a, b) => b - a));
    },
    [setSelectedPlates],
  );

  return {
    onChange,
  };
};
