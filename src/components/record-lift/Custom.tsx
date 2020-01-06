import * as React from "react";
import * as t from "../../types";
import * as db from "../../db";
import firebase from "firebase/app";
import Bar from "../Bar";
import * as util from "../../util";
import * as c from "../../constants";

interface SetWeightProps {
  setWeight: React.Dispatch<React.SetStateAction<number | undefined>>;
  weight?: number;
}
const SetWeight: React.FC<SetWeightProps> = ({ setWeight, weight }) => {
  const onWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log({ value: e.target.value });
    if (e.target.value === "") {
      setWeight(undefined);
    } else {
      if (e.target.valueAsNumber > 1500) {
        setWeight(1500);
        return;
      }
      setWeight(e.target.valueAsNumber);
    }
  };
  return (
    <div className="control is-expanded">
      <label className="label">Weight</label>
      <input
        className="input"
        type="number"
        onBlur={() => {
          setWeight(old => (old === undefined || old < 45 ? 45 : old));
        }}
        onKeyDown={evt =>
          (evt.key === "e" || evt.key === ".") && evt.preventDefault()
        }
        onChange={onWeightChange}
        value={weight === undefined ? "" : weight}
      />
    </div>
  );
};

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
          onClick={() => setReps(a => Math.max(1, a - 1))}
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
          onClick={() => setReps(a => a + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
};

const AddLift = ({ liftType, user }: t.RecordLiftProps & { user: t.User }) => {
  const [weight, setWeight] = React.useState<number | undefined>(45);
  const [reps, setReps] = React.useState(1);
  const addEnabled = weight !== undefined;
  const plateConfig = util.platesFor(weight || 45);
  const addLiftOnClick = React.useCallback(() => {
    if (weight === undefined) {
      return;
    }
    const lift: t.Lift = {
      weight: weight,
      type: liftType,
      date: new Date(),
      reps: reps
    };
    db.addLift(firebase.firestore(), user.uid, lift);
  }, [weight, liftType, reps, user.uid]);

  return (
    <>
      <Bar plateConfig={plateConfig} />
      <div className="field is-grouped">
        <div className="control full-width">
          <label className="label">Add Plate</label>
          <div className="buttons has-addons is-right add-plates">
            {Object.entries(c.plateWeight).map(([plate, weight]) => (
              <button
                key={`add-weight-${weight}`}
                onClick={() => setWeight(old => old! + weight * 2)}
                disabled={weight === undefined}
                className="button"
              >
                <div>
                  {weight}
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
        <SetWeight weight={weight} setWeight={setWeight} />
      </div>
      <div className="field flex flex-between">
        <button
          className="button is-danger is-outlined"
          onClick={() => setWeight(45)}
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
