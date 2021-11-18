import { useContext, useEffect, useMemo, useState } from 'react';
import { getLiftsByType } from '@/firebase';
import { Exercise, ExerciseData } from '@/types';
import { UserCtx } from '../Layout';

interface Resolved {
  type: 'resolved';
  exercises: ExerciseData[];
}

interface InProgress {
  type: 'in-progress';
}

interface NotStarted {
  type: 'not-started';
}

interface Failed {
  type: 'failed';
}

type LiftsRequest = NotStarted | InProgress | Resolved | Failed;

const useExercises = (exercise: Exercise): LiftsRequest => {
  const user = useContext(UserCtx);
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [type, setType] = useState<LiftsRequest['type']>('not-started');

  useEffect(() => {
    if (user === null || exercise === undefined) {
      setType('not-started');
      return;
    }
    setType('in-progress');
    getLiftsByType(user, exercise).then((exercises) => {
      setExercises(exercises);
      setType('resolved');
    });
  }, [user, exercise]);

  return useMemo(() => {
    switch (type) {
      case 'resolved': {
        return { type, exercises };
      }
      default: {
        return { type };
      }
    }
  }, [type, exercises]);
};

export default useExercises;
