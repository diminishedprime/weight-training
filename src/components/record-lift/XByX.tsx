import firebase from "firebase/app";
import * as React from "react";
import * as rrd from "react-router-dom";
import * as c from "../../constants";
import * as db from "../../db";
import * as hooks from "../../hooks";
import * as t from "../../types";
import * as util from "../../util";

const Plates = ({ plates }: { plates: t.PlateConfig }) => {
  const plateGroup: Array<[t.PlateTypes, number]> = Object.entries(plates).filter(
    ([, number]) => number > 0,
  ) as Array<[t.PlateTypes, number]>;
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
                  {c.plateWeight[plateType]}
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
  user,
}: {
  program: t.Program;
  user: t.User;
}) => {
  const history = rrd.useHistory();
  const [lastLiftUid, setLastLiftUid] = React.useState<string>();
  const {
    moment: lastLiftMoment,
    className: timeClassName,
    displayString: timeDisplay,
  } = hooks.useTimeSinceLift(user, lastLiftUid);
  const [
    { currentLift, skippedLifts, completedLifts },
    updateXByXData,
    cleanup,
  ] = hooks.useLocalStorage<XByXData>(t.LocalStorageKey.X_BY_X, {
    currentLift: 0,
    skippedLifts: {},
    completedLifts: {},
  });

  React.useEffect(() => {
    if (user === undefined) {
      return;
    }
    db.lifts(firebase.firestore(), user, (query) =>
      query.limit(1).orderBy("date", "desc"),
    ).then((lifts) => lifts.length === 1 && setLastLiftUid(lifts[0].uid));
  }, [user]);

  const finishProgram = () => {
    history.goBack();
    cleanup();
  };

  const skipLift = React.useCallback(() => {
    if (currentLift < program.length) {
      updateXByXData((current) => {
        return {
          ...current,
          currentLift: current.currentLift + 1,
          skippedLifts: { ...current.skippedLifts, [currentLift]: true },
        };
      });
    }
  }, [currentLift, program.length, updateXByXData]);

  const completeLift = React.useCallback(() => {
    if (currentLift < program.length) {
      const lift: t.Lift = {
        ...program[currentLift],
        date: firebase.firestore.Timestamp.now(),
      };
      // Don't need to block on this.
      db.addLift(firebase.firestore(), user.uid, lift).then((lift) =>
        setLastLiftUid(lift.uid),
      );
      updateXByXData((current) => {
        return {
          ...current,
          currentLift: current.currentLift + 1,
          completedLifts: { ...current.completedLifts, [currentLift]: true },
        };
      });
      /* setCompletedLifts(old => ({ ...old, [currentLift]: true }));
       * setCurrentLift(old => old + 1); */
    }
  }, [currentLift, program, user.uid, updateXByXData]);

  interface FinishRowProps {
    complete?: boolean;
  }
  const FinishRow: React.FC<FinishRowProps> = ({ complete }) => (
    <tr>
      <td colSpan={4}>
        <div className="control flex flex-center">
          <div>
            <button
              onClick={finishProgram}
              className={`button ${complete ? "is-success" : "is-danger"}`}
            >
              Finish
            </button>
          </div>

          {!complete && (
            <div className="flex flex-end flex-grow buttons">
              <button
                onClick={skipLift}
                className="button is-outlined is-warning"
              >
                Skip
              </button>
              <button
                onClick={completeLift}
                className="button is-outlined is-success"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Reps</th>
          <th>Weight</th>
          <th>Plates</th>
          <th>Warmup</th>
        </tr>
      </thead>
      <tbody>
        {program.map((lift, idx) => {
          const isSelected = idx === currentLift;
          const isSkipped = skippedLifts[idx];
          const isCompleted = completedLifts[idx];
          return (
            <React.Fragment key={idx}>
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
                <td align="center">{lift.warmup ? "✔️" : ""}</td>
              </tr>
              {isSelected && timeDisplay && (
                <tr>
                  <td colSpan={4}>
                    <div className="flex flex-between">
                      <div>
                        Last lift at:{" "}
                        <span className={timeClassName}>
                          {lastLiftMoment!.format("HH:mm")}
                        </span>
                      </div>
                      <div>
                        <span className={timeClassName}>{timeDisplay}</span> ago
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              {isSelected && <FinishRow />}
            </React.Fragment>
          );
        })}
        {currentLift >= program.length && <FinishRow complete />}
      </tbody>
    </table>
  );
};

const XByX = ({
  user,
  liftType,
  workoutType,
}: {
  user: t.User;
  liftType: t.LiftType;
  workoutType: t.WorkoutType;
}) => {
  // TODO add a calculator for estimating 1RM based on a 3x3 or 5x5.
  const history = rrd.useHistory();
  const [program, setProgram] = React.useState<t.Program | undefined>();
  const [oneRepMax, setOneRepMax] = React.useState<number | undefined>();
  const { started } = rrd.useParams();

  const [ready, setReady] = React.useState(
    started === undefined ? false : true,
  );

  React.useEffect(() => {
    if (ready && started === undefined) {
      setReady(false);
      setProgram(undefined);
    }
  }, [started, ready]);

  React.useEffect(() => {
    db.getOneRepMax(firebase.firestore(), user.uid, liftType).then((orm) => {
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
    [],
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
          <SimpleLiftTable program={program} user={user} />
        </div>
      )}
    </div>
  );
};

export default XByX;
