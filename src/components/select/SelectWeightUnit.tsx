import {
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  FormLabel,
} from "@mui/material";
import { WeightUnit } from "@/common-types";
import React from "react";

interface SelectWeightUnitProps {
  weightUnit: WeightUnit | null;
  onWeightUnitChange: (unit: WeightUnit) => void;
}

const useSelectWeightUnitAPI = (props: SelectWeightUnitProps) => {
  const { weightUnit, onWeightUnitChange } = props;

  const [localWeightUnit, setLocalWeightUnit] = React.useState<WeightUnit>(
    weightUnit ?? "pounds"
  );

  const localOnWeightUnitChange = React.useCallback((newValue: WeightUnit) => {
    setLocalWeightUnit(newValue);
  }, []);

  React.useEffect(() => {
    onWeightUnitChange(localWeightUnit);
  }, [onWeightUnitChange, localWeightUnit]);

  return {
    weightUnit: localWeightUnit,
    onWeightUnitChange: localOnWeightUnitChange,
  };
};

const SelectWeightUnit = (props: SelectWeightUnitProps) => {
  const api = useSelectWeightUnitAPI(props);
  return (
    <FormControl>
      <FormLabel>Weight Unit</FormLabel>
      <ToggleButtonGroup
        color="primary"
        value={api.weightUnit}
        exclusive
        onChange={(_e, val) => val && api.onWeightUnitChange(val)}
        size="small"
        aria-label="Weight Unit">
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
