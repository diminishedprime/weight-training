import React, { useMemo } from "react";
import { Paper, Stack, Typography } from "@mui/material";
import { ExerciseBlock } from "@/common-types";
import { uiWeight, wendlerCycleUIString } from "@/uiStrings";
import Link from "next/link";

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
        <Typography
          variant="subtitle1"
          fontWeight={600}
          data-testid="exercise-block-row-name">
          {props.block.name || "Untitled Block"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {props.block.notes}
        </Typography>
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
                  props.block.training_max_unit!
                )}
              </Typography>{" "}
              an increase of{" "}
              <Typography color="secondary" component="span">
                {uiWeight(
                  props.block.increase_amount_value!,
                  props.block.increase_amount_unit!
                )}
              </Typography>
            </Typography>
          </React.Fragment>
        )}
        <Typography
          component={Link}
          href={`/exercise-block/${props.block.id}`}
          sx={{ alignSelf: "flex-end" }}>
          Go to block
        </Typography>
      </Stack>
    </Paper>
  );
};

export default ExerciseBlockRow;
