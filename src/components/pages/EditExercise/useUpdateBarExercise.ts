import { useCallback } from 'react';
import { updateBarExercise } from '@/firebase';
import { BarExerciseData, Update, WithID } from '@/types';
import useUser from '@/hooks/useUser';

type UpdateExercise = (
  exerciseData: WithID<BarExerciseData>,
  update: Update<BarExerciseData>,
) => Promise<WithID<BarExerciseData>>;

const useUpdateBarExercise = (): UpdateExercise => {
  const user = useUser();

  return useCallback<UpdateExercise>(
    async (exerciseData, update) => {
      if (user === null || user === 'unknown') {
        throw new Error(
          'Invalid invariant. user should always be defined here.',
        );
      }
      return updateBarExercise(user, exerciseData.id, update);
    },
    [user],
  );
};

export default useUpdateBarExercise;
