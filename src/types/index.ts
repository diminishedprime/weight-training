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

export type ExerciseData = Deadlift_V1;
