import { Timestamp } from 'firebase/firestore';

export enum Exercise {
  Deadlift = 'a',
  Squat = 'b',
  FrontSquat = 'c',
  BenchPress = 'd',
  OverheadPress = 'e',
  Snatch = 'f',
}

export type BarExercise =
  | Exercise.Deadlift
  | Exercise.Squat
  | Exercise.FrontSquat
  | Exercise.BenchPress
  | Exercise.Snatch
  | Exercise.OverheadPress;

export const isBarExercise = (exercise: Exercise): exercise is BarExercise =>
  // Does typescript not check
  exercise === Exercise.Deadlift ||
  exercise === Exercise.Squat ||
  exercise === Exercise.FrontSquat ||
  exercise === Exercise.BenchPress ||
  exercise === Exercise.OverheadPress;

export interface Weight_V1 {
  unit: 'lb' | 'kg';
  value: number;
  version: 1;
}

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

interface OverheadPress_V3 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'overhead-press';
  reps: number;
  warmup: boolean;
  version: 3;
}

// TODO - this doesn't actually match the old format, but I'm not sure any are
// recorded so it might not matter.
interface Snatch_V1 {
  date: Timestamp;
  reps: number;
  type: 'snatch';
  version: 1;
  warmup: boolean;
  weight: Weight_V1;
}

export interface BarSet {
  reps: number;
  weight: Weight_V1;
  warmup: boolean;
  version: 1;
  time?: Timestamp;
  status: 'finished' | 'skipped' | 'not-started';
}

// TODO - eventually other exercises will be here too.
export type ExerciseData = BarExerciseData;

export type BarExerciseData =
  | Deadlift_V3
  | Squat_V3
  | FrontSquat_V3
  | BenchPress_V3
  | OverheadPress_V3
  | Snatch_V1;

export type WithID<T> = T & { id: string };

export type AddExerciseData = Omit<ExerciseData, 'date'>;

type _45 = { unit: 'lb'; value: 45; version: 1 };
type _25 = { unit: 'lb'; value: 25; version: 1 };
type _10 = { unit: 'lb'; value: 10; version: 1 };
type _5 = { unit: 'lb'; value: 5; version: 1 };
type _2_5 = { unit: 'lb'; value: 2.5; version: 1 };

export type PlateWeight = _45 | _25 | _10 | _5 | _2_5;

export type PlateCount = [PlateWeight, number];

export type Update<T> = { [K in keyof T]?: T[K] };

export interface OneRepMax {
  time: Timestamp;
  weight: Weight_V1;
}

export interface UserExercise {
  'one-rep-max': OneRepMax;
}

export type UserData = {
  [K in BarExerciseData['type']]?: UserExercise | undefined;
};

export type Sets = number;
export type Reps = number;

export type WarmupSet = (
  | { type: 'even'; warmupSets: number }
  | { type: 'percentage' }
) & { includeEmptyBar: boolean };
