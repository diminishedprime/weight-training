import { createEnumParam } from 'serialize-query-params';
import { Exercise, PlateWeight } from '@/types';
import { QueryParam } from '@/components/pages/Exercise';

export const ExerciseQueryParam = createEnumParam(Object.values(Exercise));

export const linkForExercise = (exercise: Exercise) =>
  `/exercise?${QueryParam.LiftType}=${exercise}`;

export const Links = {
  Deadlift: linkForExercise(Exercise.Deadlift),
  Squat: linkForExercise(Exercise.Squat),
  FrontSquat: linkForExercise(Exercise.FrontSquat),
  BenchPress: linkForExercise(Exercise.BenchPress),
  OverheadPress: linkForExercise(Exercise.OverheadPress),
  Snatch: linkForExercise(Exercise.Snatch),
  DumbbellFly: linkForExercise(Exercise.DumbbellFly),
  DumbbellRow: linkForExercise(Exercise.DumbbellRow),
  DumbbellBicepCurl: linkForExercise(Exercise.DumbbellBicepCurl),
  DumbbellHammerCurl: linkForExercise(Exercise.DumbbellHammerCurl),
};

export const OneOfEachPlate: PlateWeight[] = [
  { unit: 'lb', value: 45, version: 1 },
  { unit: 'lb', value: 25, version: 1 },
  { unit: 'lb', value: 10, version: 1 },
  { unit: 'lb', value: 5, version: 1 },
  { unit: 'lb', value: 2.5, version: 1 },
];
