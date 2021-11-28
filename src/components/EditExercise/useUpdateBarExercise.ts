import { useCallback, useContext } from 'react';
import { updateBarExercise } from '@/firebase';
import { BarExerciseData, Update, WithID } from '@/types';
import { UserCtx } from '../Layout';

type UpdateExercise = (
  exerciseData: WithID<BarExerciseData>,
  update: Update<BarExerciseData>,
) => Promise<WithID<BarExerciseData>>;

const useUpdateBarExercise = (): UpdateExercise => {
  const user = useContext(UserCtx);

  return useCallback<UpdateExercise>(
    async (exerciseData, update) => {
      if (user === null) {
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
