import * as React from "react";
import Select from "../components/general/Select";
import WithLabel from "../components/general/WithLabel";
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
        <WithLabel label="Units">
          <Select<t.WeightUnit>
            onChange={setUnit}
            initial={unit}
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
