import { useCallback, useMemo } from 'react';
import { StorageKey } from '@/hooks/usePersistentObject';
import usePersistentString from '@/hooks/usePersistentString';
import { Exercise, exerciseUIString, metadataForExercise } from '@/types';

const AllExercises = Object.values(Exercise);

type ExerciseWithMetadata = ReturnType<typeof metadataForExercise> & {
  uiString: string;
  exercise: Exercise;
};

const WithMetadata: ExerciseWithMetadata[] = AllExercises.map((e) => ({
  exercise: e,
  uiString: exerciseUIString(e),
  ...metadataForExercise(e),
}));

const useExerciseSearch = (qualifier = '') => {
  const [search, setSearch] = usePersistentString(
    StorageKey.ExerciseSearch,
    '',
    qualifier,
  );

  const filter = useCallback(
    (wm: ExerciseWithMetadata) => {
      if (search === '') {
        return true;
      }
      const parts = search.split(' ').filter((a) => !!a);
      return !!parts.every(
        (part) =>
          wm.uiString.toLowerCase().includes(part) ||
          !!wm.equipment.find((e) => e.includes(part)) ||
          !!wm.targetAreas.find((e) => e.includes(part)),
      );
    },
    [search],
  );

  const filteredExercises = useMemo(
    () => WithMetadata.filter(filter),
    [filter],
  );

  return {
    search,
    setSearch,
    filteredExercises,
  };
};

export default useExerciseSearch;
