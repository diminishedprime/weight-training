import * as t from "../types";

export const liftFromFirestore: t.FromFirestore<t.Lift> = (
  o: object
): t.Lift => {
  switch ((o as any).version) {
    case "1":
    case undefined: {
      const dbVal: {
        date: t.Timestamp;
        weight: t.Weight;
        type: t.LiftType;
        reps: number;
        warmup: boolean | undefined;
      } = o as any;
      return new t.Lift(dbVal);
    }
    default: {
      throw new Error(`Cannot parse version: ${(o as any).version}`);
    }
  }
};
