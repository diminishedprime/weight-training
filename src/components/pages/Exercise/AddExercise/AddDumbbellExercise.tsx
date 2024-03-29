import { Add } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import * as React from 'react';
import { Timestamp } from 'firebase/firestore';
import usePersistentNumber, { NumberKey } from '@/hooks/usePersistentNumber';
import {
  Exercise,
  DumbbellExerciseData,
  DumbbellExercise,
  DumbbellBicepCurl_V1,
  DumbbellFly_V1,
  DumbbellRow_V1,
  DumbbellHammerCurl_V1,
  LateralRaise_V1,
  DumbbellSkullCrusher_V1,
  DumbbellPreacherCurl_V1,
} from '@/types';
import { nameForExercise } from '@/util';
import useAddExercise from '@/components/pages/Exercise/AddExercise/useAddExercise';
import SetReps from '@/components/pages/Exercise/SetReps';
import Dumbbell from '@/components/common/Dumbbell';
import { DumbbellAPI } from '@/components/pages/Exercise/AddExercise/useDumbbellWeight';

interface AddDumbbellExerciseProps {
  dumbbellExercise: DumbbellExercise;
  dumbbellAPI: DumbbellAPI;
  onCancel: () => void;
}

const AddDumbbellExercise: React.FC<AddDumbbellExerciseProps> = ({
  dumbbellExercise,
  dumbbellAPI,
  onCancel,
}) => {
  const addExercise = useAddExercise();
  const [reps, setReps] = usePersistentNumber(
    NumberKey.Reps,
    1,
    `add-dumbbell-exercise/${nameForExercise(dumbbellExercise)}`,
  );
  const { weight } = dumbbellAPI;

  const getDumbbellExerciseData =
    React.useCallback((): DumbbellExerciseData => {
      const baseExercise: Omit<DumbbellExerciseData, 'type' | 'version'> = {
        date: Timestamp.now(),
        reps,
        weight,
      };
      switch (dumbbellExercise) {
        case Exercise.DumbbellFly:
          return {
            ...baseExercise,
            type: 'dumbbell-fly',
            version: 1,
          } as DumbbellFly_V1;
        case Exercise.DumbbellRow:
          return {
            ...baseExercise,
            type: 'dumbbell-row',
            version: 1,
          } as DumbbellRow_V1;
        case Exercise.DumbbellBicepCurl:
          return {
            ...baseExercise,
            type: 'dumbbell-bicep-curl',
            version: 1,
          } as DumbbellBicepCurl_V1;
        case Exercise.DumbbellHammerCurl:
          return {
            ...baseExercise,
            type: 'dumbbell-hammer-curl',
            version: 1,
          } as DumbbellHammerCurl_V1;
        case Exercise.LateralRaise:
          return {
            ...baseExercise,
            type: 'lateral-raise',
            version: 1,
          } as LateralRaise_V1;
        case Exercise.DumbbellSkullCrusher:
          return {
            ...baseExercise,
            type: 'dumbbell-skull-crusher',
            version: 1,
          } as DumbbellSkullCrusher_V1;
        case Exercise.DumbbellPreacherCurl:
          return {
            ...baseExercise,
            type: 'dumbbell-preacher-curl',
            version: 1,
          } as DumbbellPreacherCurl_V1;
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
        <Button variant="outlined" onClick={dumbbellAPI.bumpDown}>
          Weight Down
        </Button>
        <Dumbbell weight={weight} viewportWidth={30} />
        <Button variant="outlined" onClick={dumbbellAPI.bumpUp}>
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
