import { useCallback } from 'react';
import { updateDumbbellExercise } from '@/firebase';
import { DumbbellExerciseData, Update, WithID } from '@/types';
import useUser from '@/hooks/useUser';

type UpdateDumbbellExercise = (
  exerciseData: WithID<DumbbellExerciseData>,
  update: Update<DumbbellExerciseData>,
) => Promise<WithID<DumbbellExerciseData>>;

const useUpdateBarExercise = (): UpdateDumbbellExercise => {
  const user = useUser();

  return useCallback<UpdateDumbbellExercise>(
    async (exerciseData, update) => {
      if (user === null || user === 'unknown') {
        throw new Error(
          'Invalid invariant. user should always be defined here.',
        );
      }
      return updateDumbbellExercise(user, exerciseData.id, update);
    },
    [user],
  );
};

export default useUpdateBarExercise;
