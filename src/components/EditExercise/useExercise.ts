import { useContext, useEffect, useMemo, useState } from 'react';
import { getLift as getExercise } from '@/firebase';
import { ExerciseData, WithID } from '@/types';
import { UserCtx } from '../Layout';

interface Resolved {
  type: 'resolved';
  exercise: WithID<ExerciseData>;
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

type ExerciseRequest = NotStarted | InProgress | Resolved | Failed;

const useExercise = (id: string | undefined): ExerciseRequest => {
  const user = useContext(UserCtx);
  const [exercise, setExercise] = useState<WithID<ExerciseData>>();
  const [type, setType] = useState<ExerciseRequest['type']>('not-started');

  useEffect(() => {
    if (id === undefined) {
      return;
    }
    if (user === null) {
      setType('not-started');
      return;
    }
    setType('in-progress');
    getExercise(user, id).then((exercise) => {
      setExercise(exercise);
      setType('resolved');
    });
  }, [user]);

  return useMemo(() => {
    switch (type) {
      case 'resolved': {
        return { type, exercise };
      }
      default: {
        return { type };
      }
    }
  }, [type, exercise]);
};

export default useExercise;
