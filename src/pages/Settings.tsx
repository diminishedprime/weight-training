import * as React from "react";
import Checkbox from "../components/general/Checkbox";
import Select from "../components/general/Select";
import WithLabel from "../components/general/WithLabel";
import * as hooks from "../hooks";
import * as t from "../types";

export default () => {
  hooks.useMeasurePage("Settings");
  const { settings, setSettings } = hooks.useSettings();
  const { showOlympic, unit } = settings;
  const toggleOlympic = () => {
    setSettings((old) => ({ ...old, showOlympic: !old.showOlympic }));
  };

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
      <div className="settings-entry">
        <h4 className="subtitle">Home Page</h4>
        <Checkbox
          checked={showOlympic}
          label="Show Olympic Lifts"
          onChange={toggleOlympic}
        />
      </div>
    </>
  );
};
