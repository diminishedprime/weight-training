import * as React from 'react';
import { Button } from '@mui/material';
import { Exercise, narrowBarExercise, narrowDumbbellExercise } from '@/types';
import AddBarExercise from '@/components/pages/Exercise/AddExercise/AddBarExercise';
import AddDumbbellExercise from '@/components/pages/Exercise/AddExercise/AddDumbbellExercise';
import { DumbbellAPI } from '@/components/pages/Exercise/AddExercise/useDumbbellWeight';
import { PlatesAPI } from '@/components/pages/Exercise/usePlates';

interface AddExerciseProps {
  exercise: Exercise;
  onCancel: () => void;
  onStart: () => void;
  noneStarted: boolean;
  platesAPI: PlatesAPI;
  dumbbellAPI: DumbbellAPI;
  active: boolean;
}

const AddExercise: React.FC<AddExerciseProps> = ({
  exercise,
  onCancel,
  onStart,
  noneStarted,
  active,
  platesAPI,
  dumbbellAPI,
}) => {
  if (noneStarted) {
    return (
      <Button variant="outlined" size="small" sx={{ mr: 1 }} onClick={onStart}>
        Custom
      </Button>
    );
  }

  if (active) {
    if (narrowBarExercise(exercise)) {
      return (
        <AddBarExercise
          barExercise={exercise}
          onCancel={onCancel}
          platesAPI={platesAPI}
        />
      );
    }
    if (narrowDumbbellExercise(exercise)) {
      return (
        <AddDumbbellExercise
          dumbbellAPI={dumbbellAPI}
          dumbbellExercise={exercise}
          onCancel={onCancel}
        />
      );
    }
  }
  return null;
};

export default AddExercise;
