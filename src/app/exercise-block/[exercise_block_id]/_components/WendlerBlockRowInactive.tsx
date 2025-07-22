import WendlerBlockRow from "@/app/exercise-block/[exercise_block_id]/_components/WendlerBlockRow";
import { CompletionStatus, RoundingMode, WendlerBlock } from "@/common-types";
import EditBarbell from "@/components/edit/EditBarbell";
import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import * as React from "react";

export interface WendlerBlockRowInactiveProps {
  setName: string;
  row: WendlerBlock[number];
  availablePlates: number[];
  completionStatusUIString?: (status: CompletionStatus) => string;
}

const useWendlerBlockRowInactiveAPI = (props: WendlerBlockRowInactiveProps) => {
  const {
    row: { exercise_id, exercise_type, block_id },
  } = props;

  const isDone = React.useMemo(() => {
    return props.row.completion_status !== "not_completed";
  }, [props.row.completion_status]);

  const editExercisePath = React.useMemo(() => {
    const params = new URLSearchParams({
      backTo: `/exercise-block/${block_id}`,
    });
    return `/exercise/${exercise_type}/edit/${exercise_id}?${params.toString()}`;
  }, [exercise_type, exercise_id, block_id]);

  return { isDone, editExercisePath };
};

const WendlerBlockRowInactive: React.FC<WendlerBlockRowInactiveProps> = (
  props,
) => {
  const api = useWendlerBlockRowInactiveAPI(props);
  return (
    <WendlerBlockRow setName={props.setName} highlight={false}>
      <Stack
        direction="row"
        sx={{
          display: "grid",
          gridTemplateRows: "auto auto",
          gridTemplateColumns: "1fr 1fr 1fr 2fr",
          gap: 1,
        }}
      >
        <Stack sx={{ gridColumn: "1 / span 4", justifySelf: "center" }}>
          <EditBarbell
            targetWeightValue={
              props.row.actual_weight_value ?? props.row.target_weight_value!
            }
            barWeight={45}
            availablePlates={props.availablePlates}
            weightUnit={props.row.weight_unit!}
            onTargetWeightChange={() => {}}
            onClickWeight={() => {}}
            roundingMode={RoundingMode.NEAREST}
          />
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{ gridColumn: "4 / span 1" }}
        >
          {(props.row.completion_status === "completed" ||
            props.row.completion_status === "failed" ||
            props.row.completion_status === "skipped") && (
            <Typography>
              {props.completionStatusUIString
                ? props.completionStatusUIString(props.row.completion_status!)
                : props.row.completion_status}
            </Typography>
          )}
          <Typography sx={{ whiteSpace: "pre-line" }}>
            {props.row.notes || ""}
          </Typography>
        </Stack>
        <Stack>
          <Typography component={Link} href={api.editExercisePath}>
            Edit Exercise
          </Typography>
        </Stack>
      </Stack>
    </WendlerBlockRow>
  );
};

export default WendlerBlockRowInactive;
