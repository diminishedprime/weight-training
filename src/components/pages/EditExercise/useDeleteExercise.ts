import { useCallback } from 'react';
import { deleteExercise as deleteExerciseDB } from '@/firebase';
import { ExerciseData, WithID } from '@/types';
import useUser from '@/hooks/useUser';

type DeleteExercise = (exerciseData: WithID<ExerciseData>) => Promise<void>;

const useDeleteExercise = (): DeleteExercise => {
  const user = useUser();

  const deleteExercise: DeleteExercise = useCallback(
    (exerciseData) => {
      if (user === null || user === 'unknown') {
        throw new Error(
          'Invalid invariant. User should always be defined here.',
        );
      }
      return deleteExerciseDB(user, exerciseData.id);
    },
    [user],
  );

  return deleteExercise;
};

export default useDeleteExercise;
