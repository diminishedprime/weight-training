import * as t from "../types";

export type V1Db = {
  value: number;
  unit: t.WeightUnit;
  version: "1";
};

export const weightFromFirestore: t.FromFirestore<t.Weight> = (
  o: object
): t.Weight => {
  switch ((o as any).version) {
    case "1":
    case undefined: {
      const dbVal: V1Db = o as any;
      return new t.Weight(dbVal.value, dbVal.unit);
    }
    default: {
      throw new Error(`Cannot parse version: ${(o as any).version}`);
    }
  }
};
