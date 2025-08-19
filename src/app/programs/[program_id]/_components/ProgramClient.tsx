"use client";

import CycleStepper from "@/app/programs/[program_id]/_components/CycleStepper";
import Movement from "@/app/programs/[program_id]/_components/Movement";
import Progress from "@/app/programs/[program_id]/_components/Progress";
import { GetWendlerProgramResult, ProgramCycles } from "@/common-types";
import DisplayDate from "@/components/display/DisplayDate";
import DisplayDuration from "@/components/display/DisplayDuration";
import TODO from "@/components/TODO";
import { Paths } from "@/constants";
import { usePersistentNumber } from "@/hooks";
import { Stack, Typography } from "@mui/material";
import React, { useMemo } from "react";

interface ProgramClientProps {
  program: GetWendlerProgramResult;
}

const ProgramClient: React.FC<ProgramClientProps> = (props) => {
  const { program } = props;
  const api = useProgramClient(props);
  return (
    <React.Fragment>
      <Typography variant="h5">{program.name}</Typography>
      <Stack direction="row" alignItems={"center"}>
        {program.started_at && (
          <DisplayDate timestamp={program.started_at} noTime />
        )}
        <Typography>
          {program.started_at && program.completed_at && " - "}
        </Typography>
        {program.completed_at && (
          <DisplayDate timestamp={program.completed_at} noTime />
        )}
      </Stack>
      <Stack>
        {program.started_at && program.completed_at && (
          <DisplayDuration
            from={new Date(program.started_at)}
            to={new Date(program.completed_at)}
          />
        )}
      </Stack>
      <Progress cycles={program.cycles} />
      {program.notes && (
        <Typography variant="body2" color="textSecondary">
          {program.notes}
        </Typography>
      )}
      <CycleStepper
        program={program}
        activeCycleIdx={api.activeCycleIdx}
        setActiveCycleIdx={api.setActiveCycleIdx}
      />
      {api.activeCycle.movements.map((movement) => (
        <Movement key={movement.id} movement={movement} />
      ))}
      <TODO>Add user preferences for order of movements in wendler</TODO>
    </React.Fragment>
  );
};

export default ProgramClient;

const firstUncompletedCycleIdx = (cycles: ProgramCycles) => () => {
  const idx = cycles.findIndex(
    (cycle) => !cycle.movements.every((m) => m.completed_at !== null),
  );
  return idx === -1 ? 0 : idx;
};

const useProgramClient = (props: ProgramClientProps) => {
  const {
    program: { cycles, id: programId },
  } = props;
  const [activeCycleIdx, setActiveCycleIdx] = usePersistentNumber(
    firstUncompletedCycleIdx(cycles),
    Paths.Programs_ProgramId(programId),
    "active_cycle_idx",
  );
  const activeCycle = useMemo(
    () => cycles[activeCycleIdx],
    [cycles, activeCycleIdx],
  );

  return { activeCycle, activeCycleIdx, setActiveCycleIdx };
};
