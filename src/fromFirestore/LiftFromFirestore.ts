import * as t from "../types";
import * as Weight from "./WeightFromFirestore";

export type V1Db = {
  date: t.FirestoreTimestamp;
  weight: Weight.V1Db;
  type: t.LiftType;
  reps: number;
  warmup: boolean | undefined;
  version: "1";
};

export const liftFromFirestore: t.FromFirestore<t.Lift> = (
  o: object
): t.Lift => {
  switch ((o as any).version) {
    case "1":
    case undefined: {
      const dbVal: V1Db = o as any;
      return new t.Lift(dbVal);
    }
    default: {
      throw new Error(`Cannot parse version: ${(o as any).version}`);
    }
  }
};
