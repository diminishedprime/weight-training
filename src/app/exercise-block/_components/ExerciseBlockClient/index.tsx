"use client";

import { ExerciseBlocks } from "@/common-types";
import { Stack, Typography } from "@mui/material";
import ExerciseBlockRow from "@/app/exercise-block/_components/ExerciseBlockClient/ExerciseBlockRow";

interface ExerciseBlockClientProps {
  exerciseBlocks: ExerciseBlocks;
}

const useExerciseBlockClientAPI = (_props: ExerciseBlockClientProps) => {
  // TODO
};

const ExerciseBlockClient: React.FC<ExerciseBlockClientProps> = (props) => {
  const _api = useExerciseBlockClientAPI(props);

  if (props.exerciseBlocks.length === 0) {
    return (
      <Stack>
        <Typography variant="body1" color="textSecondary">
          No exercise blocks found.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={1}>
      {props.exerciseBlocks.map((block) => (
        <ExerciseBlockRow key={block.id} block={block} />
      ))}
    </Stack>
  );
};

export default ExerciseBlockClient;
