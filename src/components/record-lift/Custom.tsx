import * as React from "react";
import * as c from "../../constants";
import * as db from "../../db";
import * as t from "../../types";
import * as util from "../../util";
import Bar from "../Bar";
import * as g from "../general";
import WeightInput from "../general/WeightInput";
import WithLabel from "../general/WithLabel";

interface AddLiftProps {
  liftType: t.BarbellLiftType;
  user: t.FirebaseUser;
}

const AddLift: React.FC<AddLiftProps> = ({ liftType, user }) => {
  const firestore = t.useSelector((a) => a.firestore);
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
      <Bar weight={weight || t.Weight.bar()} />
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
        <g.SetReps reps={reps} setReps={setReps} />
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
