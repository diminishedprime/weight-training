import * as React from "react";
import * as hooks from "../../hooks";
import LiftTable from "../LiftTable";
import * as t from "../../types";
import AddLift from "./Custom";
import XByX from "./XByX";
import * as router from "react-router-dom";

const PreDefinedWorkout = ({
  liftType,
  user
}: t.RecordLiftProps & { user: t.User }) => {
  const [selectedWorkout, setSelectedWorkout] = React.useState<
    t.WorkoutType | undefined
  >(undefined);
  const location = router.useLocation();
  const history = router.useHistory();

  React.useEffect(() => {
    const urlWorkoutType = location.pathname
      .replace(`/lift/${liftType}/`, "")
      .split("/")[0];
    const workoutType = Object.values(t.WorkoutType).find(
      a => a === urlWorkoutType
    );
    setSelectedWorkout(workoutType);
  }, [location, liftType]);

  const chooseWorkout = React.useCallback(
    (workoutType: t.WorkoutType) => () => {
      setSelectedWorkout(workoutType);
      history.push(`/lift/${liftType}/${workoutType}`);
    },
    [history, liftType]
  );

  return (
    <div>
      {selectedWorkout === undefined && (
        <div>
          <div className="title is-5">Select a workout</div>
          <div>
            <button
              className="button"
              onClick={chooseWorkout(t.WorkoutType.THREE_BY_THREE)}
            >
              3x3
            </button>
            <button
              className="button"
              onClick={chooseWorkout(t.WorkoutType.FIVE_BY_FIVE)}
            >
              5x5
            </button>
            <button
              className="button"
              onClick={chooseWorkout(t.WorkoutType.CUSTOM)}
            >
              Custom
            </button>
          </div>
        </div>
      )}
      {selectedWorkout === t.WorkoutType.CUSTOM && (
        <AddLift liftType={liftType} user={user} />
      )}
      {selectedWorkout === t.WorkoutType.THREE_BY_THREE && (
        <XByX
          user={user}
          liftType={liftType}
          workoutType={t.WorkoutType.THREE_BY_THREE}
        />
      )}
      {selectedWorkout === t.WorkoutType.FIVE_BY_FIVE && (
        <XByX
          user={user}
          liftType={liftType}
          workoutType={t.WorkoutType.FIVE_BY_FIVE}
        />
      )}
    </div>
  );
};

export default ({ liftType }: t.RecordLiftProps) => {
  // TODO - this should really come from a state-store.
  const user = hooks.useForceSignIn();
  if (user === null) {
    return null;
  }
  return (
    <>
      <div className="title">
        <div className="centered">{liftType}</div>
        <figure className="card-svg">
          <img src={t.liftSvgMap[liftType]} width="50" alt="" />
        </figure>
      </div>
      <PreDefinedWorkout liftType={liftType} user={user} />
      <hr />
      <LiftTable liftType={liftType} user={user} />
    </>
  );
};
