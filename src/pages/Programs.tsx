import * as React from "react";
import * as t from "../types";
import { ProgramBuilder } from "../types";
import * as rrd from "react-router-dom";

export type BarbellLiftParams = {
  type: "barbell-program";
  programName: t.LiftType;
  liftType: t.LiftType;
  workoutType: t.WorkoutType;
  oneRepMax: string;
};

type ProgramsParams = BarbellLiftParams;

function paramsToObject(params: URLSearchParams) {
  const entries = params.entries();
  let result: any = {};
  for (let entry of entries) {
    // each 'entry' is a [key, value] tupple
    const [key, value] = entry;
    result[key] = value;
  }
  return result;
}

const barbellProgram = (programsParams: BarbellLiftParams): t.Program2 => {
  const oneRepMax = t.Weight.fromJSON(programsParams.oneRepMax);
  return t.Program2.builder()
    .addProgramSection(
      ProgramBuilder.xByX(
        programsParams.liftType,
        programsParams.workoutType,
        oneRepMax
      )
    )
    .build();
};

// TODO - it's important that the program section can actually record their lifts.
// TODO - add a lift table that includes the lifts that have been done so far
// for a program.

const Programs: React.FC = () => {
  const location = rrd.useLocation();
  const params = new URLSearchParams(location.search.substring(1));
  const [program, setProgram] = React.useState(() => {
    return t.Program2.builder().build();
  });

  // This is weird, but seems necessary. If the .tables function diretly returns
  // the element instead of a way to construct the element, everything goes to
  // shit.
  const Tables = program.tables();

  React.useEffect(() => {
    if (params.get("type") === "barbell-program") {
      setProgram(
        barbellProgram((paramsToObject(params) as any) as BarbellLiftParams)
      );
    }
  }, [params.get("type")]);

  return (
    <div>
      <div>
        <Tables />
      </div>
    </div>
  );
};

export default Programs;
