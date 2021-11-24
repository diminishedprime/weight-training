import { useCallback, useContext } from 'react';
import { addExercise as addExerciseDB } from '@/firebase';
import { ExerciseData } from '@/types';
import { UserCtx } from '../Layout';

type AddExercise = (exerciseData: ExerciseData) => Promise<void>;

const useAddExercise = (): AddExercise => {
  const user = useContext(UserCtx);

  const addExercise = useCallback(
    async (exerciseData: ExerciseData) => {
      await addExerciseDB(user, exerciseData);
    },
    [user],
  );

  return addExercise;
};

export default useAddExercise;
