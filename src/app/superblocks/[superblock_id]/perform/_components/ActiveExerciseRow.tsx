import {
  PerformFailExercise,
  PerformFinishExercise,
  PerformSkipExercise,
} from "@/app/superblocks/[superblock_id]/perform/_components/PerformClient";
import { RoundingMode, UserPreferences } from "@/common-types";
import { GetPerformSuperblockExercise } from "@/common-types/get-perform-superblock";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import DisplayStopwatch from "@/components/display/DisplayStopwatch";
import EditNotes from "@/components/edit/EditNotes";
import EquipmentWeightEditor from "@/components/edit/EquipmentWeightEditor";
import LabeledValue from "@/components/LabeledValue";
import SelectPerceivedEffort from "@/components/select/SelectPerceivedEffort";
import SelectReps from "@/components/select/SelectReps";
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
    <Stack component={Paper} sx={{ my: 1, p: 0.5 }} spacing={1}>
      <Stack
        sx={{ position: "relative" }}
        alignItems="center"
        justifyContent="center"
        direction="row"
        spacing={1}
      >
        <IconButton
          sx={{ position: "absolute", left: 0, top: 0 }}
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
      <Stack
        direction="row"
        spacing={2}
        flexWrap="wrap"
        justifyContent="center"
      >
        {(props.exercise.is_amrap || api.modifying) && (
          <SelectReps
            reps={api.reps}
            isAMRAP={api.isAMRAP}
            setReps={api.setReps}
            wendler1s={props.exercise.reps === 1}
            wendler3s={props.exercise.reps === 3}
            wendler5s={props.exercise.reps === 5}
          />
        )}
        <SelectPerceivedEffort
          perceivedEffort={api.perceivedEffort}
          setPerceivedEffortChange={api.setPerceivedEffort}
        />
      </Stack>
      {api.modifying && (
        <EditNotes notes={api.notes} onNotesChange={api.setNotes} />
      )}
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

  const [actualWeightValue, setActualWeightValue] = useState(
    actual_weight_value ?? undefined,
  );
  const [reps, setReps] = useState(exercise_reps);
  const [isWarmup, setIsWarmup] = useState(is_warmup);
  const [isAMRAP, setIsAMRAP] = useState(is_amrap);
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
      isAMRAP,
      notes,
      perceivedEffort,
    );
  }, [
    actualWeightValue,
    blockId,
    exerciseId,
    finishExerciseProps,
    isAMRAP,
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
      isAMRAP,
      notes,
      perceivedEffort,
    );
  }, [
    actualWeightValue,
    blockId,
    exerciseId,
    isAMRAP,
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
    isAMRAP,
    setIsAMRAP,
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
