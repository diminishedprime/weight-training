import * as React from "react";
import * as hooks from "./hooks";
import firebase from "firebase/app";
import * as util from "./util";
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
  const [weight, setWeight] = React.useState<string>("45");
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

const range = (to: number): Array<undefined> => {
  const a: undefined[] = [];
  for (let i = 0; i < to; i++) {
    a.push(undefined);
  }
  return a;
};

const Plates = ({ plates }: { plates: t.PlateConfig }) => {
  const plateGroup: [t.PlateTypes, number][] = Object.entries(plates).filter(
    ([, number]) => number > 0
  ) as [t.PlateTypes, number][];
  return plateGroup.length === 0 ? (
    <div>Nope</div>
  ) : (
    <div className="small-plates">
      {plateGroup.map(([plateType, number]) => {
        return (
          <React.Fragment key={`${plateType}-${number}`}>
            {range(number).map((_, idx) => {
              return (
                <div
                  key={`${plateType}-${number}-${idx}`}
                  className={`${plateType} small-plate`}
                >
                  {t.PlateWeight[plateType]}
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const SimpleLiftTable = ({
  program,
  user
}: {
  program: t.Program;
  user: firebase.User;
}) => {
  const [currentLift, setCurrentLift] = React.useState(0);
  const [skippedLifts, setSkippedLifts] = React.useState<{
    [idx: string]: boolean;
  }>({});
  const [completedLifts, setCompletedLifts] = React.useState<{
    [idx: string]: boolean;
  }>({});

  const skipLift = React.useCallback(() => {
    if (currentLift < program.length) {
      setSkippedLifts(old => ({ ...old, [currentLift]: true }));
      setCurrentLift(old => old + 1);
    }
  }, [currentLift, program.length]);

  const completeLift = React.useCallback(() => {
    if (currentLift < program.length) {
      const lift: t.Lift = { ...program[currentLift], date: new Date() };
      // Don't need to block on this.
      db.addLift(firebase.firestore(), user.uid, lift);
      setCompletedLifts(old => ({ ...old, [currentLift]: true }));
      setCurrentLift(old => old + 1);
    }
  }, [currentLift, program, user.uid]);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Reps</th>
          <th>Weight</th>
          <th>Plates</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {program.map((lift, idx) => {
          const isSelected = idx === currentLift;
          const isSkipped = skippedLifts[idx];
          const isCompleted = completedLifts[idx];
          return (
            <tr
              key={idx}
              className={`${isSelected ? "is-selected" : ""} ${
                isSkipped ? "is-skipped-row" : ""
              } ${isCompleted ? "is-completed-row" : ""}`}
            >
              <td>{lift.reps}</td>
              <td>{lift.weight}</td>
              <td className="plates">
                <Plates
                  plates={util.splitConfig(util.platesFor(lift.weight))}
                />
              </td>
              <td>
                {isSelected && (
                  <button onClick={skipLift} className="button is-small">
                    Skip
                  </button>
                )}
              </td>
              <td>
                {isSelected && (
                  <button onClick={completeLift} className="button is-small">
                    Done
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const FiveByFive = ({
  user,
  liftType
}: {
  user: firebase.User;
  liftType: t.LiftType;
}) => {
  // TODO persist the current workout in firebase so users don't lose progress on a refresh.
  // TODO add a calculator for estimating 1RM based on a 3x3 or 5x5.
  const [oneRepMax, setOneRepMax] = React.useState<number | undefined>();
  React.useEffect(() => {
    db.getOneRepMax(firebase.firestore(), user.uid, liftType).then(orm => {
      if (orm !== undefined) {
        setOneRepMax(orm);
      }
    });
  }, [liftType, user.uid]);
  const [ready, setReady] = React.useState(false);
  const [program, setProgram] = React.useState<t.Program | undefined>(
    undefined
  );
  const oneRepMaxOnChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.match(/^[0-9]*$/)) {
        if (value === "") {
          setOneRepMax(undefined);
        } else {
          setOneRepMax(parseInt(value));
        }
      }
    },
    []
  );

  const onSetOneRepMax = React.useCallback(() => {
    if (oneRepMax !== undefined) {
      db.setOneRepMax(firebase.firestore(), user.uid, liftType, oneRepMax);
      setReady(true);
    }
  }, [user.uid, liftType, oneRepMax]);

  React.useEffect(() => {
    if (ready && oneRepMax !== undefined) {
      setProgram(util.programFor(t.WorkoutType.FIVE_BY_FIVE, oneRepMax));
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
                value={oneRepMax === undefined ? "" : oneRepMax.toString()}
                onChange={oneRepMaxOnChange}
              />
            </div>
            <div className="control">
              <button
                className="button is-info"
                disabled={oneRepMax === undefined}
                onClick={onSetOneRepMax}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}
      {program && (
        <div>
          <div className="title is-7">Program</div>
          <SimpleLiftTable program={program} user={user} />
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
  >(undefined);

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
      {selectedWorkout === t.WorkoutType.FIVE_BY_FIVE && (
        <FiveByFive user={user} liftType={liftType} />
      )}
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
