import { UserPreferences } from "@/common-types";
import { GetPerformSuperblockExercise } from "@/common-types/get-perform-superblock";
import LabeledValue from "@/components/LabeledValue";
import Link from "@/components/Link";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import DisplayDuration from "@/components/display/DisplayDuration";
import DisplayNotes from "@/components/display/DisplayNotes";
import DisplayWeight from "@/components/display/DisplayWeight";
import SelectPerceivedEffort from "@/components/mutate/select/SelectPerceivedEffort";
import { Paths, SearchParam, WithSearchParams } from "@/constants";
import PencilIcon from "@mui/icons-material/Edit";
import { IconButton, Paper, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";

interface CompletedExerciseRowProps {
  userId: string;
  exercise: GetPerformSuperblockExercise;
  preferences: UserPreferences;
  setName: string;
  currentPath: string;
}

const CompletedExerciseRow: React.FC<CompletedExerciseRowProps> = (props) => {
  const { exercise, preferences } = props;
  const api = useCompletedExerciseRowAPI(props);

  return (
    <Stack component={Paper} sx={{ m: 0.5, p: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <DisplayCompletionStatus
          completionStatus={exercise.completion_status}
        />
        <Stack flex={1} />
        <Typography variant="body2" sx={{ ml: "auto" }}>
          {props.setName}
        </Typography>
        <IconButton
          size="small"
          component={Link}
          href={api.editLink}
          sx={{ ml: 1 }}
        >
          <PencilIcon />
        </IconButton>
      </Stack>
      <SelectPerceivedEffort
        userId={props.userId}
        exerciseId={exercise.id}
        perceivedEffort={api.perceivedEffort}
        setPerceivedEffort={api.setPerceivedEffort}
        initialEditingState={api.perceivedEffort === null}
      />
      <Stack
        direction="row"
        flexWrap="wrap"
        spacing={1}
        useFlexGap
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <LabeledValue
          label={exercise.actual_weight_value ? "Actual" : "Target"}
          alignItems="center"
        >
          <DisplayWeight
            column
            weightUnit={exercise.weight_unit}
            weightValue={
              exercise.actual_weight_value ?? exercise.target_weight_value
            }
          />
        </LabeledValue>
        <LabeledValue label="Reps" alignItems="center">
          <Typography component="span" color="secondary">
            {exercise.reps}
            {exercise.is_amrap ? " (AMRAP)" : ""}
          </Typography>
        </LabeledValue>
        <LabeledValue label="Rest" alignItems="center">
          {exercise.last_performed_at && exercise.performed_at ? (
            <DisplayDuration
              from={new Date(exercise.last_performed_at)}
              to={new Date(exercise.performed_at)}
              restTimeSeconds={preferences.default_rest_time ?? undefined}
              highResolution
            />
          ) : (
            "N/A"
          )}
        </LabeledValue>
      </Stack>
      <DisplayNotes notes={exercise.notes} />
    </Stack>
  );
};

export default CompletedExerciseRow;

const useCompletedExerciseRowAPI = (props: CompletedExerciseRowProps) => {
  const {
    exercise: { equipment_type, exercise_type, id },
    currentPath,
  } = props;

  const [perceivedEffort, setPerceivedEffort] = useState(
    props.exercise.perceived_effort ?? null,
  );

  const editLink = useMemo(
    () =>
      WithSearchParams(
        Paths.Exercise_EquipmentType_ExerciseType_Edit_ExerciseId(
          equipment_type,
          exercise_type,
          id,
        ),
        [SearchParam.BackTo, currentPath],
      ),
    [equipment_type, exercise_type, id, currentPath],
  );

  return { perceivedEffort, setPerceivedEffort, editLink };
};
