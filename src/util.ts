import * as c from "./constants";
import * as t from "./types";

export const emptyBar = (): t.PlateConfig => ({
  [t.PlateTypes.FORTY_FIVE]: 0,
  [t.PlateTypes.TWENTY_FIVE]: 0,
  [t.PlateTypes.TEN]: 0,
  [t.PlateTypes.FIVE]: 0,
  [t.PlateTypes.TWO_AND_A_HALF]: 0,
});

export const platesFor = (weight: number): t.PlateConfig => {
  if (weight < 45) {
    return "not-possible";
  }
  weight -= 45;
  const plates = emptyBar();
  const acc: { plates: t.PlateConfig; remainingWeight: number } = {
    plates,
    remainingWeight: weight,
  };
  const thing = Object.values(t.PlateTypes).reduce(
    ({ plates, remainingWeight }, plateType) => {
      while (remainingWeight >= c.plateWeight[plateType] * 2) {
        (plates as any)[plateType] += 2;
        remainingWeight -= c.plateWeight[plateType] * 2;
      }
      return { plates, remainingWeight };
    },
    acc,
  );
  return thing.plates;
};

export const splitConfig = (plateConfig: t.PlateConfig): t.PlateConfig => {
  const copied: t.PlateConfig = Object.assign({}, plateConfig);
  Object.entries(copied).forEach(([plateType, num]) => {
    (copied as any)[plateType] = num / 2;
  });
  return copied;
};

export const nearestFive = (n: number): number => {
  return 5 * Math.round(n / 5);
};

const progressionFor = (
  oneRepMax: number,
  fraction: number,
  liftsAtWeight: number,
  reps: number,
  type: t.LiftType,
): t.Program => {
  const targetWeight = nearestFive(oneRepMax * fraction);
  const jump = (targetWeight - t.BAR_WEIGHT) / 4;
  const warmup = false;
  const oneJump = nearestFive(45 + jump);
  const twoJump = nearestFive(45 + jump * 2);
  const threeJump = nearestFive(45 + jump * 3);
  return [
    { weight: 45, reps: 5, type, warmup: true },
    { weight: oneJump, reps: 5, type, warmup: true },
    { weight: twoJump, reps: 3, type, warmup: true },
    { weight: threeJump, reps: 2, type, warmup: true },
    ...range(liftsAtWeight).map(() => ({
      weight: targetWeight,
      reps,
      type,
      warmup,
    })),
  ];
};

export const programFor = (
  workout: t.WorkoutType,
  oneRepMax: number,
  liftType: t.LiftType,
): t.Program => {
  switch (workout) {
    case t.WorkoutType.FIVE_BY_FIVE:
      return progressionFor(oneRepMax, 0.8, 5, 5, liftType);
    case t.WorkoutType.THREE_BY_THREE:
      return progressionFor(oneRepMax, 0.9, 3, 3, liftType);
    default:
      return [];
  }
};

export const range = (to: number): undefined[] => {
  const a: undefined[] = [];
  for (let i = 0; i < to; i++) {
    a.push(undefined);
  }
  return a;
};
