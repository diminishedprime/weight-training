import * as React from "react";
import * as t from "../types";

const Programs: React.FC = () => {
  const program: t.Program2 = t.Program2.forLift(
    t.LiftType.DEADLIFT,
    t.WorkoutType.THREE_BY_THREE,
    t.Weight.lbs(225)
  );

  return (
    <div>
      <div>{program.tables()}</div>
    </div>
  );
};

export default Programs;
