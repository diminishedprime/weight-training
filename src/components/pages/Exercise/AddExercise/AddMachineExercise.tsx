import { Add } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import * as React from 'react';
import { Timestamp } from 'firebase/firestore';
import usePersistentNumber, { NumberKey } from '@/hooks/usePersistentNumber';
import {
  Exercise,
  MachineExercise,
  MachineExerciseData,
  AbdominalMachine_V1,
  LegCurlMachine_V1,
  AdductionInnerThighMachine_V1,
} from '@/types';
import { nameForExercise } from '@/util';
import useAddExercise from '@/components/pages/Exercise/AddExercise/useAddExercise';
import SetReps from '@/components/pages/Exercise/SetReps';
import MachineStack from '@/components/common/MachineStack';
import { MachineAPI } from '@/components/pages/Exercise/AddExercise/useMachineWeight';

interface AddMachineExerciseProps {
  machineExercise: MachineExercise;
  machineAPI: MachineAPI;
  onCancel: () => void;
}

const AddMachineExercise: React.FC<AddMachineExerciseProps> = ({
  machineExercise,
  machineAPI,
  onCancel,
}) => {
  const addExercise = useAddExercise();
  const [reps, setReps] = usePersistentNumber(
    NumberKey.Reps,
    1,
    `add-machine-exercise/${nameForExercise(machineExercise)}`,
  );
  const { weight } = machineAPI;

  const getMachineExerciseData = React.useCallback((): MachineExerciseData => {
    const baseExercise: Omit<MachineExerciseData, 'type' | 'version'> = {
      date: Timestamp.now(),
      reps,
      weight,
    };
    switch (machineExercise) {
      case Exercise.AbdominalMachine:
        return {
          ...baseExercise,
          type: 'abdominal-machine',
          version: 1,
        } as AbdominalMachine_V1;
      case Exercise.LegCurlMachine:
        return {
          ...baseExercise,
          type: 'leg-curl-machine',
          version: 1,
        } as LegCurlMachine_V1;
      case Exercise.AdductionInnerThighMachine:
        return {
          ...baseExercise,
          type: 'adduction-inner-thigh-machine',
          version: 1,
        } as AdductionInnerThighMachine_V1;
      default: {
        const exhaustiveCheck: never = machineExercise;
        throw new Error(`Unhandled case: ${exhaustiveCheck}`);
      }
    }
  }, [machineExercise, reps, weight]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <Button variant="outlined" onClick={machineAPI.bumpDown}>
          Weight Down
        </Button>
        <MachineStack weight={weight} />
        <Button variant="outlined" onClick={machineAPI.bumpUp}>
          Weight Up
        </Button>
      </Box>
      <Box sx={{ mb: 1 }}>
        <SetReps reps={reps} setReps={setReps} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          color="error"
          sx={{ mr: 1, mt: 1 }}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ mr: 1, mt: 1 }}
          onClick={() => addExercise(getMachineExerciseData())}
        >
          Add
        </Button>
      </Box>
    </>
  );
};

export default AddMachineExercise;
