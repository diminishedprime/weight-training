import { UserPreferences } from "@/common-types";
import { GetPerformSuperblockExercise } from "@/common-types/get-perform-superblock";
import LabeledValue from "@/components/LabeledValue";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import DisplayDuration from "@/components/display/DisplayDuration";
import DisplayNotes from "@/components/display/DisplayNotes";
import DisplayPerceivedEffort from "@/components/display/DisplayPerceivedEffort";
import DisplayWeight from "@/components/display/DisplayWeight";
import { Paper, Stack } from "@mui/material";

interface ExerciseRowProps {
  exercise: GetPerformSuperblockExercise;
  preferences: UserPreferences;
}

const ExerciseRow: React.FC<ExerciseRowProps> = (props) => {
  const { exercise, preferences } = props;
  return (
    <Stack component={Paper} sx={{ m: 0.5, p: 0.5 }}>
      <Stack direction="row" flexWrap="wrap" spacing={1}>
        <LabeledValue label="Status" alignItems="center">
          <DisplayCompletionStatus
            completionStatus={exercise.completion_status}
          />
        </LabeledValue>
        {exercise.perceived_effort && (
          <LabeledValue label="Effort">
            <DisplayPerceivedEffort
              perceivedEffort={exercise.perceived_effort}
            />
          </LabeledValue>
        )}
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
          <LabeledValue label="Time Between">
            <DisplayDuration
              from={new Date(exercise.last_performed_at)}
              to={new Date(exercise.performed_at)}
              restTimeSeconds={preferences.default_rest_time ?? undefined}
              highResolution
            />
          </LabeledValue>
        )}
      </Stack>
      <DisplayNotes notes={exercise.notes} />
    </Stack>
  );
};

export default ExerciseRow;
