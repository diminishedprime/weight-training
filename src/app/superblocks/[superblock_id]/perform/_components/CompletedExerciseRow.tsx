import UpdatePerceivedEffort from "@/app/superblocks/[superblock_id]/perform/_components/UpdatePerceivedEffort";
import { UserPreferences } from "@/common-types";
import { GetPerformSuperblockExercise } from "@/common-types/get-perform-superblock";
import LabeledValue from "@/components/LabeledValue";
import Link from "@/components/Link";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import DisplayDuration from "@/components/display/DisplayDuration";
import DisplayNotes from "@/components/display/DisplayNotes";
import DisplayWeight from "@/components/display/DisplayWeight";
import { Paths, SearchParam, WithSearchParams } from "@/constants";
import { Button, Paper, Stack, Typography } from "@mui/material";
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
    <Stack component={Paper} sx={{ m: 0.5, p: 0.5 }}>
      <Stack direction="row" sx={{ mb: 1 }} alignItems="space-between">
        <DisplayCompletionStatus
          completionStatus={exercise.completion_status}
        />
        <Typography variant="body2" sx={{ ml: "auto" }}>
          {props.setName}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        flexWrap="wrap"
        spacing={1}
        justifyContent="space-between"
      >
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          sx={{ alignSelf: "flex-end" }}
          component={Link}
          href={api.editLink}
        >
          Edit
        </Button>
        <LabeledValue
          label={exercise.actual_weight_value ? "Actual Work " : "Target Work"}
        >
          <DisplayWeight
            weightUnit={exercise.weight_unit}
            weightValue={
              exercise.actual_weight_value ?? exercise.target_weight_value
            }
            reps={exercise.reps}
            repsAMRAP={exercise.is_amrap}
          />
        </LabeledValue>
        {exercise.last_performed_at && exercise.performed_at && (
          <LabeledValue label="Rest Time">
            <DisplayDuration
              from={new Date(exercise.last_performed_at)}
              to={new Date(exercise.performed_at)}
              restTimeSeconds={preferences.default_rest_time ?? undefined}
              highResolution
            />
          </LabeledValue>
        )}
        <UpdatePerceivedEffort
          perceivedEffort={api.perceivedEffort}
          setPerceivedEffort={api.setPerceivedEffort}
          userId={props.userId}
          exerciseId={exercise.id}
        />
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
        [SearchParam.BackTo, props.currentPath],
      ),
    [equipment_type, exercise_type, id, currentPath],
  );

  return { perceivedEffort, setPerceivedEffort, editLink };
};
