"use client";
import {
  cancelEdit,
  saveChanges,
} from "@/app/exercise/[equipment_type]/[exercise_type]/edit/[exercise_id]/_components/EditBarbellExercise/actions";
import {
  CompletionStatus,
  ExerciseForUser,
  PerceivedEffort,
  RoundingMode,
} from "@/common-types";
import EditBarbell from "@/components/edit/EditBarbell";
import EditNotes from "@/components/edit/EditNotes";
import SelectCompletionStatus from "@/components/select/SelectCompletionStatus";
import SelectPerceivedEffort from "@/components/select/SelectPerceivedEffort";
import SelectReps from "@/components/select/SelectReps";
import SelectWarmup from "@/components/select/SelectWarmup";
import { Button, Stack } from "@mui/material";
import React from "react";

interface EditBarbellExerciseProps {
  userId: string;
  path: string;
  exercise: ExerciseForUser;
  availablePlatesLbs: number[];
  backTo?: string;
}

const useEditBarbellExerciseAPI = (props: EditBarbellExerciseProps) => {
  const { exercise } = props;
  const [localTargetWeight, setLocalTargetWeight] = React.useState(
    props.exercise.actual_weight_value ??
      props.exercise.target_weight_value ??
      0,
  );
  const [localReps, setLocalReps] = React.useState(props.exercise.reps ?? 5);
  const [completionStatus, setCompletionStatus] = React.useState(
    props.exercise.completion_status!,
  );
  const [perceivedEffort, setPerceivedEffort] = React.useState(
    props.exercise.perceived_effort,
  );
  const [isWarmup, setIsWarmup] = React.useState(
    props.exercise.warmup ?? false,
  );
  const [notes, setNotes] = React.useState(props.exercise.notes ?? undefined);

  const onLocalTargetWeightChange = React.useCallback(
    (newTargetWeight: number) => {
      setLocalTargetWeight(newTargetWeight);
    },
    [],
  );

  const onLocalRepsChange = React.useCallback((newReps: number) => {
    setLocalReps(newReps);
  }, []);

  const onLocalCompletionStatusChange = React.useCallback(
    (status: CompletionStatus) => {
      setCompletionStatus(status);
    },
    [],
  );

  const onLocalPerceivedEffortChange = React.useCallback(
    (effort: PerceivedEffort | null) => {
      setPerceivedEffort(effort);
    },
    [],
  );

  const onLocalWarmupChange = React.useCallback((warmup: boolean) => {
    setIsWarmup(warmup);
  }, []);

  const onLocalNotesChange = React.useCallback(
    (newNotes: string | undefined) => {
      setNotes(newNotes);
    },
    [],
  );

  const editedExercise: ExerciseForUser = React.useMemo(
    () => ({
      ...exercise,
      actual_weight_value: localTargetWeight,
      reps: localReps,
      completion_status: completionStatus,
      perceived_effort: perceivedEffort ?? null,
      warmup: isWarmup,
      notes: notes ?? null,
    }),
    [
      exercise,
      localTargetWeight,
      localReps,
      completionStatus,
      perceivedEffort,
      isWarmup,
      notes,
    ],
  );

  return {
    targetWeight: localTargetWeight,
    onTargetWeightWeightChange: onLocalTargetWeightChange,
    reps: localReps,
    onRepsChange: onLocalRepsChange,
    completionStatus,
    setCompletionStatus: onLocalCompletionStatusChange,
    perceivedEffort,
    onPerceivedEffortChange: onLocalPerceivedEffortChange,
    isWarmup,
    onWarmupChange: onLocalWarmupChange,
    notes,
    onNotesChange: onLocalNotesChange,
    editedExercise,
  };
};

const EditBarbellExercise: React.FC<EditBarbellExerciseProps> = (props) => {
  const api = useEditBarbellExerciseAPI(props);
  return (
    <Stack spacing={1}>
      <Stack alignItems="center">
        <EditBarbell
          editing
          targetWeightValue={api.targetWeight}
          roundingMode={RoundingMode.NEAREST}
          // TODO: change this to be from the exercise.
          barWeight={45}
          onTargetWeightChange={api.onTargetWeightWeightChange}
          weightUnit={"pounds"}
          availablePlates={props.availablePlatesLbs}
        />
      </Stack>
      <Stack alignItems="center">
        <SelectReps reps={api.reps} onRepsChange={api.onRepsChange} />
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="flex-end"
        useFlexGap
      >
        <SelectCompletionStatus
          completionStatus={api.completionStatus}
          onCompletionStatusChange={(status: CompletionStatus) =>
            api.setCompletionStatus(status)
          }
        />
        <SelectPerceivedEffort
          // TODO: I should probably clean this up so it's just using
          // undefined everywhere.
          perceivedEffort={api.perceivedEffort}
          onPerceivedEffortChange={api.onPerceivedEffortChange}
        />
        <SelectWarmup
          isWarmup={api.isWarmup}
          onWarmupChange={api.onWarmupChange}
        />
      </Stack>
      <EditNotes notes={api.notes} onNotesChange={api.onNotesChange} />
      <Stack
        spacing={1}
        direction="row"
        flexWrap="wrap"
        useFlexGap
        justifyContent="space-between"
      >
        {props.backTo && (
          <form action={cancelEdit.bind(null, props.backTo)}>
            <Button variant="outlined" type="submit" color="warning">
              Cancel
            </Button>
          </form>
        )}
        <form
          action={saveChanges.bind(
            null,
            props.userId,
            api.editedExercise,
            props.path,
            props.backTo,
          )}
        >
          <Button variant="contained" type="submit" color="primary">
            Save
          </Button>
        </form>
      </Stack>
    </Stack>
  );
};

export default EditBarbellExercise;
