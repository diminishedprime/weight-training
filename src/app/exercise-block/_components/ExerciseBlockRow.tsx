import { ExerciseBlock } from "@/common-types";
import DisplayDate from "@/components/display/DisplayDate";
import DisplayEquipmentThumbnail from "@/components/display/DisplayEquipmentThumbnail";
import {
  exerciseTypeUIStringBrief,
  uiWeight,
  wendlerCycleUIString,
} from "@/uiStrings";
import { Paper, Stack, Typography } from "@mui/material";
import { formatDistance } from "date-fns";
import Link from "next/link";
import React, { useMemo } from "react";

interface ExerciseBlockRowProps {
  block: ExerciseBlock;
}

const useExerciseBlockRowAPI = (props: ExerciseBlockRowProps) => {
  const {
    block: { wendler_id },
  } = props;

  const isWendlerBlock = useMemo(() => {
    return !!wendler_id;
  }, [wendler_id]);

  return { isWendlerBlock };
};

const ExerciseBlockRow: React.FC<ExerciseBlockRowProps> = (props) => {
  const api = useExerciseBlockRowAPI(props);
  return (
    <Paper sx={{ p: 1 }}>
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} justifyContent="space-between">
          <Typography variant="h5" data-testid="exercise-block-row-name">
            {props.block.name || "Untitled Block"}
          </Typography>
          <Typography variant="h5">
            {exerciseTypeUIStringBrief(props.block.exercise_type!)}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} justifyContent="space-between">
          <Stack>
            {props.block.started_at && (
              <DisplayDate timestamp={props.block.started_at} />
            )}
            {props.block.started_at && props.block.completed_at && (
              <Typography>
                ~
                {formatDistance(
                  new Date(props.block.started_at),
                  new Date(props.block.completed_at),
                )}
              </Typography>
            )}
          </Stack>
          <DisplayEquipmentThumbnail
            equipmentType={props.block.equipment_type!}
          />
        </Stack>
        {api.isWendlerBlock && (
          <React.Fragment>
            <Typography variant="body2" color="textSecondary">
              Wendler{" "}
              <Typography color="primary" component="span">
                {wendlerCycleUIString(props.block.cycle_type!)}
              </Typography>{" "}
              with a training max of{" "}
              <Typography color="secondary" component="span">
                {uiWeight(
                  props.block.training_max_value!,
                  props.block.training_max_unit!,
                )}
              </Typography>{" "}
              an increase of{" "}
              <Typography color="secondary" component="span">
                {uiWeight(
                  props.block.increase_amount_value!,
                  props.block.increase_amount_unit!,
                )}
              </Typography>
            </Typography>
          </React.Fragment>
        )}

        <Stack
          direction="row"
          spacing={1}
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Typography variant="caption" color="textSecondary">
            {props.block.notes}
          </Typography>
          <Typography
            component={Link}
            href={`/exercise-block/${props.block.id}`}
            sx={{ alignSelf: "flex-end" }}
          >
            Go to block
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ExerciseBlockRow;
