import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { WeightUnit } from "@/common-types";

/**
 * Selector for weight units (pounds or kilograms).
 * @param value The selected weight unit.
 * @param onChange Handler for unit change.
 */
const WeightUnitSelector: React.FC<{
  value: WeightUnit;
  onChange: (val: WeightUnit) => void;
}> = ({ value, onChange }) => {
  return (
    <ToggleButtonGroup
      color="primary"
      value={value}
      exclusive
      onChange={(_e, val) => val && onChange(val)}
      size="small"
      aria-label="Weight Unit">
      <ToggleButton value="pounds" aria-label="Pounds" size="small">
        lbs
      </ToggleButton>
      <ToggleButton value="kilograms" aria-label="Kilograms" size="small">
        kgs
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default WeightUnitSelector;
