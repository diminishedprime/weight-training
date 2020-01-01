import * as React from "react";
import * as t from "../../types";
import * as db from "../../db";
import firebase from "firebase/app";
import Bar from "../Bar";
import * as util from "../../util";

const AddLift = ({
  liftType,
  user
}: t.RecordLiftProps & { user: firebase.User }) => {
  const [weight, setWeight] = React.useState<string>("45");
  const [reps, setReps] = React.useState<string>("1");
  const [addEnabled, setAddEnabled] = React.useState(false);
  const plateConfig = util.platesFor(parseInt(weight));
  React.useEffect(() => {
    if (weight !== "") {
      setAddEnabled(true);
    }
  }, [weight]);
  const onWeightChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.match(/^[0-9]*$/)) {
        setWeight(value);
      }
    },
    []
  );
  const onRepsChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.match(/^[0-9]*$/)) {
        setReps(value);
      }
    },
    []
  );
  const addWeight = React.useCallback(
    (amount: number) => () => {
      setWeight(old => {
        const nu = parseInt(old) + amount;
        if (nu < 0) {
          return "45";
        }
        return nu.toString();
      });
    },
    []
  );
  const addLiftOnClick = React.useCallback(() => {
    if (weight === "") {
      return;
    }
    const lift: t.Lift = {
      weight: parseInt(weight),
      type: liftType,
      date: new Date(),
      reps: parseInt(reps)
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
            <button onClick={addWeight(90)} className="button">
              45
            </button>
            <button onClick={addWeight(50)} className="button">
              25
            </button>
            <button onClick={addWeight(20)} className="button">
              10
            </button>
            <button onClick={addWeight(10)} className="button">
              5
            </button>
            <button onClick={addWeight(5)} className="button">
              2.5
            </button>
          </div>
        </div>
      </div>
      <div className="field is-grouped">
        <div className="control is-expanded">
          <div className="control">
            <label className="label">Reps</label>
            <input
              className="input"
              placeholder="Reps"
              value={reps}
              onChange={onRepsChange}
            />
          </div>
        </div>
        <div className="control">
          <label className="label">Weight</label>
          <div className="control is-expanded">
            <input
              className="input"
              placeholder="Weight"
              value={weight}
              onChange={onWeightChange}
            />
          </div>
        </div>
      </div>
      <div className="field is-right is-grouped is-grouped-right">
        <button
          className="button is-success"
          onClick={addLiftOnClick}
          disabled={!addEnabled}
        >
          Add
        </button>
      </div>
    </>
  );
};

export default AddLift;
