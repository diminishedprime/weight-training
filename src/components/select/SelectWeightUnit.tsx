import { RDispatch, WeightUnit } from "@/common-types";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

interface SelectWeightUnitProps {
  weightUnit: WeightUnit | null;
  setWeightUnit: RDispatch<WeightUnit | null>;
  disabled?: boolean;
}

const SelectWeightUnit = (props: SelectWeightUnitProps) => {
  return (
    <ToggleButtonGroup
      disabled={props.disabled}
      color="primary"
      exclusive
      value={props.weightUnit}
      onChange={(_e, val) => val && props.setWeightUnit(val)}
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
  );
};

export default SelectWeightUnit;
