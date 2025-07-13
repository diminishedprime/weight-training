"use client";

import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { WendlerCycleType } from "@/common-types";
import { Constants } from "@/database.types";
import { wendlerCycleUIString } from "@/uiStrings";

export interface WendlerCycleSelectorProps {
  initialCycle: WendlerCycleType | null;
  onChange: (cycle: WendlerCycleType | null) => void;
}

const useWendlerCycleSelectorAPI = (props: WendlerCycleSelectorProps) => {
  const [value, setValue] = React.useState<WendlerCycleType | null>(
    props.initialCycle ?? null
  );

  const handleChange = React.useCallback(
    (newValue: WendlerCycleType | null) => {
      setValue(newValue);
      props.onChange(newValue ?? null);
    },
    [props]
  );

  return {
    value,
    handleChange,
  };
};

const WendlerCycleSelector: React.FC<WendlerCycleSelectorProps> = (props) => {
  const api = useWendlerCycleSelectorAPI(props);

  return (
    <ToggleButtonGroup
      color="primary"
      value={api.value}
      exclusive
      onChange={(_e, val) => val && api.handleChange(val)}
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
  );
};

export default WendlerCycleSelector;
