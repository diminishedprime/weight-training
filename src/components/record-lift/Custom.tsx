import firebase from "firebase/app";
import * as React from "react";
import * as c from "../../constants";
import * as db from "../../db";
import * as t from "../../types";
import * as util from "../../util";
import Bar from "../Bar";
import WeightInput from "../general/WeightInput";
import WithLabel from "../general/WithLabel";

interface SetRepsProps {
  setReps: React.Dispatch<React.SetStateAction<number>>;
  reps: number;
}
const SetReps: React.FC<SetRepsProps> = ({ setReps, reps }) => {
  return (
    <div className="control">
      <label className="label">Reps: {reps}</label>
      <div className="buttons has-addons">
        <button
          className="button is-outlined is-danger"
          onClick={() => setReps((a) => Math.max(1, a - 1))}
        >
          -
        </button>
        <button className="button" onClick={() => setReps(1)}>
          1
        </button>
        <button className="button" onClick={() => setReps(3)}>
          3
        </button>
        <button className="button" onClick={() => setReps(5)}>
          5
        </button>
        <button
          className="button is-outlined is-success"
          onClick={() => setReps((a) => a + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
};

const AddLift = ({ liftType, user }: t.RecordLiftProps & { user: t.User }) => {
  const [weight, setWeight] = React.useState<t.Weight | undefined>(
    t.Weight.bar()
  );
  const [reps, setReps] = React.useState(1);
  const [warmup, setWarmup] = React.useState(false);
  const addEnabled = weight !== undefined;
  const plateConfig = util.platesFor(weight || t.Weight.bar());
  const addLiftOnClick = React.useCallback(() => {
    if (weight === undefined) {
      return;
    }
    const lift: t.Lift = new t.Lift({
      weight,
      type: liftType,
      date: firebase.firestore.Timestamp.now(),
      reps,
      warmup
    });
    db.addLift(firebase.firestore(), user.uid, lift);
  }, [weight, liftType, reps, user.uid, warmup]);

  return (
    <>
      <Bar plateConfig={plateConfig} />
      <div className="field is-grouped">
        <div className="control full-width">
          <label className="label">Add Plate</label>
          <div className="buttons has-addons is-right add-plates">
            {Object.entries(c.plateWeight).map(([plate, weight]) => (
              <button
                key={`add-weight-${weight.value}`}
                onClick={() => setWeight((old) => old!.add(weight.multiply(2)))}
                disabled={weight === undefined}
                className="button"
              >
                <div>
                  {weight.value}
                  {plateConfig !== "not-possible" &&
                    plateConfig[plate as t.PlateTypes] !== 0 && (
                      <span className="has-text-primary">
                        {" "}
                        ({plateConfig[plate as t.PlateTypes] / 2})
                      </span>
                    )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="field is-grouped">
        <SetReps reps={reps} setReps={setReps} />
        <WithLabel label="Weight">
          <WeightInput setWeight={setWeight} weight={weight} />
        </WithLabel>
      </div>
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
      <div className="field flex flex-between">
        <button
          className="button is-danger is-outlined"
          onClick={() => setWeight(t.Weight.bar())}
        >
          Clear Bar
        </button>
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
