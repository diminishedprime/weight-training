import * as t from "../types";

export const userDocFromFirestore: t.FromFirestore<t.UserDoc> = (
  o: object
): t.UserDoc => {
  switch ((o as any).version) {
    case "1":
    case undefined: {
      const userDoc: {
        [lift in t.LiftType]: {
          [t.ONE_REP_MAX]: { value: number; unit: t.WeightUnit };
        };
      } = o as any;
      return new t.UserDoc(userDoc);
    }
    default: {
      throw new Error(`Cannot parse version: ${(o as any).version}`);
    }
  }
};
