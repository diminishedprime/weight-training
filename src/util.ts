import * as c from "./constants";
import * as t from "./types";

export const isOlympic = (liftType: t.LiftType) => {
  return (
    liftType === t.LiftType.CLEAN_AND_JERK || liftType === t.LiftType.SNATCH
  );
};

export const liftsForSettings = (settings: t.Settings): t.LiftType[] => {
  const showOlympic = settings.showOlympic;
  return Object.values(t.LiftType).filter((liftType) => {
    if (!showOlympic) {
      return (
        liftType !== t.LiftType.CLEAN_AND_JERK && liftType !== t.LiftType.SNATCH
      );
    } else {
      return true;
    }
  });
};

export const emptyBar = (): t.PlateConfig => ({
  [t.PlateTypes.FORTY_FIVE]: 0,
  [t.PlateTypes.TWENTY_FIVE]: 0,
  [t.PlateTypes.TEN]: 0,
  [t.PlateTypes.FIVE]: 0,
  [t.PlateTypes.TWO_AND_A_HALF]: 0
});

export const platesFor = (weight: t.Weight): t.PlateConfig => {
  const barWeight = t.Weight.bar();
  if (weight.value < barWeight.value) {
    return "not-possible";
  }
  const plates = emptyBar();
  const acc: { plates: t.PlateConfig; remainingWeight: t.Weight } = {
    plates,
    remainingWeight: weight.subtract(t.Weight.bar())
  };
  const thing = Object.values(t.PlateTypes).reduce(
    ({ plates, remainingWeight }, plateType) => {
      while (
        remainingWeight.greaterThanEq(c.plateWeight[plateType].multiply(2))
      ) {
        (plates as any)[plateType] += 2;
        remainingWeight = remainingWeight.subtract(
          c.plateWeight[plateType].multiply(2)
        );
      }
      return { plates, remainingWeight };
    },
    acc
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

const progressionFor = (
  oneRepMax: t.Weight,
  fraction: number,
  liftsAtWeight: number,
  reps: number,
  type: t.LiftType
): t.Program => {
  const bar = t.Weight.bar();
  const targetWeight = oneRepMax.multiply(fraction).nearestFive();
  const jump = targetWeight.subtract(bar).divide(4);
  const warmup = false;
  const oneJump = bar.add(jump).nearestFive();
  const twoJump = bar.add(jump.multiply(2)).nearestFive();
  const threeJump = bar.add(jump.multiply(3)).nearestFive();
  return [
    { weight: bar, reps: 5, type, warmup: true },
    { weight: oneJump, reps: 5, type, warmup: true },
    { weight: twoJump, reps: 3, type, warmup: true },
    { weight: threeJump, reps: 2, type, warmup: true },
    ...range(liftsAtWeight).map(() => ({
      weight: targetWeight,
      reps,
      type,
      warmup
    }))
  ];
};

export const programFor = (
  workout: t.WorkoutType,
  oneRepMax: t.Weight,
  liftType: t.LiftType
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
