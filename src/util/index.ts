import { OneOfEachPlate } from '@/constants';
import {
  BarSet,
  Exercise,
  ExerciseData,
  PlateCount,
  PlateWeight,
  Reps,
  Sets,
  WarmupSet,
  Weight_V1,
} from '@/types';

export const nameForExercise = (
  v: Exercise | undefined | null,
): ExerciseData['type'] | undefined => {
  switch (v) {
    case Exercise.Deadlift:
      return 'deadlift';
    case Exercise.Squat:
      return 'squat';
    case Exercise.FrontSquat:
      return 'front-squat';
    case Exercise.BenchPress:
      return 'bench-press';
    case Exercise.OverheadPress:
      return 'overhead-press';
    case Exercise.Snatch:
      return 'snatch';
    case Exercise.DumbbellRow:
      return 'dumbbell-row';
    case Exercise.DumbbellFly:
      return 'dumbbell-fly';
    case Exercise.DumbbellBicepCurl:
      return 'dumbbell-bicep-curl';
    case Exercise.DumbbellHammerCurl:
      return 'dumbbell-hammer-curl';
    case Exercise.RomainianDeadlift:
      return 'romanian-deadlift';
    case Exercise.BarbbellRow:
      return 'barbbell-row';
    case Exercise.InclineBenchPress:
      return 'incline-bench-press';
    case Exercise.DumbbellPreacherCurl:
      return 'dumbbell-preacher-curl';
    case Exercise.LateralRaise:
      return 'lateral-raise';
    case Exercise.DumbbellSkullCrusher:
      return 'dumbbell-skull-crusher';
    case Exercise.AbdominalMachine:
      return 'abdominal-machine';
    case Exercise.AdductionInnerThighMachine:
      return 'adduction-inner-thigh-machine';
    case Exercise.LegCurlMachine:
      return 'leg-curl-machine'
    case undefined:
    case null:
      return undefined;
    default: {
      const exhaustiveCheck: never = v;
      throw new Error(`Unhandled case: ${exhaustiveCheck}`);
    }
  }
};

export const fromDBExercise = (v: ExerciseData['type']): Exercise => {
  switch (v) {
    case 'deadlift':
      return Exercise.Deadlift;
    case 'squat':
      return Exercise.Squat;
    case 'front-squat':
      return Exercise.FrontSquat;
    case 'bench-press':
      return Exercise.BenchPress;
    case 'overhead-press':
      return Exercise.OverheadPress;
    case 'snatch':
      return Exercise.Snatch;
    case 'dumbbell-row':
      return Exercise.DumbbellRow;
    case 'dumbbell-fly':
      return Exercise.DumbbellFly;
    case 'dumbbell-bicep-curl':
      return Exercise.DumbbellBicepCurl;
    case 'dumbbell-hammer-curl':
      return Exercise.DumbbellHammerCurl;
    case 'romanian-deadlift':
      return Exercise.RomainianDeadlift;
    case 'barbbell-row':
      return Exercise.BarbbellRow;
    case 'incline-bench-press':
      return Exercise.InclineBenchPress;
    case 'dumbbell-preacher-curl':
      return Exercise.DumbbellPreacherCurl;
    case 'lateral-raise':
      return Exercise.LateralRaise;
    case 'dumbbell-skull-crusher':
      return Exercise.DumbbellSkullCrusher;
    case 'abdominal-machine':
      return Exercise.AbdominalMachine;
    case 'adduction-inner-thigh-machine':
      return Exercise.AdductionInnerThighMachine;
    case 'leg-curl-machine':
      return Exercise.LegCurlMachine;
    default: {
      const exhaustiveCheck: never = v;
      throw new Error(`Unhandled case: ${exhaustiveCheck}`);
    }
  }
};

export const barExerciseWeight = (plateCounts: PlateCount[]): Weight_V1 => {
  const num = plateCounts.reduce((acc, p) => acc + p[0].value * p[1] * 2, 45);
  return { value: num, unit: 'lb', version: 1 };
};

export const nearest5 = (n: number): number => {
  const remainder = n % 5;
  const nearest =
    remainder >= 2.5 ? Math.floor(n / 5) * 5 + 5 : Math.floor(n / 5) * 5;
  return nearest;
};

export const keyForSetsByReps = (sets: Sets, reps: Reps) =>
  `${sets}SetsBy${reps}Reps`;

const repsForSetNumber = (i: number): number => {
  switch (i) {
    case 1:
      return 5;
    case 2:
      return 3;
    case 3:
      return 2;
    case 4:
      return 2;
    default:
      return 2;
  }
};

export const calcSetsByReps = (
  targetWeight: Weight_V1,
  warmupSet: WarmupSet,
  sets: Sets,
  reps: Reps,
): BarSet[] => {
  const barSets: BarSet[] = [];
  if (warmupSet.includeEmptyBar) {
    if (warmupSet.type !== 'even' || warmupSet.warmupSets !== 0) {
      barSets.push({
        warmup: true,
        weight: { value: 45, unit: 'lb', version: 1 },
        reps: 5,
        status: 'not-started',
        version: 1,
      });
    }
  }
  if (warmupSet.type === 'even' && warmupSet.warmupSets !== 0) {
    const jumpAmount = (targetWeight.value - 45) / (warmupSet.warmupSets + 1);
    for (let i = 1; i < warmupSet.warmupSets + 1; i++) {
      barSets.push({
        warmup: true,
        weight: {
          value: nearest5(jumpAmount * i + 45),
          unit: 'lb',
          version: 1,
        },
        reps: repsForSetNumber(i),
        status: 'not-started',
        version: 1,
      });
    }
  }
  if (warmupSet.type === 'percentage') {
    const percentages = [0.45, 0.65, 0.85];
    percentages.forEach((percentage, i) =>
      barSets.push({
        warmup: true,
        weight: {
          value: nearest5(percentage * targetWeight.value),
          unit: 'lb',
          version: 1,
        },
        reps: repsForSetNumber(i + 1),
        status: 'not-started',
        version: 1,
      }),
    );
  }
  for (let setNumber = 0; setNumber < sets; setNumber++) {
    barSets.push({
      warmup: false,
      weight: {
        value: nearest5(targetWeight.value),
        unit: 'lb',
        version: 1,
      },
      reps,
      status: 'not-started',
      version: 1,
    });
  }
  return barSets;
};

export const platesForWeight = (weight: number): PlateWeight[] => {
  let remainingWeight = weight;
  // Note it's important that OneOfEachPlate is sorted largest to
  // smallest for this to work properly.
  const plates = OneOfEachPlate.reduce((acc, plate) => {
    const additionalPlates: PlateWeight[] = [];
    while (remainingWeight >= plate.value) {
      remainingWeight -= plate.value;
      additionalPlates.push(plate);
    }
    return acc.concat(additionalPlates);
  }, [] as PlateWeight[]);

  if (remainingWeight !== 0) {
    console.warn(
      'You called plates for weight with a weight that cannot be perfectly reperesnted by the available plates.',
      { weight, remainingWeight },
    );
  }

  return plates;
};
