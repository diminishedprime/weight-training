import { Timestamp } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { getOneRepMax } from '@/firebase';
import {
  BarbbellRow_V1,
  BarExercise,
  BarExerciseData,
  BarSet,
  BenchPress_V3,
  Deadlift_V3,
  Exercise,
  FrontSquat_V3,
  InclineBenchPress_V1,
  OneRepMax,
  OverheadPress_V3,
  Reps,
  RomainianDeadlift_V1,
  Sets,
  Snatch_V1,
  Squat_V3,
} from '@/types';
import { calcSetsByReps2, keyForSetsByReps, nameForExercise } from '@/util';
import usePersistentObject, { StorageKey } from '@/hooks/usePersistentObject';
import useAddExercise from '@/components/pages/Exercise/AddExercise/useAddExercise';
import useUser from '@/hooks/useUser';

const useORM = (exercise: BarExercise): OneRepMax | undefined => {
  const user = useUser();
  const [orm, setORM] = useState<OneRepMax>();

  useEffect(() => {
    if (user === null || user === 'unknown') {
      return;
    }
    getOneRepMax(user, exercise).then(setORM);
  }, [user, exercise]);

  return orm;
};

interface NotStarted {
  status: 'not-started';
  orm: string;
}

interface InProgress {
  status: 'in-progress';
  sets: BarSet[];
  currentSet: number;
}

type SetsByRepsData = NotStarted | InProgress;

const notStarted = (actualORM: OneRepMax | undefined): NotStarted => ({
  status: 'not-started',
  orm: actualORM === undefined ? '' : actualORM.weight.value.toString(),
});

const useSetsByReps = (
  exercise: BarExercise,
  sets: Sets,
  reps: Reps,
  ormRatio: number,
) => {
  const addExercise = useAddExercise();
  const actualORM = useORM(exercise);

  const xform = useCallback((a: Record<string, any>) => {
    const iPromise: SetsByRepsData = a as SetsByRepsData;
    if (iPromise.status === 'in-progress') {
      iPromise.sets.forEach((s) => {
        if (s.time) {
          s.time = new Timestamp(s.time.seconds, s.time.nanoseconds);
        }
      });
    }
    return iPromise;
  }, []);

  const [data, setData] = usePersistentObject<SetsByRepsData>(
    StorageKey.SetsByRepsData,
    notStarted(actualORM),
    `${nameForExercise(exercise)}/${keyForSetsByReps(sets, reps)}`,
    xform,
  );

  const setORM = useCallback(
    (s: string | undefined) => {
      try {
        const n = parseInt(s || '', 10);
        if (Number.isNaN(n)) {
          setData((old) => ({ ...old, orm: '' }));
          return;
        }
        setData((old) => ({
          ...old,
          orm: s || '',
        }));
      } catch (e) {
        console.error(`Could not parse "${s}" as a number`);
      }
    },
    [setData],
  );

  const skipLift = useCallback(() => {
    setData((old) => {
      if (old.status === 'not-started') {
        return old;
      }
      return {
        ...old,
        currentSet: old.currentSet + 1,
        sets: old.sets.map((s, idx) =>
          idx === old.currentSet
            ? { ...s, status: 'skipped', time: Timestamp.now() }
            : s,
        ),
      };
    });
  }, [setData]);

  const finishLift = useCallback(() => {
    setData((old) => {
      if (old.status === 'not-started') {
        return old;
      }
      return {
        ...old,
        currentSet: old.currentSet + 1,
        sets: old.sets.map((s, idx) => {
          if (idx !== old.currentSet) {
            return s;
          }
          const nu: BarSet = {
            ...s,
            status: 'finished',
            time: Timestamp.now(),
          };
          const exerciseData: BarExerciseData = (() => {
            const basePlate: Omit<BarExerciseData, 'type' | 'version'> = {
              date: Timestamp.now(),
              reps: s.reps,
              warmup: s.warmup,
              weight: s.weight,
            };
            switch (exercise) {
              case Exercise.Snatch:
                return {
                  ...basePlate,
                  type: 'snatch',
                  version: 1,
                } as Snatch_V1;
              case Exercise.Deadlift:
                return {
                  ...basePlate,
                  type: 'deadlift',
                  version: 3,
                } as Deadlift_V3;
              case Exercise.Squat:
                return { ...basePlate, type: 'squat', version: 3 } as Squat_V3;
              case Exercise.FrontSquat:
                return {
                  ...basePlate,
                  type: 'front-squat',
                  version: 3,
                } as FrontSquat_V3;
              case Exercise.BenchPress:
                return {
                  ...basePlate,
                  type: 'bench-press',
                  version: 3,
                } as BenchPress_V3;
              case Exercise.OverheadPress:
                return {
                  ...basePlate,
                  type: 'overhead-press',
                  version: 3,
                } as OverheadPress_V3;
              case Exercise.RomainianDeadlift:
                return {
                  ...basePlate,
                  type: 'romanian-deadlift',
                  version: 1,
                } as RomainianDeadlift_V1;
              case Exercise.BarbbellRow:
                return {
                  ...basePlate,
                  type: 'barbbell-row',
                  version: 1,
                } as BarbbellRow_V1;
              case Exercise.InclineBenchPress:
                return {
                  ...basePlate,
                  type: 'incline-bench-press',
                  version: 1,
                } as InclineBenchPress_V1;
              default: {
                const exhaustiveCheck: never = exercise;
                throw new Error(`Unhandled case: ${exhaustiveCheck}`);
              }
            }
          })();
          addExercise(exerciseData);
          return nu;
        }),
      };
    });
  }, [setData, addExercise, exercise]);

  const startSetsByReps = useCallback(() => {
    if (data.status !== 'not-started') {
      return;
    }
    const barSets = calcSetsByReps2(
      { version: 1, unit: 'lb', value: parseInt(data.orm, 10) },
      ormRatio,
    );
    setData({ status: 'in-progress', sets: barSets, currentSet: 0 });
  }, [data, setData, ormRatio]);

  const cancel = useCallback(() => {
    setData(notStarted(actualORM));
  }, [setData, actualORM]);

  if (data.status === 'not-started') {
    return {
      ...data,
      startSetsByReps,
      setORM,
      cancel,
    };
  }
  if (data.status === 'in-progress') {
    return {
      ...data,
      cancel,
      skipLift,
      finishLift,
    };
  }
  throw new Error('Invalid invariant. All status options should be covered.');
};

export default useSetsByReps;
