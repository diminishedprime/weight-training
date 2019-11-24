import * as React from "react";
import * as hooks from "./hooks";
import firebase from "firebase/app";
import LiftTable from "./LiftTable";
import Layout from "./Layout";
import * as t from "./types";

type RecordLiftProps = {
  liftType: t.LiftType;
};

const AddLift = ({
  liftType,
  user
}: RecordLiftProps & { user: firebase.User }) => {
  const [weight, setWeight] = React.useState<string>("");
  const [date, setDate] = React.useState<Date>(new Date());
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
  const onDateChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.valueAsDate) {
        setDate(e.target.valueAsDate);
      }
    },
    []
  );
  const addLift = React.useCallback(() => {
    if (weight === "") {
      return;
    }
    const lift: t.Lift = {
      weight: parseInt(weight),
      type: liftType,
      date,
      reps: parseInt(reps)
    };
    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .collection("lifts")
      .add(lift);
  }, [date, weight, liftType, reps, user.uid]);
  return (
    <>
      <div className="field is-grouped">
        <div className="control">
          <input
            className="input"
            type="date"
            onChange={onDateChange}
            value={date.toISOString().substr(0, 10)}
          />
        </div>
        <div className="control is-expanded">
          <input
            className="input"
            placeholder="Reps"
            value={reps}
            onChange={onRepsChange}
          />
        </div>
        <div className="control is-expanded">
          <input
            className="input"
            placeholder="Weight"
            value={weight}
            onChange={onWeightChange}
          />
        </div>
      </div>
      <div className="field is-right is-grouped is-grouped-right">
        <button
          className="button is-success"
          onClick={addLift}
          disabled={!addEnabled}
        >
          Add
        </button>
      </div>
    </>
  );
};

export default ({ liftType }: RecordLiftProps) => {
  const user = hooks.useForceSignIn();
  if (user === null) {
    return null;
  }
  return (
    <Layout>
      <div className="title">{liftType}</div>
      <AddLift liftType={liftType} user={user} />
      <hr />
      <LiftTable liftType={liftType} user={user} />
    </Layout>
  );
};
