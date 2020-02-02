import * as t from "../types";
import { LiftDoc as LiftDocV1 } from "../types/db/LiftDoc/v1";
import { LiftDoc as LiftDocV2 } from "../types/db/LiftDoc/v2";
import * as Weight from "./WeightFromFirestore";

export const liftFromFirestore: t.FromFirestore<t.Lift> = (
  o: object
): t.Lift => {
  switch ((o as any).liftDocVersion) {
    case "1": {
      const dbVal: LiftDocV2 = o as any;
      return t.Lift.fromDb(dbVal);
    }
    case undefined: {
      switch ((o as any).version) {
        case "1":
        case undefined: {
          const dbVal: LiftDocV1 = o as any;
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
