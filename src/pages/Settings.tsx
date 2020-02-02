import * as React from "react";
import Select from "../components/general/Select";
import WithLabel from "../components/general/WithLabel";
import * as hooks from "../hooks";
import * as t from "../types";

export default () => {
  hooks.useMeasurePage("Settings");
  const { settings, setSettings } = hooks.useSettings();
  const { unit } = settings;

  const setWeightUnit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as t.WeightUnit;
    setSettings((old) => ({ ...old, unit: newUnit }));
  };
  return (
    <>
      <h2 className="title">Settings</h2>
      <div className="settings-entry">
        <h4 className="subtitle">General</h4>
        <WithLabel label="Units">
          <Select
            onChange={setWeightUnit}
            value={unit}
            options={[
              { label: "Kilogram", value: t.WeightUnit.KILOGRAM },
              { label: "Pound", value: t.WeightUnit.POUND }
            ]}
          />
        </WithLabel>
      </div>
    </>
  );
};
