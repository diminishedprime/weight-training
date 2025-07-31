"use client";

import { GetWendlerProgramResult } from "@/common-types";
import DisplayDate from "@/components/display/DisplayDate";
import DisplayDuration from "@/components/display/DisplayDuration";
import DisplayWeight from "@/components/display/DisplayWeight";
import TODO from "@/components/TODO";
import { exerciseTypeUIStringBrief, wendlerCycleUIString } from "@/uiStrings";
import {
  LinearProgress,
  Stack,
  Step,
  StepButton,
  StepContent,
  Stepper,
  Typography,
} from "@mui/material";
import React, { useCallback, useMemo } from "react";

interface ProgramClientProps {
  program: GetWendlerProgramResult;
}

const ProgramClient: React.FC<ProgramClientProps> = (props) => {
  const { program } = props;
  const api = useProgramClient(props);
  return (
    <Stack spacing={1}>
      <Typography variant="h5">
        {program.name}
        <Stack direction="row" spacing={1} alignItems={"center"}>
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
      </Typography>
      <Stack spacing={1}>
        <LinearProgress variant="determinate" value={api.progress} />
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ justifySelf: "end" }}
        >
          {api.total}/{api.possible} complete
        </Typography>
      </Stack>
      {program.notes && (
        <Typography variant="body2" color="textSecondary">
          {program.notes}
        </Typography>
      )}
      <Stepper
        sx={{
          "& .MuiStep-root:first-of-type": { paddingLeft: 0 },
          "& .MuiStep-root:last-of-type": { paddingRight: 0 },
        }}
        nonLinear
        activeStep={api.activeCycleIdx}
      >
        {program.cycles.map((cycle, idx) => (
          <Step key={cycle.id} completed={cycle.completed_at !== null}>
            <StepButton
              color="inherit"
              onClick={() => api.onActiveCycleChange((_) => idx)}
            >
              <Typography
                fontWeight={api.activeCycleIdx === idx ? "bold" : "inherit"}
                fontSize="inherit"
              >
                {wendlerCycleUIString(cycle.cycle_type)}
              </Typography>
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <Stepper
        orientation="vertical"
        nonLinear
        activeStep={api.activeMovementIdx}
      >
        {api.cycle.movements.map((movement, idx) => (
          <Step key={movement.id} completed={movement.completed_at !== null}>
            <StepButton onClick={() => api.setActiveMovementIdx(idx)}>
              <Stack spacing={1} direction="row" alignItems="center">
                <Typography
                  fontWeight={
                    api.activeMovementIdx === idx ? "bold" : "inherit"
                  }
                  fontSize="inherit"
                >
                  {exerciseTypeUIStringBrief(movement.exercise_type)}
                </Typography>
                {movement.started_at && (
                  <DisplayDate timestamp={movement.started_at} noTime />
                )}
              </Stack>
            </StepButton>
            <StepContent>
              <Stack spacing={1} direction="row">
                Training Max:{" "}
                <DisplayWeight
                  weightValue={movement.training_max_value}
                  weightUnit={movement.weight_unit}
                />
              </Stack>
              <Stack spacing={1} direction="row">
                Heaviest Weight:{" "}
                <DisplayWeight
                  weightValue={movement.heaviest_weight_value}
                  weightUnit={movement.weight_unit}
                />
              </Stack>
              <TODO>
                keep on updating this part. I think this is where I should offer
                some basic info, but make it easy to link to the
                superblock/block to actually do the workout.
              </TODO>
              <TODO>I could also show like the preview of the workout.</TODO>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
};

export default ProgramClient;

const useProgramClient = (props: ProgramClientProps) => {
  const {
    program: { cycles },
  } = props;
  const [activeCycleIdx, setActiveCycleIdx] = React.useState<number>(() => {
    const idx = cycles.findLastIndex((cycle) => cycle.started_at !== null);
    return idx === -1 ? 0 : idx;
  });
  const cycle = useMemo(() => cycles[activeCycleIdx], [cycles, activeCycleIdx]);

  const [activeMovementIdx, setActiveMovementIdx] = React.useState<number>(
    () => {
      const idx = cycle.movements.findIndex((m) => m.started_at === null);
      return idx === -1 ? 0 : idx;
    },
  );

  const onActiveCycleChange = useCallback(
    (fn: (old: number) => number) => {
      setActiveCycleIdx((old) => {
        const nu = fn(old);
        setActiveMovementIdx((_) => {
          const idx = cycles[nu].movements.findIndex(
            (m) => m.completed_at === null,
          );
          return idx === -1 ? 0 : idx;
        });
        return nu;
      });
    },
    [cycles],
  );

  const movement = useMemo(
    () => cycle.movements[activeMovementIdx],
    [cycle, activeMovementIdx],
  );

  const { progress, total, possible } = useMemo(() => {
    let total = 0;
    let possible = 0;
    cycles.forEach((cycle) => {
      cycle.movements.forEach((movement) => {
        possible += 1;
        if (movement.started_at !== null) {
          total += 0.5;
          if (movement.completed_at !== null) {
            total += 0.5;
          }
        }
      });
    });
    return { progress: (total / possible) * 100, total, possible };
  }, [cycles]);

  return {
    activeCycleIdx,
    onActiveCycleChange,
    cycle,
    movement,
    activeMovementIdx,
    setActiveMovementIdx,
    progress,
    total,
    possible,
  };
};
