import * as React from "react";
import * as hooks from "./hooks";
import firebase from "firebase/app";
import LiftTable from "./LiftTable";
import Layout from "./Layout";
import * as t from "./types";
import * as db from "./db";

type RecordLiftProps = {
  liftType: t.LiftType;
};

const AddLift = ({
  liftType,
  user
}: RecordLiftProps & { user: firebase.User }) => {
  const [weight, setWeight] = React.useState<string>("");
  const [reps, setReps] = React.useState<string>("1");
  const [addEnabled, setAddEnabled] = React.useState(false);
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

export default ({ liftType }: RecordLiftProps) => {
  // TODO - this should really come from a state-store.
  const user = hooks.useForceSignIn();
  if (user === null) {
    return null;
  }
  return (
    <Layout>
      <div className="title">
        <div className="centered">{liftType}</div>
        <figure className="card-svg">
          <img src={t.liftSvgMap[liftType]} width="50" />
        </figure>
      </div>
      <AddLift liftType={liftType} user={user} />
      <hr />
      <LiftTable liftType={liftType} user={user} />
    </Layout>
  );
};
