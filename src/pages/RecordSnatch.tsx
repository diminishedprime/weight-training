import * as React from "react";
import BarInput from "../components/BarInput";
import * as hooks from "../hooks";

const RecordSnatch: React.FC = () => {
  hooks.useMeasurePage("Record Snatch");
  const user = hooks.useForceSignIn();
  const { weight, setWeight } = hooks.useDefaultBar();

  if (user === null) {
    return null;
  }

  return (
    <>
      <BarInput weight={weight} onWeightChange={setWeight} />
    </>
  );
};

export default RecordSnatch;
