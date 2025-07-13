"use client";

import React from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  FormLabel,
} from "@mui/material";
import { WendlerCycleType } from "@/common-types";
import { Constants } from "@/database.types";
import { wendlerCycleUIString } from "@/uiStrings";

export interface SelectWendlerCycleProps {
  cycleType: WendlerCycleType | null;
  onCycleTypeChange: (cycle: WendlerCycleType | null) => void;
}

const useSelectWendlerCycleAPI = (props: SelectWendlerCycleProps) => {
  const [cycleType, setCycleType] = React.useState<WendlerCycleType | null>(
    props.cycleType ?? null
  );

  const onCycleTypeChange = React.useCallback(
    (newValue: WendlerCycleType | null) => {
      setCycleType(newValue);
      props.onCycleTypeChange(newValue ?? null);
    },
    [props]
  );

  return {
    cycleType,
    onCycleTypeChange,
  };
};

const SelectWendlerCycle: React.FC<SelectWendlerCycleProps> = (props) => {
  const api = useSelectWendlerCycleAPI(props);

  return (
    <FormControl>
      <FormLabel>Wendler Cycle</FormLabel>
      <ToggleButtonGroup
        color="primary"
        value={api.cycleType}
        exclusive
        onChange={(_e, val) => val && api.onCycleTypeChange(val)}
        size="small"
        aria-label="Wendler Cycle">
        {Constants.public.Enums.wendler_cycle_type_enum.map((cycle) => (
          <ToggleButton
            key={cycle}
            value={cycle}
            aria-label={wendlerCycleUIString(cycle)}
            size="small">
            {wendlerCycleUIString(cycle)}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </FormControl>
  );
};

export default SelectWendlerCycle;
