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
export const platesFor = (weight: t.Weight): t.PlateConfig => {
  const barWeight = t.Weight.bar(weight.getUnit());
  if (weight.lessThan(barWeight)) {
    return "not-possible";
  }
  const plates: t.Plate[] = [];
  const acc = {
    plates,
    remainingWeight: weight.subtract(barWeight)
  };
  const thing = platesForUnit(weight.getUnit()).reduce(
    ({ plates, remainingWeight }, currentPlate) => {
      while (remainingWeight.greaterThanEq(currentPlate.weight.multiply(2))) {
        // plates.push()(plates as any)[plateType] += 2;
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
