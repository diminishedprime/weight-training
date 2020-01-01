import * as React from "react";
import * as util from "../util";
import moment from "moment";
import * as t from "../types";
import * as db from "../db";
import firebase from "firebase/app";
import * as hooks from "../hooks";
import * as rrd from "react-router-dom";

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
            {util.range(number).map((_, idx) => {
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

interface XByXData {
  currentLift: number;
  skippedLifts: { [idx: string]: boolean };
  completedLifts: { [idx: string]: boolean };
}

const SimpleLiftTable = ({
  program,
  user
}: {
  program: t.Program;
  user: firebase.User;
}) => {
  const history = rrd.useHistory();
  const [
    { currentLift, skippedLifts, completedLifts },
    updateXByXData,
    cleanup
  ] = hooks.useLocalStorage<XByXData>(hooks.LocalStorageKey.X_BY_X, {
    currentLift: 0,
    skippedLifts: {},
    completedLifts: {}
  });

  const finishProgram = () => {
    history.goBack();
    cleanup();
  };

  const skipLift = React.useCallback(() => {
    if (currentLift < program.length) {
      updateXByXData(current => {
        return {
          ...current,
          currentLift: current.currentLift + 1,
          skippedLifts: { ...current.skippedLifts, [currentLift]: true }
        };
      });
    }
  }, [currentLift, program.length, updateXByXData]);

  const completeLift = React.useCallback(() => {
    if (currentLift < program.length) {
      const lift: t.Lift = { ...program[currentLift], date: new Date() };
      // Don't need to block on this.
      db.addLift(firebase.firestore(), user.uid, lift);
      updateXByXData(current => {
        return {
          ...current,
          currentLift: current.currentLift + 1,
          completedLifts: { ...current.completedLifts, [currentLift]: true }
        };
      });
      /* setCompletedLifts(old => ({ ...old, [currentLift]: true }));
       * setCurrentLift(old => old + 1); */
    }
  }, [currentLift, program, user.uid, updateXByXData]);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Reps</th>
          <th>Weight</th>
          <th>Plates</th>
          <th></th>
          <th>
            <button
              className="button is-small is-success is-outlined"
              onClick={finishProgram}
            >
              Finish
            </button>
          </th>
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
        {currentLift >= program.length && (
          <tr>
            <td />
            <td />
            <td />
            <td />
            <td>
              <button
                className="button is-small is-success is-outlined"
                onClick={finishProgram}
              >
                Finish
              </button>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

const XByX = ({
  user,
  liftType,
  workoutType
}: {
  user: firebase.User;
  liftType: t.LiftType;
  workoutType: t.WorkoutType;
}) => {
  // TODO add a calculator for estimating 1RM based on a 3x3 or 5x5.
  const history = rrd.useHistory();
  const [program, setProgram] = React.useState<t.Program | undefined>();
  const [oneRepMax, setOneRepMax] = React.useState<number | undefined>();
  const { started } = rrd.useParams();

  const [ready, setReady] = React.useState(
    started === undefined ? false : true
  );

  React.useEffect(() => {
    if (ready && started === undefined) {
      setReady(false);
      setProgram(undefined);
    }
  }, [started, ready]);

  React.useEffect(() => {
    db.getOneRepMax(firebase.firestore(), user.uid, liftType).then(orm => {
      if (orm !== undefined) {
        setOneRepMax(orm);
      }
    });
  }, [liftType, user.uid]);

  React.useEffect(() => {
    if (oneRepMax !== undefined && ready) {
      setProgram(util.programFor(workoutType, oneRepMax, liftType));
    }
  }, [oneRepMax, ready, liftType, workoutType]);

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
      history.push(`${history.location.pathname}/started`);
    }
  }, [user.uid, liftType, oneRepMax, history]);

  return (
    <div>
      <div className="title is-5">{t.WorkoutTypeLabel[workoutType]}</div>
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
          <LastLiftTime liftType={liftType} user={user} />
          <SimpleLiftTable program={program} user={user} />
        </div>
      )}
    </div>
  );
};

// TODO - the data in here should probably be a re-usable hook.
const LastLiftTime = ({
  liftType,
  user
}: {
  liftType: t.LiftType;
  user: firebase.User;
}) => {
  const [lift, setLift] = React.useState<t.Lift | undefined>(undefined);
  const [displayTime, setDisplayTime] = React.useState<string | undefined>(
    undefined
  );
  const [timeClass, setTimeClass] = React.useState("");

  React.useEffect(() => {
    if (lift === undefined) {
      return;
    }
    const then = moment(lift.date.toUTCString());
    const duration = moment.duration(
      moment.utc().diff(then, "milliseconds"),
      "milliseconds"
    );
    if (duration.days() > 0) {
      return;
    }
    console.log({ duration });
  }, [lift]);

  React.useEffect(() => {
    return db.latestLiftOnSnapshot(
      user.uid,
      firebase.firestore(),
      liftType,
      setLift
    );
  }, [user.uid, liftType]);

  React.useEffect(() => {
    if (lift === undefined) {
      return;
    }
    const timeUtcMoment = moment(lift.date.toUTCString());
    const interval = setInterval(() => {
      const timeSinceLift = moment.duration(
        moment.utc().diff(timeUtcMoment, "milliseconds"),
        "milliseconds"
      );
      const minutes = timeSinceLift.minutes();
      if (minutes >= 15 || timeSinceLift.asMinutes() >= 15) {
        setDisplayTime(undefined);
        clearInterval(interval);
        return;
      }
      if (minutes < 2) {
        setTimeClass(old => {
          if (old !== "has-text-danger") {
            return "has-text-danger";
          } else {
            return old;
          }
        });
      } else {
        setTimeClass(old => {
          return old === "has-text-success" ? old : "has-text-success";
        });
      }
      const seconds = timeSinceLift.seconds();
      setDisplayTime(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    }, 500);
    return () => clearInterval(interval);
  }, [liftType, lift]);

  if (lift === undefined || displayTime === undefined) {
    return null;
  }

  return (
    <>
      <div>
        Last Lift:{" "}
        <span className={timeClass}>{lift.date.toLocaleTimeString()}</span>
      </div>
      <div>
        <span className={timeClass}>{displayTime}</span> ago.
      </div>
    </>
  );
};

export default XByX;
