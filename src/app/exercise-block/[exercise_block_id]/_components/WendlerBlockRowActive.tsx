"use client";
import {
  failExercise,
  finishExercise,
  skipExercise,
} from "@/app/exercise-block/[exercise_block_id]/_components/actions";
import WendlerBlockRow from "@/app/exercise-block/[exercise_block_id]/_components/WendlerBlockRow";
import {
  RoundingMode,
  type CompletionStatus,
  type PerceivedEffort,
  type WendlerBlock,
} from "@/common-types";
import EditBarbell from "@/components/edit/EditBarbell";
import SelectCompletionStatus from "@/components/select/SelectCompletionStatus";
import SelectPerceivedEffort from "@/components/select/SelectPerceivedEffort";
import SelectReps from "@/components/select/SelectReps";
import { Stack, TextField } from "@mui/material";
import * as React from "react";

interface WendlerBlockRowActiveProps {
  row: WendlerBlock[number];
  isLastRow?: boolean;
  setName: string;
  availablePlates: number[];
}

const useWendlerBlockRowActiveAPI = (props: WendlerBlockRowActiveProps) => {
  const {
    row: { block_id, exercise_id },
    row,
  } = props;
  // These fields are not nullable in UI usage
  const [reps, setReps] = React.useState<number>(row.reps!);
  const [completionStatus, setCompletionStatus] =
    React.useState<CompletionStatus>(row.completion_status!);
  const [notes, setNotes] = React.useState<string>(row.notes || "");
  const [perceivedEffort, setPerceivedEffort] =
    React.useState<PerceivedEffort | null>(row.perceived_effort ?? null);
  const [targetWeight, setTargetWeight] = React.useState<number>(
    row.target_weight_value!,
  );
  const [editable, setEditable] = React.useState<boolean>(false);

  const handleClickWeight = React.useCallback(() => {
    setEditable((old) => !old);
  }, []);

  const onRepsChange = React.useCallback((newReps: number) => {
    setReps(newReps);
  }, []);

  const onCompletionStatusChange = React.useCallback(
    (newStatus: CompletionStatus) => {
      setCompletionStatus(newStatus);
    },
    [],
  );

  const onNotesChange = React.useCallback((newNotes: string) => {
    setNotes(newNotes);
  }, []);

  const onPerceivedEffortChange = React.useCallback(
    (perceivedEffort: PerceivedEffort | null) => {
      setPerceivedEffort(perceivedEffort);
    },
    [],
  );

  const modifiedRow = React.useMemo(() => {
    return {
      ...row,
      reps,
      completion_status: completionStatus,
      notes,
      perceived_effort: perceivedEffort,
      actual_weight_value: targetWeight,
    };
  }, [row, reps, completionStatus, notes, perceivedEffort, targetWeight]);

  const path = React.useMemo(() => {
    return `/exercise-block/${block_id}/exercise/${exercise_id}`;
  }, [block_id, exercise_id]);

  return {
    reps,
    completionStatus,
    notes,
    perceivedEffort: perceivedEffort,
    targetWeight,
    onRepsChange,
    onCompletionStatusChange,
    onNotesChange,
    onEffortChange: onPerceivedEffortChange,
    onTargetWeightChange: setTargetWeight,
    modifiedRow,
    editable,
    handleClickWeight,
    path,
  };
};

// TODO: Add to useWendlerBlockRowActiveAPI
// TODO: Add handler for actual weight change
// (Assume row.availablePlates and row.weight_unit are present, otherwise fallback)

const WendlerBlockRowActive: React.FC<WendlerBlockRowActiveProps> = (props) => {
  const api = useWendlerBlockRowActiveAPI(props);
  const { row, setName } = props;

  return (
    <WendlerBlockRow setName={setName} highlight>
      <Stack spacing={2} direction="column" width="100%">
        {/* Top row: BarbellEditor spanning all columns */}
        <Stack alignItems="center" width="100%">
          <EditBarbell
            targetWeightValue={api.targetWeight}
            barWeightValue={45}
            availablePlates={props.availablePlates}
            weightUnit={row.weight_unit!}
            onTargetWeightChange={api.onTargetWeightChange}
            editing={api.editable}
            onClickWeight={api.handleClickWeight}
            roundingMode={RoundingMode.NEAREST}
          />
        </Stack>
        {/* Second row: interactive controls */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          <Stack alignItems="center" justifyContent="center">
            <SelectReps
              reps={api.reps}
              onRepsChange={api.onRepsChange}
              wendlerReps
              isAMRAP={props.isLastRow}
              hideSettings
            />
          </Stack>
          <Stack alignItems="center" justifyContent="center">
            <SelectPerceivedEffort
              perceivedEffort={api.perceivedEffort}
              onPerceivedEffortChange={api.onEffortChange}
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2}>
        <TextField
          label="Notes"
          multiline
          minRows={2}
          value={api.notes}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            api.onNotesChange(e.target.value)
          }
          sx={{ flexGrow: 1 }}
        />
        <SelectCompletionStatus
          customLabel="Finish Set"
          completionStatus={api.completionStatus}
          onCompletionStatusChange={api.onCompletionStatusChange}
          boundSkipAction={skipExercise.bind(
            null,
            row.user_id!,
            row.block_id!,
            row.exercise_id!,
            api.notes,
            api.path,
          )}
          boundFailAction={failExercise.bind(
            null,
            row.user_id!,
            row.block_id!,
            row.exercise_id!,
            api.notes,
            api.path,
          )}
          boundFinishAction={finishExercise.bind(
            null,
            row.user_id!,
            row.block_id!,
            row.exercise_id!,
            api.notes,
            api.path,
          )}
        />
      </Stack>
    </WendlerBlockRow>
  );
};

export default WendlerBlockRowActive;
