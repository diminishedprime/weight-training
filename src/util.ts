import { Exercise, ExerciseData, PlateCount, Weight_V1 } from './types';

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
      throw new Error(`Unhandled case: ${exhaustiveCheck}`);
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
      throw new Error(`Unhandled case: ${exhaustiveCheck}`);
    }
  }
};

export const fromDBExercise = (v: ExerciseData['type']): Exercise => {
  switch (v) {
    case 'deadlift':
      return Exercise.Deadlift;
    // case 'squat':
    //   return Exercise.Squat;
    // case 'front-squat':
    //   return Exercise.FrontSquat;
    // case 'bench-press':
    //   return Exercise.BenchPress;
    // case 'overhead-press':
    //   return Exercise.OverheadPress;
    case 'snatch':
      return Exercise.Snatch;
    // case 'clean-and-jerk':
    //   return Exercise.CleanAndJerk;
    default: {
      const exhaustiveCheck: never = v;
      throw new Error(`Unhandled case: ${exhaustiveCheck}`);
    }
  }
};

export const barExerciseWeight = (plateCounts: PlateCount[]): Weight_V1 => {
  const num = plateCounts.reduce((acc, p) => acc + p[0].value * p[1] * 2, 45);
  return { value: num, unit: 'lb', version: 1 };
};
