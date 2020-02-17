import firebase from "firebase/app";
import * as db from "../../../db";
import * as t from "../../../types";
import { LiftType } from "../LiftType";
import { LiftType as LiftTypeV1 } from "../LiftType/v1";
import { RecordField as RecordFieldV1 } from "../RecordField/v1";
import { RecordField as RecordFieldV2 } from "../RecordField/v2";
import { UserDoc as V1Db } from "../UserDoc/v1";
import { UserDoc as V2Db } from "../UserDoc/v2";
import { UserDoc as V3Db } from "../UserDoc/v3";

export * from "./v3";

const tryUpdateORMTimes = async (userDoc: t.UserDoc) => {
  const userString = window.localStorage.getItem(
    t.LocalStorageKey.FIREBASE_USER
  );
  if (userString !== null) {
    const user = JSON.parse(userString) as t.FirebaseUser;
    const promises = Object.values(LiftType).map(async (liftType) => {
      const orm = userDoc.getORM(liftType);
      return db
        .lifts(firebase.firestore(), user, (query) =>
          query
            .where("weight.unit", "==", orm.weight.unit)
            .where("weight.value", "==", orm.weight.value)
            .where("type", "==", liftType)
            .limit(1)
        )
        .then((lifts) => {
          if (lifts.length === 0) {
            return;
          } else {
            userDoc.setORM(liftType, orm.weight, lifts[0].getDate());
          }
        });
    });
    Promise.all(promises).then(() => {
      db.setUserDoc(firebase.firestore(), user, userDoc);
    });
  }
};

export const toUserDoc: t.FromFirestore<t.UserDoc> = (o: object): t.UserDoc => {
  switch ((o as any).version) {
    case "3": {
      const userDoc: V3Db = o as any;
      const newUserDoc = new t.UserDoc(userDoc);
      tryUpdateORMTimes(newUserDoc);
      return newUserDoc;
    }
    case "2": {
      const userDoc: V2Db = o as any;
      Object.values(LiftTypeV1).forEach((liftType) => {
        const liftMeta = userDoc[liftType];
        const orm = liftMeta[t.ONE_REP_MAX];
        const jsonTime = orm.time;
        orm.time = new firebase.firestore.Timestamp(
          jsonTime.seconds,
          jsonTime.nanoseconds
        );
      });
      const defaultRecord: RecordFieldV2 = {
        [t.ONE_REP_MAX]: {
          weight: { value: 0, unit: t.WeightUnit.POUND, version: "1" },
          time: firebase.firestore.Timestamp.fromMillis(0)
        }
      };
      const v3: V3Db = {
        ...userDoc,
        version: "3",
        [LiftType.Snatch]: defaultRecord,
        [LiftType.CleanAndJerk]: defaultRecord
      };
      return toUserDoc(v3);
    }
    case "1":
    case undefined: {
      firebase
        .analytics()
        .logEvent("old_db_version", { version: "1", type: "UserDoc" });
      const userDoc: V1Db = o as any;
      const defaultRecord: RecordFieldV2 = {
        [t.ONE_REP_MAX]: {
          weight: { value: 0, unit: t.WeightUnit.POUND, version: "1" },
          time: firebase.firestore.Timestamp.fromMillis(0)
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
        const weight = liftMeta?.[t.ONE_REP_MAX] || {
          value: 0,
          unit: t.WeightUnit.POUND,
          version: "1"
        };
        newDoc[liftType] = {
          [t.ONE_REP_MAX]: {
            weight,
            time: firebase.firestore.Timestamp.fromMillis(0)
          }
        };
      });
      return toUserDoc(newDoc);
    }
    default: {
      const exceptionString = `Cannot parse db version: ${(o as any).version}`;
      firebase
        .analytics()
        .logEvent("exception", { description: exceptionString, fatal: true });
      throw new Error(exceptionString);
    }
  }
};

export const userDocfromJSON = (s: string): t.UserDoc => {
  const parsed = JSON.parse(s);
  return toUserDoc(parsed);
};
