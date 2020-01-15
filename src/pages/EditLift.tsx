import firebase from "firebase/app";
import * as React from "react";
import { useHistory, useParams } from "react-router-dom";
import WeightInput from "../components/general/WeightInput";
import * as db from "../db";
import * as hooks from "../hooks";
import * as t from "../types";

export default () => {
  hooks.useMeasurePage("Edit Lift");
  const { liftId } = useParams();
  const [weight, setWeight] = React.useState<t.Weight | undefined>();
  const [reps, setReps] = React.useState("");
  const [date, setDate] = React.useState("");
  const [warmup, setWarmup] = React.useState(false);
  const history = useHistory();

  const onRepsChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setReps(e.target.value);
    },
    []
  );

  const user = hooks.useForceSignIn();
  React.useEffect(() => {
    if (user === null || liftId === undefined) {
      return;
    }
    db.getLift(firebase.firestore(), user.uid, liftId).then((lift) => {
      if (lift === undefined) {
        // TODO this could have better error handling.
        return;
      }
      setWeight(lift.weight);
      setReps(lift.reps.toString());
      setDate(lift.date.toDate().toISOString());
      if (lift.warmup !== undefined) {
        setWarmup(lift.warmup);
      }
    });
  }, [user, liftId]);

  const onCancel = React.useCallback(() => {
    history.goBack();
  }, [history]);

  const onUpdate = React.useCallback(() => {
    if (user === null) {
      return;
    }
    if (weight !== undefined && reps !== "" && liftId !== undefined) {
      db.updateLift(firebase.firestore(), user.uid, liftId, {
        weight,
        reps: parseInt(reps, 10),
        warmup
      }).then(() => history.goBack());
    }
  }, [history, weight, reps, liftId, user, warmup]);

  const onDelete = React.useCallback(() => {
    if (user === null || liftId === undefined) {
      return;
    }
    db.deleteLift(firebase.firestore(), user.uid, liftId).then(() =>
      history.goBack()
    );
  }, [history, liftId, user]);

  return (
    <div>
      <div className="title is-5">Edit Lift</div>
      <div className="field">
        <label className="label">Weight</label>
        <WeightInput weight={weight} setWeight={setWeight} />
      </div>
      <div className="field">
        <label className="label">Reps</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="1"
            value={reps}
            onChange={onRepsChange}
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Date</label>
        <div className="control">
          <input className="input" type="text" readOnly value={date} />
        </div>
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
      <div className="field is-grouped">
        <div className="control">
          <button onClick={onDelete} className="button is-link is-danger">
            Delete
          </button>
        </div>
        <div className="control">
          <button onClick={onUpdate} className="button is-link is-success">
            Update
          </button>
        </div>
        <div className="control">
          <button onClick={onCancel} className="button is-link is-warning">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
