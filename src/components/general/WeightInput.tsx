import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import * as React from "react";
import * as hooks from "../../hooks";
import * as t from "../../types";

interface WeightInput
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
  initial?: t.Weight;
  update: (weight: t.Weight) => void;
}

export const WeightInput: React.FC<WeightInput> = ({
  initial,
  update,
  label
}) => {
  const {
    settings: { unit: defaultUnit }
  } = hooks.useSettings();
  const [unit, setUnit] = React.useState<t.WeightUnit>(
    initial?.getUnit() || defaultUnit
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
    if (localValue !== undefined && localValue.getUnit() !== unit) {
      setUnit(localValue.getUnit());
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
    <FormControl variant="outlined">
      <InputLabel>{label || "Weight"}</InputLabel>
      <OutlinedInput
        label={label || "Weight"}
        endAdornment={
          <InputAdornment position="end">
            <Button disabled={localValue === undefined} onClick={toggleUnit}>
              {unit}
            </Button>
          </InputAdornment>
        }
        inputProps={{
          "aria-label": label || "Weight",
          "pattern": /[0-9]+/
        }}
        onChange={onChange}
        value={localValue?.getValue() || ""}
      />
    </FormControl>
  );
};

export default WeightInput;
