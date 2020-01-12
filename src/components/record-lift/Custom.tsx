import firebase from "firebase/app";
import * as React from "react";
import * as c from "../../constants";
import * as db from "../../db";
import * as hooks from "../../hooks";
import * as t from "../../types";
import * as util from "../../util";
import Bar from "../Bar";

interface SetWeightProps {
  setWeight: React.Dispatch<React.SetStateAction<t.Weight | undefined>>;
  weight?: t.Weight;
}
const SetWeight: React.FC<SetWeightProps> = ({ setWeight, weight }) => {
  const {
    settings: { unit }
  } = hooks.useSettings();
  const onWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setWeight(undefined);
    } else {
      if (unit === t.WeightUnit.POUND && e.target.valueAsNumber > 1500) {
        setWeight(t.Weight.lbs(1500));
        return;
      } else if (
        unit === t.WeightUnit.KILOGRAM &&
        e.target.valueAsNumber > t.Weight.lbsToKilo(1500)
      ) {
        setWeight(t.Weight.kilo(t.Weight.lbsToKilo(1500)));
      } else {
        setWeight((old) =>
          old === undefined
            ? new t.Weight(e.target.valueAsNumber, unit)
            : old.withValue(e.target.valueAsNumber)
        );
      }
    }
  };
  return (
    <div className="control is-expanded">
      <label className="label">Weight</label>
      <input
        className="input"
        type="number"
        onBlur={() => {
          setWeight((old) =>
            old === undefined || old.lessThanEq(t.Weight.bar())
              ? t.Weight.bar()
              : old
          );
        }}
        onKeyDown={(evt) =>
          (evt.key === "e" || evt.key === ".") && evt.preventDefault()
        }
        onChange={onWeightChange}
        value={weight === undefined ? "" : weight.value}
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
    const lift: t.Lift = {
      weight,
      type: liftType,
      date: firebase.firestore.Timestamp.now(),
      reps,
      warmup
    };
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
        <SetWeight weight={weight} setWeight={setWeight} />
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
