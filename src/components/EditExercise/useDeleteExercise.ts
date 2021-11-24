import { useCallback, useContext } from 'react';
import { deleteExercise as deleteExerciseDB } from '@/firebase';
import { ExerciseData, WithID } from '@/types';
import { UserCtx } from '../Layout';

type DeleteExercise = (exerciseData: WithID<ExerciseData>) => Promise<void>;

const useDeleteExercise = (): DeleteExercise => {
  const user = useContext(UserCtx);

  const deleteExercise: DeleteExercise = useCallback(
    (exerciseData) => deleteExerciseDB(user, exerciseData.id),
    [user],
  );

  return deleteExercise;
};

export default useDeleteExercise;
