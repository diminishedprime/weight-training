import * as React from "react";
import * as rrd from "react-router-dom";
import * as hooks from "../../hooks";
import * as t from "../../types";
import Tables from "./Tables";
import { barbellProgram, paramsToProgramsParams } from "./util";

const Programs: React.FC = () => {
  const location = rrd.useLocation();
  hooks.useMeasurePage("Programs", (a) => a.replace(location.search, ""));
  const params = React.useMemo(
    () =>
      paramsToProgramsParams(new URLSearchParams(location.search.substring(1))),
    [location.search]
  );
  const user = hooks.useForceSignIn();
  const [program] = React.useState(() => {
    if (params?.type === "barbell-program") {
      return barbellProgram(params);
    } else {
      return t.Program.builder()
        .setDisplayName("ignore")
        .build();
    }
  });

  if (user === null) {
    return null;
  }

  /* const Tables = program.tables({ user }); */

  return (
    <div>
      <div>
        <Tables
          displayText={program.getDisplayName()}
          programUrl={`${location.pathname}${location.search}`}
          user={user}
          exercises={program.getExercises()}
        />
      </div>
    </div>
  );
};

export default Programs;
