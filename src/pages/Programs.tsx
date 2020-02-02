import * as React from "react";
import * as t from "../types";
import { ProgramBuilder } from "../types";

const Programs: React.FC = () => {
  const program: t.Program2 = t.Program2.builder()
    .addProgramSection(
      ProgramBuilder.xByX(
        t.LiftType.DEADLIFT,
        t.WorkoutType.THREE_BY_THREE,
        t.Weight.lbs(225)
      )
    )
    .addProgramSection(
      ProgramBuilder.xByX(
        t.LiftType.BENCH_PRESS,
        t.WorkoutType.THREE_BY_THREE,
        t.Weight.lbs(225)
      )
    )
    .build();

  return (
    <div>
      <div>{program.tables()}</div>
    </div>
  );
};

export default Programs;
