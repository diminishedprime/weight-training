import { Timestamp } from 'firebase/firestore';

export enum Exercise {
  Deadlift = 'a',
  Squat = 'b',
  FrontSquat = 'c',
  BenchPress = 'd',
  OverheadPress = 'e',
  Snatch = 'f',
  CleanAndJerk = 'g',
}

interface Weight_V1 {
  unit: 'lb' | 'kg';
  value: number;
  version: 1;
}

interface Deadlift_V1 {
  date: Timestamp;
  reps: number;
  type: 'deadlift';
  version: 1;
  warmup?: boolean;
  weight: Weight_V1;
}

interface Snatch_V1 {
  date: Timestamp;
  reps: number;
  type: 'snatch';
  version: 1;
  warmup?: boolean;
  weight: Weight_V1;
}

export type ExerciseData = Deadlift_V1 | Snatch_V1;

export type AddExerciseData = Omit<ExerciseData, 'date'>;

type _45 = { unit: 'lb'; value: 45; version: 1 };
type _25 = { unit: 'lb'; value: 25; version: 1 };
type _10 = { unit: 'lb'; value: 10; version: 1 };
type _5 = { unit: 'lb'; value: 5; version: 1 };
type _2_5 = { unit: 'lb'; value: 2.5; version: 1 };

export type PlateWeight = _45 | _25 | _10 | _5 | _2_5;
