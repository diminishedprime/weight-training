import classNames from "classnames";
import * as React from "react";
import * as hooks from "../../hooks";
import * as t from "../../types";

interface WeightInput
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  weight?: t.Weight;
  setWeight: React.Dispatch<React.SetStateAction<t.Weight | undefined>>;
  fullWidth?: boolean;
}

export const WeightInput: React.FC<WeightInput> = ({
  weight,
  setWeight,
  fullWidth
}) => {
  const {
    settings: { unit: defaultUnit }
  } = hooks.useSettings();
  const [unit, setUnit] = React.useState<t.WeightUnit>(
    weight?.unit || defaultUnit
  );
  const [value, setValue] = React.useState<number | undefined>(weight?.value);
  const hasInitialized = React.useRef(false);

  // Normalize kg/lbs value to 1 decimal place.
  React.useEffect(() => {
    if (value !== undefined) {
      const asString = value.toString();
      const withDecimal = value.toFixed(1);
      if (asString.indexOf(".") !== -1 && withDecimal !== asString) {
        setValue(parseFloat(withDecimal));
      }
    }
  }, [value]);

  React.useEffect(() => {
    // Initalize if weight becomes not undefined.
    if (weight !== undefined && hasInitialized.current === false) {
      setValue(weight.value);
      setUnit(weight.unit);
      hasInitialized.current = true;
    }
  }, [weight]);

  React.useEffect(() => {
    if (value !== undefined) {
      setWeight((old) => {
        if (old === undefined || old.value === value) {
          return old;
        }
        const nu = old.clone();
        nu.value = value;
        return nu;
      });
    }
  }, [value]);

  // If unit changes, weight should change accordingly.
  React.useEffect(() => {
    setWeight((old) => {
      const nu = old?.clone().toUnit(unit);
      if (nu !== undefined) {
        setValue(nu.value);
      }
      return nu;
    });
  }, [unit, setWeight]);

  return (
    <div className="field has-addons has-addons-right flex-grow">
      <p className="control is-expanded">
        <input
          className={classNames("input", { "is-full-width": fullWidth })}
          type="number"
          placeholder="123"
          value={value === undefined ? "" : value}
          onChange={(e) => {
            if (e.target.value !== "") {
              setValue(e.target.valueAsNumber);
            } else {
              setValue(undefined);
            }
          }}
          onBlur={() => {
            setValue((old) => {
              if (
                old === undefined ||
                new t.Weight(old, unit).lessThanEq(t.Weight.bar())
              ) {
                return t.Weight.bar().toUnit(unit).value;
              } else {
                return old;
              }
            });
            setWeight((old) =>
              old === undefined || old.lessThanEq(t.Weight.bar())
                ? t.Weight.bar()
                : old
            );
          }}
          onKeyDown={(evt) =>
            (evt.key === "e" || evt.key === ".") && evt.preventDefault()
          }
        />
      </p>
      <p className="control">
        <span className="select">
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as t.WeightUnit)}
          >
            {Object.values(t.WeightUnit).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </span>
      </p>
    </div>
  );
};

export default WeightInput;
