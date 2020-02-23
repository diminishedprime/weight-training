import * as React from "react";
import BarInput from "../components/BarInput";
import Checkbox from "../components/general/Checkbox";
import Select from "../components/general/Select";
import SetReps from "../components/general/SetReps";
import SnatchTable from "../components/SnatchTable";
import * as hooks from "../hooks";
import * as t from "../types";
import * as util from "../util";

const RecordSnatch: React.FC = () => {
  hooks.useMeasurePage("Record Snatch");
  const user = hooks.useForceSignIn();
  const db = t.useSelector((a) => a.db);
  t.useSelector((a) => a.forceUpdateLift);
  const [reps, setReps] = React.useState(1);
  const [warmup, setWarmup] = React.useState(false);
  const [style, setStyle] = React.useState<t.SnatchStyle>(t.SnatchStyle.Full);
  const [startPosition, setStartPosition] = React.useState<t.SnatchPosition>(
    t.SnatchPosition.Floor
  );
  const { weight, setWeight } = hooks.useDefaultBar();

  const addSnatch = React.useCallback(() => {
    if (style !== undefined && startPosition !== undefined && user !== null) {
      db.addSnatch(
        user,
        util.now(),
        weight,
        reps,
        warmup,
        style,
        startPosition
      );
    }
  }, [user, weight, reps, warmup, style, startPosition, db]);

  const modifyQuery = React.useCallback(
    (q: t.Query) => q.orderBy("date", "desc"),
    []
  );

  if (user === null) {
    return null;
  }

  return (
    <>
      <h2 className="is-3 subtitle centered">Snatch</h2>
      <BarInput weight={weight} onWeightChange={setWeight} />
      <div className="flex flex-between m-margin-top flex-items-center">
        <Select<t.SnatchPosition>
          initial={startPosition}
          onChange={setStartPosition}
          options={Object.values(t.SnatchPosition).map((pos) => ({
            value: pos,
            label: pos as string
          }))}
        />
        <Select<t.SnatchStyle>
          initial={style}
          onChange={setStyle}
          options={Object.values(t.SnatchStyle).map((pos) => ({
            value: pos,
            label: pos as string
          }))}
        />

        <Checkbox
          label="Warmup"
          onChange={(e) => setWarmup(e.target.checked)}
        />
      </div>
      <div className="flex flex-between m-margin-top flex-items-end">
        <SetReps reps={reps} setReps={setReps} />
        <button
          onClick={addSnatch}
          className="button is-primary is-outlined m-margin-top"
        >
          Add
        </button>
      </div>
      <hr />
      <SnatchTable user={user} modifyQuery={modifyQuery} />
    </>
  );
};

export default RecordSnatch;
