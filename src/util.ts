import * as t from "./types";

export const emptyBar = (): t.PlateConfig => ({
  [t.PlateTypes.FORTY_FIVE]: 0,
  [t.PlateTypes.TWENTY_FIVE]: 0,
  [t.PlateTypes.TEN]: 0,
  [t.PlateTypes.FIVE]: 0,
  [t.PlateTypes.TWO_AND_A_HALF]: 0
});

export const platesFor = (weight: number): t.PlateConfig => {
  if (weight < 45) {
    return "not-possible";
  }
  weight -= 45;
  const plates = emptyBar();
  const acc: { plates: t.PlateConfig; remainingWeight: number } = {
    plates,
    remainingWeight: weight
  };
  const thing = Object.values(t.PlateTypes).reduce(
    ({ plates, remainingWeight }, plateType) => {
      while (remainingWeight >= t.PlateWeight[plateType] * 2) {
        (plates as any)[plateType] += 2;
        remainingWeight -= t.PlateWeight[plateType] * 2;
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

export const roundToNearestFive = (n: number): number => {
  return 5 * Math.round(n / 5);
};

export const programFor = (
  workout: t.WorkoutType,
  oneRepMax: number
): t.Program => {
  if (workout === t.WorkoutType.FIVE_BY_FIVE) {
    const targetWeight = roundToNearestFive(oneRepMax * 0.8);
    const splits = (targetWeight - t.BAR_WEIGHT) / 4;
    return [
      { weight: 45, reps: 5, type: t.LiftType.DEADLIFT },
      {
        weight: roundToNearestFive(45 + splits),
        reps: 5,
        type: t.LiftType.DEADLIFT
      },
      {
        weight: roundToNearestFive(45 + splits * 2),
        reps: 3,
        type: t.LiftType.DEADLIFT
      },
      {
        weight: roundToNearestFive(45 + splits * 3),
        reps: 2,
        type: t.LiftType.DEADLIFT
      },
      { weight: targetWeight, reps: 5, type: t.LiftType.DEADLIFT },
      { weight: targetWeight, reps: 5, type: t.LiftType.DEADLIFT },
      { weight: targetWeight, reps: 5, type: t.LiftType.DEADLIFT },
      { weight: targetWeight, reps: 5, type: t.LiftType.DEADLIFT },
      { weight: targetWeight, reps: 5, type: t.LiftType.DEADLIFT }
    ];
  }
  return [];
};
