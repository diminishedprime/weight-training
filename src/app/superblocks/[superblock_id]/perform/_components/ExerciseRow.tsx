import { GetPerformSuperblockExercise } from "@/common-types/get-perform-superblock";
import LabeledValue from "@/components/LabeledValue";
import DisplayWeight from "@/components/display/DisplayWeight";
import { Paper, Stack } from "@mui/material";

interface ExerciseRowProps {
  exercise: GetPerformSuperblockExercise;
}

const ExerciseRow: React.FC<ExerciseRowProps> = ({ exercise }) => {
  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      spacing={1}
      component={Paper}
      sx={{ m: 0.5, p: 0.5 }}
    >
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
    </Stack>
  );
};

export default ExerciseRow;
