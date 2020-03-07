import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import * as React from "react";
import * as hooks from "../../hooks";
import * as t from "../../types";

interface WeightInput
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  initial?: t.Weight;
  update: (weight: t.Weight) => void;
  fullWidth?: boolean;
}

export const WeightInput: React.FC<WeightInput> = ({ initial, update }) => {
  const {
    settings: { unit: defaultUnit }
  } = hooks.useSettings();
  const [unit, setUnit] = React.useState<t.WeightUnit>(
    initial?.unit || defaultUnit
  );
  const [localValue, setLocalValue] = React.useState<t.Weight | undefined>(
    initial
  );

  // Update localValue if initial changes and isn't the same as localValue
  React.useEffect(() => {
    if (initial === undefined) {
      return setLocalValue(initial);
    }
    setLocalValue((current) => {
      if (current === undefined) {
        return initial;
      }
      if (current !== undefined && !current.equals(initial)) {
        return initial;
      }
      return current;
    });
  }, [initial]);

  // Keep the unit up-to-date with the weight unit.
  React.useEffect(() => {
    if (localValue !== undefined && localValue.unit !== unit) {
      setUnit(localValue.unit);
    }
  }, [localValue, unit]);

  // Call update when localValue changes to a defined value.
  React.useEffect(() => {
    if (localValue !== undefined) {
      update(localValue);
    }
  }, [localValue, update]);

  const toggleUnit = React.useCallback(() => {
    let nextUnit: t.WeightUnit;
    switch (unit) {
      case t.WeightUnit.KILOGRAM: {
        nextUnit = t.WeightUnit.POUND;
        break;
      }
      case t.WeightUnit.POUND: {
        nextUnit = t.WeightUnit.KILOGRAM;
        break;
      }
    }
    setLocalValue((w) => w?.toUnit(nextUnit));
  }, [unit]);

  const onChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = React.useCallback(
    (e) => {
      const parsed = parseInt(e.target.value, 10);
      if (isNaN(parsed)) {
        return setLocalValue(undefined);
      }
      return setLocalValue(t.Weight.forUnit(unit)(parsed));
    },
    [unit]
  );

  return (
    <div>
      <OutlinedInput
        endAdornment={
          <InputAdornment position="end">
            <Button disabled={localValue === undefined} onClick={toggleUnit}>
              {unit}
            </Button>
          </InputAdornment>
        }
        inputProps={{
          "aria-label": "weight",
          "pattern": /[0-9]+/
        }}
        onChange={onChange}
        value={localValue?.value || ""}
        labelWidth={0}
      />
    </div>
  );
};

export default WeightInput;
