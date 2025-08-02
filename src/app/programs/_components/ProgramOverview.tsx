import { WendlerProgramOverview } from "@/common-types";
import DisplayDate from "@/components/display/DisplayDate";
import DisplayWeight from "@/components/display/DisplayWeight";
import DisplayWeightChange from "@/components/display/DisplayWeightChange";
import LabeledValue from "@/components/LabeledValue";
import Link from "@/components/Link";
import { PATHS } from "@/constants";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import { Paper, Stack, Typography } from "@mui/material";
import React from "react";

interface ProgramOverviewProps {
  program: WendlerProgramOverview;
}

const ProgramOverviewType: React.FC<ProgramOverviewProps> = (props) => {
  return (
    <Stack spacing={1} component={Paper} sx={{ m: 1, p: 1 }}>
      <Stack>
        <Typography
          variant="h6"
          component={Link}
          href={PATHS.ProgramById(props.program.id)}
          underline="hover"
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
      </Stack>
      <Stack
        direction="row"
        flexWrap="wrap"
        spacing={0}
        justifyContent="space-between"
      >
        {props.program.movement_overviews.map((movement) => (
          <LabeledValue
            key={movement.id}
            label={exerciseTypeUIStringBrief(movement.exercise_type)}
            labelColor="text.primary"
            alignItems={"center"}
          >
            <Stack>
              <DisplayWeight
                weightValue={movement.training_max_value}
                weightUnit="pounds"
                valueColor="secondary"
              />
              <LabeledValue label="Change" alignItems={"center"}>
                <DisplayWeightChange
                  changeValue={movement.increase_amount_value}
                />
              </LabeledValue>
            </Stack>
          </LabeledValue>
        ))}
      </Stack>
    </Stack>
  );
};

export default ProgramOverviewType;
