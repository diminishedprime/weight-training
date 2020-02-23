import * as React from "react";
import * as db from "../../db";
import * as hooks from "../../hooks";
import * as t from "../../types";
import * as util from "../../util";
import BarInput from "../BarInput";
import * as g from "../general";

interface AddLiftProps {
  liftType: t.BarbellLiftType;
  user: t.FirebaseUser;
}

const AddLift: React.FC<AddLiftProps> = ({ liftType, user }) => {
  const firestore = hooks.useFirestore();
  const {
    settings: { unit: defaultUnit }
  } = hooks.useSettings();
  const [weight, setWeight] = React.useState<t.Weight>(
    t.Weight.bar(defaultUnit)
  );
  const [reps, setReps] = React.useState(1);
  const [warmup, setWarmup] = React.useState(false);
  const addEnabled = weight !== undefined;
  const addLiftOnClick = React.useCallback(() => {
    if (weight === undefined) {
      return;
    }
    const lift: t.Lift = t.Lift.forBarbellLift(
      weight,
      liftType,
      reps,
      warmup,
      util.now()
    );
    db.addLift(firestore, user, lift);
  }, [weight, liftType, reps, user, warmup, firestore]);

  return (
    <>
      <BarInput weight={weight} onWeightChange={setWeight} />
      <div className="field is-grouped flex">
        <g.SetReps reps={reps} setReps={setReps} />
        <div className="field flex">
          <label className="checkbox flex flex-center full-width flex-end">
            <input
              type="checkbox"
              checked={warmup}
              onChange={(e) => setWarmup(e.target.checked)}
            />
            Warmup
          </label>
        </div>
      </div>
      <div className="field flex flex-between">
        <button
          className="button is-success"
          onClick={addLiftOnClick}
          disabled={!addEnabled}
        >
          Add Lift
        </button>
      </div>
    </>
  );
};

export default AddLift;
