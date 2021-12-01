import { Timestamp } from 'firebase/firestore';
import { Exercise, ExerciseData, Weight_V1 } from '@/types/generated-types';

export * from './generated-types';

export interface BarSet {
  reps: number;
  weight: Weight_V1;
  warmup: boolean;
  version: 1;
  time?: Timestamp;
  status: 'finished' | 'skipped' | 'not-started';
}

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

export type UserDoc_V3 = {
  [K in ExerciseData['type']]?: UserExercise | undefined;
} & { version: '3' };

interface HomePageData_V1 {
  pinnedExercises: { type: 'set'; exercises: Exercise[] } | { type: 'unset' };
}

export type UserDoc_V4 = {
  [K in ExerciseData['type']]?: UserExercise | undefined;
} & { version: 4 } & HomePageData_V1;

export type DBUserDoc = UserDoc_V3 | UserDoc_V4;

export type Sets = number;
export type Reps = number;

export type WarmupSet = (
  | { type: 'even'; warmupSets: number }
  | { type: 'percentage' }
) & { includeEmptyBar: boolean };
