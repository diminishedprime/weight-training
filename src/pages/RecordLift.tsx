import * as React from "react";
import LiftCard from "../components/LiftCard";
import LiftTable from "../components/LiftTable";
import * as hooks from "../hooks";
import * as t from "../types";
import { Link } from "react-router-dom";
import AddLift from "../components/record-lift/Custom";

export default ({ liftType }: t.RecordLiftProps) => {
  hooks.useMeasurePage("Record Lift");
  const [addLift, setAddLift] = React.useState(false);
  const user = hooks.useForceSignIn();
  const userDoc = t.useSelector(
    (s) => s.localStorage && s.localStorage.userDoc
  );
  const [targetORM, setTargetORM] = React.useState<t.Weight | undefined>(
    userDoc?.getORM(liftType).weight
  );
  if (user === null) {
    return null;
  }

  // TODO - Make it where you can choose the target 1RM weight for 3s and 5s.

  return (
    <>
      <LiftCard liftType={liftType} userDoc={userDoc} />
      {!addLift && (
        <div>
          <Link
            to={`/programs/deadlift?type=${"barbell-program"}&liftType=${liftType}&workoutType=${
              t.WorkoutType.THREE_BY_THREE
            }&oneRepMax=${targetORM!.asJSON()}`}
          >
            <button className="button" disabled={targetORM === undefined}>
              3x3
            </button>
          </Link>
          <Link
            to={`/programs/deadlift?type=${"barbell-program"}&liftType=${liftType}&workoutType=${
              t.WorkoutType.FIVE_BY_FIVE
            }&oneRepMax=${targetORM!.asJSON()}`}
          >
            <button className="button" disabled={targetORM === undefined}>
              5x5
            </button>
          </Link>
          <button className="button" onClick={() => setAddLift(true)}>
            Add Single
          </button>
        </div>
      )}
      {addLift && <AddLift liftType={liftType} user={user} />}
      <hr />
      <LiftTable
        modifyQuery={(query) =>
          query
            .where("type", "==", liftType)
            .orderBy("date", "desc")
            .limit(50)
        }
        user={user}
      />
    </>
  );
};
