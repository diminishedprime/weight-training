import { Add } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import * as React from 'react';
import { Timestamp } from 'firebase/firestore';
import usePersistentNumber, { NumberKey } from '@/hooks/usePersistentNumber';
import {
  Exercise,
  DumbbellExerciseData,
  Weight_V1,
  DumbbellExercise,
} from '@/types';
import { nameForExercise } from '@/util';
import useAddExercise from '@/components/pages/Exercise/AddExercise/useAddExercise';
import SetReps from '@/components/pages/Exercise/SetReps';
import usePersistentObject, { ObjectKey } from '@/hooks/usePersistentObject';
import Dumbbell from '@/components/common/Dumbbell';
import useDumbbellWeight from '@/components/pages/Exercise/AddExercise/useDumbbellWeight';

interface AddDumbbellExerciseProps {
  dumbbellExercise: DumbbellExercise;
  onCancel: () => void;
}

const AddDumbbellExercise: React.FC<AddDumbbellExerciseProps> = ({
  dumbbellExercise,
  onCancel,
}) => {
  const addExercise = useAddExercise();
  const [reps, setReps] = usePersistentNumber(
    NumberKey.Reps,
    1,
    `add-dumbbell-exercise/${nameForExercise(dumbbellExercise)}`,
  );
  const [weight, setWeight] = usePersistentObject<Weight_V1>(
    ObjectKey.DumbbellExerciseWeight,
    { unit: 'lb', value: 10, version: 1 },
    `dumbbell/${nameForExercise(dumbbellExercise)}`,
  );
  const weightAPI = useDumbbellWeight(setWeight);

  const getDumbbellExerciseData =
    React.useCallback((): DumbbellExerciseData => {
      const baseExercise: Omit<DumbbellExerciseData, 'type' | 'version'> = {
        date: Timestamp.now(),
        reps,
        weight,
      };
      switch (dumbbellExercise) {
        case Exercise.DumbbellFly:
          return { ...baseExercise, type: 'dumbbell-fly', version: 1 };
        case Exercise.DumbbellRow:
          return { ...baseExercise, type: 'dumbbell-row', version: 1 };
        case Exercise.DumbbellBicepCurl:
          return { ...baseExercise, type: 'dumbbell-bicep-curl', version: 1 };
        default: {
          const exhaustiveCheck: never = dumbbellExercise;
          throw new Error(`Unhandled case: ${exhaustiveCheck}`);
        }
      }
    }, [dumbbellExercise, reps, weight]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <Button variant="outlined" onClick={weightAPI.bumpDown}>
          Weight Down
        </Button>
        <Dumbbell weight={weight} viewportWidth={30} />
        <Button variant="outlined" onClick={weightAPI.bumpUp}>
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
          onClick={() => addExercise(getDumbbellExerciseData())}
        >
          Add
        </Button>
      </Box>
    </>
  );
};

export default AddDumbbellExercise;
