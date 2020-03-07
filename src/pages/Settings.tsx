import * as React from "react";
import SelectUnit from "../components/general/SelectUnit";
import * as hooks from "../hooks";
import * as t from "../types";

export default () => {
  hooks.useMeasurePage("Settings");
  const { settings, setSettings } = hooks.useSettings();

  const [unit, setUnit] = React.useState<t.WeightUnit>(settings.unit);

  React.useEffect(() => {
    if (unit !== undefined) {
      setSettings((old) => ({ ...old, unit }));
    }
  }, [unit, setSettings]);

  return (
    <>
      <h2 className="title">Settings</h2>
      <div className="settings-entry">
        <h4 className="subtitle">General</h4>
        <SelectUnit update={setUnit} initial={unit} />
      </div>
    </>
  );
};
