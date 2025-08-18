"use client";
import { ExerciseType } from "@/common-types";
import EditRestTime from "@/components/edit/EditRestTime";
import LabeledValue from "@/components/LabeledValue";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import TrashIcon from "@mui/icons-material/DeleteOutlined";
import { IconButton, Stack } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  exerciseType: ExerciseType;
  exerciseRest: number;
  removeExerciseRest: (exerciseType: ExerciseType) => void;
  onExerciseRestChange: (exerciseType: ExerciseType, rest: number) => void;
}

const ExerciseRestTime: React.FC<Props> = (props) => {
  const api = useExerciseRestTimeAPI(props);
  return (
    <LabeledValue
      labelVariant="body2"
      label={exerciseTypeUIStringBrief(props.exerciseType)}
    >
      <Stack direction="row" flexWrap="wrap">
        <EditRestTime
          restTime={api.exerciseRest}
          setRestTime={api.setExerciseRest}
        />
        <IconButton
          color="error"
          onClick={() => props.removeExerciseRest(props.exerciseType)}
        >
          <TrashIcon />
        </IconButton>
      </Stack>
    </LabeledValue>
  );
};

export default ExerciseRestTime;

const useExerciseRestTimeAPI = (props: Props) => {
  const { onExerciseRestChange, exerciseType } = props;
  const [exerciseRest, setExerciseRest] = useState(props.exerciseRest);

  useEffect(() => {
    onExerciseRestChange(exerciseType, exerciseRest);
  }, [exerciseRest, exerciseType, onExerciseRestChange]);

  return { exerciseRest, setExerciseRest };
};
