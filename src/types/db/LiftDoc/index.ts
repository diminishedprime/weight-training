import * as t from "../../../types";
import { LiftDoc as V1 } from "./v1";
import { LiftDoc as V2 } from "./v2";

export * from "./v2";

export const toLift: t.FromFirestore<t.Lift> = (o: object): t.Lift => {
  switch ((o as any).liftDocVersion) {
    case "1": {
      const dbVal: V2 = o as any;
      return t.Lift.fromDb(dbVal);
    }
    case undefined: {
      switch ((o as any).version) {
        case "1":
        case undefined: {
          const dbVal: V1 = o as any;
          const withLiftDocStuff = Object.assign({}, dbVal, {
            liftDocVersion: "1",
            liftDocType: t.LiftDocType.BARBELL
          });
          return toLift(withLiftDocStuff);
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
