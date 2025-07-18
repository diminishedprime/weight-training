"use client";
import * as React from "react";
import { Stack, TextField } from "@mui/material";
import SelectPercievedEffort from "@/components/select/SelectPercievedEffort";
import SelectReps from "@/components/select/SelectReps";
import SelectCompletionStatus from "@/components/select/SelectCompletionStatus";
import {
  RoundingMode,
  type CompletionStatus,
  type PercievedEffort,
  type WendlerBlock,
} from "@/common-types";
import WendlerBlockRow from "@/app/exercise-block/[exercise_block_id]/_components/WendlerBlockRow";
import BarbellEditor from "@/components/BarbellEditor";
import {
  finishExercise,
  failExercise,
  skipExercise,
} from "@/app/exercise-block/[exercise_block_id]/_components/actions";

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
  const [percievedEffort, setPercievedEffort] =
    React.useState<PercievedEffort | null>(row.relative_effort ?? null);
  const [targetWeight, setTargetWeight] = React.useState<number>(
    row.actual_weight_value!
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
    []
  );

  const onNotesChange = React.useCallback((newNotes: string) => {
    setNotes(newNotes);
  }, []);

  const onPercievedEffortChange = React.useCallback(
    (percievedEffort: PercievedEffort | null) => {
      setPercievedEffort(percievedEffort);
    },
    []
  );

  const onTargetWeightChange = React.useCallback((newWeight: number) => {
    setTargetWeight(newWeight);
  }, []);

  const modifiedRow = React.useMemo(() => {
    return {
      ...row,
      reps,
      completion_status: completionStatus,
      notes,
      relative_effort: percievedEffort,
      actual_weight_value: targetWeight,
    };
  }, [row, reps, completionStatus, notes, percievedEffort, targetWeight]);

  const path = React.useMemo(() => {
    return `/exercise-block/${block_id}/exercise/${exercise_id}`;
  }, [block_id, exercise_id]);

  return {
    reps,
    completionStatus,
    notes,
    relativeEffort: percievedEffort,
    targetWeight,
    onRepsChange,
    onCompletionStatusChange,
    onNotesChange,
    onEffortChange: onPercievedEffortChange,
    onTargetWeightChange,
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
          <BarbellEditor
            targetWeight={api.targetWeight}
            barWeight={45}
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
          width="100%">
          <Stack alignItems="center" justifyContent="center">
            <SelectReps
              reps={api.reps}
              onRepsChange={api.onRepsChange}
              wendlerReps
              isAmrap={props.isLastRow}
              hideSettings
            />
          </Stack>
          <Stack alignItems="center" justifyContent="center">
            <SelectPercievedEffort
              percievedEffort={api.relativeEffort}
              onPercievedEffortChange={api.onEffortChange}
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
            api.path
          )}
          boundFailAction={failExercise.bind(
            null,
            row.user_id!,
            row.block_id!,
            row.exercise_id!,
            api.notes,
            api.path
          )}
          boundFinishAction={finishExercise.bind(
            null,
            row.user_id!,
            row.block_id!,
            row.exercise_id!,
            api.notes,
            api.path
          )}
        />
      </Stack>
    </WendlerBlockRow>
  );
};

export default WendlerBlockRowActive;
