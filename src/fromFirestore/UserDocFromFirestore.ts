import firebase from "firebase/app";
import * as t from "../types";

type V1BaseDb = {
  [lift in t.LiftType]: {
    [t.ONE_REP_MAX]?: { value: number; unit: t.WeightUnit };
  };
};
type V1Db = V1BaseDb & { version?: "1" };
type V1Json = V1Db;

type V2BaseDb = {
  [lift in t.LiftType]: {
    [t.ONE_REP_MAX]: {
      weight: { value: number; unit: t.WeightUnit };
      time: t.Timestamp;
    };
  };
};
type V2Db = V2BaseDb & { version: "2" };
type V2BaseJson = {
  [lift in t.LiftType]: {
    [t.ONE_REP_MAX]: {
      weight: { value: number; unit: t.WeightUnit };
      time: {
        seconds: number;
        nanoseconds: number;
      };
    };
  };
};
type V2Json = V2BaseJson & { version: "2" };

export const userDocFromFirestore: t.FromFirestore<t.UserDoc> = (
  o: object
): t.UserDoc => {
  switch ((o as any).version) {
    case "2": {
      const userDoc: V2Db = o as any;
      return new t.UserDoc(userDoc);
    }
    case "1":
    case undefined: {
      firebase
        .analytics()
        .logEvent("old_db_version", { version: "1", type: "UserDoc" });
      const userDoc: V1Db = o as any;
      const newDoc: V2Db = {} as any;
      Object.values(t.LiftType).forEach((liftType) => {
        const liftMeta = userDoc[liftType as t.LiftType];
        const weight = liftMeta?.[t.ONE_REP_MAX] || {
          value: 0,
          unit: t.WeightUnit.POUND
        };
        newDoc[liftType as t.LiftType] = {
          [t.ONE_REP_MAX]: {
            weight,
            time: firebase.firestore.Timestamp.now()
          }
        };
      });
      return new t.UserDoc(newDoc);
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
      Object.values(t.LiftType).forEach((liftType) => {
        const liftMeta = asJson[liftType as t.LiftType];
        const orm = liftMeta[t.ONE_REP_MAX];
        const jsonTime = orm.time;
        orm.time = new firebase.firestore.Timestamp(
          jsonTime.seconds,
          jsonTime.nanoseconds
        );
      });
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
