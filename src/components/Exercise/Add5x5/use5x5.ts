import { Timestamp } from 'firebase/firestore';
import { useCallback, useContext, useEffect, useState } from 'react';
import { UserCtx } from '@/components/Layout';
import { getOneRepMax } from '@/firebase';
import {
  BarExercise,
  BarExerciseData,
  BarSet,
  OneRepMax,
  Weight_V1,
} from '@/types';
import { nameForExercise, nearest5 } from '@/util';
import usePersistentObject, { ObjectKey } from '@/hooks/usePersistentObject';
import useAddExercise from '../useAddExercise';

type WarmupSet = (
  | { type: 'even'; warmupSets: number }
  | { type: 'percentage' }
) & { includeEmptyBar: boolean };

const repsForSetNumber = (i: number): number => {
  switch (i) {
    case 1:
      return 5;
    case 2:
      return 3;
    case 3:
      return 2;
    case 4:
      return 2;
    default:
      return 2;
  }
};

const calc5x5Sets = (weight: Weight_V1, warmupSet: WarmupSet): BarSet[] => {
  const sets: BarSet[] = [];
  if (warmupSet.includeEmptyBar) {
    sets.push({
      warmup: true,
      weight: { value: 45, unit: 'lb', version: 1 },
      reps: 5,
      status: 'not-started',
      version: 1,
    });
  }
  if (warmupSet.type === 'even') {
    const jumpAmount = (weight.value - 45) / (warmupSet.warmupSets + 1);
    for (let i = 1; i < warmupSet.warmupSets + 1; i++) {
      sets.push({
        warmup: true,
        weight: {
          value: nearest5(jumpAmount * i + 45),
          unit: 'lb',
          version: 1,
        },
        reps: repsForSetNumber(i),
        status: 'not-started',
        version: 1,
      });
    }
  } else {
    const percentages = [0.45, 0.65, 0.85];
    percentages.forEach((percentage, i) =>
      sets.push({
        warmup: true,
        weight: {
          value: nearest5(percentage * weight.value),
          unit: 'lb',
          version: 1,
        },
        reps: repsForSetNumber(i + 1),
        status: 'not-started',
        version: 1,
      }),
    );
  }
  for (let i = 0; i < 5; i++) {
    sets.push({
      warmup: false,
      weight: {
        value: nearest5(weight.value),
        unit: 'lb',
        version: 1,
      },
      reps: 5,
      status: 'not-started',
      version: 1,
    });
  }
  return sets;
};

const useORM = (exercise: BarExercise): OneRepMax | undefined => {
  const user = useContext(UserCtx);
  const [orm, setORM] = useState<OneRepMax>();

  useEffect(() => {
    if (user === null) {
      return;
    }
    getOneRepMax(user, exercise).then(setORM);
  }, [user, exercise]);

  return orm;
};

const _5x5ORMRatio = 0.8;

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

type _5x5Data = NotStarted | InProgress;

const notStarted = (): NotStarted => ({
  status: 'not-started',
  orm: '',
  targetWeight: '',
  warmupSet: { type: 'percentage', includeEmptyBar: true },
});

const use5x5 = (exercise: BarExercise) => {
  const addExercise = useAddExercise();

  const xform = useCallback((a: _5x5Data) => {
    if (a.status === 'in-progress') {
      a.sets.forEach((s) => {
        if (s.time) {
          s.time = new Timestamp(s.time.seconds, s.time.nanoseconds);
        }
      });
    }
    return a;
  }, []);

  const [data, setData] = usePersistentObject<_5x5Data>(
    ObjectKey._5x5Data,
    notStarted(),
    nameForExercise(exercise),
    xform,
  );

  const actualORM = useORM(exercise);

  const setORM = useCallback(
    (s: string | undefined) => {
      try {
        const n = parseInt(s, 10);
        if (Number.isNaN(n)) {
          setData((old) => ({ ...old, orm: '', targetWeight: '' }));
          return;
        }
        setData((old) => ({
          ...old,
          orm: s,
          targetWeight: Math.floor(n * _5x5ORMRatio).toString(),
        }));
      } catch (e) {
        console.error(`Could not parse "${s}" as a number`);
      }
    },
    [setData],
  );

  const setTargetWeight = useCallback(
    (s: string | undefined) => {
      try {
        const n = parseInt(s, 10);
        if (Number.isNaN(n)) {
          setData((old) => ({ ...old, orm: '', targetWeight: '' }));
          return;
        }

        setData((old) => ({
          ...old,
          targetWeight: s,
          orm: Math.floor(n / _5x5ORMRatio).toString(),
        }));
      } catch (e) {
        console.error(`Could not parse "${s}" as a number`);
      }
    },
    [setData],
  );

  useEffect(() => {
    if (actualORM === undefined) {
      return;
    }
    setData((old) => ({
      ...old,
      orm: actualORM.weight.value.toString(),
      targetWeight: Math.floor(
        actualORM.weight.value * _5x5ORMRatio,
      ).toString(),
    }));
  }, [actualORM, setData]);

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
          const dbType = nameForExercise(exercise);
          if (dbType !== 'snatch') {
            addExercise({
              type: dbType,
              date: nu.time,
              reps: nu.reps,
              version: 1,
              weight: s.weight,
              warmup: s.warmup,
            } as BarExerciseData);
          }
          return nu;
        }),
      };
    });
  }, [setData, addExercise, exercise]);

  const start5x5 = useCallback(() => {
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
      const sets = calc5x5Sets(actualWeight, data.warmupSet);
      setData({ status: 'in-progress', sets, currentSet: 0 });
    } catch (e) {
      console.error(`Couldn't parse "${data.targetWeight}" as a number.`);
    }
  }, [data, setData]);

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
    setData(notStarted());
  }, [setData]);

  if (data.status === 'not-started') {
    return {
      ...data,
      start5x5,
      setORM,
      setTargetWeight,
      setWarmupType,
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
};

export default use5x5;
