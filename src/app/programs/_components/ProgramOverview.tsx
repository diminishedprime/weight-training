import { type ProgramOverview as ProgramOverviewType } from "@/common-types";
import DisplayDate from "@/components/display/DisplayDate";
import Link from "@/components/Link";
import { PATHS } from "@/constants";
import { exerciseTypeUIStringBrief, wendlerCycleUIString } from "@/uiStrings";
import CheckIcon from "@mui/icons-material/Check";
import { Stack, Typography } from "@mui/material";
import React from "react";

interface ProgramOverviewProps {
  program: ProgramOverviewType;
}

const ProgramOverviewType: React.FC<ProgramOverviewProps> = (props) => {
  return (
    <Stack spacing={1}>
      <Typography
        variant="h6"
        component={Link}
        href={PATHS.ProgramById(props.program.id)}
        underline="hover"
        sx={{ pb: 0 }}
      >
        {props.program.name}
      </Typography>
      <Stack direction="row" spacing={1} alignItems={"center"}>
        {props.program.started_at && (
          <DisplayDate timestamp={props.program.started_at} noTime />
        )}
        <Typography>
          {props.program.started_at && props.program.completed_at && " - "}
        </Typography>
        {props.program.completed_at && (
          <DisplayDate timestamp={props.program.completed_at} noTime />
        )}
      </Stack>
      {props.program.notes && (
        <Typography variant="body2" color="textSecondary">
          {props.program.notes}
        </Typography>
      )}
      <Stack spacing={0}>
        {props.program.cycles.map((cycle) => (
          <React.Fragment key={cycle.id}>
            <Stack spacing={0.5} mb={0.5}>
              <Typography variant="h6" fontSize="1.1rem">
                {wendlerCycleUIString(cycle.cycle_type)}
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                {cycle.movements.map((movement) => (
                  <Stack key={movement.id} spacing={0.5}>
                    <Typography variant="body1">
                      {exerciseTypeUIStringBrief(movement.exercise_type)}
                    </Typography>
                    {movement.completed_at && <CheckIcon />}
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </React.Fragment>
        ))}
      </Stack>
    </Stack>
  );
};

export default ProgramOverviewType;
