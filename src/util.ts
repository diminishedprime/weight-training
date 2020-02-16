import * as c from "./constants";
import * as t from "./types";

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

export const range = (to: number): undefined[] => {
  const a: undefined[] = [];
  for (let i = 0; i < to; i++) {
    a.push(undefined);
  }
  return a;
};
