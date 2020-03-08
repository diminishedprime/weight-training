import { ZERO_TIME } from "../../../constants";
import store from "../../../store";
import * as t from "../../../types";
import { LiftType } from "../LiftType";
import { LiftType as LiftTypeV1 } from "../LiftType/v1";
import { withBrand } from "../marker";
import { RecordField as RecordFieldV1 } from "../RecordField/v1";
import { RecordField as RecordFieldV2 } from "../RecordField/v2";
import { UserDoc as V1Db } from "../UserDoc/v1";
import { UserDoc as V2Db } from "../UserDoc/v2";
import { UserDoc as V3Db } from "../UserDoc/v3";

export * from "./v3";

export const toUserDoc: t.FromFirestore<t.UserDoc> = (o: object): t.UserDoc => {
  switch ((o as any).version) {
    case "3": {
      const userDoc: V3Db = o as any;
      const newUserDoc = new t.UserDoc(userDoc);
      return newUserDoc;
    }
    case "2": {
      const userDoc: V2Db = o as any;
      const defaultRecord: RecordFieldV2 = {
        [t.ONE_REP_MAX]: {
          weight: withBrand({
            value: 0,
            unit: t.WeightUnit.POUND,
            version: "1"
          }),
          time: withBrand(ZERO_TIME())
        }
      };
      const v3: V3Db = withBrand({
        ...userDoc,
        version: "3",
        [LiftType.Snatch]: defaultRecord,
        [LiftType.CleanAndJerk]: defaultRecord
      });
      return toUserDoc(v3);
    }
    case "1":
    case undefined: {
      store.getState().analytics?.logEvent("old_db_version", {
        version: "1",
        type: "UserDoc"
      });
      const userDoc: V1Db = o as any;
      const defaultRecord: RecordFieldV2 = {
        [t.ONE_REP_MAX]: {
          weight: withBrand({
            value: 0,
            unit: t.WeightUnit.POUND,
            version: "1"
          }),
          time: withBrand(ZERO_TIME())
        }
      };
      const newDoc: V2Db = {
        "deadlift": defaultRecord,
        "squat": defaultRecord,
        "front-squat": defaultRecord,
        "bench-press": defaultRecord,
        "overhead-press": defaultRecord,
        "version": "2"
      };
      Object.values(LiftTypeV1).forEach((liftType) => {
        const liftMeta: RecordFieldV1 | undefined = (userDoc as any)[liftType];
        const weight =
          liftMeta?.[t.ONE_REP_MAX] ||
          withBrand({
            value: 0,
            unit: t.WeightUnit.POUND,
            version: "1"
          });
        newDoc[liftType] = {
          [t.ONE_REP_MAX]: {
            weight,
            time: withBrand(ZERO_TIME())
          }
        };
      });
      return toUserDoc(newDoc);
    }
    default: {
      const exceptionString = `Cannot parse db version: ${(o as any).version}`;
      store.getState().analytics?.logEvent("exception", {
        description: exceptionString,
        fatal: true
      });
      throw new Error(exceptionString);
    }
  }
};

export const userDocfromJSON = (s: string): t.UserDoc => {
  const parsed = JSON.parse(s);
  return toUserDoc(parsed);
};
