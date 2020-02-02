import * as t from "../types";
import * as Weight from "./WeightFromFirestore";
import * as V1 from "./liftdoc/v1";

export interface V1Db {
  date: t.FirestoreTimestamp;
  weight: Weight.V1Db;
  type: t.LiftType;
  reps: number;
  warmup: boolean | undefined;
  version: "1";
}

export const liftFromFirestore: t.FromFirestore<t.Lift> = (
  o: object
): t.Lift => {
  switch ((o as any).liftDocVersion) {
    case "1": {
      const dbVal: V1.LiftDoc = o as any;
      return t.Lift.fromDb(dbVal);
    }
    case undefined: {
      switch ((o as any).version) {
        case "1":
        case undefined: {
          const dbVal: V1Db = o as any;
          const withLiftDocStuff = Object.assign({}, dbVal, {
            liftDocVersion: "1",
            liftDocType: "barbellLift"
          });
          return liftFromFirestore(withLiftDocStuff);
        }
        default: {
          throw new Error(`Cannot parse version: ${(o as any).version}`);
        }
      }
    }
    default: {
      throw new Error(
        `Cannot parse liftDocVersion: ${(o as any).liftDocVersion}`
      );
    }
  }
};
