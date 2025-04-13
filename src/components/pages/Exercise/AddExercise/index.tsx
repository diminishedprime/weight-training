import * as React from 'react';
import { Button } from '@mui/material';
import {
  Exercise,
  narrowBarExercise,
  narrowDumbbellExercise,
  narrowMachineExercise,
} from '@/types';
import AddBarExercise from '@/components/pages/Exercise/AddExercise/AddBarExercise';
import AddDumbbellExercise from '@/components/pages/Exercise/AddExercise/AddDumbbellExercise';
import AddMachineExercise from '@/components/pages/Exercise/AddExercise/AddMachineExercise';
import { DumbbellAPI } from '@/components/pages/Exercise/AddExercise/useDumbbellWeight';
import { PlatesAPI } from '@/components/pages/Exercise/usePlates';
import { MachineAPI } from './useMachineWeight';

interface AddExerciseProps {
  exercise: Exercise;
  onCancel: () => void;
  onStart: () => void;
  noneStarted: boolean;
  platesAPI: PlatesAPI;
  dumbbellAPI: DumbbellAPI;
  machineAPI: MachineAPI;
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
  machineAPI,
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
    if (narrowMachineExercise(exercise)) {
      return (
        <AddMachineExercise
          machineAPI={machineAPI}
          machineExercise={exercise}
          onCancel={onCancel}
        />
      );
    }
  }
  return null;
};

export default AddExercise;
