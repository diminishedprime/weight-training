import * as t from "../../../types";
import { WeightField as V1 } from "./v1";

export * from "./v1";

export const toWeight: t.FromFirestore<t.Weight> = (o: object): t.Weight => {
  switch ((o as any).version) {
    case "1":
    case undefined: {
      const dbVal: V1 = o as any;
      return new t.Weight(dbVal.value, dbVal.unit);
    }
    default: {
      throw new Error(`Cannot parse version: ${(o as any).version}`);
    }
  }
};
