import * as React from "react";
import * as util from "../util";
import * as t from "../types";
import * as db from "../db";
import firebase from "firebase/app";

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

const XByX = ({
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

export default XByX;
