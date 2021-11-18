import { Exercise } from './types';

export const exerciseUIString = (v: Exercise): string => {
  switch (v) {
    case Exercise.Deadlift:
      return 'Deadlift';
    case Exercise.Squat:
      return 'Squat';
    case Exercise.FrontSquat:
      return 'Front Squat';
    case Exercise.BenchPress:
      return 'Bench Press';
    case Exercise.OverheadPress:
      return 'Overhead Press';
    case Exercise.Snatch:
      return 'Snatch';
    case Exercise.CleanAndJerk:
      return 'Clean and Jerk';
    default: {
      const exhaustiveCheck: never = v;
      throw new Error(`Unhandled color case: ${exhaustiveCheck}`);
    }
  }
};

export const nameForExercise = (v: Exercise): string => {
  switch (v) {
    case Exercise.Deadlift:
      return 'deadlift';
    case Exercise.Squat:
      return 'squat';
    case Exercise.FrontSquat:
      return 'front-squat';
    case Exercise.BenchPress:
      return 'bench-press';
    case Exercise.OverheadPress:
      return 'overhead-press';
    case Exercise.Snatch:
      return 'snatch';
    case Exercise.CleanAndJerk:
      return 'clean-and-jerk';
    default: {
      const exhaustiveCheck: never = v;
      throw new Error(`Unhandled color case: ${exhaustiveCheck}`);
    }
  }
};
