// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY
import { Timestamp } from 'firebase/firestore';

export enum Exercise {
  Deadlift = 'a',
  Squat = 'b',
  FrontSquat = 'c',
  BenchPress = 'd',
  OverheadPress = 'e',
  Snatch = 'f',
  DumbbellRow = 'g',
  DumbbellFly = 'h',
  DumbbellBicepCurl = 'i',
  DumbbellHammerCurl = 'j',
}
// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY
export type DumbbellExercise =
  | Exercise.DumbbellRow
  | Exercise.DumbbellFly
  | Exercise.DumbbellBicepCurl
  | Exercise.DumbbellHammerCurl;

export type BarExercise =
  | Exercise.Deadlift
  | Exercise.Squat
  | Exercise.FrontSquat
  | Exercise.BenchPress
  | Exercise.OverheadPress
  | Exercise.Snatch;
// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY
export interface Weight_V1 {
  unit: 'lb' | 'kg';
  value: number;
  version: 1;
}

export interface ExerciseMetadata_V1 {
  targetAreas: Array<
    | 'chest'
    | 'back'
    | 'shoulders'
    | 'pectoralis'
    | 'glutes'
    | 'arms'
    | 'thighs'
    | 'calves'
    | 'quadriceps'
    | 'tensor fascia latae'
    | 'hip abductors'
    | 'trapezies'
    | 'abs'
    | 'abdominuls'
    | 'rectus abdominus'
    | 'internal obliques'
    | 'external obliques'
    | 'legs'
    | 'hamstrings'
    | 'biceps'
    | 'triceps'
    | 'deltoids'
    | 'yes'
  >;
  equipment: Array<
    'barbbell' | 'dumbbell' | 'bodyweight' | 'kettlebell' | 'resistance band'
  >;
  version: 1;
}

export interface Deadlift_V3 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'deadlift';
  reps: number;
  warmup: boolean;
  version: 3;
}

export interface Squat_V3 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'squat';
  reps: number;
  warmup: boolean;
  version: 3;
}

export interface FrontSquat_V3 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'front-squat';
  reps: number;
  warmup: boolean;
  version: 3;
}

export interface BenchPress_V3 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'bench-press';
  reps: number;
  warmup: boolean;
  version: 3;
}

export interface OverheadPress_V3 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'overhead-press';
  reps: number;
  warmup: boolean;
  version: 3;
}

export interface Snatch_V1 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'snatch';
  reps: number;
  warmup: boolean;
  version: 1;
}

export interface DumbbellRow_V1 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'dumbbell-row';
  reps: number;
  version: 1;
}

export interface DumbbellFly_V1 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'dumbbell-fly';
  reps: number;
  version: 1;
}

export interface DumbbellBicepCurl_V1 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'dumbbell-bicep-curl';
  reps: number;
  version: 1;
}

export interface DumbbellHammerCurl_V1 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'dumbbell-hammer-curl';
  reps: number;
  version: 1;
}
// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY
export type ExerciseData =
  | Deadlift_V3
  | Squat_V3
  | FrontSquat_V3
  | BenchPress_V3
  | OverheadPress_V3
  | Snatch_V1
  | DumbbellRow_V1
  | DumbbellFly_V1
  | DumbbellBicepCurl_V1
  | DumbbellHammerCurl_V1;

export type BarExerciseData =
  | Deadlift_V3
  | Squat_V3
  | FrontSquat_V3
  | BenchPress_V3
  | OverheadPress_V3
  | Snatch_V1;

export type DumbbellExerciseData =
  | DumbbellRow_V1
  | DumbbellFly_V1
  | DumbbellBicepCurl_V1
  | DumbbellHammerCurl_V1;
// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY
export const narrowDumbbellExercise = (
  toNarrow: Exercise,
): toNarrow is DumbbellExercise =>
  toNarrow === Exercise.DumbbellRow ||
  toNarrow === Exercise.DumbbellFly ||
  toNarrow === Exercise.DumbbellBicepCurl ||
  toNarrow === Exercise.DumbbellHammerCurl;

export const narrowBarExercise = (
  toNarrow: Exercise,
): toNarrow is BarExercise =>
  toNarrow === Exercise.Deadlift ||
  toNarrow === Exercise.Squat ||
  toNarrow === Exercise.FrontSquat ||
  toNarrow === Exercise.BenchPress ||
  toNarrow === Exercise.OverheadPress ||
  toNarrow === Exercise.Snatch;
// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY

export const exerciseUIString = (e: Exercise) => {
  switch (e) {
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
    case Exercise.DumbbellRow:
      return 'Bent-Over Row';
    case Exercise.DumbbellFly:
      return 'Fly';
    case Exercise.DumbbellBicepCurl:
      return 'Bicep Curl';
    case Exercise.DumbbellHammerCurl:
      return 'Hammer Curl';
    default: {
      const exhaustiveCheck: never = e;
      console.log({ exhaustiveCheck });
      throw new Error('Unhandled case');
    }
  }
};
// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY
export const metadataForExercise = (e: Exercise): ExerciseMetadata_V1 => {
  switch (e) {
    case Exercise.Deadlift: {
      return {
        version: 1,
        targetAreas: ['back', 'hamstrings', 'trapezies'],
        equipment: ['barbbell'],
      };
    }
    case Exercise.Squat: {
      return {
        version: 1,
        targetAreas: [
          'abdominuls',
          'quadriceps',
          'glutes',
          'hamstrings',
          'back',
        ],
        equipment: ['barbbell'],
      };
    }
    case Exercise.FrontSquat: {
      return {
        version: 1,
        targetAreas: ['quadriceps', 'back'],
        equipment: ['barbbell'],
      };
    }
    case Exercise.BenchPress: {
      return {
        version: 1,
        targetAreas: ['pectoralis', 'deltoids'],
        equipment: ['barbbell'],
      };
    }
    case Exercise.OverheadPress: {
      return {
        version: 1,
        targetAreas: ['shoulders', 'triceps', 'deltoids'],
        equipment: ['barbbell'],
      };
    }
    case Exercise.Snatch: {
      return {
        version: 1,
        targetAreas: ['yes'],
        equipment: ['barbbell'],
      };
    }
    case Exercise.DumbbellRow: {
      return {
        version: 1,
        targetAreas: ['back', 'deltoids'],
        equipment: ['dumbbell'],
      };
    }
    case Exercise.DumbbellFly: {
      return {
        version: 1,
        targetAreas: ['pectoralis', 'deltoids'],
        equipment: ['dumbbell'],
      };
    }
    case Exercise.DumbbellBicepCurl: {
      return {
        version: 1,
        targetAreas: ['biceps'],
        equipment: ['dumbbell'],
      };
    }
    case Exercise.DumbbellHammerCurl: {
      return {
        version: 1,
        targetAreas: ['biceps'],
        equipment: ['dumbbell'],
      };
    }
    default: {
      const exhaustiveCheck: never = e;
      console.log({ exhaustiveCheck });
      throw new Error('Unhandled case');
    }
  }
};
