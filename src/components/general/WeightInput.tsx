import * as React from "react";
import * as hooks from "../../hooks";
import * as t from "../../types";
import classNames from "classnames";

interface WeightInput
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  weight?: t.Weight;
  setWeight: React.Dispatch<React.SetStateAction<t.Weight | undefined>>;
  fullWidth?: boolean;
}

const WeightInput: React.FC<WeightInput> = ({
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

  React.useEffect(() => {
    if (weight !== undefined) {
      setValue(weight.value);
      setUnit(weight.unit);
    }
  }, [weight]);

  React.useEffect(() => {
    if (value !== undefined) {
      setWeight(new t.Weight(value, unit));
    } else {
      setWeight(undefined);
    }
  }, [unit, value, setWeight]);

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
