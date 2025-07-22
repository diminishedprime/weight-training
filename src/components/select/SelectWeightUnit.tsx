import { WeightUnit } from "@/common-types";
import {
  FormControl,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React, { useMemo } from "react";

interface SelectWeightUnitProps {
  weightUnit: WeightUnit | null;
  onWeightUnitChange: (unit: WeightUnit) => void;
  modified?: boolean;
  label?: string;
}

const useSelectWeightUnitAPI = (props: SelectWeightUnitProps) => {
  const { weightUnit, onWeightUnitChange, modified, label } = props;

  const [localWeightUnit, setLocalWeightUnit] = React.useState<WeightUnit>(
    weightUnit ?? "pounds",
  );

  const localOnWeightUnitChange = React.useCallback((newValue: WeightUnit) => {
    setLocalWeightUnit(newValue);
  }, []);

  const selectWeightUnitLabel = useMemo(() => {
    return `${label ?? "Weight Unit"}${modified ? "*" : ""}`;
  }, [modified, label]);

  React.useEffect(() => {
    onWeightUnitChange(localWeightUnit);
  }, [onWeightUnitChange, localWeightUnit]);

  return {
    weightUnit: localWeightUnit,
    onWeightUnitChange: localOnWeightUnitChange,
    label: selectWeightUnitLabel,
  };
};

const SelectWeightUnit = (props: SelectWeightUnitProps) => {
  const api = useSelectWeightUnitAPI(props);
  return (
    <FormControl>
      <FormLabel>{api.label}</FormLabel>
      <ToggleButtonGroup
        color="primary"
        value={api.weightUnit}
        exclusive
        onChange={(_e, val) => val && api.onWeightUnitChange(val)}
        size="small"
        aria-label="Weight Unit"
      >
        <ToggleButton value="pounds" aria-label="Pounds" size="small">
          lbs
        </ToggleButton>
        <ToggleButton value="kilograms" aria-label="Kilograms" size="small">
          kgs
        </ToggleButton>
      </ToggleButtonGroup>
    </FormControl>
  );
};

export default SelectWeightUnit;
