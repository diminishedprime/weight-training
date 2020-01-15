import * as t from "../types";

export const weightFromFirestore: t.FromFirestore<t.Weight> = (
  o: object
): t.Weight => {
  switch ((o as any).version) {
    case "1":
    case undefined: {
      const dbVal: { value: number; unit: t.WeightUnit } = o as any;
      return new t.Weight(dbVal.value, dbVal.unit);
    }
    default: {
      throw new Error(`Cannot parse version: ${(o as any).version}`);
    }
  }
};
