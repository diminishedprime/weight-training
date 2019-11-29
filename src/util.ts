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
