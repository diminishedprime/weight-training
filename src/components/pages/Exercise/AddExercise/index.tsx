import * as React from 'react';
import { Button } from '@mui/material';
import { Exercise, narrowBarExercise, narrowDumbbellExercise } from '@/types';
import AddBarExercise from '@/components/pages/Exercise/AddExercise/AddBarExercise';
import AddDumbbellExercise from '@/components/pages/Exercise/AddExercise/AddDumbbellExercise';

interface AddExerciseProps {
  exercise: Exercise;
  onCancel: () => void;
  onStart: () => void;
  noneStarted: boolean;
  active: boolean;
}

const AddExercise: React.FC<AddExerciseProps> = ({
  exercise,
  onCancel,
  onStart,
  noneStarted,
  active,
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
      return <AddBarExercise barExercise={exercise} onCancel={onCancel} />;
    }
    if (narrowDumbbellExercise(exercise)) {
      return (
        <AddDumbbellExercise dumbbellExercise={exercise} onCancel={onCancel} />
      );
    }
  }
  return null;
};

export default AddExercise;
