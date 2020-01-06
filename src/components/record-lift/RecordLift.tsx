import * as React from "react";
import * as hooks from "../../hooks";
import LiftTable from "../LiftTable";
import LiftCard from "../LiftCard";
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
  const userDoc = t.useSelector(s => s.localStorage && s.localStorage.userDoc);
  if (user === null) {
    return null;
  }

  return (
    <>
      <LiftCard liftType={liftType} userDoc={userDoc} />
      <PreDefinedWorkout liftType={liftType} user={user} />
      <hr />
      <LiftTable
        modifyQuery={query => query.where("type", "==", liftType)}
        user={user}
      />
    </>
  );
};
