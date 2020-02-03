import * as React from "react";
import { Link } from "react-router-dom";
import * as b from "../components/general";
import LiftCard from "../components/LiftCard";
import LiftTable from "../components/LiftTable";
import AddLift from "../components/record-lift/Custom";
import * as hooks from "../hooks";
import * as t from "../types";

const workoutTypeMeta: { [t in t.WorkoutType]: string } = {
  [t.WorkoutType.THREE_BY_THREE]: "3x3",
  [t.WorkoutType.FIVE_BY_FIVE]: "5x5",
  [t.WorkoutType.CUSTOM]: "Custom"
};

interface GetToProgramProps {
  liftType: t.LiftType;
  userDoc?: t.UserDoc;
  user: t.FirebaseUser;
}
const GetToProgram: React.FC<GetToProgramProps> = ({
  liftType,
  userDoc,
  user
}) => {
  const [addLift, setAddLift] = React.useState(false);
  const [workoutType, setWorkoutType] = React.useState<
    t.WorkoutType | undefined
  >();
  const [targetOneRepMax, setTargetOneRepMax] = React.useState<
    t.Weight | undefined
  >(userDoc?.getORM(liftType).weight);
  return (
    <React.Fragment>
      {!addLift && workoutType === undefined && (
        <React.Fragment>
          <button
            className="button"
            onClick={() => setWorkoutType(t.WorkoutType.THREE_BY_THREE)}
          >
            3x3
          </button>
          <button
            className="button"
            onClick={() => setWorkoutType(t.WorkoutType.FIVE_BY_FIVE)}
          >
            5x5
          </button>
          <button className="button" onClick={() => setAddLift(true)}>
            Add Single
          </button>
        </React.Fragment>
      )}
      {workoutType !== undefined && <div>{workoutTypeMeta[workoutType]}</div>}
      {workoutType !== undefined && (
        <b.WithLabel label="Target One Rep Max">
          <b.WeightInput
            setWeight={setTargetOneRepMax}
            weight={targetOneRepMax}
          />
        </b.WithLabel>
      )}
      {workoutType !== undefined && targetOneRepMax !== undefined && (
        <Link
          to={`/programs/${liftType}?type=${"barbell-program"}&liftType=${liftType}&workoutType=${
            t.WorkoutType.THREE_BY_THREE
          }&oneRepMax=${targetOneRepMax.asJSON()}`}
        >
          <button className="button">Go!</button>
        </Link>
      )}

      {addLift && <AddLift liftType={liftType} user={user} />}
    </React.Fragment>
  );
};

export default ({ liftType }: t.RecordLiftProps) => {
  hooks.useMeasurePage("Record Lift");
  const user = hooks.useForceSignIn();
  const userDoc = t.useSelector(
    (s) => s.localStorage && s.localStorage.userDoc
  );
  if (user === null) {
    return null;
  }

  return (
    <>
      <LiftCard liftType={liftType} userDoc={userDoc} />
      <GetToProgram liftType={liftType} userDoc={userDoc} user={user} />
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
