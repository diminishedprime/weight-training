import * as React from "react";
import * as rrd from "react-router-dom";
import * as hooks from "../../hooks";
import * as t from "../../types";
import { ProgramBuilder } from "../../types";
import Tables from "./Tables";

export interface BarbellLiftParams {
  type: "barbell-program";
  programName: t.LiftType;
  liftType: t.LiftType;
  workoutType: t.WorkoutType;
  oneRepMax: string;
}

type ProgramsParams = BarbellLiftParams;

function paramsToObject(params: URLSearchParams) {
  const entries = params.entries();
  const result: any = {};
  for (const entry of entries) {
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

const Programs: React.FC = () => {
  const location = rrd.useLocation();
  const params = React.useMemo(
    () => paramsToObject(new URLSearchParams(location.search.substring(1))),
    [location.search]
  );
  const user = hooks.useForceSignIn();
  const [program, setProgram] = React.useState(() => {
    return t.Program2.builder().build();
  });

  // This is weird, but seems necessary. If the .tables function diretly returns
  // the element instead of a way to construct the element, everything goes to
  // shit.

  React.useEffect(() => {
    if (params.type === "barbell-program") {
      setProgram(barbellProgram(params as BarbellLiftParams));
    }
  }, [params.type, params]);

  if (user === null) {
    return null;
  }

  /* const Tables = program.tables({ user }); */

  return (
    <div>
      <div>
        <Tables user={user} exercises={program.getExercises()} />
      </div>
    </div>
  );
};

export default Programs;
