import * as React from "react";
import * as hooks from "../hooks";
import * as t from "../types";

interface SelectUnitProps {
  unit?: t.WeightUnit;
  onUnitChange: (unit: t.WeightUnit) => void;
}

const SelectUnit: React.FC<SelectUnitProps> = ({
  onUnitChange,
  unit: propUnit
}) => {
  const {
    settings: { unit: defaultUnit }
  } = hooks.useSettings();
  const [unit, setUnit] = React.useState(propUnit || defaultUnit);

  React.useEffect(() => {
    onUnitChange(unit);
  }, [unit, onUnitChange]);

  return (
    <div className="select">
      <select
        value={unit}
        onChange={(e) => {
          setUnit(e.target.value as t.WeightUnit);
        }}
      >
        {Object.values(t.WeightUnit).map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectUnit;
