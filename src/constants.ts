import { createEnumParam } from 'serialize-query-params';
import { QueryParam } from './components/Exercise';
import { Exercise, PlateWeight } from './types';

export const ExerciseQueryParam = createEnumParam(Object.values(Exercise));

export const Links = {
  Deadlift: `/exercise?${QueryParam.LiftType}=${Exercise.Deadlift}`,
  Squat: `/exercise?${QueryParam.LiftType}=${Exercise.Squat}`,
  FrontSquat: `/exercise?${QueryParam.LiftType}=${Exercise.FrontSquat}`,
  BenchPress: `/exercise?${QueryParam.LiftType}=${Exercise.BenchPress}`,
  OverheadPress: `/exercise?${QueryParam.LiftType}=${Exercise.OverheadPress}`,
  Snatch: `/exercise?${QueryParam.LiftType}=${Exercise.Snatch}`,
};

export const OneOfEachPlate: PlateWeight[] = [
  { unit: 'lb', value: 45, version: 1 },
  { unit: 'lb', value: 25, version: 1 },
  { unit: 'lb', value: 10, version: 1 },
  { unit: 'lb', value: 5, version: 1 },
  { unit: 'lb', value: 2.5, version: 1 },
];
