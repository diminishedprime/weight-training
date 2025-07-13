"use client";

import React from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  FormLabel,
} from "@mui/material";

export interface SelectPlatesProps {
  availablePlates: number[];
  selectedPlates: number[] | null;
  label?: string;
  modified?: boolean;
  onSelectedPlatesChange: (plates: number[]) => void;
}

const useSelectPlatesAPI = (props: SelectPlatesProps) => {
  const { selectedPlates, onSelectedPlatesChange, modified, label } = props;

  const [localSelectedPlates, setLocalSelectedPlates] = React.useState<
    number[]
  >(selectedPlates || []);

  const localOnSelectedPlatesChange = React.useCallback(
    (newValue: number[]) => {
      setLocalSelectedPlates(newValue);
    },
    []
  );

  const selectPlatesLabel = React.useMemo(() => {
    return `${label ?? "Available Plates"}${modified ? "*" : ""}`;
  }, [modified, label]);

  React.useEffect(() => {
    onSelectedPlatesChange(localSelectedPlates);
  }, [localSelectedPlates, onSelectedPlatesChange]);

  return {
    selectedPlates: localSelectedPlates,
    onSelectedPlatesChange: localOnSelectedPlatesChange,
    label: selectPlatesLabel,
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
        aria-label="Available Plates">
        {props.availablePlates.map((plate) => (
          <ToggleButton
            key={plate}
            value={plate}
            aria-label={`${plate} lb plate`}
            size="small">
            {plate}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </FormControl>
  );
};

export default SelectPlates;
