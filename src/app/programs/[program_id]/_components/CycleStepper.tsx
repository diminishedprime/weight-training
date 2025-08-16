import { Program, RDispatch } from "@/common-types";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import { wendlerCycleUIString } from "@/uiStrings";
import { Step, StepButton, Stepper, Typography } from "@mui/material";
import React from "react";

interface Props {
  program: Program;
  activeCycleIdx: number;
  setActiveCycleIdx: RDispatch<number>;
}

const CycleStepper: React.FC<Props> = (props) => {
  return (
    <Stepper
      sx={{
        "& .MuiStep-root:first-of-type": { paddingLeft: 0 },
        "& .MuiStep-root:last-of-type": { paddingRight: 0 },
      }}
      nonLinear
      activeStep={props.activeCycleIdx}
    >
      {props.program.cycles.map((cycle, idx) => (
        <Step key={cycle.id} completed={cycle.completed_at !== null}>
          <StepButton
            onClick={() => props.setActiveCycleIdx(idx)}
            icon={
              <DisplayCompletionStatus
                // TODO: We want to just grab the completation_status off of the
                // cycle, but it's not in the DB yet.
                completionStatus={
                  cycle.completed_at !== null
                    ? "completed"
                    : cycle.started_at !== null
                      ? "in_progress"
                      : "not_started"
                }
              />
            }
          >
            <Typography
              fontWeight={props.activeCycleIdx === idx ? "bold" : "inherit"}
              fontSize="inherit"
            >
              {wendlerCycleUIString(cycle.cycle_type)}
            </Typography>
          </StepButton>
        </Step>
      ))}
    </Stepper>
  );
};

export default CycleStepper;
