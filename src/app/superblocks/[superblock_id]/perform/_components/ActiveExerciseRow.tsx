import { PerceivedEffort, RoundingMode, UserPreferences } from "@/common-types";
import { GetPerformSuperblockExercise } from "@/common-types/get-perform-superblock";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import EquipmentWeightEditor from "@/components/edit/EquipmentWeightEditor";
import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton, Paper, Stack } from "@mui/material";
import { useCallback, useState } from "react";

interface ActiveExerciseRowProps {
  exercise: GetPerformSuperblockExercise;
  blockId: string;
  finishExercise: (
    blockId: string,
    activeExerciseId: string,
    actualWeightValue: number,
    reps: number,
    isWarmup: boolean,
    isAmrap: boolean,
    notes: string,
    perceivedEffort: PerceivedEffort | null,
  ) => Promise<void>;
  preferences: UserPreferences;
}

const ActiveExerciseRow: React.FC<ActiveExerciseRowProps> = (props) => {
  const api = useActiveExerciseRowAPI(props);
  console.log(api);
  return (
    <Stack spacing={1} component={Paper} sx={{ m: 0.5, p: 0.5 }}>
      <IconButton
        sx={{ justifySelf: "flex-start", alignSelf: "flex-start" }}
        onClick={() => api.setModifying(!api.modifying)}
      >
        <EditIcon />
      </IconButton>
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
      <Stack direction="row" justifyContent="space-between">
        <Button
          variant="outlined"
          size="small"
          startIcon={<DisplayCompletionStatus completionStatus="failed" />}
        >
          Failed
        </Button>
        <Button
          variant="outlined"
          size="small"
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
  };
};
