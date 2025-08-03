import {
  PerformFailExercise,
  PerformFinishExercise,
  PerformSkipExercise,
} from "@/app/superblocks/[superblock_id]/perform/_components/PerformClient";
import { RoundingMode, UserPreferences } from "@/common-types";
import { GetPerformSuperblockExercise } from "@/common-types/get-perform-superblock";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import DisplayStopwatch from "@/components/display/DisplayStopwatch";
import EquipmentWeightEditor from "@/components/edit/EquipmentWeightEditor";
import LabeledValue from "@/components/LabeledValue";
import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton, Paper, Stack } from "@mui/material";
import { useCallback, useState } from "react";

interface ActiveExerciseRowProps {
  exercise: GetPerformSuperblockExercise;
  blockId: string;
  finishExercise: PerformFinishExercise;
  failExercise: PerformFailExercise;
  skipExercise: PerformSkipExercise;
  preferences: UserPreferences;
}

const ActiveExerciseRow: React.FC<ActiveExerciseRowProps> = (props) => {
  const api = useActiveExerciseRowAPI(props);
  return (
    <Stack spacing={1} component={Paper} sx={{ m: 0.5, p: 0.5 }}>
      <Stack
        sx={{ position: "relative" }}
        alignItems="center"
        justifyContent="center"
        direction="row"
        spacing={1}
      >
        <IconButton
          sx={{ position: "absolute", left: 0 }}
          onClick={() => api.setModifying(!api.modifying)}
        >
          <EditIcon />
        </IconButton>
        {props.exercise.last_performed_at && (
          <LabeledValue label="Rest" alignItems="center">
            <DisplayStopwatch
              start={new Date(props.exercise.last_performed_at)}
              successThresholdSeconds={
                props.preferences.default_rest_time ?? undefined
              }
              millisecondsUntilThreshold
            />
          </LabeledValue>
        )}
      </Stack>
      <EquipmentWeightEditor
        editing={api.modifying}
        equipmentType={props.exercise.equipment_type}
        targetWeightValue={props.exercise.target_weight_value}
        weightUnit={props.exercise.weight_unit}
        setActualWeightValue={api.setActualWeightValue}
        roundingMode={RoundingMode.NEAREST}
        preferences={props.preferences}
        barWeightValue={45}
        actualWeightValue={api.actualWeightValue}
      />
      <Stack direction="row" justifyContent="space-between" sx={{ pt: 1 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={api.failExercise}
          startIcon={<DisplayCompletionStatus completionStatus="failed" />}
        >
          Failed
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={api.skipExercise}
          startIcon={<DisplayCompletionStatus completionStatus="skipped" />}
        >
          Skip
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={api.finishExercise}
          startIcon={<DisplayCompletionStatus completionStatus="completed" />}
        >
          Finished
        </Button>
      </Stack>
    </Stack>
  );
};

export default ActiveExerciseRow;

const useActiveExerciseRowAPI = (props: ActiveExerciseRowProps) => {
  const {
    finishExercise: finishExerciseProps,
    failExercise: failExerciseProps,
    skipExercise: skipExerciseProps,
    exercise: {
      id: exerciseId,
      actual_weight_value,
      completion_status,
      reps: exercise_reps,
      is_warmup,
      is_amrap,
      notes: exercise_notes,
      perceived_effort,
    },
    blockId,
  } = props;
  const [modifying, setModifying] = useState(false);

  const [actualWeightValue, localSetActualWeightValue] = useState(
    actual_weight_value ?? undefined,
  );
  const setActualWeightValue: React.Dispatch<React.SetStateAction<number>> =
    useCallback(
      (value) => {
        if (typeof value === "function") {
          localSetActualWeightValue((prev) => {
            if (prev === undefined) {
              throw new Error(
                "Invalid invariant: prev must not be undefined when using function to set actualWeightValue.",
              );
            }
            return value(prev!);
          });
        } else {
          localSetActualWeightValue(value);
        }
      },
      [localSetActualWeightValue],
    );
  const [reps, setReps] = useState(exercise_reps);
  const [isWarmup, setIsWarmup] = useState(is_warmup);
  const [isAmrap, setIsAmrap] = useState(is_amrap);
  const [notes, setNotes] = useState(exercise_notes || "");
  const [completionStatus, setCompletionStatus] = useState(completion_status);
  const [perceivedEffort, setPerceivedEffort] = useState(perceived_effort);

  const finishExercise = useCallback(async () => {
    if (actualWeightValue === undefined) {
      console.error(
        "Invalid invariant: actualWeightValue must not be undefined.",
      );
      return;
    }
    await finishExerciseProps(
      blockId,
      exerciseId,
      actualWeightValue,
      reps,
      isWarmup,
      isAmrap,
      notes,
      perceivedEffort,
    );
  }, [
    actualWeightValue,
    blockId,
    exerciseId,
    finishExerciseProps,
    isAmrap,
    isWarmup,
    notes,
    perceivedEffort,
    reps,
  ]);

  const failExercise = useCallback(async () => {
    if (actualWeightValue === undefined) {
      console.error(
        "Invalid invariant: actualWeightValue must not be undefined.",
      );
      return;
    }
    await failExerciseProps(
      blockId,
      exerciseId,
      actualWeightValue,
      reps,
      isWarmup,
      isAmrap,
      notes,
      perceivedEffort,
    );
  }, [
    actualWeightValue,
    blockId,
    exerciseId,
    isAmrap,
    isWarmup,
    notes,
    perceivedEffort,
    reps,
    failExerciseProps,
  ]);

  const skipExercise = useCallback(async () => {
    await skipExerciseProps(blockId, exerciseId, notes);
  }, [blockId, exerciseId, notes, skipExerciseProps]);

  return {
    setActualWeightValue,
    actualWeightValue,
    reps,
    setReps,
    isWarmup,
    setIsWarmup,
    isAmrap,
    setIsAmrap,
    notes,
    setNotes,
    perceivedEffort,
    setPerceivedEffort,
    modifying,
    setModifying,
    completionStatus,
    setCompletionStatus,
    finishExercise,
    skipExercise,
    failExercise,
  };
};
