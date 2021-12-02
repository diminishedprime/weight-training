import { useCallback } from 'react';
import { addExercise as addExerciseDB } from '@/firebase';
import { ExerciseData } from '@/types';
import useUser from '@/hooks/useUser';

type AddExercise = (exerciseData: ExerciseData) => Promise<void>;

const useAddExercise = (): AddExercise => {
  const user = useUser();

  const addExercise = useCallback(
    async (exerciseData: ExerciseData) => {
      if (user === null || user === 'unknown') {
        return;
      }
      await addExerciseDB(user, exerciseData);
    },
    [user],
  );

  return addExercise;
};

export default useAddExercise;
