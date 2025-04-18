// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY
import { Timestamp } from 'firebase/firestore';

export enum Exercise {
  Deadlift = 'a',
  Squat = 'b',
  FrontSquat = 'c',
  BenchPress = 'd',
  OverheadPress = 'e',
  Snatch = 'f',
  RomainianDeadlift = 'k',
  BarbbellRow = 'l',
  InclineBenchPress = 'n',
  DumbbellRow = 'g',
  DumbbellFly = 'h',
  DumbbellBicepCurl = 'i',
  DumbbellHammerCurl = 'j',
  DumbbellPreacherCurl = 'm',
  LateralRaise = 'o',
  DumbbellSkullCrusher = 'p',
  AbdominalMachine = 'q',
  LegCurlMachine = 'r',
  AdductionInnerThighMachine = 's',
}
// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY
export type DumbbellExercise =
  | Exercise.DumbbellRow
  | Exercise.DumbbellFly
  | Exercise.DumbbellBicepCurl
  | Exercise.DumbbellHammerCurl
  | Exercise.DumbbellPreacherCurl
  | Exercise.LateralRaise
  | Exercise.DumbbellSkullCrusher;

export type BarExercise =
  | Exercise.Deadlift
  | Exercise.Squat
  | Exercise.FrontSquat
  | Exercise.BenchPress
  | Exercise.OverheadPress
  | Exercise.Snatch
  | Exercise.RomainianDeadlift
  | Exercise.BarbbellRow
  | Exercise.InclineBenchPress;

export type MachineExercise =
  | Exercise.AbdominalMachine
  | Exercise.LegCurlMachine
  | Exercise.AdductionInnerThighMachine;
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
    | 'hip flexors'
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
    | 'barbbell'
    | 'dumbbell'
    | 'bodyweight'
    | 'kettlebell'
    | 'resistance band'
    | 'machine'
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

export interface RomainianDeadlift_V1 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'romanian-deadlift';
  reps: number;
  warmup: boolean;
  version: 1;
}

export interface BarbbellRow_V1 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'barbbell-row';
  reps: number;
  warmup: boolean;
  version: 1;
}

export interface InclineBenchPress_V1 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'incline-bench-press';
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

export interface DumbbellPreacherCurl_V1 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'dumbbell-preacher-curl';
  reps: number;
  version: 1;
}

export interface LateralRaise_V1 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'lateral-raise';
  reps: number;
  version: 1;
}

export interface DumbbellSkullCrusher_V1 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'dumbbell-skull-crusher';
  reps: number;
  version: 1;
}

export interface AbdominalMachine_V1 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'abdominal-machine';
  reps: number;
  version: 1;
}

export interface LegCurlMachine_V1 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'leg-curl-machine';
  reps: number;
  version: 1;
}

export interface AdductionInnerThighMachine_V1 {
  date: Timestamp;
  weight: Weight_V1;
  type: 'adduction-inner-thigh-machine';
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
  | RomainianDeadlift_V1
  | BarbbellRow_V1
  | InclineBenchPress_V1
  | DumbbellRow_V1
  | DumbbellFly_V1
  | DumbbellBicepCurl_V1
  | DumbbellHammerCurl_V1
  | DumbbellPreacherCurl_V1
  | LateralRaise_V1
  | DumbbellSkullCrusher_V1
  | AbdominalMachine_V1
  | LegCurlMachine_V1
  | AdductionInnerThighMachine_V1;

export type BarExerciseData =
  | Deadlift_V3
  | Squat_V3
  | FrontSquat_V3
  | BenchPress_V3
  | OverheadPress_V3
  | Snatch_V1
  | RomainianDeadlift_V1
  | BarbbellRow_V1
  | InclineBenchPress_V1;

export type DumbbellExerciseData =
  | DumbbellRow_V1
  | DumbbellFly_V1
  | DumbbellBicepCurl_V1
  | DumbbellHammerCurl_V1
  | DumbbellPreacherCurl_V1
  | LateralRaise_V1
  | DumbbellSkullCrusher_V1;

export type MachineExerciseData =
  | AbdominalMachine_V1
  | LegCurlMachine_V1
  | AdductionInnerThighMachine_V1;
// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY
export const narrowDumbbellExercise = (
  toNarrow: Exercise,
): toNarrow is DumbbellExercise =>
  toNarrow === Exercise.DumbbellRow ||
  toNarrow === Exercise.DumbbellFly ||
  toNarrow === Exercise.DumbbellBicepCurl ||
  toNarrow === Exercise.DumbbellHammerCurl ||
  toNarrow === Exercise.DumbbellPreacherCurl ||
  toNarrow === Exercise.LateralRaise ||
  toNarrow === Exercise.DumbbellSkullCrusher;

export const narrowBarExercise = (
  toNarrow: Exercise,
): toNarrow is BarExercise =>
  toNarrow === Exercise.Deadlift ||
  toNarrow === Exercise.Squat ||
  toNarrow === Exercise.FrontSquat ||
  toNarrow === Exercise.BenchPress ||
  toNarrow === Exercise.OverheadPress ||
  toNarrow === Exercise.Snatch ||
  toNarrow === Exercise.RomainianDeadlift ||
  toNarrow === Exercise.BarbbellRow ||
  toNarrow === Exercise.InclineBenchPress;

export const narrowMachineExercise = (
  toNarrow: Exercise,
): toNarrow is MachineExercise =>
  toNarrow === Exercise.AbdominalMachine ||
  toNarrow === Exercise.LegCurlMachine ||
  toNarrow === Exercise.AdductionInnerThighMachine;
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
    case Exercise.RomainianDeadlift:
      return 'Romainian Deadlift';
    case Exercise.BarbbellRow:
      return 'Barbbell Row';
    case Exercise.InclineBenchPress:
      return 'Incline Bench Press';
    case Exercise.DumbbellRow:
      return 'Dumbbell Row';
    case Exercise.DumbbellFly:
      return 'Fly';
    case Exercise.DumbbellBicepCurl:
      return 'Bicep Curl';
    case Exercise.DumbbellHammerCurl:
      return 'Hammer Curl';
    case Exercise.DumbbellPreacherCurl:
      return 'Dumbbell Preacher Curl';
    case Exercise.LateralRaise:
      return 'Lateral Raise';
    case Exercise.DumbbellSkullCrusher:
      return 'Dumbbell Skull Crusher';
    case Exercise.AbdominalMachine:
      return 'Abdominal Machine';
    case Exercise.LegCurlMachine:
      return 'Leg Curl Machine';
    case Exercise.AdductionInnerThighMachine:
      return 'Adduction Inner Thigh Machine';
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
    case Exercise.RomainianDeadlift: {
      return {
        version: 1,
        targetAreas: [],
        equipment: ['barbbell'],
      };
    }
    case Exercise.BarbbellRow: {
      return {
        version: 1,
        targetAreas: ['back', 'deltoids'],
        equipment: ['barbbell'],
      };
    }
    case Exercise.InclineBenchPress: {
      return {
        version: 1,
        targetAreas: [],
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
    case Exercise.DumbbellPreacherCurl: {
      return {
        version: 1,
        targetAreas: [],
        equipment: ['dumbbell'],
      };
    }
    case Exercise.LateralRaise: {
      return {
        version: 1,
        targetAreas: [],
        equipment: ['dumbbell'],
      };
    }
    case Exercise.DumbbellSkullCrusher: {
      return {
        version: 1,
        targetAreas: ['triceps'],
        equipment: ['dumbbell'],
      };
    }
    case Exercise.AbdominalMachine: {
      return {
        version: 1,
        targetAreas: ['abdominuls'],
        equipment: ['machine'],
      };
    }
    case Exercise.LegCurlMachine: {
      return {
        version: 1,
        targetAreas: ['hamstrings'],
        equipment: ['machine'],
      };
    }
    case Exercise.AdductionInnerThighMachine: {
      return {
        version: 1,
        targetAreas: ['hip flexors', 'glutes'],
        equipment: ['machine'],
      };
    }
    default: {
      const exhaustiveCheck: never = e;
      console.log({ exhaustiveCheck });
      throw new Error('Unhandled case');
    }
  }
};
