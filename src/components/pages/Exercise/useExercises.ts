import { useEffect, useMemo, useState } from 'react';
import { subscribeToLiftsByType } from '@/firebase';
import { Exercise, ExerciseData, WithID } from '@/types';
import useUser from '@/hooks/useUser';

interface Resolved {
  type: 'resolved';
  exercises: WithID<ExerciseData>[];
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

const useExercises = (exercise: Exercise | undefined | null): LiftsRequest => {
  const user = useUser();
  const [exercises, setExercises] = useState<WithID<ExerciseData>[]>([]);
  const [type, setType] = useState<LiftsRequest['type']>('not-started');

  useEffect(() => {
    if (
      user === null ||
      user === 'unknown' ||
      exercise === undefined ||
      exercise === null
    ) {
      setType('not-started');
      return;
    }
    setType('in-progress');
    return subscribeToLiftsByType(user, exercise, (exercises) => {
      setType('resolved');
      setExercises(exercises);
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
