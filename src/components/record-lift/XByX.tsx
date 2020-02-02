import firebase from "firebase/app";
import * as React from "react";
import * as rrd from "react-router-dom";
import * as c from "../../constants";
import * as db from "../../db";
import * as hooks from "../../hooks";
import * as t from "../../types";
import * as util from "../../util";
import * as g from "../general";

const Plates = ({ plates }: { plates: t.PlateConfig }) => {
  const plateGroup: Array<[t.PlateTypes, number]> = Object.entries(
    plates
  ).filter(([, num]) => num > 0) as Array<[t.PlateTypes, number]>;
  return plateGroup.length === 0 ? (
    <div>Nope</div>
  ) : (
    <div className="small-plates">
      {plateGroup.map(([plateType, num]) => {
        return (
          <React.Fragment key={`${plateType}-${num}`}>
            {util.range(num).map((_, idx) => {
              return (
                <div
                  key={`${plateType}-${num}-${idx}`}
                  className={`${plateType} small-plate`}
                >
                  {c.plateWeight[plateType].value}
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
  workoutType
}: {
  program: t.Program;
  user: t.FirebaseUser;
  workoutType: t.WorkoutType;
}) => {
  const {
    settings: { unit }
  } = hooks.useSettings();
  const history = rrd.useHistory();
  const [lastLiftUid, setLastLiftUid] = React.useState<string>();
  const {
    moment: lastLiftMoment,
    className: timeClassName,
    displayString: timeDisplay
  } = hooks.useTimeSinceLift(user, lastLiftUid);
  const [
    { currentLift, skippedLifts, completedLifts },
    updateXByXData,
    cleanup
  ] = hooks.useLocalStorage<XByXData>(t.LocalStorageKey.X_BY_X, {
    currentLift: 0,
    skippedLifts: {},
    completedLifts: {}
  });

  React.useEffect(() => {
    if (user === undefined) {
      return;
    }
    db.lifts(firebase.firestore(), user, (query) =>
      query.limit(1).orderBy("date", "desc")
    ).then((lifts) => lifts.length === 1 && setLastLiftUid(lifts[0].uid));
  }, [user]);

  const finishProgram = React.useCallback(() => {
    const completedAllLifts =
      Object.values(skippedLifts).length === 0 &&
      Object.values(completedLifts).length === program.length;
    firebase
      .analytics()
      .logEvent("level_end", { workoutType, completedAllLifts });
    history.goBack();
    cleanup();
  }, [workoutType, skippedLifts, completedLifts, program, cleanup, history]);

  const skipLift = React.useCallback(() => {
    if (currentLift < program.length) {
      updateXByXData((current) => {
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
      const pLift = program[currentLift];
      const lift: t.Lift = new t.Lift({
        date: firebase.firestore.Timestamp.now(),
        weight: pLift.weight,
        type: pLift.type,
        reps: pLift.reps,
        warmup: pLift.warmup,
        version: "1",
        liftDocType: t.LiftDocType.BARBELL,
        liftDocVersion: "1"
      });
      // Don't need to block on this.
      db.addLift(firebase.firestore(), user.uid, lift).then((lift) =>
        setLastLiftUid(lift.uid)
      );
      updateXByXData((current) => {
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
                <td>{lift.weight.display(unit)}</td>
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
  workoutType
}: {
  user: t.FirebaseUser;
  liftType: t.LiftType;
  workoutType: t.WorkoutType;
}) => {
  // TODO add a calculator for estimating 1RM based on a 3x3 or 5x5.
  const history = rrd.useHistory();
  const {
    settings: { unit }
  } = hooks.useSettings();
  const [program, setProgram] = React.useState<t.Program | undefined>();
  const [oneRepMax, setOneRepMax] = React.useState<t.Weight | undefined>();
  const { started } = rrd.useParams();
  const userDoc = t.useSelector((s) => s.localStorage.userDoc);

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
    if (userDoc !== undefined) {
      setOneRepMax(userDoc.getORM(liftType).weight);
    }
  }, [userDoc, liftType]);

  React.useEffect(() => {
    if (oneRepMax !== undefined && ready) {
      setProgram(util.programFor(workoutType, oneRepMax, liftType));
      firebase.analytics().logEvent("level_start", { workoutType });
    }
  }, [oneRepMax, ready, liftType, workoutType]);

  const onSetOneRepMax = React.useCallback(() => {
    if (oneRepMax !== undefined) {
      setReady(true);
      history.push(`${history.location.pathname}/started`);
    }
  }, [oneRepMax, history]);
  const topSet =
    oneRepMax &&
    util
      .programFor(workoutType, oneRepMax, liftType)
      .sort((a, b) => b.weight.compare(a.weight))[0];

  return (
    <div>
      <div className="title is-5">{t.WorkoutTypeLabel[workoutType]}</div>
      {!ready && (
        <>
          <g.WithLabel
            label="Target One Rep Max"
            childrenClasses={["has-addons"]}
          >
            <button
              className="button is-info sm-margin-right"
              disabled={oneRepMax === undefined}
              onClick={onSetOneRepMax}
            >
              Start
            </button>
            <g.WeightInput
              weight={oneRepMax}
              setWeight={setOneRepMax}
              fullWidth
            />
          </g.WithLabel>
          {topSet && (
            <div className="">
              <div className="flex-grow">
                Top set:{" "}
                <span className="bold">
                  {topSet && topSet.reps}x{topSet.weight.display(unit)}
                </span>
              </div>
            </div>
          )}
        </>
      )}
      {program && (
        <div>
          <SimpleLiftTable
            program={program}
            user={user}
            workoutType={workoutType}
          />
        </div>
      )}
    </div>
  );
};

export default XByX;
