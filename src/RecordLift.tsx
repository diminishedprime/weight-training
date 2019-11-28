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

const programFor = (workout: t.WorkoutType, oneRepMax: number): t.Program => {
  if (workout === t.WorkoutType.FIVE_BY_FIVE) {
    const targetWeight = oneRepMax * 0.8;
    const splits = (targetWeight - t.BAR_WEIGHT) / 4;
    return [
      { weight: 45, reps: 5, type: t.LiftType.DEADLIFT },
      { weight: 45 + splits, reps: 5, type: t.LiftType.DEADLIFT },
      { weight: 45 + splits * 2, reps: 3, type: t.LiftType.DEADLIFT },
      { weight: 45 + splits * 3, reps: 2, type: t.LiftType.DEADLIFT },
      { weight: targetWeight, reps: 5, type: t.LiftType.DEADLIFT },
      { weight: targetWeight, reps: 5, type: t.LiftType.DEADLIFT },
      { weight: targetWeight, reps: 5, type: t.LiftType.DEADLIFT },
      { weight: targetWeight, reps: 5, type: t.LiftType.DEADLIFT },
      { weight: targetWeight, reps: 5, type: t.LiftType.DEADLIFT }
    ];
  }
  return [];
};

const SimpleLiftTable = ({ program }: { program: t.Program }) => {
  const [currentLift, setCurrentLift] = React.useState(0);
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Reps</th>
          <th>Weight</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {program.map((lift, idx) => {
          const isSelected = idx === currentLift;
          return (
            <tr className={isSelected ? "is-selected" : ""}>
              <td>{lift.reps}</td>
              <td>{lift.weight}</td>
              <td>
                {isSelected && (
                  <button className="button is-small">Skip</button>
                )}
              </td>
              <td>
                {isSelected && (
                  <button className="button is-small">Done</button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const FiveByFive = () => {
  // TODO add a calculator for estimating 1RM based on a 3x3 or 5x5.
  // TODO change back to defaults so the UI must be traversed.
  const [oneRepMax, setOneRepMax] = React.useState((165 / 0.8).toString());
  const [ready, setReady] = React.useState(true);
  const [program, setProgram] = React.useState<t.Program | undefined>(
    undefined
  );
  const oneRepMaxOnChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.match(/^[0-9]*$/)) {
        setOneRepMax(value);
      }
    },
    []
  );

  React.useEffect(() => {
    if (ready && oneRepMax) {
      setProgram(programFor(t.WorkoutType.FIVE_BY_FIVE, parseInt(oneRepMax)));
    }
  }, [ready, oneRepMax]);

  return (
    <div>
      <div className="title is-5">5x5</div>
      {!ready && (
        <div className="field">
          <label className="label">Current One Rep Max</label>
          <div className="field has-addons is-full-width">
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="123"
                value={oneRepMax}
                onChange={oneRepMaxOnChange}
              />
            </div>
            <div className="control">
              <button
                className="button is-info"
                disabled={oneRepMax === ""}
                onClick={() => {
                  setReady(true);
                }}
              >
                Set
              </button>
            </div>
          </div>
        </div>
      )}
      {program && (
        <div>
          <div className="title is-7">Program</div>
          <SimpleLiftTable program={program} />
        </div>
      )}
    </div>
  );
};

const PreDefinedWorkout = ({
  liftType,
  user
}: RecordLiftProps & { user: firebase.User }) => {
  const [selectedWorkout, setSelectedWorkout] = React.useState<
    t.WorkoutType | undefined
  >(t.WorkoutType.FIVE_BY_FIVE);

  return (
    <div>
      {selectedWorkout === undefined && (
        <div>
          <div className="title is-5">Select a workout</div>
          <div>
            <button className="button">1 Rep Max</button>
            <button className="button">3x3</button>
            <button
              className="button"
              onClick={() => setSelectedWorkout(t.WorkoutType.FIVE_BY_FIVE)}
            >
              5x5
            </button>
            <button
              className="button"
              onClick={() => setSelectedWorkout(t.WorkoutType.CUSTOM)}
            >
              Custom
            </button>
          </div>
        </div>
      )}
      {selectedWorkout === t.WorkoutType.CUSTOM && (
        <AddLift liftType={liftType} user={user} />
      )}
      {selectedWorkout === t.WorkoutType.FIVE_BY_FIVE && <FiveByFive />}
    </div>
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
          <img src={t.liftSvgMap[liftType]} width="50" alt="" />
        </figure>
      </div>
      <PreDefinedWorkout liftType={liftType} user={user} />
      <hr />
      <LiftTable liftType={liftType} user={user} />
    </Layout>
  );
};
