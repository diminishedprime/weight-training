import { createEnumParam } from 'serialize-query-params';
import { QueryParam } from './components/Exercise';
import { Exercise } from './types';

export const ExerciseQueryParam = createEnumParam(Object.values(Exercise));

export const Links = {
  Deadlift: `/exercise?${QueryParam.LiftType}=${Exercise.Deadlift}`,
  Squat: `/exercise?${QueryParam.LiftType}=${Exercise.Squat}`,
  FrontSquat: `/exercise?${QueryParam.LiftType}=${Exercise.FrontSquat}`,
  BenchPress: `/exercise?${QueryParam.LiftType}=${Exercise.BenchPress}`,
  OverheadPress: `/exercise?${QueryParam.LiftType}=${Exercise.OverheadPress}`,
  CleanAndJerk: `/exercise?${QueryParam.LiftType}=${Exercise.CleanAndJerk}`,
  Snatch: `/exercise?${QueryParam.LiftType}=${Exercise.Snatch}`,
};
