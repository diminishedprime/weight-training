import { Timestamp } from 'firebase/firestore';
import { Weight_V1 } from '@/types';

export enum Exercise {
  // Powerlifting Stuff
  Squat = 'b',
  BenchPress = 'd',
  Deadlift = 'a',
  // General Bar stuff
  FrontSquat = 'c',
  OverheadPress = 'e',
  // Olympic Lift Stuff,
  Snatch = 'f',
  // Dumbbell Stuff,
  DumbbellRow = 'g',
  DumbbellFly = 'h',
  DumbbellBicepCurl = 'i',
}

export type DumbbellExercise =
  | Exercise.DumbbellRow
  | Exercise.DumbbellFly
  | Exercise.DumbbellBicepCurl;

export const narrowDumbbellExercise = (
  exercise: Exercise,
): exercise is DumbbellExercise =>
  exercise === Exercise.DumbbellRow ||
  exercise === Exercise.DumbbellFly ||
  exercise === Exercise.DumbbellBicepCurl;

export type DumbbellExerciseData =
  | DumbbellRow_V1
  | DumbbellFly_V1
  | DumbbellBicepCurl_V1;

interface DumbbellRow_V1 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'dumbbell-row';
  reps: number;
  version: 1;
}

interface DumbbellFly_V1 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'dumbbell-fly';
  reps: number;
  version: 1;
}

interface DumbbellBicepCurl_V1 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'dumbbell-bicep-curl';
  reps: number;
  version: 1;
}

export type BarExercise =
  | Exercise.Deadlift
  | Exercise.Squat
  | Exercise.FrontSquat
  | Exercise.BenchPress
  | Exercise.Snatch
  | Exercise.OverheadPress;

export const narrowBarExercise = (
  exercise: Exercise,
): exercise is BarExercise =>
  exercise === Exercise.Deadlift ||
  exercise === Exercise.Squat ||
  exercise === Exercise.FrontSquat ||
  exercise === Exercise.BenchPress ||
  exercise === Exercise.OverheadPress;

export const isBarExercise = (exercise: Exercise): boolean =>
  exercise === Exercise.Deadlift ||
  exercise === Exercise.Squat ||
  exercise === Exercise.FrontSquat ||
  exercise === Exercise.BenchPress ||
  exercise === Exercise.OverheadPress;

export type BarExerciseData =
  | Deadlift_V3
  | Squat_V3
  | FrontSquat_V3
  | BenchPress_V3
  | OverheadPress_V3
  | Snatch_V1;

interface Deadlift_V3 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'deadlift';
  reps: number;
  warmup: boolean;
  version: 3;
}

interface Squat_V3 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'squat';
  reps: number;
  warmup: boolean;
  version: 3;
}

interface FrontSquat_V3 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'front-squat';
  reps: number;
  warmup: boolean;
  version: 3;
}

interface BenchPress_V3 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'bench-press';
  reps: number;
  warmup: boolean;
  version: 3;
}

interface OverheadPress_V3 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'overhead-press';
  reps: number;
  warmup: boolean;
  version: 3;
}

interface Snatch_V1 {
  date: Timestamp;
  reps: number;
  type: 'snatch';
  version: 1;
  warmup: boolean;
  weight: Weight_V1;
}

export type ExerciseData = BarExerciseData | DumbbellExerciseData;
