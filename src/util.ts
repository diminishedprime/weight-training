import firebase from "firebase/app";
import * as c from "./constants";
import * as t from "./types";

// TODO - migrate the time utils into the Timestamp class as static methods.

export const now = (): t.FirestoreTimestamp => {
  return firebase.firestore.Timestamp.now();
};

export const timestamp = (
  seconds: number,
  nanoseconds: number
): t.FirestoreTimestamp => {
  return new firebase.firestore.Timestamp(seconds, nanoseconds);
};

// Returns half the plates needed to make weight.
// TODO - this code is getting pretty hairy. It needs some tests. Especially for
// the cases where consolidate is on or off and the baseConfig is more or less
// than the target weight.
export const platesFor = (
  weight: t.Weight,
  baseConfig: t.PlateConfig = [],
  consolidate: boolean
): t.PlateConfig => {
  const barWeight = t.Weight.bar(weight.getUnit());
  if (weight.lessThan(barWeight) || baseConfig === "not-possible") {
    return "not-possible";
  }
  const baseConfigWeight = baseConfig
    .map((a) => a.weight.multiply(2))
    .reduce((a, b) => a.add(b), t.Weight.zero().toUnit(weight.getUnit()));

  const baseConfigWithBar = baseConfigWeight.add(barWeight);

  const weightToSubtract =
    consolidate || baseConfigWithBar.greaterThan(weight)
      ? barWeight
      : barWeight.add(baseConfigWeight);
  const remainingWeight = weight.subtract(weightToSubtract);
  const plates: t.Plate[] =
    consolidate || baseConfigWithBar.greaterThan(weight) ? [] : baseConfig;
  const acc = {
    plates,
    remainingWeight
  };
  const thing = platesForUnit(weight.getUnit()).reduce(
    ({ plates, remainingWeight }, currentPlate) => {
      while (remainingWeight.greaterThanEq(currentPlate.weight.multiply(2))) {
        plates.push(currentPlate);
        remainingWeight = remainingWeight.subtract(
          currentPlate.weight.multiply(2)
        );
      }
      return { plates, remainingWeight };
    },
    acc
  );
  return thing.plates;
};

export const range = (to: number): undefined[] => {
  const a: undefined[] = [];
  for (let i = 0; i < to; i++) {
    a.push(undefined);
  }
  return a;
};

export const platesForUnit = (unit: t.WeightUnit): t.Plate[] => {
  const plates = Object.values(c.plates).filter(
    (plate) => plate.weight.getUnit() === unit
  );
  return plates.sort((a, b) =>
    a.weight.lessThanEq(b.weight) ? 1 : a.weight.equals(b.weight) ? 0 : -1
  );
};
