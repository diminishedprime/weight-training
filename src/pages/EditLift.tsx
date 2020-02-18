import * as React from "react";
import { useHistory, useParams } from "react-router-dom";
import * as g from "../components/general";
import * as db from "../db";
import * as hooks from "../hooks";
import * as t from "../types";

export default () => {
  const { liftId } = useParams();
  const firestore = t.useSelector((a) => a.firestore);
  const cleanupPagePath = React.useCallback(
    (pageName: string) => pageName.replace(`${liftId}`, "{liftId}"),
    [liftId]
  );
  hooks.useMeasurePage("Edit Lift", cleanupPagePath);
  const [weight, setWeight] = React.useState<t.Weight | undefined>();
  const [reps, setReps] = React.useState<number>(1);
  const [date, setDate] = React.useState("");
  const [warmup, setWarmup] = React.useState(false);
  const history = useHistory();

  const user = hooks.useForceSignIn();
  React.useEffect(() => {
    if (user === null || liftId === undefined) {
      return;
    }
    db.getLift(firestore, user, liftId).then((lift) => {
      if (lift === undefined) {
        // TODO this could have better error handling.
        return;
      }
      setWeight(lift.getWeight());
      setReps(lift.getReps());
      setDate(
        lift
          .getDate()
          .toDate()
          .toISOString()
      );
      setWarmup(lift.getWarmup());
    });
  }, [user, liftId, firestore]);

  const onCancel = React.useCallback(() => {
    history.goBack();
  }, [history]);

  const onUpdate = React.useCallback(() => {
    if (user === null) {
      return;
    }
    if (weight !== undefined && liftId !== undefined) {
      db.updateLift(firestore, user, liftId, {
        weight,
        reps,
        warmup
      }).then(() => history.goBack());
    }
  }, [history, weight, reps, liftId, user, warmup, firestore]);

  const onDelete = React.useCallback(() => {
    if (user === null || liftId === undefined) {
      return;
    }
    db.deleteLift(firestore, user, liftId).then(() => history.goBack());
  }, [history, liftId, user, firestore]);

  return (
    <div>
      <div className="title is-5">Edit Lift</div>
      <div className="field is-grouped">
        <g.SetReps reps={reps} setReps={setReps} />
        <g.WithLabel label="Weight">
          <g.WeightInput setWeight={setWeight} weight={weight} />
        </g.WithLabel>
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
