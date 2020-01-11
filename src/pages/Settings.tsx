import * as React from "react";
import Checkbox from "../components/general/Checkbox";
import * as hooks from "../hooks";

export default () => {
  const { settings, setSettings } = hooks.useSettings();
  const { showOlympic } = settings;
  const toggleOlympic = () => {
    setSettings((old) => ({ ...old, showOlympic: !old.showOlympic }));
  };
  return (
    <>
      <h2 className="title">Settings</h2>
      <div>
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
