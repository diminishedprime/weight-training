import * as React from "react";
import firebase from "firebase/app";
import { useParams, useHistory } from "react-router-dom";
import * as hooks from "../hooks";
import * as db from "../db";

export default () => {
  const { liftId } = useParams();
  const [weight, setWeight] = React.useState("");
  const [reps, setReps] = React.useState("");
  const [date, setDate] = React.useState("");
  const history = useHistory();

  const onWeightChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setWeight(e.target.value);
    },
    []
  );
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
    db.getLift(firebase.firestore(), user.uid, liftId).then(lift => {
      if (lift === undefined) {
        // TODO this could have better error handling.
        return;
      }
      setWeight(lift.weight.toString());
      setReps(lift.reps.toString());
      setDate(lift.date.toISOString());
    });
  }, [user, liftId]);

  const onCancel = React.useCallback(() => {
    history.goBack();
  }, [history]);

  const onUpdate = React.useCallback(() => {
    if (user === null) {
      return;
    }
    if (weight !== "" && reps !== "" && liftId !== undefined) {
      db.updateLift(firebase.firestore(), user.uid, liftId, {
        weight: parseInt(weight),
        reps: parseInt(reps)
      }).then(() => history.goBack());
    }
  }, [history, weight, reps, liftId, user]);

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
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="123"
            value={weight}
            onChange={onWeightChange}
          />
        </div>
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
