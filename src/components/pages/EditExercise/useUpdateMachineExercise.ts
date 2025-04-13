import { useCallback } from 'react';
import { updateMachineExercise } from '@/firebase';
import { MachineExerciseData, Update, WithID } from '@/types';
import useUser from '@/hooks/useUser';

type UpdateMachineExercise = (
  exerciseData: WithID<MachineExerciseData>,
  update: Update<MachineExerciseData>,
) => Promise<WithID<MachineExerciseData>>;

const useUpdateMachineExercise = (): UpdateMachineExercise => {
  const user = useUser();

  return useCallback<UpdateMachineExercise>(
    async (exerciseData, update) => {
      if (user === null || user === 'unknown') {
        throw new Error(
          'Invalid invariant. user should always be defined here.',
        );
      }
      return updateMachineExercise(user, exerciseData.id, update);
    },
    [user],
  );
};

export default useUpdateMachineExercise;
