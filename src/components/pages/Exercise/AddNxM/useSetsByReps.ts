import { Timestamp } from 'firebase/firestore';
import { useCallback, useContext, useEffect, useState } from 'react';
import { UserCtx } from '@/components/Layout';
import { getOneRepMax } from '@/firebase';
import {
  BarExercise,
  BarExerciseData,
  BarSet,
  Exercise,
  OneRepMax,
  Reps,
  Sets,
  WarmupSet,
  Weight_V1,
} from '@/types';
import {
  calcSetsByReps,
  keyForSetsByReps,
  nameForExercise,
  nearest5,
} from '@/util';
import usePersistentObject, { ObjectKey } from '@/hooks/usePersistentObject';
import useAddExercise from '@/components/pages/Exercise/AddExercise/useAddExercise';

const useORM = (exercise: BarExercise): OneRepMax | undefined => {
  const user = useContext(UserCtx);
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
  targetWeight: string;
  warmupSet: WarmupSet;
}

interface InProgress {
  status: 'in-progress';
  sets: BarSet[];
  currentSet: number;
}

type SetsByRepsData = NotStarted | InProgress;

const notStarted = (
  actualORM: OneRepMax | undefined,
  ormRatio: number,
): NotStarted => ({
  status: 'not-started',
  orm: actualORM === undefined ? '' : actualORM.weight.value.toString(),
  targetWeight:
    actualORM === undefined
      ? ''
      : nearest5(actualORM.weight.value * ormRatio).toString(),
  warmupSet: { type: 'percentage', includeEmptyBar: true },
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
    ObjectKey.SetsByRepsData,
    notStarted(actualORM, ormRatio),
    `${nameForExercise(exercise)}/${keyForSetsByReps(sets, reps)}`,
    xform,
  );

  const setORM = useCallback(
    (s: string | undefined) => {
      try {
        const n = parseInt(s || '', 10);
        if (Number.isNaN(n)) {
          setData((old) => ({ ...old, orm: '', targetWeight: '' }));
          return;
        }
        setData((old) => ({
          ...old,
          orm: s || '',
          targetWeight: Math.floor(n * ormRatio).toString(),
        }));
      } catch (e) {
        console.error(`Could not parse "${s}" as a number`);
      }
    },
    [setData, ormRatio],
  );

  const setTargetWeight = useCallback(
    (s: string | undefined) => {
      try {
        const n = parseInt(s || '', 10);
        if (Number.isNaN(n)) {
          setData((old) => ({ ...old, orm: '', targetWeight: '' }));
          return;
        }

        setData((old) => ({
          ...old,
          targetWeight: s || '',
          orm: Math.floor(n / ormRatio).toString(),
        }));
      } catch (e) {
        console.error(`Could not parse "${s}" as a number`);
      }
    },
    [setData, ormRatio],
  );

  useEffect(() => {
    if (actualORM === undefined) {
      return;
    }
    setData((old) => ({
      ...old,
      orm: actualORM.weight.value.toString(),
      targetWeight: Math.floor(actualORM.weight.value * ormRatio).toString(),
    }));
  }, [actualORM, setData, ormRatio]);

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
          addExercise(
            (() => {
              const basePlate: Omit<BarExerciseData, 'type' | 'version'> = {
                date: Timestamp.now(),
                reps: s.reps,
                warmup: s.warmup,
                weight: s.weight,
              };
              switch (exercise) {
                case Exercise.Snatch:
                  return { ...basePlate, type: 'snatch', version: 1 };
                case Exercise.Deadlift:
                  return { ...basePlate, type: 'deadlift', version: 3 };
                case Exercise.Squat:
                  return { ...basePlate, type: 'squat', version: 3 };
                case Exercise.FrontSquat:
                  return { ...basePlate, type: 'front-squat', version: 3 };
                case Exercise.BenchPress:
                  return { ...basePlate, type: 'bench-press', version: 3 };
                case Exercise.OverheadPress:
                  return { ...basePlate, type: 'overhead-press', version: 3 };
                default: {
                  const exhaustiveCheck: never = exercise;
                  throw new Error(`Unhandled case: ${exhaustiveCheck}`);
                }
              }
            })() as BarExerciseData,
          );
          return nu;
        }),
      };
    });
  }, [setData, addExercise, exercise]);

  const startSetsByReps = useCallback(() => {
    if (data.status !== 'not-started') {
      return;
    }
    try {
      const value = parseInt(data.targetWeight, 10);
      const actualWeight: Weight_V1 = {
        value: nearest5(value),
        unit: 'lb',
        version: 1,
      };
      const barSets = calcSetsByReps(actualWeight, data.warmupSet, sets, reps);
      setData({ status: 'in-progress', sets: barSets, currentSet: 0 });
    } catch (e) {
      console.error(`Couldn't parse "${data.targetWeight}" as a number.`);
    }
  }, [data, setData, reps, sets]);

  const setWarmupSets = useCallback(
    (s: Sets) => {
      setData((old) => {
        if (old.status !== 'not-started') {
          return old;
        }
        if (old.warmupSet.type !== 'even') {
          return old;
        }
        return {
          ...old,
          warmupSet: { ...old.warmupSet, warmupSets: Math.max(0, s) },
        };
      });
    },
    [setData],
  );

  const setWarmupType = useCallback(
    (warmupType: WarmupSet['type']) => {
      if (data.status !== 'not-started') {
        return;
      }
      let warmupSet: WarmupSet;
      switch (warmupType) {
        case 'percentage':
          warmupSet = { type: 'percentage', includeEmptyBar: true };
          break;
        case 'even': {
          warmupSet = {
            type: 'even',
            warmupSets: 3,
            includeEmptyBar: true,
          };
          break;
        }
        default: {
          const exhaustiveCheck: never = warmupType;
          throw new Error(`Unhandled case: ${exhaustiveCheck}`);
        }
      }
      setData((old) => {
        if (old.status !== 'not-started') {
          return old;
        }
        return { ...old, warmupSet };
      });
    },
    [data, setData],
  );

  const cancel = useCallback(() => {
    setData(notStarted(actualORM, ormRatio));
  }, [setData, actualORM, ormRatio]);

  if (data.status === 'not-started') {
    return {
      ...data,
      startSetsByReps,
      setORM,
      setTargetWeight,
      setWarmupType,
      cancel,
      setWarmupSets,
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
