import firebase from "firebase/app";
import * as db from "../db";
import store from "../store";
import * as t from "../types";
import * as timestamp from "./Timestamp";
import * as Weight from "./WeightFromFirestore";

interface V1RecordDb {
  [t.ONE_REP_MAX]?: Weight.V1Db;
}

export interface V1Db {
  "deadlift": V1RecordDb;
  "squat": V1RecordDb;
  "front-squat": V1RecordDb;
  "bench-press": V1RecordDb;
  "overhead-press": V1RecordDb;
  "version"?: "1";
}
type V1Json = V1Db;

interface V2RecordDb {
  [t.ONE_REP_MAX]: { weight: Weight.V1Db; time: timestamp.V1 };
}
export interface V2Db {
  "deadlift": V2RecordDb;
  "squat": V2RecordDb;
  "front-squat": V2RecordDb;
  "bench-press": V2RecordDb;
  "overhead-press": V2RecordDb;
  "clean-and-jerk": V2RecordDb;
  "snatch": V2RecordDb;
  "version": "2";
}
type V2Json = V2Db;

const tryUpdateORMTimes = async (userDoc: t.UserDoc) => {
  const userString = window.localStorage.getItem(t.LocalStorageKey.USER);
  if (userString !== null) {
    const user = JSON.parse(userString) as t.FirebaseUser;
    const promises = Object.values(t.LiftType).map(async (liftType) => {
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
            userDoc.setORM(liftType, orm.weight, lifts[0].date);
          }
        });
    });
    Promise.all(promises).then(() => {
      db.setUserDoc(firebase.firestore(), user, userDoc);
    });
  }
};

export const userDocFromFirestore: t.FromFirestore<t.UserDoc> = (
  o: object
): t.UserDoc => {
  switch ((o as any).version) {
    case "2": {
      const userDoc: V2Db = o as any;
      Object.values(t.LiftType).forEach((liftType) => {
        const liftMeta = userDoc[liftType as t.LiftType];
        const orm = liftMeta[t.ONE_REP_MAX];
        const jsonTime = orm.time;
        orm.time = new firebase.firestore.Timestamp(
          jsonTime.seconds,
          jsonTime.nanoseconds
        );
      });
      return new t.UserDoc(userDoc);
    }
    case "1":
    case undefined: {
      firebase
        .analytics()
        .logEvent("old_db_version", { version: "1", type: "UserDoc" });
      const userDoc: V1Db = o as any;
      const defaultRecord: V2RecordDb = {
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
        "clean-and-jerk": defaultRecord,
        "snatch": defaultRecord,
        "version": "2"
      };
      Object.values(t.LiftType).forEach((liftType) => {
        const liftMeta: V1RecordDb | undefined = (userDoc as any)[liftType];
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
      const newUserDoc = new t.UserDoc(newDoc);
      tryUpdateORMTimes(newUserDoc);
      return newUserDoc;
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

export const userDocFromJSON = (s: string): t.UserDoc => {
  const parsed = JSON.parse(s);
  switch (parsed.version) {
    case "2": {
      const asJson: V2Json = parsed as any;
      return t.UserDoc.fromFirestoreData(asJson);
    }
    // es-lint-disable-next-line no-fallthrough
    case "1":
    case undefined: {
      firebase
        .analytics()
        .logEvent("old_json_version", { version: "1", type: "UserDoc" });
      const asJson: V1Json = parsed as any;
      return t.UserDoc.fromFirestoreData(asJson);
    }
    default: {
      const exceptionString = `Cannot parse json version: ${parsed.version}`;
      firebase
        .analytics()
        .logEvent("exception", { description: exceptionString, fatal: true });
      throw new Error(exceptionString);
    }
  }
};
