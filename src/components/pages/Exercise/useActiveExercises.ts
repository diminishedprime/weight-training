import { useCallback, useMemo } from 'react';
import usePersistentObject, { StorageKey } from '@/hooks/usePersistentObject';
import { Exercise, Reps, Sets } from '@/types';
import { keyForSetsByReps, nameForExercise } from '@/util';

const AddVisibleKey = `AddExerciseVisible`;

const useActiveExercises = (exercise: Exercise | undefined | null) => {
  const [data, setData] = usePersistentObject<Record<string, boolean>>(
    StorageKey.ActiveBarExercise,
    {},
    nameForExercise(exercise) || '',
  );

  const noneStarted = useMemo(
    () => Object.values(data).every((started) => !started),
    [data],
  );

  const isAddVisible = useCallback(() => !!data[AddVisibleKey], [data]);

  const isActive = useCallback(
    (sets: Sets, reps: Reps) => !!data[keyForSetsByReps(sets, reps)],
    [data],
  );

  const setActive = useCallback(
    (sets: Sets, reps: Reps) => {
      setData((old) => ({
        ...Object.entries(old).reduce(
          (acc, [k, _]) => ({
            ...acc,
            [k]: false,
          }),
          {},
        ),
        [keyForSetsByReps(sets, reps)]: true,
      }));
    },
    [setData],
  );

  const setInactive = useCallback(
    (sets: Sets, reps: Reps) => {
      setData((old) => ({
        ...old,
        [keyForSetsByReps(sets, reps)]: false,
      }));
    },
    [setData],
  );

  const setAddExerciseInactive = useCallback(() => {
    setData((old) => ({
      ...old,
      [AddVisibleKey]: false,
    }));
  }, [setData]);

  const setAddExerciseActive = useCallback(() => {
    setData((old) => ({
      ...Object.entries(old).reduce(
        (acc, [k, _]) => ({
          ...acc,
          [k]: false,
        }),
        {},
      ),
      [AddVisibleKey]: true,
    }));
  }, [setData]);

  return {
    isActive,
    setActive,
    setInactive,
    noneStarted,
    isAddVisible,
    setAddExerciseInactive,
    setAddExerciseActive,
  };
};

export default useActiveExercises;
